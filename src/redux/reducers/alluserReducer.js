import {
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
  TOGGLE_USER_STATUS_SUCCESS,
  TOGGLE_USER_STATUS_FAILURE,
  CHANGE_USER_ROLE_SUCCESS,
  CHANGE_USER_ROLE_FAILURE,
  EDIT_USER_PROFILE_FAILURE,
  EDIT_USER_PROFILE_SUCCESS
} from "../actions/alluserGet";

const initialState = {
  users: [],
  error: null,
  newUser: null,
  toggleUserStatusResponse: null, // Holds the response for license status toggle
  userRoleChangeSuccess: null,
  userRoleChangeError: null,
  userProfileUpdateSuccess: null, // Holds the success status for user profile update
  userProfileUpdateError: null,   // Holds the error message for user profile update failure
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload, // This will be either all users or filtered users based on company
        error: null,
      };
    case FETCH_USERS_FAILURE:
      return {
        ...state,
        users: [],
        error: action.payload,
      };
    case CREATE_USER_SUCCESS:
      return {
        ...state,
        newUser: action.payload,
        error: null,
      };
    case CREATE_USER_FAILURE:
      return {
        ...state,
        newUser: null,
        error: action.payload,
      };
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.filter((user) => !action.payload.includes(user.id)),
        error: null,
      };
    case DELETE_USER_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case TOGGLE_USER_STATUS_SUCCESS:
      return {
        ...state,
        toggleUserStatusResponse: action.payload,
        error: null,
      };
    case TOGGLE_USER_STATUS_FAILURE:
      return {
        ...state,
        toggleUserStatusResponse: null,
        error: action.payload,
      };
    case CHANGE_USER_ROLE_SUCCESS:
      return {
        ...state,
        userRoleChangeSuccess: true, // Mark role change success
        userRoleChangeError: null,   // Clear any previous error
        error: null,
      };

    case CHANGE_USER_ROLE_FAILURE:
      return {
        ...state,
        userRoleChangeSuccess: false, // Reset success flag
        userRoleChangeError: action.payload, // Store the error message for role change failure
        error: null,
      };
    case EDIT_USER_PROFILE_SUCCESS:
      return {
        ...state,
        userProfileUpdateSuccess: true, // Mark profile update success
        userProfileUpdateError: null,   // Clear any previous error
        error: null,
      };

    case EDIT_USER_PROFILE_FAILURE:
      return {
        ...state,
        userProfileUpdateSuccess: false, // Reset success flag
        userProfileUpdateError: action.payload, // Store the error message for profile update failure
        error: null,
      };
    default:
      return state;
  }
};

export default userReducer;
