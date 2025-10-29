import CryptoJS from "crypto-js"; // Ensure you have imported CryptoJS
import { showNotification } from "../actions/notificationActions"; // Import showNotification

export const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS";
export const FETCH_USERS_FAILURE = "FETCH_USERS_FAILURE";
export const CREATE_USER_SUCCESS = "CREATE_USER_SUCCESS";
export const CREATE_USER_FAILURE = "CREATE_USER_FAILURE";
export const DELETE_USER_SUCCESS = "DELETE_USER_SUCCESS";
export const DELETE_USER_FAILURE = "DELETE_USER_FAILURE";
export const TOGGLE_USER_STATUS_SUCCESS = "TOGGLE_LICENSE_STATUS_SUCCESS";
export const TOGGLE_USER_STATUS_FAILURE = "TOGGLE_LICENSE_STATUS_FAILURE";
export const CHANGE_USER_ROLE_FAILURE = "CHANGE_USER_ROLE_FAILURE";
export const CHANGE_USER_ROLE_SUCCESS = "CHANGE_USER_ROLE_SUCCESS";
export const EDIT_USER_PROFILE_SUCCESS = "EDIT_USER_PROFILE_SUCCESS";
export const EDIT_USER_PROFILE_FAILURE = "EDIT_USER_PROFILE_FAILURE";

// Action for fetching all users without filtering
export const fetchAllUsers = () => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/user/all-users`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    console.log("Fetched all users:", data);

    // Filter users with "Partner" role only and save ALL data including IDs
    const partnerUsers = data
      .filter((user) => user.roles && user.roles.includes("Partner"))
      .map((user) => ({
        _id: user._id, // Save the ID
        id: user.id, // Save alternative ID if available
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        roles: user.roles || [],
        // Include any other relevant fields you might need
      }));

    console.log("Partner users with IDs:", partnerUsers);

    // Store complete partner users data in localStorage
    localStorage.setItem("partnerUsers", JSON.stringify(partnerUsers));

    // Also save just the partner IDs separately for easy access
    const partnerIds = partnerUsers
      .map((partner) => partner._id || partner.id)
      .filter(Boolean);
    localStorage.setItem("partnerIds", JSON.stringify(partnerIds));

    // Get company name from localStorage and count users for that company
    const storedCompanyName = localStorage.getItem("companyName") || "HappMe";
    const companyUsers = data.filter(
      (user) => user.company === storedCompanyName
    );

    // Store company user count in localStorage
    localStorage.setItem("companyUserCount", companyUsers.length);

    // Dispatch FETCH_USERS_SUCCESS with ALL users (original data)
    dispatch({ type: FETCH_USERS_SUCCESS, payload: data });
  } catch (error) {
    console.error("Error in fetchAllUsers:", error);
    dispatch({ type: FETCH_USERS_FAILURE, payload: error.message });
  }
};

export const createUser = (userData) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");
    console.log("User Data Being Sent:", userData);

    // Retrieve and decrypt userId from localStorage
    const encryptedId = localStorage.getItem("userId");
    if (!encryptedId) {
      console.error("Encrypted user ID is missing.");
      return null;
    }

    let userId = null;
    try {
      const bytes = CryptoJS.AES.decrypt(
        encryptedId,
        "477f58bc13b97959097e7bda64de165ab9d7496b7a15ab39697e6d31ac61cbd1"
      );
      userId = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error("Error decrypting user ID:", error);
      return null;
    }

    const formData = new FormData();
    formData.append("uploaded_by", userId);

    for (const key in userData) {
      if (userData[key] instanceof File || userData[key] instanceof Blob) {
        formData.append(key, userData[key]);
      } else if (typeof userData[key] === "object" && userData[key] !== null) {
        for (const subKey in userData[key]) {
          formData.append(`${key}[${subKey}]`, userData[key][subKey]);
        }
      } else {
        formData.append(key, userData[key]);
      }
    }

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/adminSignup/signup`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      }
    );

    const data = await response.json();
    console.log("API Response Data:", data);

    if (data.message === "Email or Mobile is already in use.") {
      // dispatch(showNotification(data.message, "error"));
    } else {
      // dispatch(showNotification(data.message, "success"));
    }

    dispatch({ type: CREATE_USER_SUCCESS, payload: data });

    // Refresh users list after creating user
    dispatch(fetchAllUsers());

    return data;
  } catch (error) {
    // dispatch({ type: CREATE_USER_FAILURE, payload: error.message });
    throw error;
  }
};

// Action for deleting multiple users
export const deleteUser = (userIds) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    // Ensure userIds is always an array
    const idsToDelete = Array.isArray(userIds) ? userIds : [userIds];

    console.log("Sending user IDs to delete:", idsToDelete);
    console.log("Request payload:", JSON.stringify({ userIds: idsToDelete }));

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/user/users-delete`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIds: idsToDelete }),
      }
    );

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Error response:", errorData);
      throw new Error(errorData.message || "Failed to delete users");
    }

    const data = await response.json();
    console.log("Success response:", data);

    dispatch({ type: DELETE_USER_SUCCESS, payload: idsToDelete });

    // Return success for the component to handle
    return true;
  } catch (error) {
    console.log("Delete error:", error);
    dispatch({ type: DELETE_USER_FAILURE, payload: error.message });
    return false;
  }
};
// Action for toggling the User status
export const toggleUserStatus = (userIds) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    // Ensure userIds is always an array
    const formattedUserIds = Array.isArray(userIds) ? userIds : [userIds];

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/user/users/block-status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIds: formattedUserIds }), // Ensure it's an array
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to toggle user status");
    }

    const data = await response.json();

    dispatch({ type: TOGGLE_USER_STATUS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: TOGGLE_USER_STATUS_FAILURE, payload: error.message });
  }
};

// Action for changing the user role
export const changeUserRole = (userId, newRole) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/role/change-role`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, newRole }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to change user role");
    }

    const data = await response.json();
    dispatch({ type: CHANGE_USER_ROLE_SUCCESS, payload: data });

    // Return the message to be used in the success handler
    return Promise.resolve(data); // Contains the message field like { message: 'Role changed Done' }
  } catch (error) {
    dispatch({ type: CHANGE_USER_ROLE_FAILURE, payload: error.message });

    // Return the error message in case of failure
    return Promise.reject(error); // Contains the error message
  }
};

// Action for editing the user profile with form data
export const editUserProfile = (userId, formData) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");
    console.log(userId);
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/adminSignup/edit/${userId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          // Do not set Content-Type here when using FormData
          // The browser will automatically set the correct Content-Type with boundary
        },
        body: formData, // Pass the FormData object directly
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user profile");
    }

    const data = await response.json();
    console.log(data);
    dispatch({ type: EDIT_USER_PROFILE_SUCCESS, payload: data });

    // Return the message to be used in the success handler
    return Promise.resolve(data); // Contains the message field like { message: 'Profile updated successfully' }
  } catch (error) {
    dispatch({ type: EDIT_USER_PROFILE_FAILURE, payload: error.message });
    console.log(error);

    // Return the error message in case of failure
    return Promise.reject(error); // Contains the error message
  }
};
