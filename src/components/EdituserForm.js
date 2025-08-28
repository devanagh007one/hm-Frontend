import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllLicensing } from "../redux/actions/allLicensingGet.js";
import {
  fetchAllUsers,
  createUser,
  editUserProfile,
} from "../redux/actions/alluserGet.js";
import { showNotification } from "../redux/actions/notificationActions.js";
import "./popup.css"; // Import custom CSS
import { Button, Select } from "antd";

const EditUser = ({ record }) => {
  const [showPopup, setShowPopup] = useState(false);
  const darkMode = useSelector((state) => state.theme.darkMode);

  const { licensing, error: licensingError } = useSelector(
    (state) => state.licensing
  );
  const { users, error } = useSelector((state) => state.user);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [totalLicenses, setTotalLicenses] = useState(false);
  const [userCount, setUserCount] = useState(false);
  const [role, setRole] = useState("Admin");
  const [fileName, setFileName] = useState("Upload");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    doB: "",
    userName: "",
    company: "",
    department: "",
    email: "",
    password: "",
    image: null,
    employeeCount: "",
    numberOfLicenses: "",
    address: "",
    mobile: "",
    roles: "",
    country: "",
    interests: "",
    goals: "",
    joinedAt: "",
    relationShipStatus: "",
    bloodGroups: "",
    childCount: "",
  });

  useEffect(() => {
    if (record) {
      setFormData({
        firstName: record.firstName || "",
        lastName: record.lastName || "",
        gender: record.gender || "",
        doB: record.doB || "",
        userName: record.userName || "",
        company: record.company || "",
        department: record.department || "",
        email: record.email || "",
        password: record.password || "",
        image: record.image || null,
        employeeCount: record.employeeCount || "",
        numberOfLicenses: record.numberOfLicenses || "",
        address: record.address || "",
        mobile: record.mobile || "",
        roles: record.roles || "",
        country: record.country || "",
        interests: record.interests || "",
        goals: record.goals || "",
        joinedAt: record.joinedAt || "",
        relationShipStatus: record.relationShipStatus
          ? record.relationShipStatus.charAt(0).toUpperCase() +
            record.relationShipStatus.slice(1).toLowerCase()
          : "",
        bloodGroups: record.bloodGroups || "",
        childCount: record.childCount || "",
      });
    }
    console.log("Record data:", record);
    // Add this inside your component to debug
    console.log("Relationship status value:", formData.relationShipStatus);
  }, [record]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllLicensing());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSaveDisabled) return;

    // Create FormData instance with different variable name
    const submitFormData = new FormData();

    // Use the state formData variable, not the FormData instance
    submitFormData.append("firstName", formData.firstName);
    submitFormData.append("lastName", formData.lastName);
    submitFormData.append("gender", formData.gender);
    submitFormData.append("doB", formData.doB);
    submitFormData.append("userName", formData.userName);
    submitFormData.append("department", formData.department);
    submitFormData.append("email", formData.email);
    submitFormData.append("password", formData.password);
    submitFormData.append("employeeCount", formData.employeeCount);
    submitFormData.append("address", formData.address);
    submitFormData.append("mobile", formData.mobile);
    submitFormData.append("roles", formData.roles);
    submitFormData.append("country", formData.country);
    submitFormData.append("interests", formData.interests);
    submitFormData.append("goals", formData.goals);
    submitFormData.append("joinedAt", formData.joinedAt);
    submitFormData.append("relationShipStatus", formData.relationShipStatus);
    submitFormData.append("bloodGroups", formData.bloodGroups);
    submitFormData.append("childCount", formData.childCount);

    // Don't forget to append the company field and image file
    submitFormData.append("company", formData.company);
    if (formData.image && formData.image instanceof File) {
      submitFormData.append("image", formData.image);
    }

    // Dispatch the edit action with the correct FormData
    dispatch(editUserProfile(record._id, submitFormData))
      .then(() => {
        dispatch(
          showNotification("User profile updated successfully", "success")
        );
        setShowPopup(false);
      })
      .catch((error) => {
        console.error("Error updating user profile:", error);
        dispatch(showNotification("Failed to update user profile", "error"));
      });
  };

  const storedCompanyName = localStorage.getItem("companyName") || "HappMe";

  const handleFullNameChange = (event) => {
    const fullName = event.target.value.trim();
    const [firstName = "", ...lastNameParts] = fullName.split(" ");
    const lastName = lastNameParts.join(" ");
    setFormData((prevData) => ({ ...prevData, firstName, lastName }));
  };

  const handleViewPopup = () => setShowPopup(true);
  const handleClosePopup = () => setShowPopup(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file ? file.name : "Upload");
    setFormData((prevData) => ({ ...prevData, image: file }));
  };

  const formatDate = (date) => {
    if (!date) return "";

    // Handle ISO date strings (like "2025-08-15T00:00:00.000Z")
    if (typeof date === "string" && date.includes("T")) {
      return date.split("T")[0];
    }

    // Handle MM/DD/YYYY format (like "12/08/2025")
    if (date.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    // Handle YYYY-MM-DD format
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return date;
    }

    return "";
  };

  return (
    <>
      <div onClick={handleViewPopup}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.16"
            d="M4.16634 13.3333L3.33301 16.6667L6.66634 15.8333L14.9997 7.5L12.4997 5L4.16634 13.3333Z"
            fill="#C7C7C7"
          />
          <path
            d="M12.4997 5.00007L14.9997 7.50007M10.833 16.6667H17.4997M4.16634 13.3334L3.33301 16.6667L6.66634 15.8334L16.3213 6.17841C16.6338 5.86586 16.8093 5.44201 16.8093 5.00007C16.8093 4.55813 16.6338 4.13429 16.3213 3.82174L16.178 3.67841C15.8655 3.36596 15.4416 3.19043 14.9997 3.19043C14.5577 3.19043 14.1339 3.36596 13.8213 3.67841L4.16634 13.3334Z"
            stroke="#C7C7C7"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div
            className={`rounded-xl border border-gray-600 focus:outline-none-xl border border-gray-600 focus:outline-none-3xl shadow-lg w-] max-w-[70%] overflow-y-scroll pl-10 pr-10 p-8 relative flex flex-col max-h-[95%] ${
              darkMode
                ? "bg-[#222222] text-white text-[16px]"
                : "bg-[#fff] text-dark text-[16px]"
            }`}
          >
            <div className="flex justify-between align-center">
              <h2 className="text-2xl mb-6">Edit User</h2>
              <svg
                className="cursor-pointer mt-1"
                onClick={handleClosePopup}
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_3261_1019)">
                  <path
                    d="M3.516 20.985C2.36988 19.878 1.45569 18.5539 0.826781 17.0898C0.197873 15.6258 -0.133162 14.0511 -0.147008 12.4578C-0.160854 10.8644 0.142767 9.28428 0.746137 7.80953C1.34951 6.33477 2.24055 4.99495 3.36726 3.86823C4.49397 2.74152 5.83379 1.85048 7.30855 1.24711C8.78331 0.643743 10.3635 0.340123 11.9568 0.353969C13.5502 0.367815 15.1248 0.698849 16.5889 1.32776C18.0529 1.95667 19.377 2.87085 20.484 4.01697C22.6699 6.2802 23.8794 9.31143 23.8521 12.4578C23.8247 15.6042 22.5627 18.6139 20.3378 20.8388C18.1129 23.0637 15.1032 24.3257 11.9568 24.3531C8.81045 24.3804 5.77922 23.1709 3.516 20.985ZM5.208 19.293C7.00935 21.0943 9.4525 22.1063 12 22.1063C14.5475 22.1063 16.9906 21.0943 18.792 19.293C20.5933 17.4916 21.6053 15.0485 21.6053 12.501C21.6053 9.95348 20.5933 7.51032 18.792 5.70897C16.9906 3.90762 14.5475 2.89564 12 2.89564C9.4525 2.89564 7.00935 3.90762 5.208 5.70897C3.40665 7.51032 2.39466 9.95348 2.39466 12.501C2.39466 15.0485 3.40665 17.4916 5.208 19.293ZM17.088 9.10497L13.692 12.501L17.088 15.897L15.396 17.589L12 14.193L8.604 17.589L6.912 15.897L10.308 12.501L6.912 9.10497L8.604 7.41297L12 10.809L15.396 7.41297L17.088 9.10497Z"
                    fill="#C7C7C7"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_3261_1019">
                    <rect
                      width="24"
                      height="24"
                      fill="white"
                      transform="translate(0 0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>

            {/* Choose Role */}
            <div className="flex flex-col">
              <label className="text-white mb-1">Organisation</label>
              <input
                name="company"
                value={formData.company}
                disabled
                className="p-2 rounded-xl border border-gray-600 bg-gray-100"
              />
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* First Name & Last Name */}
              <div className="flex gap-4 mt-3">
                <div className="flex flex-col w-1/2">
                  <label className="text-white mb-1">Name *</label>
                  <input
                    name="full name"
                    value={`${formData.firstName} ${formData.lastName}`}
                    onChange={handleFullNameChange}
                    type="text"
                    placeholder="Name"
                    className="p-2  rounded-xl border border-gray-600 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col w-1/2">
                  <label className="text-white mb-1">User Name</label>
                  <input
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    type="text"
                    placeholder="User Name"
                    className="p-2  rounded-xl border border-gray-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="flex flex-col">
                <label className="text-white mb-1">Email ID*</label>
                <input
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  type="email"
                  placeholder="Enter Email"
                  className="p-2  rounded-xl border border-gray-600 focus:outline-none"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col">
                <label className="text-white mb-1">Phone Number </label>
                <input
                  name="mobile"
                  onChange={handleChange}
                  value={formData.mobile}
                  type="text"
                  placeholder="Enter Phone Number"
                  className="p-2  rounded-xl border border-gray-600 focus:outline-none"
                />
              </div>

              {/* Location */}
              <div className="flex flex-col">
                <label className="text-white mb-1">Location </label>
                <input
                  name="address"
                  onChange={handleChange}
                  value={formData.address}
                  type="text"
                  placeholder="Enter Location"
                  className="p-2  rounded-xl border border-gray-600 focus:outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-white mb-1">Department</label>
                <input
                  name="department"
                  onChange={handleChange}
                  value={formData.department}
                  type="text"
                  placeholder="Department"
                  className="p-2  rounded-xl border border-gray-600 focus:outline-none"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col w-1/2">
                  <label className="text-white mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="p-2  rounded-xl border border-gray-600 focus:outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>
                {/* DOB */}
                <div className="flex flex-col w-1/2">
                  <label className="text-white mb-1">DOB</label>
                  <input
                    name="doB"
                    value={formData.doB ? formatDate(formData.doB) : ""}
                    onChange={handleChange}
                    type="date"
                    className="p-2  rounded-xl border border-gray-600 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col w-full">
                  <label className="text-white mb-1">Country</label>
                  <input
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className="p-2  rounded-xl border border-gray-600 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col w-1/2">
                  <label className="text-white mb-1">Interests</label>
                  <input
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    placeholder="Interests"
                    className="p-2  rounded-xl border border-gray-600 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col w-1/2">
                  <label className="text-white mb-1">Goals</label>
                  <input
                    name="goals"
                    onChange={handleChange}
                    value={formData.goals}
                    type="text"
                    placeholder="goals"
                    className="p-2  rounded-xl border border-gray-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col w-full">
                  <label className="text-white mb-1">Profile Picture</label>
                  <label className="p-3 pl-4 pr-4  rounded-xl border border-gray-600 focus:outline-none flex items-center justify-between cursor-pointer">
                    <div>{fileName}</div>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.8501 9.59998V3.48748L3.9001 5.43748L2.8501 4.34998L6.6001 0.599976L10.3501 4.34998L9.3001 5.43748L7.3501 3.48748V9.59998H5.8501ZM2.1001 12.6C1.6876 12.6 1.3346 12.4532 1.0411 12.1597C0.747598 11.8662 0.600598 11.513 0.600098 11.1V8.84998H2.1001V11.1H11.1001V8.84998H12.6001V11.1C12.6001 11.5125 12.4533 11.8657 12.1598 12.1597C11.8663 12.4537 11.5131 12.6005 11.1001 12.6H2.1001Z"
                        fill="#C7C7C7"
                      />
                    </svg>
                    <input
                      name="image"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col w-1/2">
                  <label className="text-white mb-1">Relationship Status</label>
                  <select
                    name="relationShipStatus"
                    value={formData.relationShipStatus || ""}
                    onChange={handleChange}
                    className="p-2  rounded-xl border border-gray-600 focus:outline-none"
                  >
                    <option value="">Select Relationship</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Engaged">Engaged</option>
                    <option value="Complicated">Complicated</option>
                  </select>
                </div>
                <div className="flex flex-col w-1/2">
                  <label className="text-white mb-1">Date of Joining</label>
                  <input
                    name="joinedAt"
                    value={
                      formData.joinedAt ? formatDate(formData.joinedAt) : ""
                    }
                    onChange={handleChange}
                    type="date"
                    className="p-2  rounded-xl border border-gray-600 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col w-1/2">
                  <label className="text-white mb-1">Blood Group</label>
                  <select
                    name="bloodGroups"
                    value={formData.bloodGroups}
                    onChange={handleChange}
                    className="p-2  rounded-xl border border-gray-600 focus:outline-none"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div className="flex flex-col w-1/2">
                  <label className="text-white mb-1">Child Count</label>
                  <input
                    type="text"
                    name="childCount"
                    value={formData.childCount}
                    onChange={handleChange}
                    placeholder="Enter Child Count"
                    className="p-2 rounded-xl border border-gray-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-4 w-full">
                {!isSaveDisabled && (
                  <div className="flex flex-col w-full">
                    <button
                      type="submit"
                      className="bg-[#F48567] px-4 py-2 rounded-xl border border-gray-600 focus:outline-none-xl text-[#000]"
                    >
                      Save
                    </button>
                  </div>
                )}

                <div className="flex flex-col w-full">
                  {/* Save Button */}
                  <button
                    onClick={handleClosePopup}
                    className="bg-[#C7C7C7] px-4 py-2 rounded-xl border border-gray-600 focus:outline-none-xl text-[#000]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditUser;
