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

    // Fetch all users
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
console.log(data)
    // Dispatch FETCH_USERS_SUCCESS with the full user list
    dispatch({ type: FETCH_USERS_SUCCESS, payload: data });
  } catch (error) {
    console.error("Error in fetchAllUsers:", error);
    dispatch({ type: FETCH_USERS_FAILURE, payload: error.message });
  }
};


// Action for creating a user
export const createUser = (userData) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    console.log(userData)
    // Construct FormData
    const formData = new FormData();
    for (const key in userData) {
      formData.append(key, userData[key]);
    }

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/adminSignup/signup`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ userData }),
        // body: formData,
      }
    );

    const data = await response.json();

    console.log(data)


    // Check if the response contains a success message
    if (data.message === "User created successfully") {
      dispatch({ type: CREATE_USER_SUCCESS, payload: data });
    } else {
      throw new Error(data.message || "Failed to create user");
    }
  } catch (error) {
    dispatch({ type: CREATE_USER_FAILURE, payload: error.message });
  }
};

// Action for deleting multiple users
export const deleteUser = (userIds) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    console.log(JSON.stringify({ userIds }));

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/user/users-delete`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIds }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete users");
    }

    const data = await response.json();
    console.log(data);

    dispatch({ type: DELETE_USER_SUCCESS, payload: userIds });
  } catch (error) {
    dispatch({ type: DELETE_USER_FAILURE, payload: error.message });
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
    return Promise.resolve(data);  // Contains the message field like { message: 'Role changed and notification sent' }
  } catch (error) {
    dispatch({ type: CHANGE_USER_ROLE_FAILURE, payload: error.message });
    
    // Return the error message in case of failure
    return Promise.reject(error);  // Contains the error message
  }
};


// Action for editing the user profile with form data
export const editUserProfile = (userId, formData) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/user/profile/${userId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          // Do not set Content-Type here when using FormData
          // The browser will automatically set the correct Content-Type with boundary
        },
        body: formData,  // Pass the FormData object directly
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user profile");
    }

    const data = await response.json();
    console.log(data)
    dispatch({ type: EDIT_USER_PROFILE_SUCCESS, payload: data });
    
    // Return the message to be used in the success handler
    return Promise.resolve(data);  // Contains the message field like { message: 'Profile updated successfully' }
  } catch (error) {
    dispatch({ type: EDIT_USER_PROFILE_FAILURE, payload: error.message });
    console.log(error)

    // Return the error message in case of failure
    return Promise.reject(error);  // Contains the error message
  }
};
