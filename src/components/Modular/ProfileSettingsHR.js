import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { showNotification } from "../../redux/actions/notificationActions";
import { hrLicenseGet } from "../../redux/actions/allLicensingGet.js";
import { fetchUsers } from "../../redux/actions/authActions";
import { editUserProfile } from "../../redux/actions/alluserGet";
import CropImage from "./Cropimage";
import CryptoJS from "crypto-js";

const EditableField = ({ label, value, onChange, isEditable, onEditClick }) => (
  <div className="text-xl flex items-center justify-between">
    <div className="flex items-center gap-2">{label}:</div>
    <input
      value={value}
      readOnly={!isEditable}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-transparent border rounded p-1 text-xl outline-none w-3/5 ${
        isEditable ? "border-green-500" : "border-gray-300"
      }`}
    />
  </div>
);

const DatePickerField = ({ label, value, onChange, isEditable }) => {
  // Format date for display (DD/MM/YYYY)
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    // If it's already in DD/MM/YYYY format, convert it
    if (dateString.includes("/")) {
      const [day, month, year] = dateString.split("/");
      if (day && month && year) {
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }
    }

    // If it's a valid date string, format it
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0];
    }

    return "";
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value; // This is in YYYY-MM-DD format
    if (selectedDate) {
      // Convert to DD/MM/YYYY for storage
      const [year, month, day] = selectedDate.split("-");
      const formattedDate = `${day}/${month}/${year}`;
      onChange(formattedDate);
    } else {
      onChange("");
    }
  };

  return (
    <div className="text-xl flex items-center justify-between">
      <div className="flex items-center gap-2">{label}:</div>
      {isEditable ? (
        <input
          type="date"
          value={formatDateForInput(value)}
          onChange={handleDateChange}
          className={`bg-transparent border rounded p-1 text-xl outline-none w-3/5 border-green-500`}
          max={new Date().toISOString().split("T")[0]} // Prevent future dates
        />
      ) : (
        <input
          value={formatDateForDisplay(value)}
          readOnly={true}
          className={`bg-transparent border rounded p-1 text-xl outline-none w-3/5 border-gray-300`}
        />
      )}
    </div>
  );
};

const Profilecreads = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);
  const userData = useSelector((state) => state.auth.userData);
  const { hrlicensing, error: licensingError } = useSelector(
    (state) => state.licensing
  );

  const [formData, setFormData] = useState({
    userName: "",
    company: "",
    mobile: "",
    email: "",
    address: "",
    joinedAt: "",
    department: "",
    gender: "",
    doB: "",
    bloodGroups: "",
    relationShipStatus: "",
    childCount: "",
  });

  const [editStatus, setEditStatus] = useState({
    userName: false,
    company: false,
    mobile: false,
    email: false,
    address: false,
    joinedAt: false,
    department: false,
    gender: false,
    doB: false,
    bloodGroups: false,
    relationShipStatus: false,
    childCount: false,
  });

  const [showProfile, setShowProfile] = useState(true);
  const [showLicence, setShowLicence] = useState(false);

  // Image URL processing function
  const getImageUrl = (imagePath) => {
    if (!imagePath)
      return `${process.env.REACT_APP_STATIC_API_URL}/default.png`;

    let cleanPath = imagePath;

    // Remove /root if it exists at the beginning
    if (cleanPath.startsWith("/root/")) {
      cleanPath = cleanPath.replace("/root/", "");
    }

    // Ensure proper path format
    if (!cleanPath.startsWith("uploads/")) {
      const uploadsIndex = cleanPath.indexOf("uploads/");
      if (uploadsIndex !== -1) {
        cleanPath = cleanPath.substring(uploadsIndex);
      } else {
        // If no uploads found, assume it's just the filename
        cleanPath = `uploads/${cleanPath}`;
      }
    }

    return `${process.env.REACT_APP_STATIC_API_URL}/${cleanPath}`;
  };

  // Image error handling
  const handleImageError = (e) => {
    console.log("Image failed to load:", e.target.src);
    e.target.src = `${process.env.REACT_APP_STATIC_API_URL}/default.png`;
  };

  useEffect(() => {
    dispatch(hrLicenseGet());
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (userData) {
      setFormData({
        userName: userData.userName || "",
        company: userData.company || "",
        mobile: userData.mobile || "",
        email: userData.email || "",
        address: userData.address || "",
        joinedAt: userData.joinedAt || "",
        department: userData.department || "",
        gender: userData.gender || "",
        doB: userData.doB || "",
        bloodGroups: userData.bloodGroups || "",
        relationShipStatus: userData.relationShipStatus || "",
        childCount: userData.childCount || "",
      });
    }
  }, [userData]);

  // Debug useEffect - remove in production
  useEffect(() => {
    if (userData?.image) {
      console.log("Original image path:", userData.image);
      console.log("Processed image URL:", getImageUrl(userData.image));
    }
    if (hrlicensing?.licenseDetails?.logo) {
      console.log("Original logo path:", hrlicensing.licenseDetails.logo);
      console.log(
        "Processed logo URL:",
        getImageUrl(hrlicensing.licenseDetails.logo)
      );
    }
  }, [userData, hrlicensing]);

  const toggleEdit = () => {
    const allEditable = !allFieldsTrue; // Check if any field is currently editable
    const updatedEditStatus = Object.keys(editStatus).reduce((acc, key) => {
      acc[key] = allEditable;
      return acc;
    }, {});

    setEditStatus(updatedEditStatus);
    dispatch(
      showNotification(
        allEditable ? "Now you can edit all fields" : "Editing disabled",
        "success"
      )
    );
  };

  const handleSave = () => {
    const updatedData = new FormData();
    Object.keys(formData).forEach((key) =>
      updatedData.append(key, formData[key])
    );

    const encryptedId = localStorage.getItem("userId");
    let userId = null;

    if (encryptedId) {
      try {
        const bytes = CryptoJS.AES.decrypt(
          encryptedId,
          "477f58bc13b97959097e7bda64de165ab9d7496b7a15ab39697e6d31ac61cbd1"
        );
        userId = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } catch (error) {
        console.error("Decryption error:", error);
        return;
      }
    }

    if (!userId) {
      console.error("Failed to retrieve userId");
      return;
    }

    dispatch(editUserProfile(userId, updatedData));
    dispatch(showNotification(`Profile edited successfully`, "success"));
    setEditStatus({
      userName: false,
      company: false,
      mobile: false,
      email: false,
      address: false,
      joinedAt: false,
      department: false,
      gender: false,
      doB: false,
      bloodGroups: false,
      relationShipStatus: false,
      childCount: false,
    });
    dispatch(fetchUsers());
  };

  const handleCancel = () => {
    setEditStatus({
      userName: false,
      company: false,
      mobile: false,
      email: false,
      address: false,
      joinedAt: false,
      department: false,
      gender: false,
      doB: false,
      bloodGroups: false,
      relationShipStatus: false,
      childCount: false,
    });
  };

  const openProfilePopup = () => {
    setShowProfile(true);
    setShowLicence(false);
  };

  const openLicencePopup = () => {
    setShowLicence(true);
    setShowProfile(false);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const allFieldsTrue = Object.values(editStatus).some(
    (status) => status === true
  );

  return (
    <>
      <div className="flex ml-3">
        <div
          className={`theprofilesect cursor-pointer ${
            showLicence ? "bg-[#333333] text-[#F48567]" : "bg-transparent"
          }`}
          onClick={openLicencePopup}
        >
          Company Profile
        </div>
        <div
          className={`theprofilesect cursor-pointer ${
            showProfile ? "bg-[#333333] text-[#F48567]" : "bg-transparent"
          }`}
          onClick={openProfilePopup}
        >
          User Profile
        </div>
      </div>

      <section
        className={`flex ml-3 flex-col mailemt mr-3 justify-between items-center ${
          darkMode ? "bg-[#333333]" : "text-black"
        }`}
      >
        {showLicence && (
          <div
            className={`flex w-full mr-3  justify-between items-center ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            <section className="w-full flex-col flex items-center justify-center">
              <div className="flex items-center justify-center">
                <img
                  src={getImageUrl(hrlicensing?.licenseDetails?.logo)}
                  onError={handleImageError}
                  className="h-48 relative z-10 mt-[-7rem] w-48 rounded-full ml-16 bg-slate-500 object-cover"
                  alt="Company Logo"
                />
                <div className="mt-3 ml-[-25px] relative z-20">
                  <CropImage />
                </div>
              </div>
              <div className="flex ">
                {" "}
                <div className="mt-3 ml-5">
                  <h3 className="text-xl">
                    Mr {hrlicensing?.licenseDetails?.organisationName}
                  </h3>
                  <span className={`flex text-xs`}>
                    {hrlicensing?.licenseDetails?.contactPersonEmail}
                  </span>
                </div>
              </div>

              <section className="flex w-1/2 justify-between">
                <div
                  className={`mt-5 w-full flex gap-7 ${
                    darkMode ? "text-gray-300" : "text-black"
                  }`}
                >
                  <div className="w-full flex flex-col gap-2">
                    <EditableField
                      label="Company Name"
                      value={hrlicensing?.licenseDetails?.organisationName}
                    />
                    <EditableField
                      label="Industry"
                      value={hrlicensing?.licenseDetails?.industryType}
                    />
                    <EditableField
                      label="Company Size"
                      value={hrlicensing?.licenseDetails?.organizationSize}
                    />
                    <EditableField
                      label="Contact Person Name"
                      value={hrlicensing?.licenseDetails?.contactPersonName}
                    />
                    <EditableField
                      label="Contact Email Address"
                      value={hrlicensing?.licenseDetails?.contactPersonEmail}
                    />
                    <EditableField
                      label="Phone Number"
                      value={hrlicensing?.licenseDetails?.contactPersonPhone}
                    />
                    <EditableField
                      label="Total User For Licensing"
                      value={hrlicensing?.assignedLicenses}
                    />
                    <EditableField
                      label="Main Licensing Detail"
                      value={hrlicensing?.licenseDetails?.numberOfLicence}
                    />
                    <EditableField
                      label="Comment Or Special Request"
                      value={hrlicensing?.message}
                    />
                  </div>
                </div>
              </section>
            </section>
          </div>
        )}

        {showProfile && (
          <div
            className={`flex w-full mr-3  justify-between items-center h-[70vh] overflow-scroll ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            <section className="w-full flex-col flex items-center justify-center h-[100vh] mt-[300px]">
              <div className="flex items-center justify-center">
                <img
                  src={getImageUrl(userData?.image)}
                  onError={handleImageError}
                  className="h-48 relative z-10 mt-[-7rem] w-48 rounded-full ml-16 bg-slate-500 object-cover"
                  alt="Profile"
                />
                <div className="mt-3 ml-[-25px] relative z-20">
                  <CropImage />
                </div>
              </div>
              <div className="flex ">
                {" "}
                <div className="mt-3 ml-5">
                  <h3 className="text-xl">Mr {formData.userName}</h3>
                  <span className={`flex text-xs`}>{formData.email}</span>
                </div>
                <button onClick={toggleEdit} className="ml-2 text-blue-500">
                  {allFieldsTrue ? (
                    <svg
                      width="20"
                      height="21"
                      viewBox="0 0 20 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.345 14.2167L13.7967 5.76506L12.6183 4.58672L4.16667 13.0384V14.2167H5.345ZM6.03583 15.8834H2.5V12.3476L12.0292 2.81839C12.1854 2.66216 12.3974 2.5744 12.6183 2.5744C12.8393 2.5744 13.0512 2.66216 13.2075 2.81839L15.565 5.17589C15.7212 5.33216 15.809 5.54409 15.809 5.76506C15.809 5.98603 15.7212 6.19795 15.565 6.35422L6.03583 15.8834ZM2.5 17.5501H17.5V19.2167H2.5V17.5501Z"
                        fill="#1E1E1E"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="21"
                      viewBox="0 0 20 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.345 14.2167L13.7967 5.76506L12.6183 4.58672L4.16667 13.0384V14.2167H5.345ZM6.03583 15.8834H2.5V12.3476L12.0292 2.81839C12.1854 2.66216 12.3974 2.5744 12.6183 2.5744C12.8393 2.5744 13.0512 2.66216 13.2075 2.81839L15.565 5.17589C15.7212 5.33216 15.809 5.54409 15.809 5.76506C15.809 5.98603 15.7212 6.19795 15.565 6.35422L6.03583 15.8834ZM2.5 17.5501H17.5V19.2167H2.5V17.5501Z"
                        fill="#1E1E1E"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <section className="flex w-1/2 justify-between">
                <div
                  className={`mt-5 w-full flex gap-7 ${
                    darkMode ? "text-gray-300" : "text-black"
                  }`}
                >
                  <div className="w-full flex flex-col gap-2">
                    <EditableField
                      label="User Name"
                      value={formData.userName}
                      isEditable={editStatus.userName}
                      onChange={(val) => handleChange("userName", val)}
                      onEditClick={() => toggleEdit("userName")}
                    />
                    <EditableField
                      label="Organization Name"
                      value={formData.company}
                    />
                    <DatePickerField
                      label="DOJ"
                      value={formData.joinedAt}
                      isEditable={editStatus.joinedAt}
                      onChange={(val) => handleChange("joinedAt", val)}
                    />
                    <EditableField
                      label="Email Address"
                      value={formData.email}
                      isEditable={editStatus.email}
                      onChange={(val) => handleChange("email", val)}
                      onEditClick={() => toggleEdit("email")}
                    />
                    <EditableField
                      label="Location"
                      value={formData.address}
                      isEditable={editStatus.address}
                      onChange={(val) => handleChange("address", val)}
                      onEditClick={() => toggleEdit("address")}
                    />
                    <EditableField
                      label="Department"
                      value={formData.department}
                      isEditable={editStatus.department}
                      onChange={(val) => handleChange("department", val)}
                      onEditClick={() => toggleEdit("department")}
                    />
                    <EditableField
                      label="Gender"
                      value={formData.gender}
                      isEditable={editStatus.gender}
                      onChange={(val) => handleChange("gender", val)}
                      onEditClick={() => toggleEdit("gender")}
                    />

                    {/* Updated DOB field with calendar */}
                    <DatePickerField
                      label="DOB"
                      value={formData.doB}
                      isEditable={editStatus.doB}
                      onChange={(val) => handleChange("doB", val)}
                    />

                    <EditableField
                      label="Blood Group"
                      value={formData.bloodGroups}
                      isEditable={editStatus.bloodGroups}
                      onChange={(val) => handleChange("bloodGroups", val)}
                      onEditClick={() => toggleEdit("bloodGroups")}
                    />
                    <EditableField
                      label="Relationship"
                      value={formData.relationShipStatus}
                      isEditable={editStatus.relationShipStatus}
                      onChange={(val) =>
                        handleChange("relationShipStatus", val)
                      }
                      onEditClick={() => toggleEdit("relationShipStatus")}
                    />
                    <EditableField
                      label="Child Count"
                      value={formData.childCount}
                      isEditable={editStatus.childCount}
                      onChange={(val) => handleChange("childCount", val)}
                      onEditClick={() => toggleEdit("childCount")}
                    />
                  </div>
                </div>
              </section>
              {allFieldsTrue && (
                <div className="flex gap-5 mt-5 w-full items-center justify-center ">
                  <button
                    className="w-28 p-3 rounded-2xl bg-[#F48567] text-white text-lg"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="w-28 p-3 rounded-2xl bg-[#C7C7C7] text-white text-lg"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </section>
          </div>
        )}
      </section>
    </>
  );
};

export default Profilecreads;
