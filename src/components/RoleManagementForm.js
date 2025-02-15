import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllLicensing } from "../redux/actions/allLicensingGet.js";
import { fetchAllUsers, createUser } from "../redux/actions/alluserGet.js";
import { showNotification } from "../redux/actions/notificationActions.js"; // Import showNotification
import "./popup.css"; // Import custom CSS
import { Button, Select, Checkbox, Radio } from "antd";

const ParentComponent = () => {
    const [showPopup, setShowPopup] = useState(false);
    const { licensing, error: licensingError } = useSelector((state) => state.licensing);
    const { users, error } = useSelector((state) => state.user);
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
        dateOfAniversary: "",
        relationShipStatus: "",
        bloodGroups: "",
        childCount: "",
        permissions: {},
        title_at_organization: "",
        social_twitter: "",
        social_youtube: "",
        social_insta: "",
        type_of_contantSpecilization: "",
        brief_bio: "",
        contact_method: "",
    });
    console.log(formData)

    const handleCheckboxChange = (checkedValues) => {
        // If at least one checkbox is selected, ensure all permissions are initialized
        let updatedPermissions = {};
        if (checkedValues.length > 0) {
            updatedPermissions = {
                Create: false,
                Update: false,
                View: false,
                Delete: false,
                ...Object.fromEntries(checkedValues.map((key) => [key, true])),
            };
        }

        setFormData((prev) => ({
            ...prev,
            permissions: updatedPermissions,
        }));
    };


    const dispatch = useDispatch();
    console.log(formData)
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

        dispatch(createUser(formData))
            .then(() => {
                dispatch(showNotification("User created successfully", "success"));
                sessionStorage.setItem("fetchData", "fatchdata");
                // setShowPopup(false);
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
        // Ensure the restriction applies only when the role is "HR"
        if (formData.roles !== "HR") {
            setFormData((prevData) => ({
                ...prevData,
                company: value,
                numberOfLicenses: 1, // Default for non-HR roles
            }));
            return;
        }
    
        const associatedLicense = licensing.find(
            (license) => license.organisationName === value
        );
    
        if (associatedLicense) {
            const { numberOfLicence } = associatedLicense;
            const userCount = users.filter((user) => user.company === value).length;
            const nextUserCount = userCount + 1; // Incremental value
    
            setUserCount(userCount);
            setTotalLicenses(numberOfLicence);
    
            if (userCount >= numberOfLicence) {
                setIsSaveDisabled(true);
                dispatch(
                    showNotification(
                        `Max users (${numberOfLicence}) reached, but Partner, Admin, and Super Admin can still be added.`,
                        "error"
                    )
                );
            } else {
                setIsSaveDisabled(false);
            }
    
            setFormData((prevData) => ({
                ...prevData,
                company: value,
                numberOfLicenses: nextUserCount, // Store the incremented user count
            }));
        } else {
            setUserCount(0);
            setTotalLicenses(0);
            setIsSaveDisabled(false);
    
            setFormData((prevData) => ({
                ...prevData,
                company: value,
                numberOfLicenses: 1, // Start from 1 if no existing users
            }));
        }
    };
    

    const handleChangeSocial = (e) => {
        const inputText = e.target.value;
        const links = inputText.split(",").map((link) => link.trim()); // Split by comma and trim spaces

        let updatedSocials = {
            social_twitter: "",
            social_youtube: "",
            social_insta: "",
        };

        links.forEach((link) => {
            if (link.includes("twitter.com") || link.includes("x.com")) {
                updatedSocials.social_twitter = link;
            } else if (link.includes("youtube.com") || link.includes("youtu.be")) {
                updatedSocials.social_youtube = link;
            } else if (link.includes("instagram.com")) {
                updatedSocials.social_insta = link;
            }
        });

        setFormData((prev) => ({
            ...prev,
            ...updatedSocials,
        }));
    };

    return (
        <>
            <Button
                className=" trigger text-[#F48567] border-none bg-transparent hover:bg-[#F4856720] hover:text-[#F48567] p-2 rounded"
                icon={
                    <svg width="46" height="47" viewBox="0 0 46 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_b_3004_846)">
                            <rect x="0.1" y="0.6" width="45.8" height="45.8" rx="11.9" stroke="#F48567" stroke-width="0.2" />
                            <path d="M19.9839 28.6513C20.5443 28.9443 21.0496 29.3039 21.4997 29.73C21.9497 30.1561 22.3319 30.6311 22.6461 31.1549C22.9603 31.6787 23.2065 32.2469 23.3849 32.8594C23.5632 33.472 23.6524 34.1023 23.6524 34.7504H22.0219C22.0219 34.0491 21.8946 33.3877 21.6398 32.7662C21.385 32.1448 21.0369 31.6032 20.5953 31.1416C20.1537 30.6799 19.6315 30.3115 19.0286 30.0363C18.4256 29.7611 17.793 29.6279 17.1306 29.6368C16.4513 29.6368 15.8186 29.77 15.2327 30.0363C14.6468 30.3026 14.1288 30.6666 13.6787 31.1283C13.2286 31.5899 12.8762 32.1359 12.6215 32.7662C12.3667 33.3966 12.2393 34.058 12.2393 34.7504H10.6089C10.6089 34.1023 10.6938 33.472 10.8636 32.8594C11.0335 32.2469 11.2797 31.6787 11.6024 31.1549C11.9251 30.6311 12.3115 30.1561 12.7616 29.73C13.2116 29.3039 13.7169 28.9443 14.2774 28.6513C13.6405 28.1719 13.1437 27.5727 12.787 26.8536C12.4304 26.1345 12.2478 25.3577 12.2393 24.5231C12.2393 23.8218 12.3667 23.1604 12.6215 22.539C12.8762 21.9175 13.2244 21.376 13.666 20.9143C14.1075 20.4527 14.6255 20.0842 15.22 19.809C15.8144 19.5338 16.4513 19.4006 17.1306 19.4095C17.9289 19.4095 18.6719 19.5959 19.3597 19.9688C20.0476 20.3417 20.6208 20.8655 21.0793 21.5402C21.402 20.8655 21.8181 20.2618 22.3276 19.7291C22.8371 19.1964 23.4146 18.7614 24.06 18.4241C23.4231 17.9447 22.9263 17.3454 22.5697 16.6263C22.213 15.9072 22.0304 15.1304 22.0219 14.2959C22.0219 13.5945 22.1493 12.9331 22.4041 12.3117C22.6588 11.6902 23.007 11.1487 23.4486 10.687C23.8901 10.2254 24.4081 9.85696 25.0026 9.58174C25.597 9.30653 26.2339 9.17336 26.9132 9.18224C27.5841 9.18224 28.2167 9.31541 28.8112 9.58174C29.4056 9.84808 29.9236 10.2121 30.3652 10.6737C30.8067 11.1354 31.1592 11.6814 31.4224 12.3117C31.6857 12.942 31.813 13.6034 31.8045 14.2959C31.8045 15.1304 31.6262 15.9072 31.2696 16.6263C30.9129 17.3454 30.4119 17.9447 29.7665 18.4241C30.327 18.717 30.8322 19.0766 31.2823 19.5027C31.7324 19.9289 32.1145 20.4038 32.4287 20.9276C32.7429 21.4514 32.9892 22.0196 33.1675 22.6322C33.3458 23.2447 33.435 23.8751 33.435 24.5231H31.8045C31.8045 23.8218 31.6772 23.1604 31.4224 22.539C31.1676 21.9175 30.8195 21.376 30.3779 20.9143C29.9363 20.4527 29.4141 20.0842 28.8112 19.809C28.2082 19.5338 27.5756 19.4006 26.9132 19.4095C26.2339 19.4095 25.6012 19.5427 25.0153 19.809C24.4294 20.0754 23.9114 20.4393 23.4613 20.901C23.0112 21.3626 22.6588 21.9086 22.4041 22.539C22.1493 23.1693 22.0219 23.8307 22.0219 24.5231C22.0219 25.3577 21.8436 26.1345 21.4869 26.8536C21.1303 27.5727 20.6293 28.1719 19.9839 28.6513ZM23.6524 14.2959C23.6524 14.7664 23.7373 15.2059 23.9071 15.6142C24.077 16.0226 24.3105 16.3866 24.6077 16.7062C24.9049 17.0258 25.2488 17.27 25.6395 17.4386C26.0301 17.6073 26.4547 17.6961 26.9132 17.705C27.3633 17.705 27.7836 17.6162 28.1743 17.4386C28.5649 17.2611 28.9131 17.0169 29.2188 16.7062C29.5245 16.3955 29.758 16.0359 29.9193 15.6276C30.0807 15.2192 30.1656 14.7753 30.1741 14.2959C30.1741 13.8254 30.0892 13.3859 29.9193 12.9775C29.7495 12.5691 29.516 12.2051 29.2188 11.8855C28.9216 11.5659 28.5776 11.3218 28.187 11.1531C27.7964 10.9844 27.3718 10.8957 26.9132 10.8868C26.4632 10.8868 26.0428 10.9756 25.6522 11.1531C25.2616 11.3307 24.9134 11.5748 24.6077 11.8855C24.302 12.1963 24.0685 12.5558 23.9071 12.9642C23.7458 13.3726 23.6609 13.8165 23.6524 14.2959ZM13.8698 24.5231C13.8698 24.9937 13.9547 25.4331 14.1245 25.8415C14.2943 26.2499 14.5279 26.6139 14.8251 26.9335C15.1223 27.2531 15.4662 27.4972 15.8568 27.6659C16.2475 27.8346 16.6721 27.9234 17.1306 27.9322C17.5807 27.9322 18.001 27.8435 18.3917 27.6659C18.7823 27.4883 19.1305 27.2442 19.4362 26.9335C19.7419 26.6228 19.9754 26.2632 20.1367 25.8548C20.2981 25.4464 20.383 25.0026 20.3915 24.5231C20.3915 24.0526 20.3066 23.6132 20.1367 23.2048C19.9669 22.7964 19.7334 22.4324 19.4362 22.1128C19.1389 21.7932 18.795 21.5491 18.4044 21.3804C18.0138 21.2117 17.5892 21.1229 17.1306 21.1141C16.6806 21.1141 16.2602 21.2028 15.8696 21.3804C15.479 21.558 15.1308 21.8021 14.8251 22.1128C14.5194 22.4235 14.2859 22.7831 14.1245 23.1915C13.9632 23.5999 13.8782 24.0437 13.8698 24.5231Z" fill="#F48567" />
                            <path d="M33.9566 27.0455C36.0436 29.2341 36.0436 32.7659 33.9566 34.9545C32.9528 36.0021 31.5924 36.5904 30.174 36.5904C28.7557 36.5904 27.3953 36.0021 26.3914 34.9545C25.3894 33.9051 24.8267 32.4828 24.8267 31C24.8267 29.5172 25.3894 28.0949 26.3914 27.0455C28.4849 24.8636 31.8632 24.8636 33.9566 27.0455ZM31.1523 34.75V32.0227H33.761V29.9773H31.1523V27.25H29.1958V29.9773H26.5871V32.0227H29.1958V34.75H31.1523Z" fill="#F48567" />
                        </g>
                        <defs>
                            <filter id="filter0_b_3004_846" x="-4" y="-3.5" width="54" height="54" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feGaussianBlur in="BackgroundImageFix" stdDeviation="2" />
                                <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_3004_846" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_3004_846" result="shape" />
                            </filter>
                        </defs>
                    </svg>


                }
                onClick={handleViewPopup}

            />

            {/* Popup */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="p-8 bg-[rgb(30,30,30)] rounded-lg w-[500px] max-h-[800px] overflow-y-auto">
                        <div className="flex justify-between align-center">
                            <h2 className="text-2xl mb-6 text-white">Add New Role</h2>
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


                        {/* Choose Role */}
                        <div className="flex flex-col">
                            <label className="text-white mb-1">Choose Role *</label>
                            <select
                                name="roles"
                                value={formData.roles}
                                onChange={handleChange}
                                className="p-2 bg-[#333333] text-white rounded"
                            >
                                <option value="">Choose Role</option>
                                <option value="HR">HR</option>
                                <option value="Partner">Partner</option>
                                <option value="Admin">Admin</option>
                                <option value="Super Admin">Super Admin</option>
                            </select>
                        </div>

                        {formData.roles === "HR" && (
                            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                                <div className="flex flex-col mt-3">
                                    <label className="text-white mb-1">Organization Name</label>
                                    <Select
                                        showSearch
                                        placeholder="Choose Organization"
                                        options={licensing?.map((item) => ({
                                            label: item.organisationName,
                                            value: item.organisationName,
                                        }))}
                                        onChange={handleCompanyChange}
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex flex-col w-1/2">
                                        <label className="text-white mb-1">Contact Person Name</label>
                                        <input
                                            name="full name"
                                            onChange={handleFullNameChange}
                                            required
                                            type="text"
                                            placeholder="Contact Person Name"
                                            className="p-2 bg-[#333333] text-white rounded"
                                        />
                                    </div>
                                    <div className="flex flex-col w-1/2">
                                        <label className="text-white mb-1">Contact Email Address</label>
                                        <input
                                            name="email"
                                            onChange={handleChange}
                                            required
                                            type="email"
                                            placeholder="Contact Email Address"
                                            className="p-2 bg-[#333333] text-white rounded"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex flex-col">
                                    <label className="text-white mb-1">Phone Number</label>
                                    <input
                                        name="mobile"
                                        onChange={handleChange}
                                        required
                                        type="number"
                                        placeholder="Phone Number"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>

                                {/* Location */}
                                <div className="flex flex-col">
                                    <label className="text-white mb-1">Location</label>
                                    <input
                                        name="address"
                                        onChange={handleChange}
                                        required
                                        type="text"
                                        placeholder="Location"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-white mb-1">Upload your Profile Picture</label>
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

                                </div>
                            </form>
                        )}

                        {formData.roles === "Partner" && (
                            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                <div className="flex gap-4 mt-3">
                                    <div className="flex flex-col w-1/2">
                                        <label className="text-white mb-1">Partner Name</label>
                                        <input
                                            name="full name"
                                            onChange={handleFullNameChange}
                                            required
                                            type="text"
                                            placeholder="Partner Name"
                                            className="p-2 bg-[#333333] text-white rounded"
                                        />
                                    </div>
                                    <div className="flex flex-col w-1/2">
                                        <label className="text-white mb-1">Organization Name</label>
                                        <Select
                                            showSearch
                                            placeholder="Choose Organization"
                                            options={licensing?.map((item) => ({
                                                label: item.organisationName,
                                                value: item.organisationName,
                                            }))}
                                            onChange={handleCompanyChange}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-white mb-1">Email Address</label>
                                    <input
                                        name="email"
                                        onChange={handleChange}
                                        required
                                        type="email"
                                        placeholder="Email"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>

                                {/* Phone */}
                                <div className="flex flex-col">
                                    <label className="text-white mb-1">Phone</label>
                                    <input
                                        name="mobile"
                                        onChange={handleChange}
                                        required
                                        type="text"
                                        placeholder="Phone"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>

                                {/* Location */}
                                <div className="flex flex-col">
                                    <label className="text-white mb-1">Location</label>
                                    <input
                                        name="address"
                                        onChange={handleChange}
                                        required
                                        type="text"
                                        placeholder="Location"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-white mb-1">Role/ Title at Organization</label>
                                    <input
                                        name="title_at_organization"
                                        onChange={handleChange}
                                        required
                                        type="text"
                                        placeholder="Organization"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-white mb-1">Social Media Profile</label>
                                    <input
                                        name="socialMedia"
                                        onChange={handleChangeSocial}
                                        required
                                        type="text"
                                        placeholder="Enter Social Media Links (comma-separated)"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-white mb-1">Type of Content Specialization</label>
                                    <input
                                        name="type_of_contantSpecilization"
                                        onChange={handleChange}
                                        required
                                        type="text"
                                        placeholder="Content Specialization"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-white mb-1">Brief Bio</label>
                                    <textarea
                                        name="brief_bio"
                                        onChange={handleChange}
                                        required
                                        type="text"
                                        placeholder="Bio"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>

                                <div className="flex flex-row items-center">
                                    <label className="text-white mb-1 mr-2">Preferred Contact Method:</label>
                                    <Radio.Group
                                        options={['Call', 'Email']}
                                        className="p-2 flex justify-start gap-5 text-white rounded"
                                        required
                                        value={formData.contact_method}
                                        onChange={(e) => setFormData({ ...formData, contact_method: e.target.value })}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-white mb-1">Upload your Profile Picture</label>
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


                                <div className="flex gap-4 mt-4 w-full">
                                        <div className="flex flex-col w-full">
                                            <button
                                                type="submit"
                                                className="bg-[#F48567] px-4 py-2 rounded-xl text-[#000]"
                                            >
                                                Save
                                            </button>
                                        </div>
                                </div>
                            </form>
                        )}

                        {formData.roles === "Admin" && (
                            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                                <div className="flex flex-col mt-3">
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


                                <div className="flex flex-col">
                                    <label className="text-white mb-1">Organization Name</label>
                                    <Select
                                        showSearch
                                        placeholder="Choose Organization"
                                        options={licensing?.map((item) => ({
                                            label: item.organisationName,
                                            value: item.organisationName,
                                        }))}
                                        onChange={handleCompanyChange}
                                    />
                                </div>


                                {/* Email Address */}
                                <div className="flex flex-col">
                                    <label className="text-white mb-1">Email Address</label>
                                    <input
                                        name="email"
                                        onChange={handleChange}
                                        required
                                        type="email"
                                        placeholder="Email"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>

                                {/* Phone */}
                                <div className="flex flex-col">
                                    <label className="text-white mb-1">Phone</label>
                                    <input
                                        name="mobile"
                                        onChange={handleChange}
                                        required
                                        type="text"
                                        placeholder="Phone"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>

                                {/* Location */}
                                <div className="flex flex-col">
                                    <label className="text-white mb-1">Location</label>
                                    <input
                                        name="address"
                                        onChange={handleChange}
                                        required
                                        type="text"
                                        placeholder="Location"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>

                                <div className="flex flex-row items-center">
                                    <label className="text-white mb-1">Function</label>
                                    <Checkbox.Group
                                        options={['Create', 'Update', 'View', 'Delete']}
                                        className="p-2 flex selectext justify-between rounded w-full"
                                        value={Object.keys(formData.permissions).filter((key) => formData.permissions[key])}
                                        onChange={handleCheckboxChange}
                                    />
                                </div>


                                <div className="flex flex-col">
                                    <label className="text-white mb-1">Upload your Profile Picture</label>
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



                                <div className="flex gap-4 mt-4 w-full">
                                        <div className="flex flex-col w-full">
                                            <button
                                                type="submit"
                                                className="bg-[#F48567] px-4 py-2 rounded-xl text-[#000]"
                                            >
                                                Save
                                            </button>
                                        </div>

                                </div>
                            </form>
                        )}

                        {formData.roles === "Super Admin" && (
                            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                                <div className="flex flex-col mt-3">
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


                                <div className="flex flex-col">
                                    <label className="text-white mb-1">Organization Name</label>
                                    <Select
                                        showSearch
                                        placeholder="Choose Organization"
                                        options={licensing?.map((item) => ({
                                            label: item.organisationName,
                                            value: item.organisationName,
                                        }))}
                                        onChange={handleCompanyChange}
                                    />
                                </div>


                                {/* Email Address */}
                                <div className="flex flex-col">
                                    <label className="text-white mb-1">Email Address</label>
                                    <input
                                        name="email"
                                        onChange={handleChange}
                                        required
                                        type="email"
                                        placeholder="Email"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>

                                {/* Phone */}
                                <div className="flex flex-col">
                                    <label className="text-white mb-1">Phone</label>
                                    <input
                                        name="mobile"
                                        onChange={handleChange}
                                        required
                                        type="text"
                                        placeholder="Phone"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>

                                {/* Location */}
                                <div className="flex flex-col">
                                    <label className="text-white mb-1">Location</label>
                                    <input
                                        name="address"
                                        onChange={handleChange}
                                        required
                                        type="text"
                                        placeholder="Location"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-white mb-1">Upload your Profile Picture</label>
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



                                <div className="flex gap-4 mt-4 w-full">
                                    <div className="flex flex-col w-full">
                                        <button
                                            type="submit"
                                            className="bg-[#F48567] px-4 py-2 rounded-xl text-[#000]"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </form>

                        )}
                    </div>
                </div>
            )}
        </ >
    );
};

export default ParentComponent;
