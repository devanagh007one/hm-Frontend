// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import "../popup.css";
// import { fetchUsers } from "../../redux/actions/authActions";
// import { showNotification } from "../../redux/actions/notificationActions";
// import { deleteUser, editUserProfile } from "../../redux/actions/alluserGet";

// const EyeForm = ({ data }) => {
//   const dispatch = useDispatch();
//   const darkMode = useSelector((state) => state.theme.darkMode);
//   const { licenseData } = useSelector((state) => state.licensing);
//   const currentUser = useSelector((state) => state.auth.currentUser) || data;

//   // State management
//   const [showPopup, setShowPopup] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [company, setCompany] = useState("N/A");
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   // Fields configuration
//   const fields = [
//     { label: "Username", key: "userName", editable: true },
//     { label: "Organization", key: "company", editable: false },
//     { label: "Email Address", key: "email", editable: true },
//     { label: "Phone Number", key: "mobile", editable: true },
//     { label: "Location", key: "address", editable: true },
//     { label: "Department", key: "department", editable: true },
//     { label: "Gender", key: "gender", editable: true },
//     { label: "DOB", key: "doB", editable: true },
//     { label: "Date of Joining", key: "joinedAt", editable: false },
//     { label: "Blood Group", key: "bloodGroups", editable: true },
//     { label: "Relationship Status", key: "relationShipStatus", editable: true },
//     { label: "DOA", key: "dateOfAniversary", editable: true },
//     { label: "Child Count", key: "childCount", editable: true },
//     { label: "Interests", key: "interests", editable: true },
//   ];

//   // Initialize form data
//   useEffect(() => {
//     if (licenseData?.license?.setcompany !== undefined) {
//       setCompany(licenseData.license.usedLicenses);
//     }

//     if (currentUser) {
//       const userData = currentUser.user || currentUser;
//       const initialFormData = {
//         userName:
//           userData.userName ||
//           `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
//           "N/A",
//         company: userData.company || company || "N/A",
//         email: userData.email || "N/A",
//         mobile: userData.mobile || "N/A",
//         address: userData.address || "N/A",
//         department: userData.department || "N/A",
//         gender: userData.gender || "N/A",
//         doB: userData.doB || "N/A",
//         bloodGroups: userData.bloodGroups || "N/A",
//         joinedAt: userData.joinedAt ? formatDate(userData.joinedAt) : "N/A",
//         relationShipStatus: userData.relationShipStatus || "N/A",
//         dateOfAniversary: userData.dateOfAniversary || "N/A",
//         childCount: userData.childCount || "N/A",
//         interests: userData.interests || "N/A",
//       };
//       setFormData(initialFormData);
//     }
//   }, [currentUser, company, licenseData]);

//   // Helper functions
//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     return new Date(dateString).toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   const formatTime = (dateString) => {
//     if (!dateString) return "";
//     return new Date(dateString).toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // Event handlers
//   const handleViewPopup = () => {
//     setShowPopup(true);
//     if (!currentUser) {
//       dispatch(fetchUsers());
//     }
//   };

//   const handleClosePopup = () => {
//     setShowPopup(false);
//     setIsEditing(false);
//     setIsActivityLogOpen(false);
//   };

//   const handleEditToggle = () => {
//     setIsEditing(!isEditing);
//   };

//   const handleInputChange = (e, key) => {
//     setFormData((prev) => ({
//       ...prev,
//       [key]: e.target.value,
//     }));
//   };

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setUploadedImage(file);
//     }
//   };

//   const handleSave = async () => {
//     setIsLoading(true);
//     try {
//       const formDataToSend = new FormData();

//       // Add all changed fields to FormData
//       Object.keys(formData).forEach((key) => {
//         if (formData[key] !== (currentUser[key] || currentUser.user?.[key])) {
//           formDataToSend.append(key, formData[key]);
//         }
//       });

//       // Add image if uploaded
//       if (uploadedImage) {
//         formDataToSend.append("image", uploadedImage);
//       }

