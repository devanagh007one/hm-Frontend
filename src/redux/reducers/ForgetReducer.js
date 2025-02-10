import {
  FORGET_PASSWORD_REQUEST,
  FORGET_PASSWORD_SUCCESS,
  FORGET_PASSWORD_FAILURE,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAILURE,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
} from '../actions/ForgetAction';

const initialState = {
  loading: false,
  success: false,
  error: null,
};

const forgetReducer = (state = initialState, action) => {
  switch (action.type) {
    case FORGET_PASSWORD_REQUEST:
    case VERIFY_OTP_REQUEST:
    case RESET_PASSWORD_REQUEST:
      return { ...state, loading: true, success: false, error: null };
      
    case FORGET_PASSWORD_SUCCESS:
      return { ...state, loading: false, success: true, error: null };

    case RESET_PASSWORD_SUCCESS:
      return { ...state, loading: false, resetSuccess: true };

    case VERIFY_OTP_SUCCESS:
      return { ...state, loading: false, success: true, token: action.payload };
      
    case FORGET_PASSWORD_FAILURE:
    case VERIFY_OTP_FAILURE:
    case RESET_PASSWORD_FAILURE:
      return { ...state, loading: false, success: false, error: action.error };
      
    default:
      return state;
  }
};

export default forgetReducer;
