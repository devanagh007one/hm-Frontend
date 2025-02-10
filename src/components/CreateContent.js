import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import "./popup.css"; // Import custom CSS
import "./popup2.css"; // Import custom CSS
import { useSelector, useDispatch } from "react-redux";
import { createContent, createchallenge } from "../redux/actions/allContentGet";
import { fetchAllContent } from "../redux/actions/allContentGet.js";
import { showNotification } from "../redux/actions/notificationActions"; // Import showNotification

const ParentComponent = () => {
    const dispatch = useDispatch();
    const { content: fetchedContents } = useSelector((state) => state.content);

    const [showPopup, setShowPopup] = useState(false);
    const [isSectionVisible, setIsSectionVisible] = useState(true);
    const [isSection2Visible, setIsSection2Visible] = useState(false);
    const [isSection3Visible, setIsSection3Visible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpenModule, setIsOpenModule] = useState(false);
    const [fileProfile, setFileProfile] = useState("Upload Cover Photo");
    const [selectedContent, setSelectedContent] = useState(null);
    const [isChallengeSelected, setIsChallengeSelected] = useState(false);
    const [time, settime] = useState({
        duration: 0, // Initialize with 0 or any default value you prefer
    });

    // Fetch contents on component mount
    useEffect(() => {
        dispatch(fetchAllContent());
    }, [dispatch]);

    const generateUniqueId = () => {
        return Math.floor(1000000 + Math.random() * 9000000).toString();
    };



    const initialFormData = {
        uniqueUploadId: generateUniqueId(),
        tracks: "",
        moduleName: "",
        moduleType: "Module",
        fileSize: "",
        isApproved: "pending",
        description: "",
        cover_Photo: "",
        videoFile_introduction: "",
        videoFile_description: null,
        content: ""
    };
    const initialChallangeData = {
        uniChallengeId: generateUniqueId(),
        challengeName: "",
        module: '',
        challenge_Description: "",
        duration: time.duration,
        isApproved: "pending",
        difficulty_Level: "",
        video_or_image: ""
    };



    const [formData, setFormData] = useState(initialFormData);
    const [challengeData, setChallengeData] = useState(initialChallangeData);
    console.log(formData);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const toggleDropdown2 = () => setIsOpen2(!isOpen2);
    const toggleModule = () => setIsOpenModule(!isOpenModule);

    const handleSelectTracks = (option) => {
        setFormData(prevData => ({
            ...prevData,
            tracks: option,  // Store the selected option in the tracks field
        }));
        setIsOpen(false); // Close dropdown after selection
    };

    const tracks = [
        "Valrrues", "Dance", "Fitnfes", "Mindfulness", "Music", "Art", "Cooking", "Yoga"
    ];

    const handleNext = () => {
        setIsSectionVisible(false);
        setIsSection2Visible(true);
    };

    const handleMoreNext = () => {
        setIsSectionVisible(false);
        setIsSection2Visible(false);
        setIsSection3Visible(true);
    };

    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];

        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: file, // Dynamically update the specific field with the selected file
        }));
    };
    const handleVideoChange = (e, fieldName) => {
        const file = e.target.files[0];

        setChallengeData((prevData) => ({
            ...prevData,
            [fieldName]: file, // Dynamically update the specific field with the selected file
        }));
    };


    const [loading2, setLoading2] = useState(false);

    const handleSave = async () => {
        setLoading2(true); // Start loading

        const payload = { formData };

        try {
            const response = await dispatch(createContent(payload));

            if (response?._id) {
                dispatch(showNotification("Content created successfully.", "success"));

                // Update challenge data with the new content ID directly
                setChallengeData((prevState) => ({
                    ...prevState,
                    module: response._id, // Directly set the module field
                }));

                handleMoreNext();
            }
        } catch (error) {
            dispatch(showNotification("An error occurred. Please try again.", "error"));
        } finally {
            setLoading2(false); // Stop loading
        }
    };


    const [loading, setLoading] = useState(false);

    const handleSaveChall = async () => {
        if (!challengeData.challengeName || !challengeData.challenge_Description || !challengeData.difficulty_Level) {
            dispatch(showNotification("Please fill all required fields.", "error"));
            return;
        }
    
        setLoading(true); // Start loading
    
        try {
            const response = await dispatch(createchallenge(challengeData));
    
            if (response && response.success) {
                dispatch(showNotification("Challenge created successfully.", "success"));
                handleClosePopup();
                window.location.reload(); // Reload the page after closing the popup
            } else {
                dispatch(showNotification("Failed to create challenge. Please try again.", "error"));
            }
        } catch (error) {
            dispatch(showNotification("An error occurred. Please try again.", "error"));
        } finally {
            setLoading(false); // Stop loading
        }
    };
    




    const handleViewPopup = () => setShowPopup(true);
    const handleClosePopup = () => {
        setShowPopup(false);
        setFormData(initialFormData);
        setChallengeData(initialChallangeData);
        settime({ duration: 0 }); // Reset time state
        setIsSectionVisible(true);
        setIsSection2Visible(false);
        setIsSection3Visible(false);
        setIsOpen(false);
        setIsOpen2(false);
        setIsOpenModule(false);
        setFileProfile("Upload Cover Photo");
        setSelectedContent(null);
        setIsChallengeSelected(false);
    };

    const adjustTime = (change) => {
        settime((prevData) => {
            const newDuration = prevData.duration + change;
            setChallengeData((prevChallengeData) => ({
                ...prevChallengeData,
                duration: newDuration, // Update the duration in challengeData
            }));
            return { duration: newDuration }; // Adjust the duration in the time state
        });
    };

    const handleDurationChange = (e) => {
        const minutes = parseInt(e.target.value.replace(' min', ''), 10) || 0; // Convert input value to integer
        settime({ duration: minutes }); // Set the new duration in time state
        setChallengeData((prevChallengeData) => ({
            ...prevChallengeData,
            duration: minutes, // Update the duration in challengeData
        }));
    };


    return (
        <>
            <div onClick={handleViewPopup}
            >
                <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_b_4249_1934)">
                        <rect x="0.1" y="0.1" width="45.8" height="45.8" rx="11.9" stroke="#F48567" stroke-width="0.2" />
                        <path d="M21.75 28V17.8125L18.5 21.0625L16.75 19.25L23 13L29.25 19.25L27.5 21.0625L24.25 17.8125V28H21.75ZM15.5 33C14.8125 33 14.2242 32.7554 13.735 32.2663C13.2458 31.7771 13.0008 31.1883 13 30.5V26.75H15.5V30.5H30.5V26.75H33V30.5C33 31.1875 32.7554 31.7763 32.2663 32.2663C31.7771 32.7563 31.1883 33.0008 30.5 33H15.5Z" fill="#F48567" />
                    </g>
                    <defs>
                        <filter id="filter0_b_4249_1934" x="-4" y="-4" width="54" height="54" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                            <feGaussianBlur in="BackgroundImageFix" stdDeviation="2" />
                            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_4249_1934" />
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_4249_1934" result="shape" />
                        </filter>
                    </defs>
                </svg>
            </div>



            {/* Popup */}
            {showPopup && (
                <div className="popup-overlay" onClick={handleClosePopup}>
                    <div
                        className="popup-container p-8 bg-[rgb(30,30,30)] rounded-lg w-[500px] h-[auto] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()} // Prevent closing popup on click inside
                    >
                        <div className="flex justify-between items-center">
                            {isSectionVisible && (
                                <h2 className="text-2xl mb-6 text-white">Upload Content</h2>
                            )}
                            {isSection2Visible && (
                                <h2 className="text-2xl mb-6 text-white">Track: Values</h2>
                            )}
                            {isSection3Visible && (
                                <h2 className="text-2xl mb-6 text-white">Track: Challenge</h2>
                            )}
                            <svg
                                className="cursor-pointer mt-1"
                                onClick={handleClosePopup}
                                width="24"
                                height="25"
                                viewBox="0 0 24 25"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g clipPath="url(#clip0_3261_1019)">
                                    <path
                                        d="M3.516 20.985C2.36988 19.878 1.45569 18.5539 0.826781 17.0898C0.197873 15.6258 -0.133162 14.0511 -0.147008 12.4578C-0.160854 10.8644 0.142767 9.28428 0.746137 7.80953C1.34951 6.33477 2.24055 4.99495 3.36726 3.86823C4.49397 2.74152 5.83379 1.85048 7.30855 1.24711C8.78331 0.643743 10.3635 0.340123 11.9568 0.353969C13.5502 0.367815 15.1248 0.698849 16.5889 1.32776C18.0529 1.95667 19.377 2.87085 20.484 4.01697C22.6699 6.2802 23.8794 9.31143 23.8521 12.4578C23.8247 15.6042 22.5627 18.6139 20.3378 20.8388C18.1129 23.0637 15.1032 24.3257 11.9568 24.3531C8.81045 24.3804 5.77922 23.1709 3.516 20.985ZM5.208 19.293C7.00935 21.0943 9.4525 22.1063 12 22.1063C14.5475 22.1063 16.9906 21.0943 18.792 19.293C20.5933 17.4916 21.6053 15.0485 21.6053 12.501C21.6053 9.95348 20.5933 7.51032 18.792 5.70897C16.9906 3.90762 14.5475 2.89564 12 2.89564C9.4525 2.89564 7.00935 3.90762 5.208 5.70897C3.40665 7.51032 2.39466 9.95348 2.39466 12.501C2.39466 15.0485 3.40665 17.4916 5.208 19.293ZM17.088 9.10497L13.692 12.501L17.088 15.897L15.396 17.589L12 14.193L8.604 17.589L6.912 15.897L10.308 12.501L6.912 9.10497L8.604 7.41297L12 10.809L15.396 7.41297L17.088 9.10497Z"
                                        fill="#C7C7C7"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_3261_1019">
                                        <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>


                        <div>
                            {/* First Section */}
                            {isSectionVisible && (
                                <div>
                                    {!isChallengeSelected && (
                                        <div className="flex gap-4">
                                            <div className="flex flex-col w-full">
                                                <label className="text-white mb-1">Choose a Track *</label>
                                                <div className="dropdown-container mb-3">
                                                    <div
                                                        className="dropdown-btn flex p-2 bg-[#333333] text-white rounded mb-2 cursor-pointer"
                                                        onClick={toggleDropdown}
                                                    >
                                                        <span>{formData.tracks || "Choose a Track"}</span>
                                                        <span>
                                                            <svg
                                                                width="12"
                                                                height="7"
                                                                viewBox="0 0 12 7"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    clipRule="evenodd"
                                                                    d="M6.59245 6.46417L11.3066 1.75L10.1283 0.571671L6.00328 4.69667L1.87828 0.571671L0.699951 1.75L5.41412 6.46417C5.57039 6.6204 5.78231 6.70816 6.00328 6.70816C6.22425 6.70816 6.43618 6.6204 6.59245 6.46417Z"
                                                                    fill="#C7C7C7"
                                                                />
                                                            </svg>
                                                        </span>
                                                    </div>

                                                    {/* Custom Dropdown Menu */}
                                                    {isOpen && (
                                                        <div className="dropdown-menu flex flex-col items-center w-full bg-gray-800 p-2 rounded mb-3">
                                                            {tracks.map((track, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="dropdown-item flex items-start w-[95%] p-2 text-white hover:bg-gray-700 cursor-pointer"
                                                                    onClick={() => handleSelectTracks(track)}
                                                                >
                                                                    {track}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex flex-col w-full">
                                        <button
                                            type="submit"
                                            className={`px-4 py-2 rounded-xl ${formData.tracks ? "bg-[#F48567] text-black cursor-pointer" : "bg-gray-400 text-gray-700 cursor-not-allowed"
                                                }`}
                                            onClick={handleNext}
                                            disabled={!formData.tracks}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}


                            <div>

                                {isSection2Visible && (
                                    <section>
                                        <div className="flex flex-col">
                                            <label className="text-white mb-1">Title</label>
                                            <input
                                                name="moduleName"
                                                required
                                                type="text"
                                                placeholder="Title"
                                                className="p-2 bg-[#333333] text-white rounded"
                                                value={formData.moduleName}
                                                onChange={(e) => setFormData({ ...formData, moduleName: e.target.value })}
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="text-white mb-1">Description</label>
                                            <textarea
                                                name="description"
                                                required
                                                type="text"
                                                placeholder="Enter Description"
                                                className="p-2 bg-[#333333] text-white rounded"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            />
                                        </div>

                                        <div className="flex flex-col w-full">
                                            <label className="text-white mb-1">Upload Cover Photo (Optional)</label>
                                            <label className="p-2 pl-4 pr-4 bg-[#333333] text-white rounded flex items-center justify-between cursor-pointer">
                                                <div>{formData.cover_Photo?.name || "Upload Cover Photo"}</div>
                                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M5.8501 9.59998V3.48748L3.9001 5.43748L2.8501 4.34998L6.6001 0.599976L10.3501 4.34998L9.3001 5.43748L7.3501 3.48748V9.59998H5.8501ZM2.1001 12.6C1.6876 12.6 1.3346 12.4532 1.0411 12.1597C0.747598 11.8662 0.600598 11.513 0.600098 11.1V8.84998H2.1001V11.1H11.1001V8.84998H12.6001V11.1C12.6001 11.5125 12.4533 11.8657 12.1598 12.1597C11.8663 12.4537 11.5131 12.6005 11.1001 12.6H2.1001Z"
                                                        fill="#C7C7C7"
                                                    />
                                                </svg>
                                                <input
                                                    name="cover_Photo"
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(e) => handleFileChange(e, 'cover_Photo')}
                                                />
                                            </label>
                                        </div>

                                        <div className="flex flex-col w-full">
                                            <label className="text-white mb-1">Upload Module Video (Optional)</label>
                                            <label className="p-2 pl-4 pr-4 bg-[#333333] text-white rounded flex items-center justify-between cursor-pointer">
                                                <div>{formData.videoFile_introduction?.name || "Upload Module Video"}</div>
                                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M5.8501 9.59998V3.48748L3.9001 5.43748L2.8501 4.34998L6.6001 0.599976L10.3501 4.34998L9.3001 5.43748L7.3501 3.48748V9.59998H5.8501ZM2.1001 12.6C1.6876 12.6 1.3346 12.4532 1.0411 12.1597C0.747598 11.8662 0.600598 11.513 0.600098 11.1V8.84998H2.1001V11.1H11.1001V8.84998H12.6001V11.1C12.6001 11.5125 12.4533 11.8657 12.1598 12.1597C11.8663 12.4537 11.5131 12.6005 11.1001 12.6H2.1001Z"
                                                        fill="#C7C7C7"
                                                    />
                                                </svg>
                                                <input
                                                    name="videoFile_introduction"
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(e) => handleFileChange(e, 'videoFile_introduction')}
                                                />
                                            </label>
                                        </div>

                                        <div className="flex flex-col w-full">
                                            <label className="text-white mb-1">Upload Explanatory Video (Optional)</label>
                                            <label className="p-2 pl-4 pr-4 bg-[#333333] text-white rounded flex items-center justify-between cursor-pointer">
                                                <div>{formData.videoFile_description?.name || "Upload Explanatory Video"}</div>
                                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M5.8501 9.59998V3.48748L3.9001 5.43748L2.8501 4.34998L6.6001 0.599976L10.3501 4.34998L9.3001 5.43748L7.3501 3.48748V9.59998H5.8501ZM2.1001 12.6C1.6876 12.6 1.3346 12.4532 1.0411 12.1597C0.747598 11.8662 0.600598 11.513 0.600098 11.1V8.84998H2.1001V11.1H11.1001V8.84998H12.6001V11.1C12.6001 11.5125 12.4533 11.8657 12.1598 12.1597C11.8663 12.4537 11.5131 12.6005 11.1001 12.6H2.1001Z"
                                                        fill="#C7C7C7"
                                                    />
                                                </svg>
                                                <input
                                                    name="videoFile_description"
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(e) => handleFileChange(e, 'videoFile_description')}
                                                />
                                            </label>
                                        </div>


                                        <div className="flex gap-4 mt-4 w-full">
                                            <div className="flex flex-col w-full">
                                                <button
                                                    type="submit"
                                                    className="bg-[#F48567] px-4 py-2 rounded-xl text-[#000] flex items-center justify-center"
                                                    onClick={handleSave}
                                                    disabled={loading2}
                                                >
                                                    {loading2 ? <Spin size="small" /> : "Save"}
                                                </button>

                                            </div>

                                            <div className="flex flex-col w-full">
                                                <button
                                                    onClick={handleClosePopup}
                                                    className="bg-[#C7C7C7] px-4 py-2 rounded-xl text-[#000]"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {isSection3Visible && (
                                    <section>
                                        <div className="flex flex-col">
                                            <label className="text-white mb-1">Challenge Name</label>
                                            <input
                                                name="challengeName"
                                                required
                                                type="text"
                                                placeholder="Challenge Name"
                                                className="p-2 bg-[#333333] text-white rounded"
                                                value={challengeData.challengeName}
                                                onChange={(e) => setChallengeData({ ...challengeData, challengeName: e.target.value })}
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="text-white mb-1">Description</label>
                                            <textarea
                                                name="challenge_Description"
                                                required
                                                type="text"
                                                placeholder="How to do the challenge"
                                                className="p-2 bg-[#333333] text-white rounded"
                                                value={challengeData.challenge_Description}
                                                onChange={(e) => setChallengeData({ ...challengeData, challenge_Description: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-white mb-1">Benefits</label>
                                            <input
                                                name="moduleName"
                                                required
                                                type="text"
                                                placeholder="Benefits"
                                                className="p-2 bg-[#333333] text-white rounded"
                                                value={challengeData.moduleName}
                                                onChange={(e) => setChallengeData({ ...challengeData, moduleName: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-white mb-1">Duration</label>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    name="duration"
                                                    required
                                                    type="text"
                                                    placeholder="Enter time (e.g., 1h 30min)"
                                                    className="p-2 bg-[#333333] text-white rounded w-full"
                                                    value={`${time.duration} min`} // Use the time state for value
                                                    onChange={handleDurationChange}
                                                />
                                                <div className="flex flex-col">
                                                    <button
                                                        type="button"
                                                        className="p-[6.5px] bg-[#333333] text-white rounded"
                                                        onClick={() => adjustTime(30)} // Add 30 minutes
                                                    >
                                                        <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.8925 0.295001L10.6067 5.00917L9.42833 6.1875L5.30333 2.0625L1.17833 6.1875L0 5.00917L4.71417 0.295001C4.87044 0.138774 5.08236 0.0510116 5.30333 0.0510116C5.5243 0.0510116 5.73623 0.138774 5.8925 0.295001Z" fill="#C7C7C7" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="p-[6.5px] bg-[#333333] text-white rounded"
                                                        onClick={() => adjustTime(-30)} // Subtract 30 minutes
                                                    >
                                                        <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.8925 6.08L10.6067 1.36583L9.42833 0.1875L5.30333 4.3125L1.17833 0.1875L0 1.36583L4.71417 6.08C4.87044 6.23623 5.08236 6.32399 5.30333 6.32399C5.5243 6.32399 5.73623 6.23623 5.8925 6.08Z" fill="#C7C7C7" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>





                                        <div className="flex flex-col">
                                            <label className="text-white mb-1">Difficulty Level</label>
                                            <select
                                                name="difficulty_Level"
                                                required
                                                className="p-2 bg-[#333333] text-white rounded"
                                                value={challengeData.difficulty_Level}
                                                onChange={(e) => setChallengeData({ ...challengeData, difficulty_Level: e.target.value })}
                                            >
                                                <option value="" disabled>Select Difficulty</option>
                                                <option value="High">High</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Low">Low</option>
                                            </select>
                                        </div>



                                        <div className="flex flex-col w-full">
                                            <label className="text-white mb-1">Upload Photo or Video</label>
                                            <label className="p-2 pl-4 pr-4 bg-[#333333] text-white rounded flex items-center justify-between cursor-pointer">
                                                <div>{challengeData.video_or_image?.name || "Upload Photo or Video"}</div>
                                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M5.8501 9.59998V3.48748L3.9001 5.43748L2.8501 4.34998L6.6001 0.599976L10.3501 4.34998L9.3001 5.43748L7.3501 3.48748V9.59998H5.8501ZM2.1001 12.6C1.6876 12.6 1.3346 12.4532 1.0411 12.1597C0.747598 11.8662 0.600598 11.513 0.600098 11.1V8.84998H2.1001V11.1H11.1001V8.84998H12.6001V11.1C12.6001 11.5125 12.4533 11.8657 12.1598 12.1597C11.8663 12.4537 11.5131 12.6005 11.1001 12.6H2.1001Z"
                                                        fill="#C7C7C7"
                                                    />
                                                </svg>
                                                <input
                                                    name="video_or_image"
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(e) => handleVideoChange(e, 'video_or_image')}
                                                />
                                            </label>
                                        </div>


                                        <div className="flex gap-4 mt-4 w-full">
                                            <div className="flex flex-col w-full">
                                                <button
                                                    type="submit"
                                                    className="bg-[#F48567] px-4 py-2 rounded-xl text-[#000] flex items-center justify-center"
                                                    onClick={handleSaveChall}
                                                    disabled={loading}
                                                >
                                                    {loading ? <Spin size="small" /> : "Save"}
                                                </button>

                                            </div>

                                            <div className="flex flex-col w-full">
                                                <button
                                                    onClick={handleClosePopup}
                                                    className="bg-[#C7C7C7] px-4 py-2 rounded-xl text-[#000]"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </section>
                                )}

                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ParentComponent;