//       if (currentUser?._id) {
//         await dispatch(editUserProfile(currentUser._id, formDataToSend));
//         dispatch(showNotification("Profile updated successfully!", "success"));
//       }

//       setIsEditing(false);
//       setIsLoading(false);

//       // Refresh after 2 seconds
//       setTimeout(() => {
//         window.location.reload();
//       }, 2000);
//     } catch (error) {
//       setIsLoading(false);
//       dispatch(showNotification("Failed to update profile", "error"));
//     }
//   };

//   const handleDeleteUser = () => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       dispatch(deleteUser(currentUser._id));
//       dispatch(showNotification("User deleted successfully", "success"));
//       handleClosePopup();
//     }
//   };

//   const toggleActivityLog = () => {
//     setIsActivityLogOpen(!isActivityLogOpen);
//   };

//   return (
//     <>
//       <div onClick={handleViewPopup} className="cursor-pointer flex flex-row">
//         <span>Profile Setting</span>
//       </div>

//       {showPopup && (
//         <div className="popup-overlay">
//           <div
//             className={`rounded-3xl shadow-lg w-auto max-w-[100%] overflow-y-scroll pl-10 pr-10 p-4 relative flex flex-col max-h-[95%] ${
//               darkMode ? "bg-[#222222] text-white" : "bg-[#fff] text-dark"
//             }`}
//           >
//             {/* Header */}
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-2xl">USER DETAILS</h2>
//               <div className="flex gap-3">
//                 <button
//                   onClick={toggleActivityLog}
//                   className={`p-1 rounded ${
//                     isActivityLogOpen ? "bg-[#F48567]" : ""
//                   }`}
//                 >
//                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                     <path
//                       d="M3 12H21M3 6H21M3 18H21"
//                       stroke={isActivityLogOpen ? "#fff" : "#C7C7C7"}
//                       strokeWidth="2"
//                     />
//                   </svg>
//                 </button>
//                 <button onClick={handleClosePopup} className="p-1">
//                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                     <path
//                       d="M18 6L6 18M6 6L18 18"
//                       stroke="#C7C7C7"
//                       strokeWidth="2"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             {/* Main Content */}
//             <div className="flex">
//               {/* Profile Section */}
//               <div className={`${isActivityLogOpen ? "w-2/3" : "w-full"}`}>
//                 <div className="flex flex-col items-center mb-6">
//                   <div className="relative">
//                     <img
//                       src={
//                         uploadedImage
//                           ? URL.createObjectURL(uploadedImage)
//                           : currentUser?.image
//                           ? `${
//                               process.env.REACT_APP_STATIC_API_URL
//                             }${currentUser.image.replace(
//                               "/root/happme_adminuser_management",
//                               ""
//                             )}`
//                           : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"
//                       }
//                       alt="Profile"
//                       className="w-40 h-40 rounded-full object-cover border-4 border-[#F48567]"
//                     />
//                     {isEditing && (
//                       <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full">
//                         <label className="cursor-pointer">
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleImageUpload}
//                             className="hidden"
//                           />
//                           <svg
//                             width="24"
//                             height="24"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                           >
//                             <path
//                               d="M12 6V18M6 12H18"
//                               stroke="#F48567"
//                               strokeWidth="2"
//                             />
//                           </svg>
//                         </label>
//                       </div>
//                     )}
//                   </div>
//                   <button
//                     onClick={handleEditToggle}
//                     className="mt-4 flex items-center gap-2 text-[#F48567]"
//                   >
//                     <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//                       <path
//                         d="M8 13H15M11 3L13 1L15 3L13 5L11 3ZM11 3L3 11V13H5L13 5L11 3Z"
//                         stroke="#F48567"
//                         strokeWidth="2"
//                       />
//                     </svg>
//                     {isEditing ? "Cancel Editing" : "Edit Profile"}
//                   </button>
//                 </div>

