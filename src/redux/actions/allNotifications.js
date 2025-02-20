export const FETCH_NOTIFICATION_SUCCESS = "FETCH_NOTIFICATION_SUCCESS";
export const FETCH_NOTIFICATION_FAILURE = "FETCH_NOTIFICATION_FAILURE";
export const MARK_NOTIFICATION_READ_SUCCESS = "MARK_NOTIFICATION_READ_SUCCESS";
export const MARK_NOTIFICATION_READ_FAILURE = "MARK_NOTIFICATION_READ_FAILURE";

// Action for fetching all notifications with encryptedRoles
export const fetchAllNotifications = (encryptedRoles) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");
    console.log(encryptedRoles)

    // Send a POST request with encryptedRoles in the body
    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/noti/get-notifications`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ userId: encryptedRoles }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }

    const data = await response.json();
console.log(data)
    // Dispatch FETCH_NOTIFICATION_SUCCESS with the notification list
    dispatch({ type: FETCH_NOTIFICATION_SUCCESS, payload: data });
  } catch (error) {
    console.error("Error in fetchAllNotifications:", error);
    dispatch({ type: FETCH_NOTIFICATION_FAILURE, payload: error.message });
  }
};

// Action for marking a notification as read
export const markNotificationAsRead = (notificationId) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    // Send a POST request with the notificationId in the body
    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/noti/mark-notification-read`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ notificationId }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to mark notification as read");
    }

    const data = await response.json();
    console.log("Notification marked as read:", data);

    // Dispatch MARK_NOTIFICATION_READ_SUCCESS
    dispatch({ type: MARK_NOTIFICATION_READ_SUCCESS, payload: data });
  } catch (error) {
    console.error("Error in markNotificationAsRead:", error);
    dispatch({ type: MARK_NOTIFICATION_READ_FAILURE, payload: error.message });
  }
};
