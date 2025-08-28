import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { object, string, number, array, ref } from "yup";
import {
  forgetPassword,
  verifyOtp,
  resetPassword,
} from "../redux/actions/ForgetAction";
import { showNotification } from "../redux/actions/notificationActions";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { loading, success, error, token, resetSuccess } = useSelector(
    (state) => state.forgetPassword
  );

  // Yup validation schemas
  const emailSchema = object({
    email: string()
      .required("Email or phone number is required")
      .test(
        "is-email-or-phone",
        "Please enter a valid email or phone number",
        (value) => {
          // Check if it's a valid email
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          // Check if it's a valid phone number (basic validation)
          const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
          return emailRegex.test(value) || phoneRegex.test(value);
        }
      ),
  });

  const otpSchema = object({
    otp: array()
      .of(
        string()
          .matches(/^[0-9]$/, "Must be a single digit")
          .required("Digit required")
      )
      .length(6, "OTP must be 6 digits")
      .test("is-complete", "Please complete the OTP", (value) =>
        value.every((digit) => digit !== "")
      ),
  });

  const passwordSchema = object({
    password: string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: string()
      .required("Please confirm your password")
      .oneOf([ref("password")], "Passwords must match"),
  });

  // Handle Email Submission with validation
  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      await emailSchema.validate({ email }, { abortEarly: false });
      setErrors({});
      dispatch(forgetPassword(email));
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      dispatch(showNotification("Please fix the validation errors", "error"));
    }
  };

  // Handle OTP Submission with validation
  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      await otpSchema.validate({ otp }, { abortEarly: false });
      setErrors({});
      dispatch(verifyOtp(email, otp.join("")));
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      dispatch(showNotification("Please complete the OTP", "error"));
    }
  };

  // Handle Password Change with validation
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      await passwordSchema.validate(
        { password, confirmPassword },
        { abortEarly: false }
      );
      setErrors({});
      dispatch(resetPassword(resetToken, password));
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);

      if (newErrors.confirmPassword) {
        dispatch(showNotification(newErrors.confirmPassword, "error"));
      }
    }
  };

  // Handle OTP Input Change
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.match(/[0-9]/)) {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = value;
        return newOtp;
      });

      // Clear OTP errors when user starts typing
      if (errors.otp) {
        setErrors((prev) => ({ ...prev, otp: undefined }));
      }

      if (index < otp.length - 1) {
        const nextInput = document.getElementsByName("otp")[index + 1];
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace") {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = "";
        return newOtp;
      });

      if (index > 0 && otp[index] === "") {
        const previousInput = document.getElementsByName("otp")[index - 1];
        if (previousInput) {
          previousInput.focus();
        }
      }
    }
  };

  // Handle input changes to clear specific errors
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordInputChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
  };

  // Open OTP Section if success message is received
  useEffect(() => {
    if (success && !showOtpSection && !showPasswordSection) {
      setShowOtpSection(true);
      setErrors({}); // Clear any previous errors
    }
  }, [success, showOtpSection, showPasswordSection]);

  // Open Password Section if OTP verified
  useEffect(() => {
    if (token) {
      setResetToken(token);
      setShowPasswordSection(true);
      setErrors({}); // Clear any previous errors
    }
  }, [token]);

  // Reload the page if password reset is successful
  useEffect(() => {
    if (resetSuccess) {
      const timeout = setTimeout(() => {
        window.location.reload();
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [resetSuccess]);

  return (
    <div className="flex flex-col gap-5 w-3/5">
      {showPasswordSection ? (
        <>
          <div className="pb-12 text-3xl flex flex-col justify-center items-center gap-3 text-black">
            Sign In to your Account
            <span className="text-xl">Let's get started!</span>
          </div>
          <div className="password-section flex flex-col w-full items-center gap-4 slide-in-from-left">
            <div className="text-lg subpixel-antialiased">
              Enter your new password.
            </div>
            <div className="w-full flex flex-col items-center">
              <input
                type="password"
                className={`shadow-inner h-12 pl-5 text-lg rounded-full block w-2/4 p-2.5 custom-input ${
                  errors.password ? "border-red-500 border-2" : ""
                }`}
                placeholder="New Password *"
                value={password}
                onChange={handlePasswordInputChange}
              />
              {errors.password && (
                <div className="text-red-500 text-sm mt-1 w-2/4 text-left">
                  {errors.password}
                </div>
              )}
            </div>
            <div className="w-full flex flex-col items-center">
              <input
                type="password"
                className={`shadow-inner h-12 pl-5 text-lg rounded-full block w-2/4 p-2.5 custom-input ${
                  errors.confirmPassword ? "border-red-500 border-2" : ""
                }`}
                placeholder="Confirm Password *"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              {errors.confirmPassword && (
                <div className="text-red-500 text-sm mt-1 w-2/4 text-left">
                  {errors.confirmPassword}
                </div>
              )}
            </div>
            <button
              className="w-2/4 p-3 rounded-full bg-[#F48567] text-white text-lg subpixel-antialiased disabled:opacity-50"
              onClick={handlePasswordChange}
              disabled={loading}
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </div>
        </>
      ) : showOtpSection ? (
        <>
          <div className="pb-12 text-3xl flex flex-col justify-center items-center gap-3 text-black">
            Sign In to your Account
            <span className="text-xl">Let's get started!</span>
          </div>
          <div className="otp flex flex-col w-full items-center gap-4 slide-in-from-left">
            <div className="text-lg subpixel-antialiased">
              Enter the 6-digit OTP received on your mobile.
            </div>
            <div className="flex flex-col items-center">
              <div className="flex space-x-2">
                {otp.map((data, index) => (
                  <input
                    className={`shadow-inner h-12 w-12 text-lg text-center rounded-lg custom-input mb-2 text-black ${
                      errors.otp ? "border-red-500 border-2" : ""
                    }`}
                    type="text"
                    name="otp"
                    maxLength="1"
                    key={index}
                    value={data}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={(e) => e.target.select()}
                  />
                ))}
              </div>
              {errors.otp && (
                <div className="text-red-500 text-sm mt-1">{errors.otp}</div>
              )}
            </div>
            <button
              className="w-2/4 p-3 rounded-full bg-[#F48567] text-white text-lg subpixel-antialiased disabled:opacity-50"
              onClick={handleOtpSubmit}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="pb-10 text-3xl flex flex-col justify-center items-center gap-3 text-black">
            Forgot Password?
            <span className="text-xl">Lets get you in.</span>
          </div>
          <div className="email flex flex-col w-full items-center gap-4">
            <label className="text-sm mb-[-8px] w-2/4 ml-4">Receive OTP</label>
            <div className="relative w-2/4 flex flex-col items-center">
              <input
                type="text"
                aria-describedby="helper-text-explanation"
                className={`h-12 pl-10 text-xs rounded-full block w-full p-2.5 custom-input bg-transparent ${
                  errors.email ? "border-red-500 border-2" : ""
                }`}
                placeholder="Enter your email address or Phone number"
                value={email}
                onChange={handleEmailChange}
              />
              <div className="absolute top-[-2px] inset-y-0 left-0 flex items-center pl-5 pointer-events-none bg-transparent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.33333 4.66667C5.33333 3.95942 5.61428 3.28115 6.11438 2.78105C6.61448 2.28095 7.29276 2 8 2C8.70724 2 9.38552 2.28095 9.88562 2.78105C10.3857 3.28115 10.6667 3.95942 10.6667 4.66667C10.6667 5.37391 10.3857 6.05219 9.88562 6.55229C9.38552 7.05238 8.70724 7.33333 8 7.33333C7.29276 7.33333 6.61448 7.05238 6.11438 6.55229C5.61428 6.05219 5.33333 5.37391 5.33333 4.66667ZM5.33333 8.66667C4.44928 8.66667 3.60143 9.01786 2.97631 9.64298C2.35119 10.2681 2 11.1159 2 12C2 12.5304 2.21071 13.0391 2.58579 13.4142C2.96086 13.7893 3.46957 14 4 14H12C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12C14 11.1159 13.6488 10.2681 13.0237 9.64298C12.3986 9.01786 11.5507 8.66667 10.6667 8.66667H5.33333Z"
                    fill="#C7C7C7"
                  />
                </svg>
              </div>
              {errors.email && (
                <div className="text-red-500 text-sm mt-1 w-full text-left pl-4">
                  {errors.email}
                </div>
              )}
            </div>
            <button
              className="w-2/4 p-3 rounded-full bg-[#F48567] text-white text-lg subpixel-antialiased disabled:opacity-50"
              onClick={handleEmailSubmit}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ForgetPassword;