//                 {/* Profile Fields */}
//                 <div className="space-y-4 max-h-[50vh] overflow-y-auto">
//                   {fields.map((field) => (
//                     <div key={field.key} className="flex items-start">
//                       <span className="w-48 font-medium capitalize">
//                         {field.label}:
//                       </span>
//                       {isEditing && field.editable ? (
//                         <input
//                           type={
//                             field.key === "doB" ||
//                             field.key === "dateOfAniversary"
//                               ? "date"
//                               : "text"
//                           }
//                           value={formData[field.key] || ""}
//                           onChange={(e) => handleInputChange(e, field.key)}
//                           className={`flex-1 p-2 rounded ${
//                             darkMode ? "bg-gray-700" : "bg-gray-100"
//                           }`}
//                         />
//                       ) : (
//                         <span className="flex-1 p-2">
//                           {formData[field.key] || "N/A"}
//                         </span>
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex justify-between mt-8">
//                   {isEditing ? (
//                     <button
//                       onClick={handleSave}
//                       disabled={isLoading}
//                       className="px-6 py-2 bg-[#F48567] text-white rounded-lg flex items-center gap-2"
//                     >
//                       {isLoading ? "Saving..." : "Save Changes"}
//                       {isLoading && (
//                         <svg
//                           className="animate-spin h-5 w-5"
//                           viewBox="0 0 24 24"
//                         >
//                           <circle
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                             fill="none"
//                           />
//                         </svg>
//                       )}
//                     </button>
//                   ) : null}
//                   <button
//                     onClick={handleDeleteUser}
//                     className="px-6 py-2 bg-red-500 text-white rounded-lg"
//                   >
//                     Delete Account
//                   </button>
//                 </div>
//               </div>

//               {/* Activity Logs Sidebar */}
//               {isActivityLogOpen && (
//                 <div className="w-1/3 pl-8 border-l border-gray-200 dark:border-gray-700">
//                   <h3 className="text-xl font-semibold mb-6">Activity Logs</h3>
//                   <div className="space-y-4 max-h-[70vh] overflow-y-auto">
//                     {currentUser?.editLogs?.length > 0 ? (
//                       currentUser.editLogs.map((log) => (
//                         <div key={log._id} className="relative pl-6">
//                           <div className="absolute left-0 top-2 h-3 w-3 rounded-full bg-[#F48567]"></div>
//                           <div className=" p-4 rounded-lg">
//                             <div className="text-sm text-gray-600 dark:text-gray-300">
//                               {formatDate(log.date)} at {formatTime(log.date)}
//                             </div>
//                             <div className="mt-1 font-medium">
//                               {log.message}
//                             </div>
//                             {/* <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
//                               Edited by: {log.editedBy || "System"}
//                             </div> */}
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="text-center py-8 text-gray-500 dark:text-gray-400">
//                         No activity logs available
//                       </div>
//                     )}
//                   </div>
//                   <button className="text-black bg-[#F48567] rounded-lg p-2 w-[184px] justify-center flex items-center">
//                     Load More
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default EyeForm;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../popup.css";
import { fetchUsers } from "../../redux/actions/authActions";
import { showNotification } from "../../redux/actions/notificationActions";
import { deleteUser, editUserProfile } from "../../redux/actions/alluserGet";

