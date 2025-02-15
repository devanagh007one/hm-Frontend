import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../popup.css";
import { deleteUser, } from "../../redux/actions/alluserGet";
import { fetchLicenseData, FETCH_LICENSE_DATA_SUCCESS, updateLicense, deleteLicence } from "../../redux/actions/allLicensingGet";
import { showNotification } from "../../redux/actions/notificationActions"; // Import showNotification

const EyeForm = ({ data }) => {
        const darkMode = useSelector((state) => state.theme.darkMode);
    
    const [showPopup, setShowPopup] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const { licenseData } = useSelector((state) => state.licensing);

    const [usedLicenses, setUsedLicenses] = useState("N/A");

    useEffect(() => {
        if (licenseData?.license?.usedLicenses !== undefined) {
            setUsedLicenses(licenseData.license.usedLicenses);
        }
    }, [licenseData]); // Runs when licenseData changes

    const dispatch = useDispatch();

    const handleViewPopup = () => {
        setShowPopup(true);
        if (data?._id) {
            dispatch(fetchLicenseData(data._id));
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setIsEditing(false);
        dispatch({ type: FETCH_LICENSE_DATA_SUCCESS, payload: null });
    };


    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e, key) => {
        setFormData((prev) => ({
            ...prev,
            [key]: e.target.value
        }));
    };

    const handleDelete = async (data) => {
        console.log(data)
        await dispatch(deleteLicence(data));
        handleClosePopup();
        dispatch(showNotification('Deleted License successful!', 'success'));
    
        localStorage.setItem("activeComponent", "Licensing"); // Store Licensing before reload
        window.location.reload();
    };

    const fields = [
        { label: "Name of the Organization", key: "contactPersonName" },
        { label: "Industry", key: "industryType" },
        { label: "Organization Size", key: "organizationSize" },
        { label: "Contact Person Name", key: "contactPersonName" },
        { label: "Contact Email Address", key: "contactPersonEmail" },
        { label: "Phone Number", key: "phoneNumber" },
        { label: "Total User For Licensing", key: "usedLicenses", value: usedLicenses, editable: false },
        { label: "Main Licensing Detail", key: "numberOfLicence" },
        { label: "Comment or Special Request", key: "comment" },
    ];

    // Update formData when data or licenseData changes
    useEffect(() => {
        if (data) {
            setFormData({
                contactPersonName: data?.contactPersonName || "",
                industryType: data?.industryType || "",
                organizationSize: data?.organizationSize || "",
                contactPersonEmail: data?.contactPersonEmail || "",
                phoneNumber: data?.phoneNumber || "",
                usedLicenses: licenseData?.license?.usedLicenses || "", // Fixed
                numberOfLicence: data?.numberOfLicence || "",
                comment: data?.comment || "",
            });
        }
    }, [data, licenseData]); // Runs when data or licenseData changes


    const [uploadedImage, setUploadedImage] = useState(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUploadedImage(file);
        }
    };

    const handleSave = () => {
        const updatedData = {
            ...formData,
            logo: uploadedImage, // Include the uploaded image if available
        };
    
        if (data?._id) {
            dispatch(updateLicense(data._id, updatedData));
        }
    
        setIsEditing(false);
        dispatch(showNotification('Edited License successful!', 'success'));
    
        localStorage.setItem("activeComponent", "Licensing"); // Store Licensing before reload
        setTimeout(() => {
            handleClosePopup();
            window.location.reload();
        }, 3000); // 3000ms = 3 seconds
            };
    
    



    return (
        <>
            <div onClick={handleViewPopup} className="cursor-pointer flex flex-row">
            <span className="w-16 overflow-hidden">{data.contactPersonName}</span>

                <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
                    <path d="M6.87887 10.2027V8.53605H13.5455V10.2027H6.87887ZM6.87887 6.86938V5.20272H13.5455V6.86938H6.87887ZM5.2122 11.8694H11.4622C11.865 11.8694 12.24 11.9563 12.5872 12.1302C12.9344 12.3041 13.2261 12.5505 13.4622 12.8694L15.2122 15.161V3.53605H5.2122V11.8694ZM5.2122 16.8694H14.4205L12.1497 13.8902C12.0664 13.7791 11.9658 13.6924 11.848 13.6302C11.7303 13.568 11.6016 13.5366 11.4622 13.536H5.2122V16.8694ZM15.2122 18.536H5.2122C4.75387 18.536 4.36164 18.373 4.03553 18.0469C3.70942 17.7208 3.54609 17.3283 3.54553 16.8694V3.53605C3.54553 3.07772 3.70887 2.6855 4.03553 2.35938C4.3622 2.03327 4.75442 1.86994 5.2122 1.86938H15.2122C15.6705 1.86938 16.063 2.03272 16.3897 2.35938C16.7164 2.68605 16.8794 3.07827 16.8789 3.53605V16.8694C16.8789 17.3277 16.7158 17.7202 16.3897 18.0469C16.0636 18.3735 15.6711 18.5366 15.2122 18.536Z" fill="#6376B1" />
                </svg>
            </div>

            {showPopup && (
                <div className="popup-overlay">
                                        <div className={`rounded-lg shadow-lg w-[35%] max-w-3xl p-8 relative flex flex-col max-h-[90%] ${darkMode ? 'bg-[#222222] text-white' : 'bg-[#fff] text-dark'}`}>

                    {/* <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg w-[40%] max-w-3xl p-8 relative flex flex-col max-h-[90%]"> */}
                            <div className="flex justify-between align-center">
                            <h2 className="text-2xl mb-4">SPOC</h2>
                            <svg className="cursor-pointer mt-1" onClick={handleClosePopup}
                                width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_3261_1019)">
                                    <path d="M3.516 20.985C2.36988 19.878 1.45569 18.5539 0.826781 17.0898C0.197873 15.6258 -0.133162 14.0511 -0.147008 12.4578C-0.160854 10.8644 0.142767 9.28428 0.746137 7.80953C1.34951 6.33477 2.24055 4.99495 3.36726 3.86823C4.49397 2.74152 5.83379 1.85048 7.30855 1.24711C8.78331 0.643743 10.3635 0.340123 11.9568 0.353969C13.5502 0.367815 15.1248 0.698849 16.5889 1.32776C18.0529 1.95667 19.377 2.87085 20.484 4.01697C22.6699 6.2802 23.8794 9.31143 23.8521 12.4578C23.8247 15.6042 22.5627 18.6139 20.3378 20.8388C18.1129 23.0637 15.1032 24.3257 11.9568 24.3531C8.81045 24.3804 5.77922 23.1709 3.516 20.985ZM5.208 19.293C7.00935 21.0943 9.4525 22.1063 12 22.1063C14.5475 22.1063 16.9906 21.0943 18.792 19.293C20.5933 17.4916 21.6053 15.0485 21.6053 12.501C21.6053 9.95348 20.5933 7.51032 18.792 5.70897C16.9906 3.90762 14.5475 2.89564 12 2.89564C9.4525 2.89564 7.00935 3.90762 5.208 5.70897C3.40665 7.51032 2.39466 9.95348 2.39466 12.501C2.39466 15.0485 3.40665 17.4916 5.208 19.293ZM17.088 9.10497L13.692 12.501L17.088 15.897L15.396 17.589L12 14.193L8.604 17.589L6.912 15.897L10.308 12.501L6.912 9.10497L8.604 7.41297L12 10.809L15.396 7.41297L17.088 9.10497Z" fill="#C7C7C7" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_3261_1019">
                                        <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>

                        <div className="flex justify-center">
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
                                            uploadedImage
                                                ? URL.createObjectURL(uploadedImage) // Use uploaded image preview
                                                : data?.logo
                                                    ? `${process.env.REACT_APP_STATIC_API_URL}${data.logo.replace('/root/happme_adminuser_management', '')}`
                                                    : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"
                                        }
                                    />


                                </defs>
                            </svg>
                        </div>
                        <div className="flex  mb-8">
                            {isEditing && (
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className={`ml-4 p-1 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-[#f1f5f9]'}`}
                                    />
                                </div>
                            )}
                            <div
                                onClick={handleEditToggle}
                                className="absolute mt-[-30px] left-1/2 ml-[75px] transform -translate-x-1/2 -translate-y-1/2"
                            >
                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="15" cy="15" r="15" fill="#D9D9D9" />
                                    <path d="M10.345 18.2417L18.7967 9.79002L17.6183 8.61169L9.16667 17.0634V18.2417H10.345ZM11.0358 19.9084H7.5V16.3725L17.0292 6.84335C17.1854 6.68713 17.3974 6.59937 17.6183 6.59937C17.8393 6.59937 18.0512 6.68713 18.2075 6.84335L20.565 9.20085C20.7212 9.35713 20.809 9.56905 20.809 9.79002C20.809 10.011 20.7212 10.2229 20.565 10.3792L11.0358 19.9084ZM7.5 21.575H22.5V23.2417H7.5V21.575Z" fill="#1E1E1E" />
                                </svg>
                            </div>

                        </div>
                        <div className="overflow-y-auto flex flex-col space-y-6  h-[50vh]">
                            <div className="space-y-3">
                                {fields.map((field, index) => {
                                    return (
                                        <div key={index} className="flex justify-start items-center p-1">
                                            <span className="font-medium capitalize w-[180px]">{field.label}:</span>
                                            {isEditing && field.editable !== false ? (
                                                <input
                                                    type="text"
                                                    value={formData[field.key] || ""}
                                                    onChange={(e) => handleInputChange(e, field.key)}
                                                    className={`ml-4 p-1 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-[#f1f5f9]'}`}
                                                />
                                            ) : (
                                                <span className="ml-4">{formData[field.key] || "N/A"}</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex justify-center mt-8 space-x-6">
                                {isEditing ? (
                                    <button
                                        type="button"
                                        onClick={() => handleSave()} // Call a function to save before disabling editing
                                        className="py-3 px-6 bg-[#F48567] text-black font-medium rounded-lg"
                                    >
                                        Save
                                    </button>
                                ) : null}
                                <button
                                    type="button"
                                    className="py-3 px-6 bg-[#C7C7C7] text-black font-medium rounded-lg"
                                    onClick={() => handleDelete(data?._id)} // Ensure data._id exists
                                >
                                    Delete
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EyeForm;
