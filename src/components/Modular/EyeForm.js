import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../popup.css";
import { deleteUser, editUserProfile } from "../../redux/actions/alluserGet";
import { fetchLicenseData, FETCH_LICENSE_DATA_SUCCESS, updateLicense, deleteLicence } from "../../redux/actions/allLicensingGet";
import { showNotification } from "../../redux/actions/notificationActions"; // Import showNotification

const EyeForm = ({ data }) => {
    const darkMode = useSelector((state) => state.theme.darkMode);

    const [showPopup, setShowPopup] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const { licenseData } = useSelector((state) => state.licensing);

    const [company, setcompany] = useState("N/A");

    useEffect(() => {
        if (licenseData?.license?.setcompany !== undefined) {
            setcompany(licenseData.license.usedLicenses);
        }
    }, [licenseData]); // Runs when licenseData changes

    const dispatch = useDispatch();

    const handleViewPopup = () => {
        setShowPopup(true);
        console.log(data)
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
        await dispatch(deleteUser([data]));
        handleClosePopup();
        dispatch(showNotification('Deleted License successful!', 'success'));

        localStorage.setItem("activeComponent", "Rolemanagement"); // Store Licensing before reload
        window.location.reload();
    };

    const fields = [
        { label: "User ID", key: "userId" },
        { label: "Partner Name", key: "firstName" },
        { label: "Organization Name", key: "company", value: company, editable: false },
        { label: "Email Address", key: "email" },
        { label: "Phone Number", key: "mobile" },
        { label: "Location", key: "address" },
        { label: "Role/ Title at Organization", key: "title_at_organization" },
        { label: "Social Media Profile", key: "social_twitter", key: "social_youtube", key: "social_insta" },
        { label: "Type of Content Specialization", key: "type_of_contantSpecilization" },
        { label: "Date of Joining", key: "joinedAt" },
        { label: "Brief Bio", key: "brief_bio" },
        { label: "Preferred Contact Method", key: "contact_method" },
    ];

    // Update formData when data or licenseData changes
    useEffect(() => {
        if (data) {
            setFormData({
                userId: data?.userId || "",
                firstName: data?.firstName || "",
                company: data?.company || "",
                email: data?.email || "",
                mobile: data?.mobile || "",
                address: licenseData?.license?.address || "", // Fixed
                title_at_organization: data?.title_at_organization || "",
                social_twitter: data?.social_twitter || "",
                type_of_contantSpecilization: data?.type_of_contantSpecilization || "",
                joinedAt: data?.joinedAt || "",
                brief_bio: data?.brief_bio || "",
                contact_method: data?.contact_method || "",
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
            image: uploadedImage, // Include the uploaded image if available
        };

        const formDataToSend = new FormData();

        for (const key in updatedData) {
            if (data && updatedData[key] === data[key] && (key === 'userId' || key === 'email')) {
                continue; // Skip adding unchanged userId and email
            }
            formDataToSend.append(key, updatedData[key]);
        }

        if (data?._id) {
            dispatch(editUserProfile(data._id, formDataToSend));
        }

        setIsEditing(false);
        dispatch(showNotification('Edited License successful!', 'success'));

        localStorage.setItem("activeComponent", "Rolemanagement"); // Store Licensing before reload
    };

    const [isOpen, setIsOpen] = useState(false);

    const handleOpenSidebar = () => {
        setIsOpen(!isOpen); // Toggle the state
    };



    return (
        <>
            <div onClick={handleViewPopup} className="cursor-pointer flex flex-row">
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

            {showPopup && (
                <div className="popup-overlay">
                    <div className={`rounded-3xl shadow-lg w-] max-w-[70%] overflow-y-scroll pl-10 pr-10 p-4 relative flex flex-col max-h-[95%] ${darkMode ? 'bg-[#222222] text-white' : 'bg-[#fff] text-dark'}`}>
                        <div className="flex justify-between align-center">
                            <h2 className="text-2xl mb-4">USER DETAILS</h2>
                            {!isOpen && (
                                <div className="flex gap-3">
                                    <svg className="cursor-pointer" onClick={handleOpenSidebar} width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.9145 1.875H18.0855C21.549 1.875 24.2625 1.875 26.3805 2.16C28.5465 2.451 30.2565 3.06 31.599 4.401C32.9415 5.7435 33.549 7.4535 33.84 9.621C34.125 11.7375 34.125 14.451 34.125 17.9145V18.0855C34.125 21.549 34.125 24.2625 33.84 26.3805C33.549 28.5465 32.94 30.2565 31.599 31.599C30.2565 32.9415 28.5465 33.549 26.379 33.84C24.2625 34.125 21.549 34.125 18.0855 34.125H17.9145C14.451 34.125 11.7375 34.125 9.6195 33.84C7.4535 33.549 5.7435 32.94 4.401 31.599C3.0585 30.2565 2.451 28.5465 2.16 26.379C1.875 24.2625 1.875 21.549 1.875 18.0855V17.9145C1.875 14.451 1.875 11.7375 2.16 9.6195C2.451 7.4535 3.06 5.7435 4.401 4.401C5.7435 3.0585 7.4535 2.451 9.621 2.16C11.7375 1.875 14.451 1.875 17.9145 1.875ZM9.9195 4.389C8.0025 4.647 6.846 5.139 5.9925 5.9925C5.1375 6.8475 4.647 8.0025 4.389 9.921C4.128 11.871 4.125 14.433 4.125 18C4.125 21.567 4.128 24.129 4.389 26.079C4.647 27.9975 5.139 29.154 5.9925 30.009C6.8475 30.8625 8.0025 31.353 9.921 31.611C11.871 31.872 14.433 31.875 18 31.875C21.567 31.875 24.129 31.872 26.079 31.611C27.9975 31.353 29.154 30.861 30.009 30.0075C30.8625 29.1525 31.353 27.9975 31.611 26.079C31.872 24.129 31.875 21.567 31.875 18C31.875 14.433 31.872 11.871 31.611 9.921C31.353 8.0025 30.861 6.846 30.0075 5.991C29.1525 5.1375 27.9975 4.647 26.079 4.389C24.129 4.128 21.567 4.125 18 4.125C14.433 4.125 11.8695 4.128 9.9195 4.389ZM15.777 9.684C15.8841 9.78589 15.9701 9.9079 16.0301 10.0431C16.0901 10.1782 16.1228 10.3239 16.1264 10.4717C16.13 10.6195 16.1045 10.7666 16.0512 10.9045C15.998 11.0424 15.918 11.1685 15.816 11.2755L11.5305 15.7755C11.4254 15.8858 11.2991 15.9736 11.1591 16.0336C11.019 16.0935 10.8683 16.1245 10.716 16.1245C10.5637 16.1245 10.413 16.0935 10.2729 16.0336C10.1329 15.9736 10.0066 15.8858 9.9015 15.7755L8.187 13.9755C8.08075 13.8694 7.9968 13.7432 7.94011 13.6041C7.88341 13.4651 7.85512 13.3161 7.8569 13.166C7.85868 13.0159 7.89049 12.8676 7.95045 12.73C8.01042 12.5923 8.09734 12.4681 8.20607 12.3646C8.31481 12.261 8.44317 12.1803 8.58358 12.1272C8.724 12.074 8.87364 12.0495 9.02367 12.0551C9.17371 12.0607 9.32111 12.0963 9.45718 12.1597C9.59326 12.2231 9.71526 12.3132 9.816 12.4245L10.716 13.3695L14.187 9.7245C14.3927 9.50857 14.6758 9.38316 14.9739 9.37585C15.2721 9.36854 15.5609 9.47841 15.777 9.684ZM18.375 13.5C18.375 13.2016 18.4935 12.9155 18.7045 12.7045C18.9155 12.4935 19.2016 12.375 19.5 12.375H27C27.2984 12.375 27.5845 12.4935 27.7955 12.7045C28.0065 12.9155 28.125 13.2016 28.125 13.5C28.125 13.7984 28.0065 14.0845 27.7955 14.2955C27.5845 14.5065 27.2984 14.625 27 14.625H19.5C19.2016 14.625 18.9155 14.5065 18.7045 14.2955C18.4935 14.0845 18.375 13.7984 18.375 13.5ZM15.7755 20.1855C16.2255 20.6145 16.2435 21.3255 15.8145 21.7755L11.529 26.2755C11.4239 26.3858 11.2976 26.4736 11.1576 26.5336C11.0175 26.5935 10.8668 26.6245 10.7145 26.6245C10.5622 26.6245 10.4115 26.5935 10.2714 26.5336C10.1314 26.4736 10.0051 26.3858 9.9 26.2755L8.1855 24.4755C8.07925 24.3694 7.9953 24.2432 7.93861 24.1041C7.88191 23.9651 7.85362 23.8161 7.8554 23.666C7.85718 23.5159 7.88899 23.3676 7.94895 23.23C8.00892 23.0923 8.09583 22.9681 8.20457 22.8646C8.31331 22.761 8.44167 22.6803 8.58208 22.6272C8.7225 22.574 8.87214 22.5495 9.02217 22.5551C9.17221 22.5607 9.31961 22.5963 9.45568 22.6597C9.59176 22.7231 9.71376 22.8132 9.8145 22.9245L10.7145 23.8695L14.1855 20.2245C14.3912 20.0086 14.6743 19.8832 14.9724 19.8759C15.2706 19.8685 15.5594 19.9799 15.7755 20.1855ZM18.375 24C18.375 23.7016 18.4935 23.4155 18.7045 23.2045C18.9155 22.9935 19.2016 22.875 19.5 22.875H27C27.2984 22.875 27.5845 22.9935 27.7955 23.2045C28.0065 23.4155 28.125 23.7016 28.125 24C28.125 24.2984 28.0065 24.5845 27.7955 24.7955C27.5845 25.0065 27.2984 25.125 27 25.125H19.5C19.2016 25.125 18.9155 25.0065 18.7045 24.7955C18.4935 24.5845 18.375 24.2984 18.375 24Z" fill="#C7C7C7" />
                                    </svg>

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
                            )}
                            {isOpen && (
                                <div className="flex justify-between w-[60%]">

                                    <svg className="cursor-pointer" onClick={handleOpenSidebar} width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.9145 1.875H18.0855C21.549 1.875 24.2625 1.875 26.3805 2.16C28.5465 2.451 30.2565 3.06 31.599 4.401C32.9415 5.7435 33.549 7.4535 33.84 9.621C34.125 11.7375 34.125 14.451 34.125 17.9145V18.0855C34.125 21.549 34.125 24.2625 33.84 26.3805C33.549 28.5465 32.94 30.2565 31.599 31.599C30.2565 32.9415 28.5465 33.549 26.379 33.84C24.2625 34.125 21.549 34.125 18.0855 34.125H17.9145C14.451 34.125 11.7375 34.125 9.6195 33.84C7.4535 33.549 5.7435 32.94 4.401 31.599C3.0585 30.2565 2.451 28.5465 2.16 26.379C1.875 24.2625 1.875 21.549 1.875 18.0855V17.9145C1.875 14.451 1.875 11.7375 2.16 9.6195C2.451 7.4535 3.06 5.7435 4.401 4.401C5.7435 3.0585 7.4535 2.451 9.621 2.16C11.7375 1.875 14.451 1.875 17.9145 1.875ZM9.9195 4.389C8.0025 4.647 6.846 5.139 5.9925 5.9925C5.1375 6.8475 4.647 8.0025 4.389 9.921C4.128 11.871 4.125 14.433 4.125 18C4.125 21.567 4.128 24.129 4.389 26.079C4.647 27.9975 5.139 29.154 5.9925 30.009C6.8475 30.8625 8.0025 31.353 9.921 31.611C11.871 31.872 14.433 31.875 18 31.875C21.567 31.875 24.129 31.872 26.079 31.611C27.9975 31.353 29.154 30.861 30.009 30.0075C30.8625 29.1525 31.353 27.9975 31.611 26.079C31.872 24.129 31.875 21.567 31.875 18C31.875 14.433 31.872 11.871 31.611 9.921C31.353 8.0025 30.861 6.846 30.0075 5.991C29.1525 5.1375 27.9975 4.647 26.079 4.389C24.129 4.128 21.567 4.125 18 4.125C14.433 4.125 11.8695 4.128 9.9195 4.389ZM15.777 9.684C15.8841 9.78589 15.9701 9.9079 16.0301 10.0431C16.0901 10.1782 16.1228 10.3239 16.1264 10.4717C16.13 10.6195 16.1045 10.7666 16.0512 10.9045C15.998 11.0424 15.918 11.1685 15.816 11.2755L11.5305 15.7755C11.4254 15.8858 11.2991 15.9736 11.1591 16.0336C11.019 16.0935 10.8683 16.1245 10.716 16.1245C10.5637 16.1245 10.413 16.0935 10.2729 16.0336C10.1329 15.9736 10.0066 15.8858 9.9015 15.7755L8.187 13.9755C8.08075 13.8694 7.9968 13.7432 7.94011 13.6041C7.88341 13.4651 7.85512 13.3161 7.8569 13.166C7.85868 13.0159 7.89049 12.8676 7.95046 12.73C8.01042 12.5923 8.09734 12.4681 8.20607 12.3646C8.31481 12.261 8.44317 12.1803 8.58358 12.1272C8.724 12.074 8.87364 12.0495 9.02367 12.0551C9.17371 12.0607 9.32111 12.0963 9.45718 12.1597C9.59326 12.2231 9.71526 12.3132 9.816 12.4245L10.716 13.3695L14.187 9.7245C14.3927 9.50857 14.6758 9.38316 14.9739 9.37585C15.2721 9.36854 15.5609 9.47842 15.777 9.684ZM18.375 13.5C18.375 13.2016 18.4935 12.9155 18.7045 12.7045C18.9155 12.4935 19.2016 12.375 19.5 12.375H27C27.2984 12.375 27.5845 12.4935 27.7955 12.7045C28.0065 12.9155 28.125 13.2016 28.125 13.5C28.125 13.7984 28.0065 14.0845 27.7955 14.2955C27.5845 14.5065 27.2984 14.625 27 14.625H19.5C19.2016 14.625 18.9155 14.5065 18.7045 14.2955C18.4935 14.0845 18.375 13.7984 18.375 13.5ZM15.7755 20.1855C16.2255 20.6145 16.2435 21.3255 15.8145 21.7755L11.529 26.2755C11.4239 26.3858 11.2976 26.4736 11.1576 26.5336C11.0175 26.5935 10.8668 26.6245 10.7145 26.6245C10.5622 26.6245 10.4115 26.5935 10.2714 26.5336C10.1314 26.4736 10.0051 26.3858 9.9 26.2755L8.1855 24.4755C8.07925 24.3694 7.9953 24.2432 7.93861 24.1041C7.88191 23.9651 7.85362 23.8161 7.8554 23.666C7.85718 23.5159 7.88899 23.3676 7.94896 23.23C8.00892 23.0923 8.09584 22.9681 8.20457 22.8646C8.31331 22.761 8.44167 22.6803 8.58208 22.6272C8.7225 22.574 8.87214 22.5495 9.02217 22.5551C9.17221 22.5607 9.31961 22.5963 9.45568 22.6597C9.59176 22.7231 9.71376 22.8132 9.8145 22.9245L10.7145 23.8695L14.1855 20.2245C14.3912 20.0086 14.6743 19.8832 14.9724 19.8759C15.2706 19.8685 15.5594 19.9799 15.7755 20.1855ZM18.375 24C18.375 23.7016 18.4935 23.4155 18.7045 23.2045C18.9155 22.9935 19.2016 22.875 19.5 22.875H27C27.2984 22.875 27.5845 22.9935 27.7955 23.2045C28.0065 23.4155 28.125 23.7016 28.125 24C28.125 24.2984 28.0065 24.5845 27.7955 24.7955C27.5845 25.0065 27.2984 25.125 27 25.125H19.5C19.2016 25.125 18.9155 25.0065 18.7045 24.7955C18.4935 24.5845 18.375 24.2984 18.375 24Z" fill="#F48567" />
                                    </svg>


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
                            )}
                        </div>
                        <div className="flex activetolgs">
                            <div>
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
                                                        : data?.image
                                                            ? `${process.env.REACT_APP_STATIC_API_URL}${data.image.replace('/root/happme_adminuser_management', '')}`
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
  className={`absolute mt-[-30px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
    isOpen ? "ml-[-190px]" : "ml-[80px]"
  }`}
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

                            {isOpen && (
                                <section className="flex flex-col gap-20 activetolgs">
                                    {data.editLogs.map((log, index) => (
                                        <div key={log._id} className="flex flex-row gap-3">
                                            <div>{new Date(log.date).toDateString()}</div>
                                            <span className="gola"></span>
                                            <div className="flex flex-col">
                                                <span>{log.message}</span>
                                                <div className="flex items-center gap-7 absolute mt-[35px] ml-[-100px]">
                                                    <span>{new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    <span>
                                                        <svg width="40" height="2" viewBox="0 0 40 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M0 1H40" stroke="white" stroke-dasharray="2 2" />
                                                        </svg>
                                                    </span>
                                                    <span>Omnis et est.</span>
                                                </div>
                                                <div className="flex items-center gap-7 absolute mt-[65px] ml-[-100px]">
                                                    <span>{new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    <span>
                                                        <svg width="40" height="2" viewBox="0 0 40 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M0 1H40" stroke="white" stroke-dasharray="2 2" />
                                                        </svg>
                                                    </span>
                                                    <span>Omnis et est.</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add the glowing circle at the end of the timeline */}
                                    <div className="flex justify-center  ml-[-263px]">
                                        <span className="gola-end"></span>
                                    </div>
                                </section>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EyeForm;
