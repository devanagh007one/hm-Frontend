import { showNotification } from "./notificationActions";

export const CLEAR_SESSION = "CLEAR_SESSION";
// Action creator to clear the session in the Redux store
export const clearSession = () => ({
  type: CLEAR_SESSION,
});

// Function to handle logout process
export const handleLogout = () => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    // Retrieve login timestamp from session storage
    const loginTimestamp = sessionStorage.getItem("loginTimestamp");
    if (!loginTimestamp) {
      throw new Error("Login timestamp not found in session storage");
    }

    // Parse the login timestamp to a Date object
    const loginTime = new Date(loginTimestamp);
    const currentTime = new Date();

    // Calculate the time difference in milliseconds
    const timeDifference = currentTime - loginTime;

    // Convert time difference to hours
    const hours = (timeDifference / (1000 * 60 * 60)).toFixed(2);

    // Get current date in YYYY-MM-DD format
    const date = currentTime.toISOString().split("T")[0];

    localStorage.clear();
    sessionStorage.clear();

    // Clear Redux state
    dispatch(clearSession());

    // Show success notification
    dispatch(showNotification("Logged out successfully", "success"));

    // Prepare the payload
    const payload = {
      hours: parseFloat(hours),
      date: date,
    };
    // Send tracking data to the server
    const trackingResponse = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/user/track-availability`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    // Parsing the JSON response from the tracking server
    const trackingData = await trackingResponse.json();
    console.log("Tracking Response:", trackingData.message);

    if (trackingData.message === "Availability tracked successfully") {
      // Perform the logout request
      const logoutResponse = await fetch(
        `${process.env.REACT_APP_STATIC_API_URL}/api/auth/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Parsing the JSON response from the logout server
      const logoutData = await logoutResponse.json();

      // Check if the logout was successful
      if (logoutData.message === "Logged out successfully") {
        // localStorage.removeItem('userData');
        localStorage.removeItem("encryptedRoles");
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("loginTimestamp");
        dispatch(clearSession());
        dispatch(showNotification("Logged out successfully", "success")); // Dispatch success notification
      }
    } else {
      dispatch(showNotification("Failed to track availability", "error")); // Dispatch error notification
    }
  } catch (error) {
    console.error("Logout process failed:", error);
    dispatch(
      showNotification(`Logout process failed: ${error.message}`, "error")
    ); // Dispatch error notification
  }
};
