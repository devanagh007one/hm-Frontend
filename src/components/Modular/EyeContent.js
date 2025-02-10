import React, { useState } from "react";
import "../popup.css";
import { Table, Badge, Button, Space, Pagination, Select, Card } from "antd";


const EyeForm = ({ data }) => {
    const [showPopup, setShowPopup] = useState(false); // State to toggle popup visibility

    const handleViewPopup = () => setShowPopup(true);
    const handleClosePopup = () => setShowPopup(false);

    return (
        <>
            {/* Button to open the popup */}
            <div
                onClick={handleViewPopup}
                type="link"
                className="text-white cursor-pointer"
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M17.9532 9.20417C18.2065 9.55917 18.3332 9.7375 18.3332 10C18.3332 10.2633 18.2065 10.4408 17.9532 10.7958C16.8148 12.3925 13.9073 15.8333 9.99984 15.8333C6.0915 15.8333 3.18484 12.3917 2.0465 10.7958C1.79317 10.4408 1.6665 10.2625 1.6665 10C1.6665 9.73667 1.79317 9.55917 2.0465 9.20417C3.18484 7.6075 6.09234 4.16667 9.99984 4.16667C13.9082 4.16667 16.8148 7.60833 17.9532 9.20417Z"
                        stroke="#C7C7C7"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M12.5 10C12.5 9.33696 12.2366 8.70107 11.7678 8.23223C11.2989 7.76339 10.663 7.5 10 7.5C9.33696 7.5 8.70107 7.76339 8.23223 8.23223C7.76339 8.70107 7.5 9.33696 7.5 10C7.5 10.663 7.76339 11.2989 8.23223 11.7678C8.70107 12.2366 9.33696 12.5 10 12.5C10.663 12.5 11.2989 12.2366 11.7678 11.7678C12.2366 11.2989 12.5 10.663 12.5 10Z"
                        stroke="#C7C7C7"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {/* Modal Popup */}
            {showPopup && (
                <div className="popup-overlay">

                    <div className="w-[50%] min-h-screen bg-[#1E1E1E] flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
                        <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg w-full max-w-3xl p-8 relative flex flex-col">
                            {/* Close Button */}
                            <button
                                onClick={handleClosePopup}
                                className="absolute top-4 right-4 text-white text-xl font-bold"
                            >
                                ×
                            </button>

                            <h2 className="text-3xl font-semibold text-white mb-6">
                                {data.firstName || "NAME NAME"}
                            </h2>

                            
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EyeForm;
