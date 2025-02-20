import CryptoJS from 'crypto-js';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const USER_DATA = 'USER_DATA';
export const USER_DATA_ERROR = 'USER_DATA_ERROR';

export const loginRequest = () => ({
  type: LOGIN_REQUEST,
});

export const loginSuccess = (data) => ({
  type: LOGIN_SUCCESS,
  payload: data,
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const userData = (data) => ({
  type: USER_DATA,
  payload: data,
});

export const userFailure = (error) => ({
  type: USER_DATA_ERROR,
  payload: error,
});


export const loginUser = (credentials) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    console.log(`${process.env.REACT_APP_STATIC_API_URL}/api/auth/login`)
    try {
      const response = await fetch(`${process.env.REACT_APP_STATIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        const authToken = data.token;

        if (authToken) {
          // Save auth token
          localStorage.setItem('authToken', authToken);

          // Encrypt and save roles in localStorage
          if (data?.user?.roles) {
            const encryptedRoles = CryptoJS.AES.encrypt(JSON.stringify(data?.user?.roles), '477f58bc13b97959097e7bda64de165ab9d7496b7a15ab39697e6d31ac61cbd1').toString();
            localStorage.setItem('encryptedRoles', encryptedRoles);
          }
          if (data?.user?.userId) {
            const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(data?.user?.userId), '477f58bc13b97959097e7bda64de165ab9d7496b7a15ab39697e6d31ac61cbd1').toString();
            localStorage.setItem('uniqueid', encryptedUser);
          }
          if (data?.user?._id) {
            const encryptedId = CryptoJS.AES.encrypt(JSON.stringify(data?.user?._id), '477f58bc13b97959097e7bda64de165ab9d7496b7a15ab39697e6d31ac61cbd1').toString();
            localStorage.setItem('userId', encryptedId);
          }
          dispatch(loginSuccess(data));

          if (data.message === 'Logged in successfully') {
            // Store the login timestamp in session storage
            sessionStorage.setItem('loginTimestamp', new Date().toISOString());
          }
        } else {
          throw new Error('Authentication token not found in response');
        }

        return { success: true, data };
      } else {
        throw new Error(data.message || 'Failed to log in');
      }
    } catch (error) {
      console.error('Error during login:', error);
      dispatch(loginFailure(error.message));
      return { success: false, message: error.message };
    }
  };
};

export const fetchUsers = () => async (dispatch) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const encryptedId = localStorage.getItem('userId');

    if (!authToken) {
      console.error('Auth token is missing.');
      dispatch(userFailure('Auth token is missing.'));
      return null;
    }

    if (!encryptedId) {
      console.error('Encrypted user ID is missing.');
      dispatch(userFailure('Encrypted user ID is missing.'));
      return null;
    }

    // Decrypt the user ID
    let userId = null;
    try {
      const bytes = CryptoJS.AES.decrypt(
        encryptedId,
        '477f58bc13b97959097e7bda64de165ab9d7496b7a15ab39697e6d31ac61cbd1'
      );
      userId = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (decryptionError) {
      console.error('Error decrypting user ID:', decryptionError);
      dispatch(userFailure('Error decrypting user ID.'));
      return null;
    }

    if (!userId) {
      console.error('Decrypted user ID is invalid.');
      dispatch(userFailure('Decrypted user ID is invalid.'));
      return null;
    }

    // Send POST request to fetch user data
    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/user/profile`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({ userId }),
      }
    );

    // Handle HTTP errors
    if (!response.ok) {
      const errorMessage = `HTTP error! Status: ${response.status}`;
      console.error(errorMessage);
      dispatch(userFailure(errorMessage));
      return null;
    }

    const data = await response.json();
    // console.log('Fetched User Data:', data);

    // Dispatch the fetched user data
    dispatch(userData(data));
    return data;
  } catch (error) {
    console.error('Fetch Error:', error);
    dispatch(userFailure('An error occurred while fetching user data.'));
    return null;
  }
};
