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
            className={`rounded-3xl shadow-lg w-auto max-w-[100%] overflow-y-scroll pl-10 pr-10 p-4 relative flex flex-col max-h-[95%] ${
              darkMode ? "bg-[#222222] text-white" : "bg-[#fff] text-dark"
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl">USER DETAILS</h2>
              <div className="flex gap-3">
                <button
                  onClick={toggleActivityLog}
                  className={`p-1 rounded ${
                    isActivityLogOpen ? "bg-[#F48567]" : ""
                  }`}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 12H21M3 6H21M3 18H21"
                      stroke={isActivityLogOpen ? "#fff" : "#C7C7C7"}
                      strokeWidth="2"
                    />
                  </svg>
                </button>
                <button onClick={handleClosePopup} className="p-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="#C7C7C7"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex">
              {/* Profile Section */}
              <div className={`${isActivityLogOpen ? "w-2/3" : "w-full"}`}>
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <img
                      src={
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
                      alt="Profile"
                      className="w-40 h-40 rounded-full object-cover border-4 border-[#F48567]"
                    />
                    {isEditing && (
                      <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M12 6V18M6 12H18"
                              stroke="#F48567"
                              strokeWidth="2"
                            />
                          </svg>
                        </label>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleEditToggle}
                    className="mt-4 flex items-center gap-2 text-[#F48567]"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 13H15M11 3L13 1L15 3L13 5L11 3ZM11 3L3 11V13H5L13 5L11 3Z"
                        stroke="#F48567"
                        strokeWidth="2"
                      />
                    </svg>
                    {isEditing ? "Cancel Editing" : "Edit Profile"}
                  </button>
                </div>

                {/* Profile Fields */}
                <div className="space-y-4 max-h-[50vh] overflow-y-auto">
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
                <div className="flex justify-between mt-8">
                  {isEditing ? (
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="px-6 py-2 bg-[#F48567] text-white rounded-lg flex items-center gap-2"
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                      {isLoading && (
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                        </svg>
                      )}
                    </button>
                  ) : null}
                  <button
                    onClick={handleDeleteUser}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg"
                  >
                    Delete Account
                  </button>
                </div>
              </div>

              {/* Activity Logs Sidebar */}
              {isActivityLogOpen && (
                <div className="w-1/3 pl-8 border-l border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold mb-6">Activity Logs</h3>
                  <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                    {currentUser?.editLogs?.length > 0 ? (
                      currentUser.editLogs.map((log) => (
                        <div key={log._id} className="relative pl-6">
                          <div className="absolute left-0 top-2 h-3 w-3 rounded-full bg-[#F48567]"></div>
                          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {formatDate(log.date)} at {formatTime(log.date)}
                            </div>
                            <div className="mt-1 font-medium">
                              {log.message}
                            </div>
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                              Edited by: {log.editedBy || "System"}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No activity logs available
                      </div>
                    )}
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
