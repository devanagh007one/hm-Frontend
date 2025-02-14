import {
  FETCH_LICENSINGS_SUCCESS,
  FETCH_LICENSINGS_FAILURE,
  CREATE_LICENSING_SUCCESS,
  CREATE_LICENSING_FAILURE,
  TOGGLE_LICENSE_STATUS_SUCCESS,
  TOGGLE_LICENSE_STATUS_FAILURE,
  HR_LICENSE_STATUS_SUCCESS,
  HR_LICENSE_STATUS_FAILURE,
  CHANGE_LICENSE_TYPE_SUCCESS,
  CHANGE_LICENSE_TYPE_FAILURE,
  FETCH_LICENSE_DATA_SUCCESS,
  FETCH_LICENSE_DATA_FAILURE,
  UPDATE_LICENSE_SUCCESS,
  UPDATE_LICENSE_FAILURE,
  DELETE_LICENSE_FAILURE,
  DELETE_LICENSE_SUCCESS
} from "../actions/allLicensingGet";

const initialState = {
  licensing: [],
  error: null,
  hrlicensing: [],
  newLicensing: null,
  toggleLicenseStatusResponse: null,
  changeLicenseTypeResponse: null,
  licenseData: null,
};

const licensingReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LICENSINGS_SUCCESS:
      return { ...state, licensing: action.payload, error: null };
    case FETCH_LICENSINGS_FAILURE:
      return { ...state, licensing: [], error: action.payload };
    case CREATE_LICENSING_SUCCESS:
      return { ...state, newLicensing: action.payload, error: null };
    case CREATE_LICENSING_FAILURE:
      return { ...state, newLicensing: null, error: action.payload };
    case TOGGLE_LICENSE_STATUS_SUCCESS:
      return { ...state, toggleLicenseStatusResponse: action.payload, error: null };
    case TOGGLE_LICENSE_STATUS_FAILURE:
      return { ...state, toggleLicenseStatusResponse: null, error: action.payload };
    case HR_LICENSE_STATUS_SUCCESS:
      return { ...state, hrlicensing: action.payload, error: null };
    case HR_LICENSE_STATUS_FAILURE:
      return { ...state, hrlicensing: [], error: action.payload };
    case CHANGE_LICENSE_TYPE_SUCCESS:
      return { ...state, changeLicenseTypeResponse: action.payload, error: null };
    case CHANGE_LICENSE_TYPE_FAILURE:
      return { ...state, changeLicenseTypeResponse: null, error: action.payload };
    case FETCH_LICENSE_DATA_SUCCESS:
      return { ...state, licenseData: action.payload, error: null };
    case FETCH_LICENSE_DATA_FAILURE:
      return { ...state, licenseData: null, error: action.payload };
    case UPDATE_LICENSE_SUCCESS:
      return { ...state, licenseData: action.payload, error: null };
    case UPDATE_LICENSE_FAILURE:
      return { ...state, error: action.payload };
    case DELETE_LICENSE_SUCCESS:
      return {
        ...state,
        licensing: state.licensing.filter((license) => !action.payload.includes(license.id)),
        error: null,
      };
    case DELETE_LICENSE_FAILURE:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};


export default licensingReducer;
