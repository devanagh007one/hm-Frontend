import React, { useState } from "react";
import { useDispatch } from "react-redux"; // Import useDispatch
import "../popup.css";
import { deleteUser, fetchAllUsers } from '../../redux/actions/alluserGet'; // Import fetchAllUsers

const EyeForm = ({ data }) => {
    const [showPopup, setShowPopup] = useState(false);
    const dispatch = useDispatch(); // Initialize dispatch

    const handleViewPopup = () => setShowPopup(true);
    const handleClosePopup = () => setShowPopup(false);

    const handleDelete = async (userId) => {
        await dispatch(deleteUser([userId])); // Wait for the delete action
        dispatch(fetchAllUsers()); // Fetch updated users list
        handleClosePopup()
    };
    // console.log(data)

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

                    <div className="w-[40%] h-1/2 bg-[#1E1E1E] flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8" style={{ display: "contents" }}>
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

                            <div className="flex justify-center mb-8">
                                <svg width="180" height="193" viewBox="0 0 180 193" fill="none">
                                    <path d="M0.5 0.5H179.5V147.408L90 172.481L0.5 147.408V0.5Z" fill="#D9D9D9" stroke="black" />
                                    <rect x="17" y="13" width="148" height="148" fill="url(#pattern0_3001_1137)" />
                                    <path
                                        d="M180 131V166.197C176.154 169.298 171.73 172.293 166.648 175.127C146.016 186.624 118.795 192.95 89.9978 192.95C61.2003 192.95 33.9841 186.624 13.3518 175.127C8.27042 172.293 3.8461 169.303 0 166.197V131C9.01949 144.28 39.9284 163.867 89.9978 163.867C140.067 163.867 170.98 144.28 180 131Z"
                                        fill="#F48567"
                                    />
                                    <defs>
                                        <pattern id="pattern0_3001_1137" patternContentUnits="objectBoundingBox" width="1" height="1">
                                            <use href="#image0_3001_1137" transform="scale(0.00675676)" />
                                        </pattern>
                                        <image
                                            id="image0_3001_1137"
                                            width="180"
                                            height="173"
                                            href={
                                                data?.image
                                                    ? `${process.env.REACT_APP_STATIC_API_URL}${data.image.replace(/^.*happme_adminuser_management/, '')}`
                                                    : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"
                                            }
                                        />

                                    </defs>
                                </svg>
                            </div>

                            {/* Content Section */}
                            <div className="overflow-y-auto flex flex-col space-y-6 text-[#C7C7C7] h-[50vh]">
                                <div className="space-y-3">
                                    {Object.entries(data)
                                        .filter(([key]) => !["_id", "blocked", "editLogs", "__v", "activityLogs", "availability", "totalAvailabilityHours"].includes(key)) // Exclude unwanted keys
                                        .map(([key, value]) => (
                                            <div className="flex justify-start items-center ml-34 p-1" key={key}>
                                                <span className="font-medium capitalize w-[150px]">
                                                    {key.replace(/([A-Z])/g, " $1")}:
                                                </span>
                                                <span className="ml-4">
                                                    {typeof value === "object" && value !== null
                                                        ? JSON.stringify(value, null, 2) // Format objects as JSON
                                                        : value || "N/A"}
                                                </span>
                                            </div>
                                        ))}

                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-center mt-8 space-x-6">
                                    <button
                                        type="button"
                                        onClick={handleClosePopup}
                                        className="py-3 px-6 pr-10 pl-10 bg-[#F48567] text-black font-medium rounded-lg"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="py-3 px-6 pr-10 pl-10 bg-[#C7C7C7] text-black font-medium rounded-lg"
                                        onClick={() => handleDelete(data._id)}                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EyeForm;
