import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  USER_DATA,
  USER_DATA_ERROR,
} from '../actions/authActions';

const initialState = {
  loading: false,
  data: null, // Stores login data (e.g., auth token)
  error: null,
  userData: null, // Stores user-specific data fetched after login
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    // Login actions
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case LOGIN_SUCCESS:
      return { ...state, loading: false, data: action.payload, error: null };
    case LOGIN_FAILURE:
      return { ...state, loading: false, error: action.payload, data: null };

    // User data actions
    case USER_DATA:
      return { ...state, loading: true, userData: action.payload, error: null };
    case USER_DATA_ERROR:
      return { ...state, loading: false, error: action.payload, userData: null };

    default:
      return state;
  }
};

export default authReducer;