const EyeForm = ({ data }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);
  const { licenseData } = useSelector((state) => state.licensing);
  const currentUser = useSelector((state) => state.auth.currentUser) || data;

  // State management
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [company, setCompany] = useState("N/A");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fields configuration
  const fields = [
    { label: "Username", key: "userName", editable: true },
    { label: "Organization", key: "company", editable: false },
    { label: "Email Address", key: "email", editable: true },
    { label: "Phone Number", key: "mobile", editable: true },
    { label: "Location", key: "address", editable: true },
    { label: "Department", key: "department", editable: true },
    { label: "Gender", key: "gender", editable: true },
    { label: "DOB", key: "doB", editable: true },
    { label: "Date of Joining", key: "joinedAt", editable: false },
    { label: "Blood Group", key: "bloodGroups", editable: true },
    { label: "Relationship Status", key: "relationShipStatus", editable: true },
    { label: "DOA", key: "dateOfAniversary", editable: true },
    { label: "Child Count", key: "childCount", editable: true },
    { label: "Interests", key: "interests", editable: true },
  ];

  // Initialize form data
  useEffect(() => {
    if (licenseData?.license?.setcompany !== undefined) {
      setCompany(licenseData.license.usedLicenses);
    }

    if (currentUser) {
      const userData = currentUser.user || currentUser;
      const initialFormData = {
        userName:
          userData.userName ||
          `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
          "N/A",
        company: userData.company || company || "N/A",
        email: userData.email || "N/A",
        mobile: userData.mobile || "N/A",
        address: userData.address || "N/A",
        department: userData.department || "N/A",
        gender: userData.gender || "N/A",
        doB: userData.doB || "N/A",
        bloodGroups: userData.bloodGroups || "N/A",
        joinedAt: userData.joinedAt ? formatDate(userData.joinedAt) : "N/A",
        relationShipStatus: userData.relationShipStatus || "N/A",
        dateOfAniversary: userData.dateOfAniversary || "N/A",
        childCount: userData.childCount || "N/A",
        interests: userData.interests || "N/A",
      };
      setFormData(initialFormData);
    }
  }, [currentUser, company, licenseData]);

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Event handlers
  const handleViewPopup = () => {
    setShowPopup(true);
    if (!currentUser) {
      dispatch(fetchUsers());
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setIsEditing(false);
    setIsActivityLogOpen(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e, key) => {
    setFormData((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();

      // Add all changed fields to FormData
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== (currentUser[key] || currentUser.user?.[key])) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add image if uploaded
      if (uploadedImage) {
        formDataToSend.append("image", uploadedImage);
      }

      if (currentUser?._id) {
        await dispatch(editUserProfile(currentUser._id, formDataToSend));
        dispatch(showNotification("Profile updated successfully!", "success"));
      }

      setIsEditing(false);
      setIsLoading(false);

      // Refresh after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      dispatch(showNotification("Failed to update profile", "error"));
    }
  };

  const handleDeleteUser = () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(currentUser._id));
      dispatch(showNotification("User deleted successfully", "success"));
      handleClosePopup();
    }
  };

  const toggleActivityLog = () => {
    setIsActivityLogOpen(!isActivityLogOpen);
  };

  return (
    <>
      <div onClick={handleViewPopup} className="cursor-pointer flex flex-row">
        <span>Profile Setting</span>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div
            className={`rounded-3xl shadow-lg w-auto max-w-[80%] overflow-y-auto pl-10 pr-10 p-4 relative flex flex-col max-h-[95%] ${
              darkMode ? "bg-[#222222] text-white" : "bg-[#fff] text-dark"
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">USER DETAILS</h2>
              <div className="flex gap-3">
                <button
                  onClick={toggleActivityLog}
                  className={`p-1 ${
                    isActivityLogOpen ? "text-[#F48567]" : "text-[#C7C7C7]"
                  }`}
                >
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M17.9145 1.875H18.0855C21.549 1.875 24.2625 1.875 26.3805 2.16C28.5465 2.451 30.2565 3.06 31.599 4.401C32.9415 5.7435 33.549 7.4535 33.84 9.621C34.125 11.7375 34.125 14.451 34.125 17.9145V18.0855C34.125 21.549 34.125 24.2625 33.84 26.3805C33.549 28.5465 32.94 30.2565 31.599 31.599C30.2565 32.9415 28.5465 33.549 26.379 33.84C24.2625 34.125 21.549 34.125 18.0855 34.125H17.9145C14.451 34.125 11.7375 34.125 9.6195 33.84C7.4535 33.549 5.7435 32.94 4.401 31.599C3.0585 30.2565 2.451 28.5465 2.16 26.379C1.875 24.2625 1.875 21.549 1.875 18.0855V17.9145C1.875 14.451 1.875 11.7375 2.16 9.6195C2.451 7.4535 3.06 5.7435 4.401 4.401C5.7435 3.0585 7.4535 2.451 9.621 2.16C11.7375 1.875 14.451 1.875 17.9145 1.875ZM9.9195 4.389C8.0025 4.647 6.846 5.139 5.9925 5.9925C5.1375 6.8475 4.647 8.0025 4.389 9.921C4.128 11.871 4.125 14.433 4.125 18C4.125 21.567 4.128 24.129 4.389 26.079C4.647 27.9975 5.139 29.154 5.9925 30.009C6.8475 30.8625 8.0025 31.353 9.921 31.611C11.871 31.872 14.433 31.875 18 31.875C21.567 31.875 24.129 31.872 26.079 31.611C27.9975 31.353 29.154 30.861 30.009 30.0075C30.8625 29.1525 31.353 27.9975 31.611 26.079C31.872 24.129 31.875 21.567 31.875 18C31.875 14.433 31.872 11.871 31.611 9.921C31.353 8.0025 30.861 6.846 30.0075 5.991C29.1525 5.1375 27.9975 4.647 26.079 4.389C24.129 4.128 21.567 4.125 18 4.125C14.433 4.125 11.8695 4.128 9.9195 4.389ZM15.777 9.684C15.8841 9.78589 15.9701 9.9079 16.0301 10.0431C16.0901 10.1782 16.1228 10.3239 16.1264 10.4717C16.13 10.6195 16.1045 10.7666 16.0512 10.9045C15.998 11.0424 15.918 11.1685 15.816 11.2755L11.5305 15.7755C11.4254 15.8858 11.2991 15.9736 11.1591 16.0336C11.019 16.0935 10.8683 16.1245 10.716 16.1245C10.5637 16.1245 10.413 16.0935 10.2729 16.0336C10.1329 15.9736 10.0066 15.8858 9.9015 15.7755L8.187 13.9755C8.08075 13.8694 7.9968 13.7432 7.94011 13.6041C7.88341 13.4651 7.85512 13.3161 7.8569 13.166C7.85868 13.0159 7.89049 12.8676 7.95045 12.73C8.01042 12.5923 8.09734 12.4681 8.20607 12.3646C8.31481 12.261 8.44317 12.1803 8.58358 12.1272C8.724 12.074 8.87364 12.0495 9.02367 12.0551C9.17371 12.0607 9.32111 12.0963 9.45718 12.1597C9.59326 12.2231 9.71526 12.3132 9.816 12.4245L10.716 13.3695L14.187 9.7245C14.3927 9.50857 14.6758 9.38316 14.9739 9.37585C15.2721 9.36854 15.5609 9.47841 15.777 9.684ZM18.375 13.5C18.375 13.2016 18.4935 12.9155 18.7045 12.7045C18.9155 12.4935 19.2016 12.375 19.5 12.375H27C27.2984 12.375 27.5845 12.4935 27.7955 12.7045C28.0065 12.9155 28.125 13.2016 28.125 13.5C28.125 13.7984 28.0065 14.0845 27.7955 14.2955C27.5845 14.5065 27.2984 14.625 27 14.625H19.5C19.2016 14.625 18.9155 14.5065 18.7045 14.2955C18.4935 14.0845 18.375 13.7984 18.375 13.5ZM15.7755 20.1855C16.2255 20.6145 16.2435 21.3255 15.8145 21.7755L11.529 26.2755C11.4239 26.3858 11.2976 26.4736 11.1576 26.5336C11.0175 26.5935 10.8668 26.6245 10.7145 26.6245C10.5622 26.6245 10.4115 26.5935 10.2714 26.5336C10.1314 26.4736 10.0051 26.3858 9.9 26.2755L8.1855 24.4755C8.07925 24.3694 7.9953 24.2432 7.93861 24.1041C7.88191 23.9651 7.85362 23.8161 7.8554 23.666C7.85718 23.5159 7.88899 23.3676 7.94895 23.23C8.00892 23.0923 8.09583 22.9681 8.20457 22.8646C8.31331 22.761 8.44167 22.6803 8.58208 22.6272C8.7225 22.574 8.87214 22.5495 9.02217 22.5551C9.17221 22.5607 9.31961 22.5963 9.45568 22.6597C9.59176 22.7231 9.71376 22.8132 9.8145 22.9245L10.7145 23.8695L14.1855 20.2245C14.3912 20.0086 14.6743 19.8832 14.9724 19.8759C15.2706 19.8685 15.5594 19.9799 15.7755 20.1855ZM18.375 24C18.375 23.7016 18.4935 23.4155 18.7045 23.2045C18.9155 22.9935 19.2016 22.875 19.5 22.875H27C27.2984 22.875 27.5845 22.9935 27.7955 23.2045C28.0065 23.4155 28.125 23.7016 28.125 24C28.125 24.2984 28.0065 24.5845 27.7955 24.7955C27.5845 25.0065 27.2984 25.125 27 25.125H19.5C19.2016 25.125 18.9155 25.0065 18.7045 24.7955C18.4935 24.5845 18.375 24.2984 18.375 24Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleClosePopup}
                  className="p-1 text-[#C7C7C7]"
                >
                  <svg
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_3261_1019)">
                      <path
                        d="M3.516 20.985C2.36988 19.878 1.45569 18.5539 0.826781 17.0898C0.197873 15.6258 -0.133162 14.0511 -0.147008 12.4578C-0.160854 10.8644 0.142767 9.28428 0.746137 7.80953C1.34951 6.33477 2.24055 4.99495 3.36726 3.86823C4.49397 2.74152 5.83379 1.85048 7.30855 1.24711C8.78331 0.643743 10.3635 0.340123 11.9568 0.353969C13.5502 0.367815 15.1248 0.698849 16.5889 1.32776C18.0529 1.95667 19.377 2.87085 20.484 4.01697C22.6699 6.2802 23.8794 9.31143 23.8521 12.4578C23.8247 15.6042 22.5627 18.6139 20.3378 20.8388C18.1129 23.0637 15.1032 24.3257 11.9568 24.3531C8.81045 24.3804 5.77922 23.1709 3.516 20.985ZM5.208 19.293C7.00935 21.0943 9.4525 22.1063 12 22.1063C14.5475 22.1063 16.9906 21.0943 18.792 19.293C20.5933 17.4916 21.6053 15.0485 21.6053 12.501C21.6053 9.95348 20.5933 7.51032 18.792 5.70897C16.9906 3.90762 14.5475 2.89564 12 2.89564C9.4525 2.89564 7.00935 3.90762 5.208 5.70897C3.40665 7.51032 2.39466 9.95348 2.39466 12.501C2.39466 15.0485 3.40665 17.4916 5.208 19.293ZM17.088 9.10497L13.692 12.501L17.088 15.897L15.396 17.589L12 14.193L8.604 17.589L6.912 15.897L10.308 12.501L6.912 9.10497L8.604 7.41297L12 10.809L15.396 7.41297L17.088 9.10497Z"
                        fill="currentColor"
                      />
                    </g>
                  </svg>
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex">
              {/* Profile Section */}
              <div className={`${isActivityLogOpen ? "w-2/3" : "w-full"}`}>
                <div className="flex justify-center mb-6">
                  <div
                    className="relative"
                    style={{ width: "180px", height: "193px" }}
                  >
                    <svg
                      width="180"
                      height="193"
                      viewBox="0 0 180 193"
                      fill="none"
                    >
                      <path
                        d="M0.5 0.5H179.5V147.408L90 172.481L0.5 147.408V0.5Z"
                        fill="#D9D9D9"
                        stroke="black"
                      />
                      <rect
                        x="17"
                        y="13"
                        width="148"
                        height="148"
                        fill="url(#pattern0)"
                      />
                      <path
                        d="M180 131V166.197C176.154 169.298 171.73 172.293 166.648 175.127C146.016 186.624 118.795 192.95 89.9978 192.95C61.2003 192.95 33.9841 186.624 13.3518 175.127C8.27042 172.293 3.8461 169.303 0 166.197V131C9.01949 144.28 39.9284 163.867 89.9978 163.867C140.067 163.867 170.98 144.28 180 131Z"
                        fill="#F48567"
                      />
                      <defs>
                        <pattern
                          id="pattern0"
                          patternContentUnits="objectBoundingBox"
                          width="1"
                          height="1"
                        >
                          <use href="#image0" transform="scale(0.00675676)" />
                        </pattern>
                        <image
                          id="image0"
                          width="180"
                          height="173"
                          href={
                            uploadedImage
                              ? URL.createObjectURL(uploadedImage)
                              : currentUser?.image
                              ? `${
                                  process.env.REACT_APP_STATIC_API_URL
                                }${currentUser.image.replace(
                                  "/root/happme_adminuser_management",
                                  ""
                                )}`
                              : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"
                          }
                        />
                      </defs>
                    </svg>

                    <div className="absolute bottom-4 right-4">
                      <label className="cursor-pointer flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          onClick={handleEditToggle}
                          className="hidden"
                        />
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
                            fill="#F48567"
                          />
                          <path
                            d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z"
                            fill="#F48567"
                          />
                        </svg>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Profile Fields */}
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-4">
                  {fields.map((field) => (
                    <div key={field.key} className="flex items-start">
                      <span className="w-48 font-medium capitalize">
                        {field.label}:
                      </span>
                      {isEditing && field.editable ? (
                        <input
                          type={
                            field.key === "doB" ||
                            field.key === "dateOfAniversary"
                              ? "date"
                              : "text"
                          }
                          value={formData[field.key] || ""}
                          onChange={(e) => handleInputChange(e, field.key)}
                          className={`flex-1 p-2 rounded ${
                            darkMode ? "bg-gray-700" : "bg-gray-100"
                          }`}
                        />
                      ) : (
                        <span className="flex-1 p-2">
                          {formData[field.key] || "N/A"}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between mt-8 space-x-6">
                  {isEditing ? (
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="py-3 px-6 bg-[#F48567] text-black font-medium rounded-lg w-[184px]"
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                  ) : null}
                  <button
                    onClick={handleDeleteUser}
                    className="py-3 px-6 bg-[#C7C7C7] text-black font-medium rounded-lg w-[184px]"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Activity Logs Sidebar */}
              {isActivityLogOpen && (
                <div className="w-[80%] pl-8">
                  <h3 className="text-xl font-semibold mb-6">Activity Logs</h3>
                  <div className="relative min-h-[200px]">
                    <div className="absolute left-4 top-0 h-full w-0.5 bg-[#F48567]"></div>

                    {currentUser?.editLogs?.length > 0 ? (
                      currentUser.editLogs.map((log, index) => (
                        <div key={log._id} className="relative pl-6 pb-8">
                          <div className="absolute left-0 top-0 h-3 w-3 rounded-full bg-[#F48567] transform -translate-x-1/2 ml-4"></div>
                          <div className="flex flex-col">
                            <span>{log.message}</span>
                            <div className="flex items-center gap-7 absolute mt-[35px] ml-[-100px]">
                              <span>{formatTime(log.date)}</span>
                              <span>
                                <svg
                                  width="40"
                                  height="2"
                                  viewBox="0 0 40 2"
                                  fill="none"
                                >
                                  <path
                                    d="M0 1H40"
                                    stroke="white"
                                    strokeDasharray="2 2"
                                  />
                                </svg>
                              </span>
                            </div>
                            <div className="flex items-center gap-7 absolute mt-[65px] ml-[-100px]">
                              <span>{formatTime(log.date)}</span>
                              <span>
                                <svg
                                  width="40"
                                  height="2"
                                  viewBox="0 0 40 2"
                                  fill="none"
                                >
                                  <path
                                    d="M0 1H40"
                                    stroke="white"
                                    strokeDasharray="2 2"
                                  />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No activity logs available
                      </div>
                    )}

                    {/* Add the glowing circle at the end of the timeline */}
                    <div className="flex justify-center ml-[-263px]">
                      <span className="w-3 h-3 rounded-full bg-[#F48567]"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EyeForm;
