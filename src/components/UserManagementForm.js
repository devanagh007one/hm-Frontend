import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllLicensing } from "../redux/actions/allLicensingGet.js";
import { fetchAllUsers, createUser } from "../redux/actions/alluserGet";
import { showNotification } from "../redux/actions/notificationActions"; // Import showNotification
import "./popup.css"; // Import custom CSS
import { Button, Select } from "antd";

const ParentComponent = () => {
    const [showPopup, setShowPopup] = useState(false);
    const { licensing, error: licensingError } = useSelector((state) => state.licensing);
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
        numberOfLicenses: "10",
        address: "",
        mobile: "",
        roles: "",
        country: "",
        interests: "",
        goals: "",
    });

    const dispatch = useDispatch();
// console.log(formData)
    useEffect(() => {
        dispatch(fetchAllLicensing());
        dispatch(fetchAllUsers());
    }, [dispatch]);

    const handleLicenseChange = (licenseId) => {
        const selected = licensing.find((license) => license.id === licenseId);
        setSelectedLicense(selected);

        if (selected) {
            const { numberOfLicenses } = selected;
            const userCount = users.filter(
                (user) => user.company === formData.company
            ).length;

            if (userCount >= numberOfLicenses) {
                setIsSaveDisabled(true);
                dispatch(
                    showNotification(
                        `The selected license allows only ${numberOfLicenses} users. Please upgrade your license.`,
                        "error"
                    )
                );
            } else {
                setIsSaveDisabled(false);
            }
        }
    };

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

        dispatch(createUser(formData))
            .then(() => {
                dispatch(showNotification("User created successfully", "success"));
                sessionStorage.setItem("fetchData", "fatchdata");
                setShowPopup(false);
            })
            .catch((error) => {
                console.error(error);
            });
    };

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




    const handleCompanyChange = (value) => {
        const associatedLicense = licensing.find(
            (license) => license.organisationName === value
        );

        if (associatedLicense) {
            const { numberOfLicence } = associatedLicense;
            const userCount = users.filter((user) => user.company === value).length;

            setUserCount(userCount); // Update the user count
            setTotalLicenses(numberOfLicence); // Update the total licenses

            if (userCount >= numberOfLicence) {
                setIsSaveDisabled(true);
                dispatch(
                    showNotification(
                        `Maximum number of users (${numberOfLicence}) reached for this organisation.`,
                        "error"
                    )
                );
            } else {
                setIsSaveDisabled(false);
            }
        } else {
            setUserCount(0);
            setTotalLicenses(0);
            setIsSaveDisabled(false);
        }

        setFormData((prevData) => ({
            ...prevData,
            company: value,
        }));
    };




    return (
        <>
            <Button
                className=" trigger text-[#F48567] border-none bg-transparent hover:bg-[#F4856720] hover:text-[#F48567] p-2 rounded"
                icon={
                    <svg width="46" height="47" viewBox="0 0 46 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_b_3004_2013)">
                            <rect x="0.1" y="0.6" width="45.8" height="45.8" rx="11.9" stroke="#F48567" stroke-width="0.2" />
                            <g clip-path="url(#clip0_3004_2013)">
                                <path d="M18 21.95H17.275C16.2856 21.9143 15.2995 22.0822 14.3777 22.4435C13.456 22.8047 12.6183 23.3516 11.9167 24.05L11.7167 24.2834V31.1834H15.1167V27.2667L15.575 26.75L15.7833 26.5084C16.8683 25.3938 18.219 24.5736 19.7083 24.125C18.9629 23.5574 18.3749 22.8087 18 21.95Z" fill="#F48567" />
                                <path d="M34.1167 24.0249C33.4151 23.3264 32.5774 22.7796 31.6556 22.4183C30.7339 22.0571 29.7477 21.8891 28.7583 21.9249C28.4549 21.9265 28.1518 21.9432 27.85 21.9749C27.4681 22.7805 26.8962 23.4811 26.1833 24.0165C27.7735 24.456 29.2139 25.3203 30.35 26.5165L30.5583 26.7499L31.0084 27.2665V31.1915H34.2917V24.2582L34.1167 24.0249Z" fill="#F48567" />
                                <path d="M17.25 20.3251H17.5083C17.3883 19.2945 17.5692 18.2511 18.029 17.321C18.4889 16.3909 19.2082 15.6137 20.1 15.0834C19.7767 14.5895 19.3307 14.1881 18.8057 13.9184C18.2806 13.6487 17.6945 13.5199 17.1048 13.5448C16.515 13.5696 15.9419 13.7472 15.4414 14.0601C14.9409 14.3731 14.5302 14.8106 14.2496 15.33C13.9691 15.8493 13.8282 16.4326 13.8407 17.0227C13.8533 17.6128 14.0189 18.1896 14.3214 18.6965C14.6239 19.2034 15.0528 19.6231 15.5661 19.9144C16.0795 20.2057 16.6597 20.3587 17.25 20.3584V20.3251Z" fill="#F48567" />
                                <path d="M28.3584 19.7C28.3678 19.8916 28.3678 20.0835 28.3584 20.275C28.5183 20.3007 28.6798 20.3146 28.8417 20.3167H29.0001C29.5877 20.2854 30.1573 20.1024 30.6533 19.7856C31.1492 19.4688 31.5547 19.029 31.8303 18.509C32.1058 17.989 32.242 17.4064 32.2256 16.8182C32.2092 16.2299 32.0407 15.6559 31.7366 15.152C31.4325 14.6482 31.0031 14.2316 30.4902 13.943C29.9774 13.6543 29.3985 13.5034 28.81 13.5049C28.2215 13.5064 27.6434 13.6602 27.132 13.9514C26.6206 14.2427 26.1933 14.6613 25.8917 15.1667C26.646 15.6592 27.2662 16.3311 27.6967 17.1224C28.1272 17.9136 28.3546 18.7993 28.3584 19.7Z" fill="#F48567" />
                                <path d="M22.8916 23.4334C24.9489 23.4334 26.6166 21.7657 26.6166 19.7084C26.6166 17.6511 24.9489 15.9834 22.8916 15.9834C20.8344 15.9834 19.1666 17.6511 19.1666 19.7084C19.1666 21.7657 20.8344 23.4334 22.8916 23.4334Z" fill="#F48567" />
                                <path d="M23.0917 25.4166C22.0035 25.3732 20.9177 25.5501 19.8995 25.9367C18.8813 26.3234 17.9518 26.9118 17.1667 27.6666L16.9584 27.9V33.175C16.9616 33.3468 16.9987 33.5163 17.0675 33.6738C17.1362 33.8313 17.2354 33.9737 17.3592 34.0929C17.483 34.212 17.6291 34.3057 17.7891 34.3684C17.9491 34.4311 18.1199 34.4616 18.2917 34.4583H27.8667C28.0385 34.4616 28.2093 34.4311 28.3693 34.3684C28.5293 34.3057 28.6754 34.212 28.7992 34.0929C28.923 33.9737 29.0222 33.8313 29.0909 33.6738C29.1597 33.5163 29.1968 33.3468 29.2 33.175V27.9166L29 27.6666C28.2203 26.9091 27.2941 26.3188 26.2781 25.9319C25.2621 25.545 24.1778 25.3696 23.0917 25.4166Z" fill="#F48567" />
                                <g clip-path="url(#clip1_3004_2013)">
                                    <rect x="27" y="28" width="8" height="8" rx="4" fill="white" />
                                    <path d="M33.3199 29.68C34.5999 30.964 34.5999 33.036 33.3199 34.32C32.7042 34.9345 31.8699 35.2797 30.9999 35.2797C30.13 35.2797 29.2956 34.9345 28.6799 34.32C28.0654 33.7043 27.7202 32.8699 27.7202 32C27.7202 31.13 28.0654 30.2957 28.6799 29.68C29.9639 28.4 32.0359 28.4 33.3199 29.68ZM31.5999 34.2V32.6H33.1999V31.4H31.5999V29.8H30.3999V31.4H28.7999V32.6H30.3999V34.2H31.5999Z" fill="#F48567" />
                                </g>
                            </g>
                        </g>
                        <defs>
                            <filter id="filter0_b_3004_2013" x="-4" y="-3.5" width="54" height="54" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feGaussianBlur in="BackgroundImageFix" stdDeviation="2" />
                                <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_3004_2013" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_3004_2013" result="shape" />
                            </filter>
                            <clipPath id="clip0_3004_2013">
                                <rect width="30" height="30" fill="white" transform="translate(8 8.5)" />
                            </clipPath>
                            <clipPath id="clip1_3004_2013">
                                <rect x="27" y="28" width="8" height="8" rx="4" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                }
                onClick={handleViewPopup}

            />

            {/* Popup */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="p-8 bg-[rgb(30,30,30)] rounded-lg w-[500px] h-[800px] overflow-y-auto">
                        <div className="flex justify-between align-center">
                            <h2 className="text-2xl mb-6 text-white">Create User Profile</h2>
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
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            {/* First Name & Last Name */}
                            <div className="flex gap-4">
                                <div className="flex flex-col w-1/2">
                                    <label className="text-white mb-1">Name *</label>
                                    <input
                                        name="full name"
                                        onChange={handleFullNameChange}
                                        required
                                        type="text"
                                        placeholder="Name"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>
                                <div className="flex flex-col w-1/2">
                                    <label className="text-white mb-1">User Name</label>
                                    <input
                                        name="userName"
                                        onChange={handleChange}
                                        required
                                        type="text"
                                        placeholder="User Name"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>
                            </div>
                            {/* Choose Role */}
                            <div className="flex flex-col">
                                <label className="text-white mb-1">Organisation</label>
                                <select
                                    name="roles"
                                    value={formData.roles}
                                    onChange={handleChange}
                                    className="p-2 bg-[#333333] text-white rounded"
                                >
                                    <option >Select</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Super Admin">Super Admin</option>
                                    <option value="HR">HR</option>
                                    <option value="Partner">Partner</option>
                                    <option value="End User">End User</option>
                                </select>
                            </div>
                            {/* Email Address */}
                            <div className="flex flex-col">
                                <label className="text-white mb-1">Email ID*</label>
                                <input
                                    name="email"
                                    onChange={handleChange}
                                    required
                                    type="email"
                                    placeholder="Enter Email"
                                    className="p-2 bg-[#333333] text-white rounded"
                                />
                            </div>

                            {/* Phone */}
                            <div className="flex flex-col">
                                <label className="text-white mb-1">Phone Number </label>
                                <input
                                    name="mobile"
                                    onChange={handleChange}
                                    required
                                    type="text"
                                    placeholder="Enter Phone Number"
                                    className="p-2 bg-[#333333] text-white rounded"
                                />
                            </div>

                            {/* Location */}
                            <div className="flex flex-col">
                                <label className="text-white mb-1">Location </label>
                                <input
                                    name="address"
                                    onChange={handleChange}
                                    required
                                    type="text"
                                    placeholder="Enter Location"
                                    className="p-2 bg-[#333333] text-white rounded"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-white mb-1">Department</label>
                                <input
                                    name="department"
                                    onChange={handleChange}
                                    required
                                    type="text"
                                    placeholder="Department"
                                    className="p-2 bg-[#333333] text-white rounded"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col w-1/2">
                                    <label className="text-white mb-1">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="p-2 bg-[#333333] text-white rounded"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="female">Female</option>
                                        <option value="male">Male</option>
                                    </select>
                                </div>{/* DOB */}
                                <div className="flex flex-col w-1/2">
                                    <label className="text-white mb-1">DOB</label>
                                    <input
                                        name="doB"
                                        value={formData.doB}
                                        onChange={handleChange}
                                        type="date"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col w-1/2">
                                    <label className="text-white mb-1">Country</label>
                                    <input
                                        name="country"
                                        onChange={handleChange}
                                        placeholder="Relationship status"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>
                                <div className="flex flex-col w-1/2">
                                    <label className="text-white mb-1">Password</label>
                                    <input
                                        name="password"
                                        onChange={handleChange}
                                        required
                                        type="text"
                                        placeholder="Password"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col w-1/2">
                                    <label className="text-white mb-1">Company</label>

                                    <Select
                                        showSearch
                                        placeholder="Company"
                                        options={licensing?.map((item) => ({
                                            label: item.organisationName,
                                            value: item.organisationName,
                                        }))}
                                        onChange={handleCompanyChange}
                                    />
                                </div>
                                <div className="flex flex-col w-1/2">
                                    <label className="text-white mb-1">Licenses</label>
                                    <input
                                        name="numberOfLicences"
                                        type="text"
                                        value={totalLicenses ? `${userCount} / ${totalLicenses}` : ""}
                                        disabled
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>

                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col w-1/2">
                                    <label className="text-white mb-1">Employee Count</label>
                                    <input
                                        name="employeeCount"
                                        onChange={handleChange}
                                        required
                                        type="number"
                                        placeholder="Employee Count"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>
                                <div className="flex flex-col w-1/2">
                                    <label className="text-white mb-1">Profile Picture</label>
                                    <label className="p-2 pl-4 pr-4 bg-[#333333] text-white rounded flex items-center justify-between cursor-pointer">
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




                            <div className="flex gap-4 mt-4 w-full">
                                {!isSaveDisabled && (
                                    <div className="flex flex-col w-full">
                                        <button
                                            type="submit"
                                            className="bg-[#F48567] px-4 py-2 rounded-xl text-[#000]"
                                        >
                                            Save
                                        </button>
                                    </div>
                                )}


                                <div className="flex flex-col w-full">
                                    {/* Save Button */}
                                    <button

                                        onClick={handleClosePopup}
                                        className="bg-[#C7C7C7] px-4 py-2 rounded-xl text-[#000]"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </ >
    );
};

export default ParentComponent;
