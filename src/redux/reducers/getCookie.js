import { getCookie } from '../actions/cookies';

export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN';

export const setAuthToken = (token) => ({
  type: SET_AUTH_TOKEN,
  payload: token,
});

// Optionally, if you need to use cookies to set the token
export const fetchTokenFromCookie = () => {
  return (dispatch) => {
    const token = getCookie('token');
    if (token) {
      dispatch(setAuthToken(token));
    }
  };
};
