import { showNotification } from "./notificationActions";

export const FORGET_PASSWORD_REQUEST = "FORGET_PASSWORD_REQUEST";
export const FORGET_PASSWORD_SUCCESS = "FORGET_PASSWORD_SUCCESS";
export const FORGET_PASSWORD_FAILURE = "FORGET_PASSWORD_FAILURE";
export const VERIFY_OTP_REQUEST = "VERIFY_OTP_REQUEST";
export const VERIFY_OTP_SUCCESS = "VERIFY_OTP_SUCCESS";
export const VERIFY_OTP_FAILURE = "VERIFY_OTP_FAILURE";
export const RESET_PASSWORD_REQUEST = "RESET_PASSWORD_REQUEST";
export const RESET_PASSWORD_SUCCESS = "RESET_PASSWORD_SUCCESS";
export const RESET_PASSWORD_FAILURE = "RESET_PASSWORD_FAILURE";

// Helper function to detect if input is email or phone
const detectInputType = (input) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;

  if (emailRegex.test(input)) {
    return "email";
  } else if (phoneRegex.test(input)) {
    return "phone";
  }
  return null;
};

// Action to handle forget password
export const forgetPassword = (input) => {
  return async (dispatch) => {
    dispatch({ type: FORGET_PASSWORD_REQUEST });

    try {
      const inputType = detectInputType(input);
      let requestBody = {};

      if (inputType === "email") {
        requestBody = {
          email: input,
          via: "email",
        };
      } else if (inputType === "phone") {
        // Remove any '+' or non-digit characters for mobile number
        const cleanedPhone = input.replace(/\D/g, "");
        requestBody = {
          mobile: cleanedPhone,
          via: "sms",
        };
      } else {
        throw new Error("Invalid email or phone number format");
      }

      const response = await fetch(
        `${process.env.REACT_APP_STATIC_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (response.ok && data.message === "OTP sent via SMS") {
        dispatch({ type: FORGET_PASSWORD_SUCCESS, payload: data });
        const notificationMessage =
          inputType === "email"
            ? "Please check your email for the password reset OTP."
            : "Please check your mobile for the password reset OTP.";
        dispatch(showNotification(notificationMessage, "message"));
      } else {
        dispatch({ type: FORGET_PASSWORD_FAILURE, error: data.message });
        dispatch(showNotification(data.message, "error"));
      }
    } catch (error) {
      dispatch({ type: FORGET_PASSWORD_FAILURE, error: error.message });
      dispatch(showNotification(error.message, "error"));
    }
  };
};

// Action to handle OTP verification
export const verifyOtp = (input, otp) => {
  return async (dispatch) => {
    dispatch({ type: VERIFY_OTP_REQUEST });

    try {
      const inputType = detectInputType(input);
      let requestBody = {};

      if (inputType === "email") {
        requestBody = {
          email: input,
          otp: otp,
        };
      } else if (inputType === "phone") {
        // Remove any '+' or non-digit characters for mobile number
        const cleanedPhone = input.replace(/\D/g, "");
        requestBody = {
          mobile: cleanedPhone,
          otp: otp,
        };
      } else {
        throw new Error("Invalid email or phone number format");
      }

      const response = await fetch(
        `${process.env.REACT_APP_STATIC_API_URL}/api/auth/verify-reset-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (response.ok && data.message === "OTP verified") {
        dispatch({ type: VERIFY_OTP_SUCCESS, payload: data.resetToken });
        dispatch(showNotification("OTP verified successfully.", "message"));
      } else {
        dispatch({ type: VERIFY_OTP_FAILURE, error: data.message });
        dispatch(showNotification(data.message, "error"));
      }
    } catch (error) {
      dispatch({ type: VERIFY_OTP_FAILURE, error: error.message });
      dispatch(showNotification(error.message, "error"));
    }
  };
};

// Action to handle password reset
export const resetPassword = (resetToken, password) => async (dispatch) => {
  dispatch({ type: RESET_PASSWORD_REQUEST });

  try {
    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resetToken, password }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data });
      dispatch(showNotification("Password reset successfully.", "message"));
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    dispatch({ type: RESET_PASSWORD_FAILURE, error: error.message });
    dispatch(showNotification(error.message, "error"));
  }
};
