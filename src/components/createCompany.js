import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { licencingUser } from "../redux/actions/allLicensingGet";
import { showNotification } from "../redux/actions/notificationActions";
import "./popup.css";
import { Button, Spin, Switch } from "antd";



const statesAndCities = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore"],
    "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat"],
    "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Durg", "Bilaspur"],
    "Delhi": ["New Delhi"],
    "Goa": ["Panaji", "Vasco da Gama", "Margao"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
    "Haryana": ["Chandigarh", "Faridabad", "Gurgaon", "Panipat"],
    "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
    "Karnataka": ["Bengaluru", "Mysore", "Hubli", "Mangalore"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
    "Manipur": ["Imphal", "Thoubal", "Bishnupur"],
    "Meghalaya": ["Shillong", "Tura", "Nongstoin"],
    "Mizoram": ["Aizawl", "Lunglei", "Champhai"],
    "Nagaland": ["Kohima", "Dimapur", "Mokokchung"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
    "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur", "Kota"],
    "Sikkim": ["Gangtok", "Namchi", "Gyalshing"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad"],
    "Tripura": ["Agartala", "Udaipur", "Dharmanagar"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Nainital"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol"]
};

const ParentComponent = () => {
    const darkMode = useSelector((state) => state.theme.darkMode);
    const [showPopup, setShowPopup] = useState(false);
    const [fileName, setFileName] = useState("Upload");
    const [formData, setFormData] = useState({
        organisationName: "",
        industryType: "",
        organizationSize: "",
        contactPersonName: "",
        contactPersonEmail: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        pinCode: "",
        phoneNumber: "",
        demoLicence: "",
        numberOfLicence: "",
        period: "Trial",
        comment: "",
        active: true,
        logo: null,
    });

    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value,
        }));
    };

    const handleToggleActive = () => {
        setFormData((prevData) => ({
            ...prevData,
            active: !prevData.active,
        }));
    };

    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Validate required fields
        const requiredFields = [
            "organisationName",
            "industryType",
            "organizationSize",
            "contactPersonName",
            "contactPersonEmail",
            "address1",
            "city",
            "state",
            "pinCode",
            "phoneNumber",
        ];

        const emptyFields = requiredFields.filter((field) => !formData[field]);

        if (emptyFields.length > 0) {
            dispatch(showNotification(`Please fill all required fields: ${emptyFields.join(", ")}`, "error"));
            setLoading(false);
            return;
        }

        dispatch(licencingUser(formData))
            .then(() => {
                dispatch(showNotification("Licenses created successfully", "success"));
                setShowPopup(false);
                setLoading(false);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    };


    const handleViewPopup = () => setShowPopup(true);
    const handleClosePopup = () => setShowPopup(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFileName(file ? file.name : "Upload");
        setFormData((prevData) => ({ ...prevData, logo: file }));
    };
    const handleStateChange = (e) => {
        const selectedState = e.target.value;
        setFormData({ ...formData, state: selectedState, city: "" });
    };

    const handleCityChange = (e) => {
        setFormData({ ...formData, city: e.target.value });
    };




    return (
        <>
            <Button
                className="trigger text-[#F48567] border-none bg-transparent hover:bg-[#F4856720] hover:text-[#F48567] p-2 rounded"
                onClick={handleViewPopup}

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
            />

            {showPopup && (
                <div className="popup-overlay">
                    <div className={`p-8 rounded-lg overflow-y-auto overflow-hidden shadow-lg w-[520px] h-[800px] max-h-[90%] ${darkMode ? 'bg-[#222222] text-white' : 'bg-[#fff] text-dark'}`}>
                        <div className="flex justify-between align-center">
                            <h2 className="text-2xl mb-4">Create Company Profile</h2>
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
                        <form className="grid grid-cols-2 gap-6 w-full h-[97%] mt-3 pb-6" onSubmit={handleSubmit}>

                            <div className="col-span-2">
                                <label className="block  mb-2">Organization Name</label>
                                <input
                                    type="text"
                                    name="organisationName"
                                    value={formData.organisationName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Name"
                                    className="w-full px-4 py-2  rounded-lg border border-gray-600 focus:outline-none"
                                />
                            </div>
                            <div className="flex col-span-2 gap-5">
                                <div className=" w-1/2">
                                    <label className="block mb-2">Industry</label>
                                    <input
                                        type="text"
                                        name="industryType"
                                        value={formData.industryType}
                                        onChange={handleChange}
                                        required
                                        placeholder="Industry"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-600 focus:outline-none "
                                    />
                                </div>

                                <div className="w-1/2">
                                    <label className="block  mb-2">Organization Size</label>
                                    <input
                                        type="text"
                                        name="organizationSize"
                                        value={formData.organizationSize}
                                        onChange={handleChange}
                                        required
                                        placeholder="Organization Size"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-600 focus:outline-none "
                                    />
                                </div>
                            </div>

                            <div className="flex col-span-2 gap-5">
                                <div className=" w-1/2">
                                    <label className="block  mb-2">Contact Person Name</label>
                                    <input
                                        type="text"
                                        name="contactPersonName"
                                        value={formData.contactPersonName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Contact Person Name"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-600 focus:outline-none "
                                    />
                                </div>

                                <div className=" w-1/2">
                                    <label className="block  mb-2">Contact Email Address</label>
                                    <input
                                        type="email"
                                        name="contactPersonEmail"
                                        value={formData.contactPersonEmail}
                                        onChange={handleChange}
                                        required
                                        placeholder="Contact Email Address"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-600 focus:outline-none "
                                    />
                                </div>
                            </div>

                            <div className="flex col-span-2 gap-5">
                                <div className=" w-1/2">
                                    <label className="block  mb-2">Address 1</label>
                                    <input
                                        type="text"
                                        name="address1"
                                        value={formData.address1}
                                        required
                                        onChange={handleChange}
                                        placeholder="Address 1"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-600 focus:outline-none "
                                    />
                                </div>

                                <div className=" w-1/2">
                                    <label className="block  mb-2">Address 2</label>
                                    <input
                                        type="text"
                                        name="address2"
                                        value={formData.address2}
                                        onChange={handleChange}
                                        placeholder="Address 2"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-600 focus:outline-none "
                                    />
                                </div>
                            </div>
                            <div className="flex col-span-2 gap-5">
                                {/* State Dropdown */}
                                <div className="w-1/2">
                                    <label className="block  mb-2">State</label>
                                    <select
                                        name="state"
                                        value={formData.state}
                                        onChange={handleStateChange}
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-600 focus:outline-none"
                                    >
                                        <option value="">Select State</option>
                                        {Object.keys(statesAndCities).map((state) => (
                                            <option key={state} value={state}>
                                                {state}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* City Dropdown */}
                                <div className="w-1/2">
                                    <label className="block  mb-2">City</label>
                                    <select
                                        name="city"
                                        value={formData.city}
                                        onChange={handleCityChange}
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-600 focus:outline-none"
                                        disabled={!formData.state}
                                    >
                                        <option value="">Select City</option>
                                        {formData.state &&
                                            statesAndCities[formData.state].map((city) => (
                                                <option key={city} value={city}>
                                                    {city}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex col-span-2 gap-5">
                                <div className=" w-1/2">
                                    <label className="block  mb-2">Phone Number</label>
                                    <input
                                        type="number"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        required
                                        onChange={handleChange}
                                        placeholder="Phone Number"
                                        className="w-full px-4 py-2  rounded-lg border border-gray-600 focus:outline-none "
                                    />
                                </div>
                                <div className=" w-1/2">
                                    <label className="block  mb-2">Pin Code</label>
                                    <input
                                        type="number"
                                        name="pinCode"
                                        required
                                        value={formData.pinCode}
                                        onChange={handleChange}
                                        placeholder="Pin Code"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-600 focus:outline-none "
                                    />
                                </div>
                            </div>

                            <div className="flex col-span-2 gap-5">
                                <div className="w-1/2">
                                    <label className="block  mb-2">Demo License</label>
                                    <select
                                        name="demoLicence"
                                        value={formData.demoLicence}
                                        required
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-600 focus:outline-none"
                                    >
                                        <option value="">Select Range</option>
                                        {Array.from({ length: 7 }, (_, i) => {
                                            const start = i * 10 + 1;
                                            const end = start + 9;
                                            return (
                                                <option key={i} value={`${start}-${end}`}>
                                                    {start}-{end}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>


                                <div className="flex col-span-2 flex-col w-1/2">
                                    <label className=" mb-1">Uploard Image</label>
                                    <label className="p-2 pl-4 pr-4  rounded flex items-center justify-between cursor-pointer">
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


                            <div className="flex col-span-2 gap-5">
                                <div className=" w-1/2">
                                    <label className="block  mb-2">Number of Licenses</label>
                                    <input
                                        type="number"
                                        name="numberOfLicence"
                                        value={formData.numberOfLicence}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-600 focus:outline-none "
                                    />


                                </div>

                                <div className="w-1/2 flex flex-col items-center ">
                                    <label className="block  mb-2">Trial/Paid</label>
                                    <Switch
                                        onChange={(checked) => handleChange({ target: { name: "period", value: checked ? "Subscription" : "Trial" } })}
                                        checkedChildren="P"
                                        unCheckedChildren="S"
                                        className="custom-switch"
                                    />
                                </div>

                            </div>



                            <div className="col-span-2">
                                <label className="block  mb-2">Comments or Special Requests</label>
                                <textarea
                                    name="comment"
                                    value={formData.comment}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Comments or Special Requests"
                                    className="w-full px-4 py-2  rounded-lg border border-gray-600 focus:outline-none "
                                ></textarea>
                            </div>

                            <div className="flex col-span-2 gap-4 mt-4 pb-9 w-full">
                                <div className="flex flex-col w-full">
                                    <button
                                        type="submit"
                                        onClick={handleSubmit}
                                        className="bg-[#F48567] px-4 py-2 rounded-xl text-[#000] flex justify-center items-center"
                                        disabled={loading}
                                    >
                                        {loading ? <Spin /> : "Save"}
                                    </button>
                                </div>

                                <div className="flex flex-col w-full">
                                    <button
                                        onClick={handleClosePopup}
                                        className="bg-[#C7C7C7] px-4 py-2 rounded-xl text-[#000]"
                                        disabled={loading}
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

export default ParentComponent;



