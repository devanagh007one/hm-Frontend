import {
  FETCH_LICENSINGS_SUCCESS,
  FETCH_LICENSINGS_FAILURE,
  CREATE_LICENSING_SUCCESS,
  CREATE_LICENSING_FAILURE,
  TOGGLE_LICENSE_STATUS_SUCCESS,
  TOGGLE_LICENSE_STATUS_FAILURE,
  HR_LICENSE_STATUS_SUCCESS,
  HR_LICENSE_STATUS_FAILURE
} from "../actions/allLicensingGet";

const initialState = {
  licensing: [],
  error: null,
  hrlicensing: [],
  newLicensing: null,
  toggleLicenseStatusResponse: null, // Holds the response for license status toggle
};

const licensingReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LICENSINGS_SUCCESS:
      return {
        ...state,
        licensing: action.payload,
        error: null,
      };
    case FETCH_LICENSINGS_FAILURE:
      return {
        ...state,
        licensing: [],
        error: action.payload,
      };
    case CREATE_LICENSING_SUCCESS:
      return {
        ...state,
        newLicensing: action.payload,
        error: null,
      };
    case CREATE_LICENSING_FAILURE:
      return {
        ...state,
        newLicensing: null,
        error: action.payload,
      };
    case TOGGLE_LICENSE_STATUS_SUCCESS:
      return {
        ...state,
        toggleLicenseStatusResponse: action.payload,
        error: null,
      };
    case TOGGLE_LICENSE_STATUS_FAILURE:
      return {
        ...state,
        toggleLicenseStatusResponse: null,
        error: action.payload,
      };
    case HR_LICENSE_STATUS_SUCCESS:
      return {
        ...state,
        hrlicensing: action.payload,
        error: null,
      };
    case HR_LICENSE_STATUS_FAILURE:
      return {
        ...state,
        hrlicensing: [],
        error: action.payload,
      };
    default:
      return state;
  }
};

export default licensingReducer;