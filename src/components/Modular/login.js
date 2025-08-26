import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/actions/authActions";
import { showNotification } from "../../redux/actions/notificationActions";
import loginimage from "../../Images/loginintro.jpg";
import Notification from "../Template/Notification";
import Forgetpassword from "../Forgetpassword";
import backgroundImage from "../../Images/background.svg";

const Login = () => {
  const [emailOrMobile, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgetPasswordVisible, setForgetPasswordVisible] = useState(false); // State to control Forget Password visibility
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Added navigate for redirection

  const handleSubmit = async () => {
    if (!emailOrMobile || !password) {
      dispatch(
        showNotification("Email or Mobile and Password are required.", "error")
      );
      return;
    }

    const credentials = {
      emailOrMobile,
      password,
    };

    try {
      const response = await dispatch(loginUser(credentials)); // Assuming login action returns a promise
      if (response.success) {
        dispatch(showNotification("Login successful!", "success"));
        navigate("/");
        window.location.reload();
      } else {
        dispatch(
          showNotification(
            "Login failed. Please check your credentials.",
            "error"
          )
        );
      }
    } catch (error) {
      dispatch(
        showNotification("Error during login. Please try again.", "error")
      );
    }
  };

  return (
    <section className="w-100 h-screen backgroundgray flex flex-col items-center justify-center">
      <div className="mb-9">
        <svg
          width="478"
          height="112"
          viewBox="0 0 478 112"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M230.131 23.5718C218.17 23.5718 211.233 30.313 208.041 38.2123H207.922C208.041 35.7515 207.292 28.1211 206.425 23.9647L198.779 24.3576V111.891H209.657V75.3927C213.598 81.741 220.396 86.2697 229.521 86.2697C246.567 86.2697 257.898 73.8211 257.898 55.0448C257.898 36.2685 246.547 23.5718 230.131 23.5718ZM228.89 76.6747C215.45 76.6747 209.657 65.4048 209.657 56.2235V53.7627C209.657 44.6848 215.825 33.1874 228.18 33.1874C239.65 33.1874 246.803 41.9965 246.803 55.0655C246.803 68.1344 239.788 76.6954 228.91 76.6954L228.89 76.6747Z"
            fill="white"
          />
          <path
            d="M295.948 23.6812C283.986 23.6812 277.069 30.4224 273.857 38.3217H273.739C273.857 35.8609 273.128 28.2305 272.261 24.074L264.615 24.4669V112H275.453V75.502C279.395 81.8504 286.193 86.379 295.337 86.379C312.363 86.379 323.695 73.9305 323.695 55.1542C323.695 36.3779 312.344 23.6812 295.928 23.6812H295.948ZM294.726 76.7841C281.286 76.7841 275.453 65.5142 275.453 56.3329V53.8721C275.453 44.7941 281.621 33.2968 293.977 33.2968C305.466 33.2968 312.62 42.1059 312.62 55.1748C312.62 68.2438 305.584 76.8048 294.726 76.8048V76.7841Z"
            fill="white"
          />
          <path
            d="M403.392 0.103455L378.7 56.8459C377.222 60.3406 374.621 66.5442 374.03 68.7568H373.773C373.025 66.5442 370.68 60.3406 369.202 56.8459L344.509 0.103455H332.292V85.5893H343.524L343.268 33.024C343.268 29.4052 342.894 22.5399 342.775 21.8782L343.268 21.7541C343.386 22.4158 344.135 26.4275 345.987 30.5632L370.404 85.8581H377.321L400.889 31.4731C401.894 29.2605 403.609 23.1602 403.983 21.7541L404.476 21.8782C404.358 22.5399 403.983 29.4052 403.983 33.024L403.727 85.5893H414.94V0.103455H403.353H403.392Z"
            fill="white"
          />
          <path
            d="M471.339 68.7371C468.738 72.3559 463.673 76.7604 454.805 76.7604C445.307 76.7604 438.646 71.8389 436.045 63.6708L447.278 63.7949C466.885 63.9189 477.645 57.0536 477.645 45.0186C477.645 32.1978 468.501 23.6575 452.579 23.6575C435.671 23.6575 423.571 36.2095 423.571 55.1305C423.571 74.0515 435.316 86.3554 453.938 86.3554C463.929 86.3554 472.581 82.5918 478 75.0854L471.359 68.7371H471.339ZM434.685 55.0064C434.685 41.0276 442.824 33.2731 453.071 33.2731C461.348 33.2731 466.885 37.6776 466.885 44.2535C466.885 51.9046 461.565 55.7922 446.154 55.6681L434.685 55.5441V55.0271V55.0064Z"
            fill="white"
          />
          <path d="M115.894 0H104.681V85.4859H115.894V0Z" fill="white" />
          <path
            d="M57.954 55.8507C43.391 55.8507 29.6359 53.8035 19.2113 50.102C3.48555 44.5187 0.19458 36.9297 0.19458 31.5532H11.0725C11.0725 35.296 27.5076 44.436 57.9737 44.436C88.4398 44.436 104.875 35.296 104.875 31.5532H115.753C115.753 36.9297 112.462 44.5187 96.7362 50.102C86.3115 53.8035 72.5368 55.8507 57.9934 55.8507H57.954Z"
            fill="white"
          />
          <path d="M11.2523 0H0V85.4859H11.2523V0Z" fill="white" />
          <path
            d="M177.355 24.3576C176.488 28.4933 175.74 35.7309 175.858 38.2123H175.74C172.665 29.9201 165.394 23.5718 154.279 23.5718C137.253 23.5718 125.902 35.9997 125.902 54.776C125.902 73.5523 137.273 86.2697 153.668 86.2697C164.034 86.2697 170.951 81.0793 174.656 73.8211H174.912V76.013C174.912 76.2405 174.912 76.4473 174.932 76.6747C175.109 81.5136 177.474 84.3052 180.981 85.4839H185.041V24.3576H177.395H177.355ZM174.143 56.0787C174.143 65.1567 167.975 76.6541 155.619 76.6541C144.15 76.6541 136.997 67.8449 136.997 54.7553C136.997 41.6657 144.012 33.146 154.89 33.146C168.33 33.146 174.124 44.3953 174.124 53.5973V56.0581L174.143 56.0787Z"
            fill="white"
          />
          <path
            d="M185.003 68.6727H174.913V85.4845H185.003V68.6727Z"
            fill="white"
          />
        </svg>
      </div>
      <main className="h-3/5 w-3/4 overflow-hidden">
        {" "}
        <div className="rounded-2xl h-full w-full flex overflow-hidden">
          <div
            className="w-full bg-white flex flex-col justify-center items-center"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "initial",
              backgroundPosition: "center center",
            }}
          >
            {!forgetPasswordVisible && ( // Hide this section based on forgetPasswordVisible state
              <>
                <div className="pb-12 text-3xl flex flex-col justify-center items-center gap-3 text-black">
                  Sign In to your Account
                  <span className="text-xl">Let’s get started!</span>
                </div>
                <div className="flex flex-col gap-5 w-1/3 email">
                  <div className="relative w-full">
                    <input
                      type="text"
                      aria-describedby="helper-text-explanation"
                      className="h-12 pl-10 text-xs rounded-full block w-full p-2.5 custom-input bg-transparent text-black"
                      placeholder="Enter your email address or Phone number"
                      value={emailOrMobile}
                      onChange={(e) => setEmail(e.target.value)}
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
                  </div>

                  <div className="relative w-full">
                    <input
                      type="password"
                      aria-describedby="helper-text-explanation"
                      className="h-12 pl-10 text-xs rounded-full block w-full p-2.5 custom-input bg-transparent text-black"
                      placeholder="Enter the Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="ml-2 absolute top-[-2px] inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M8.00008 11.3333C8.3537 11.3333 8.69284 11.1929 8.94289 10.9428C9.19294 10.6928 9.33341 10.3536 9.33341 10C9.33341 9.64638 9.19294 9.30724 8.94289 9.05719C8.69284 8.80714 8.3537 8.66667 8.00008 8.66667C7.64646 8.66667 7.30732 8.80714 7.05727 9.05719C6.80722 9.30724 6.66675 9.64638 6.66675 10C6.66675 10.3536 6.80722 10.6928 7.05727 10.9428C7.30732 11.1929 7.64646 11.3333 8.00008 11.3333ZM12.0001 5.33333C12.3537 5.33333 12.6928 5.47381 12.9429 5.72386C13.1929 5.97391 13.3334 6.31304 13.3334 6.66667V13.3333C13.3334 13.687 13.1929 14.0261 12.9429 14.2761C12.6928 14.5262 12.3537 14.6667 12.0001 14.6667H4.00008C3.64646 14.6667 3.30732 14.5262 3.05727 14.2761C2.80722 14.0261 2.66675 13.687 2.66675 13.3333V6.66667C2.66675 6.31304 2.80722 5.97391 3.05727 5.72386C3.30732 5.47381 3.64646 5.33333 4.00008 5.33333H4.66675V4C4.66675 3.11594 5.01794 2.2681 5.64306 1.64298C6.26818 1.01786 7.11603 0.666666 8.00008 0.666666C8.43782 0.666666 8.87127 0.752885 9.27569 0.920401C9.68011 1.08792 10.0476 1.33345 10.3571 1.64298C10.6666 1.95251 10.9122 2.31997 11.0797 2.72439C11.2472 3.12881 11.3334 3.56226 11.3334 4V5.33333H12.0001ZM8.00008 2C7.46965 2 6.96094 2.21071 6.58587 2.58579C6.21079 2.96086 6.00008 3.46957 6.00008 4V5.33333H10.0001V4C10.0001 3.46957 9.78937 2.96086 9.41429 2.58579C9.03922 2.21071 8.53051 2 8.00008 2Z"
                          fill="#C7C7C7"
                        />
                      </svg>
                    </div>
                  </div>
                  <div
                    className="text-sm mt-[-15px] mr-3 text-end cursor-pointer text-black"
                    onClick={() => setForgetPasswordVisible(true)} // Set Forget Password visibility
                  >
                    <u>Forgot Password</u>
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      className="w-3/6 p-3 rounded-full bg-[#F48567] text-white text-lg subpixel-antialiased"
                      onClick={handleSubmit}
                    >
                      Sign in
                    </button>
                  </div>
                </div>
              </>
            )}
            {forgetPasswordVisible && ( // Render Forget Password component conditionally
              <Forgetpassword className="slide-in-from-left" />
            )}
          </div>
        </div>
      </main>
      <Notification />
    </section>
  );
};

export default Login;
