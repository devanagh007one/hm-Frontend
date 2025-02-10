import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, createUser } from "../redux/actions/alluserGet";
import { showNotification } from "../redux/actions/notificationActions"; // Import showNotification
import "./popup.css"; // Import custom CSS
import { Button } from "antd";

const ParentComponent = () => {
    const [showPopup, setShowPopup] = useState(false);
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
        numberOfLicences: "",
        address: "",
        mobile: "",
        roles: "",
        country: "",
        interests: "",
        goals: "",
    });

    const dispatch = useDispatch();

    useEffect(() => {
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
        dispatch(createUser(formData))
            .then(() => {
                // Dispatch notification after successful user creation
                dispatch(showNotification("User created successfully", 'success'));
                // Close the popup
                setShowPopup(false);
            })
            .catch((error) => {
                // Handle errors if any
                console.error(error);
            });
    };

    const handleFullNameChange = (event) => {
        const fullName = event.target.value.trim(); // Remove leading/trailing spaces
        const [firstName = "", ...lastNameParts] = fullName.split(" "); // Split into parts
        const lastName = lastNameParts.join(" "); // Combine remaining parts into lastName
        setFormData({ firstName, lastName });
    };

    const handleViewPopup = () => setShowPopup(true);
    const handleClosePopup = () => setShowPopup(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFileName(file ? file.name : "Upload");
    };

    return (
        <>
            <Button
                className=" trigger text-[#F48567] border-none bg-transparent hover:bg-[#F4856720] hover:text-[#F48567] p-2 rounded"
                icon={
                    <svg
                    width="44"
                    height="45"
                    viewBox="0 0 44 45"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g filter="url(#filter0_b_3001_982)">
                      <rect
                        x="0.1"
                        y="0.6"
                        width="43.8"
                        height="43.8"
                        rx="11.9"
                        stroke="#F48567"
                        strokeWidth="0.2"
                      />
                      <path
                        d="M19.6666 10.8333H24.3333C24.9521 10.8333 25.5456 11.0792 25.9832 11.5168C26.4208 11.9543 26.6666 12.5478 26.6666 13.1667V15.5H31.3333C31.9521 15.5 32.5456 15.7458 32.9832 16.1834C33.4208 16.621 33.6666 17.2145 33.6666 17.8333V24.285C32.9926 23.6667 32.1982 23.1941 31.3333 22.8967V17.8333H12.6666V30.6667H22.0933C22.2333 31.5067 22.5249 32.2883 22.9333 33H12.6666C12.0477 33 11.4543 32.7542 11.0167 32.3166C10.5791 31.879 10.3333 31.2855 10.3333 30.6667V17.8333C10.3333 17.2145 10.5791 16.621 11.0167 16.1834C11.4543 15.7458 12.0477 15.5 12.6666 15.5H17.3333V13.1667C17.3333 12.5478 17.5791 11.9543 18.0167 11.5168C18.4543 11.0792 19.0477 10.8333 19.6666 10.8333ZM24.3333 15.5V13.1667H19.6666V15.5H24.3333ZM24.3333 28.3333H27.8333V24.8333H30.1666V28.3333H33.6666V30.6667H30.1666V34.1667H27.8333V30.6667H24.3333V28.3333Z"
                        fill="#F48567"
                      />
                    </g>
                    <defs>
                      <filter
                        id="filter0_b_3001_982"
                        x="-4"
                        y="-3.5"
                        width="52"
                        height="52"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                      >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feGaussianBlur in="BackgroundImageFix" stdDeviation="2" />
                        <feComposite
                          in2="SourceAlpha"
                          operator="in"
                          result="effect1_backgroundBlur_3001_982"
                        />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="effect1_backgroundBlur_3001_982"
                          result="shape"
                        />
                      </filter>
                    </defs>
                  </svg>
                }
                onClick={handleViewPopup}

            />

            {/* Popup */}
            {showPopup && (
                <div className="popup-overlay ">
                    <div className="p-8 bg-[rgb(30,30,30)] rounded-lg overflow-y-auto overflow-hidden shadow-lg w-[520px] h-[800px] ove">
                    <div className="flex justify-between align-center">
                            <h2 className="text-2xl mb-4 text-white">Create Company Profile</h2>
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
                        <form className="grid grid-cols-2 gap-6 h-[97%] mt-3 pb-6" onSubmit={handleSubmit}>
                            {/* Organization Name */}
                            <div className="col-span-2">
                                <label className="block text-gray-300 mb-2">Organization Name</label>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    name="organizationName"
                                    value={formData.organizationName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-[#333333] text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            {/* Industry */}
                            <div>
                                <label className="block text-gray-300 mb-2">Industry</label>
                                <input
                                    type="text"
                                    placeholder="Industry"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-[#333333] text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            {/* Organization Size */}
                            <div>
                                <label className="block text-gray-300 mb-2">Organization Size</label>
                                <input
                                    type="text"
                                    name="organizationSize"
                                    placeholder="Organization Size"
                                    value={formData.organizationSize}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-[#333333] text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            {/* Contact Person Name */}
                            <div>
                                <label className="block text-gray-300 mb-2">Contact Person Name</label>
                                <input
                                    type="text"
                                    name="contactPerson"
                                    placeholder="Contact Person Name"
                                    value={formData.contactPerson}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-[#333333] text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            {/* Email Address */}
                            <div>
                                <label className="block text-gray-300 mb-2">Contact Email Address</label>
                                <input
                                    type="text"
                                    name="contactEmail"
                                    placeholder="Contact Email Address"
                                    value={formData.contactEmail}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-[#333333] text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            {/*Address 1*/}
                            <div>
                                <label className="block text-gray-300 mb-2">Address 1</label>
                                <input
                                    type="text"
                                    name="address1"
                                    placeholder="Address 1"
                                    value={formData.address1}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-[#333333] text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            {/*Address 2*/}
                            <div>
                                <label className="block text-gray-300 mb-2">Address 2</label>
                                <input
                                    type="text"
                                    name="address2"
                                    placeholder="Address 2"
                                    value={formData.address2}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-[#333333] text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            {/*State*/}
                            <div>
                                <label className="block text-gray-300 mb-2">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="State"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-[#333333] text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            {/*City*/}
                            <div>
                                <label className="block text-gray-300 mb-2">City</label>
                                <input
                                    type="text"
                                    name="City"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-[#333333] text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            {/* Phone Number */}
                            <div>
                                <label className="block text-gray-300 mb-2">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-[#333333] text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            {/* Pin Code */}
                            <div>
                                <label className="block text-gray-300 mb-2">Pin Code</label>
                                <input
                                    type="text"
                                    name="pinCode"
                                    placeholder="Pin Code"
                                    value={formData.pinCode}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-[#333333] text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            {/*Demo Licenses*/}
                            <div>
                                <label className="block text-gray-300 mb-2">Demo Licenses</label>
                                <input
                                    type="text"
                                    name="demoLicenses"
                                    placeholder="1-10"
                                    value={formData.demoLicenses}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-[#333333] text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            {/*Upload Logo*/}
                            <div>
                                <label className="block text-gray-300 mb-2">Upload Logo</label>
                                <input
                                    type="text"
                                    name="uploadLogo"
                                    placeholder="Upload"
                                    value={formData.uploadLogo}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-[#333333] text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            {/*No Of Licenses*/}
                            <div>
                                <label className="block text-gray-300 mb-2">No of Licenses</label>
                                <input
                                    type="text"
                                    name="numberLicences"
                                    placeholder="Enter No. of Licenses"
                                    value={formData.numberLicenses}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-[#333333] text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            {/* Comments */}
                            <div className="col-span-2">
                                <label className="block text-gray-300 mb-2">Comments or Special Requests</label>
                                <textarea
                                    name="comments"
                                    placeholder="Comments or Special Requests"
                                    value={formData.comments}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-[#333333] text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    rows="3"
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <div className="col-span-2 flex justify-center ">
                                <button
                                    type="submit"
                                    className="px-6 py-2 pr-32 pl-32 bg-[#F48567] text-white rounded-lg transition"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </ >
    );
};

export default ParentComponent;
