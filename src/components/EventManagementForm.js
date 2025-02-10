import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEvent } from "../redux/actions/alleventGet";
import { showNotification } from "../redux/actions/notificationActions"; // Import showNotification
import "./popup.css"; // Import custom CSS
import { Button, Radio, Checkbox } from "antd";

const ParentComponent = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [showOna, setShowOnaPopup] = useState(false);
    const { licensing, error: licensingError } = useSelector((state) => state.licensing);
    const { users, error } = useSelector((state) => state.user);
    const [selectedLicense, setSelectedLicense] = useState(null);
    const [isSaveDisabled, setIsSaveDisabled] = useState(false);
    const [totalLicenses, setTotalLicenses] = useState(false);
    const [userCount, setUserCount] = useState(false);
    const [role, setRole] = useState("Admin");
    const [fileName, setFileName] = useState("Upload");
    const [fullQanda, setFullQanda] = useState({ title: "", qnaList: [] });
    const [currentQna, setCurrentQna] = useState({ question: "", answer: "" });
    const [showQnaInput, setShowQnaInput] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        startDateTime: "",
        endDateTime: "",
        location: "",
        mode: "",
        typeOfEvent: "",
        eventFees: "",
        notificationSettings: {
            setupReminder: false,
            reminders: []
        },
        notificationContent: "",
        engagementTools: {
            qnaSection: false,
            newsFeedConnection: false
        },
        questionandanswer: fullQanda,
        attachments: null,
        postEventFollowUp: "",
        status: 'Pending',
    });


    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            questionandanswer: fullQanda,
        }));
    }, [fullQanda]);
    

    const dispatch = useDispatch();
    // console.log(formData)
    useEffect(() => {
        // dispatch(fetchAllUsers());
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

        dispatch(createEvent(formData))
            .then(() => {
                dispatch(showNotification("Event created successfully", "success"));
                setShowPopup(false);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleViewPopup = () => setShowPopup(true);
    const openOnaPopup = () => setShowOnaPopup(true);
    const handleClosePopup = () => {
        setShowPopup(false);
        setShowOnaPopup(false);
        setSelectedLicense(null);
        setIsSaveDisabled(false);
        setTotalLicenses(false);
        setUserCount(false);
        setRole("Admin");
        setFileName("Upload");
        setFullQanda({ title: "", qnaList: [] });
        setCurrentQna({ question: "", answer: "" });
        setShowQnaInput(false);
        setEditingIndex(null);
        setFormData({
            title: "",
            description: "",
            startDateTime: "",
            endDateTime: "",
            location: "",
            mode: "",
            typeOfEvent: "",
            eventFees: "",
            notificationSettings: {
                setupReminder: false,
                reminders: []
            },
            notificationContent: "",
            engagementTools: {
                qnaSection: false,
                newsFeedConnection: false
            },
            questionandanswer: { title: "", qnaList: [] }, // Resetting fullQanda properly
            attachments: null,
            postEventFollowUp: "",
            status: 'Pending',
        });
    };
    
        const handleCloseQna = () => setShowOnaPopup(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFileName(file ? file.name : "Upload");
        setFormData((prevData) => ({ ...prevData, attachments: file }));
    };









    const handleQna = (e) => {
        const { name, value } = e.target;
        if (name === "title") {
            setFullQanda((prev) => ({ ...prev, title: value }));
        } else {
            setCurrentQna((prev) => ({ ...prev, [name]: value }));
        }
    };

    const addOrUpdateQandA = () => {
        if (!currentQna.question || !currentQna.answer) return;

        if (editingIndex !== null) {
            const updatedList = [...fullQanda.qnaList];
            updatedList[editingIndex] = currentQna;
            setFullQanda((prev) => ({ ...prev, qnaList: updatedList }));
            setEditingIndex(null);
        } else {
            setFullQanda((prev) => ({
                ...prev,
                qnaList: [...prev.qnaList, currentQna],
            }));
        }

        setCurrentQna({ question: "", answer: "" });
        setShowQnaInput(false);
    };

    const deleteQna = (index) => {
        const updatedList = fullQanda.qnaList.filter((_, i) => i !== index);
        setFullQanda((prev) => ({ ...prev, qnaList: updatedList }));
    };

    const editQna = (index) => {
        setCurrentQna(fullQanda.qnaList[index]);
        setEditingIndex(index);
        setShowQnaInput(true);
    };




    return (
        <>
            <Button
                className=" trigger text-[#F48567] border-none bg-transparent hover:bg-[#F4856720] hover:text-[#F48567] p-2 rounded"
                icon={
                    <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_b_5582_16219)">
                            <rect x="0.1" y="0.1" width="45.8" height="45.8" rx="11.9" stroke="#F48567" stroke-width="0.2" />
                            <path d="M34.25 29.25V18H16.75V29.25H34.25ZM34.25 11.75C34.913 11.75 35.5489 12.0134 36.0178 12.4822C36.4866 12.9511 36.75 13.587 36.75 14.25V29.25C36.75 29.913 36.4866 30.5489 36.0178 31.0178C35.5489 31.4866 34.913 31.75 34.25 31.75H16.75C16.087 31.75 15.4511 31.4866 14.9822 31.0178C14.5134 30.5489 14.25 29.913 14.25 29.25V14.25C14.25 13.587 14.5134 12.9511 14.9822 12.4822C15.4511 12.0134 16.087 11.75 16.75 11.75H18V9.25H20.5V11.75H30.5V9.25H33V11.75H34.25ZM11.75 34.25H29.25V36.75H11.75C11.087 36.75 10.4511 36.4866 9.98223 36.0178C9.51339 35.5489 9.25 34.913 9.25 34.25V19.25H11.75V34.25Z" fill="#F48567" />
                            <path d="M32.13 23.6364C34.2169 25.825 34.2169 29.3568 32.13 31.5455C31.1261 32.593 29.7657 33.1813 28.3474 33.1813C26.929 33.1813 25.5686 32.593 24.5648 31.5455C23.5628 30.496 23 29.0737 23 27.5909C23 26.1081 23.5628 24.6858 24.5648 23.6364C26.6582 21.4545 30.0365 21.4545 32.13 23.6364ZM29.3256 31.3409V28.6136H31.9343V26.5682H29.3256V23.8409H27.3691V26.5682H24.7604V28.6136H27.3691V31.3409H29.3256Z" fill="#F48567" />
                            <path d="M29.3256 31.3409V28.6136H31.9343V26.5682H29.3256V23.8409H27.3691V26.5682H24.7604V28.6136H27.3691V31.3409H29.3256Z" fill="#F48567" />
                            <path d="M29.3256 31.3409V28.6136H31.9343V26.5682H29.3256V23.8409H27.3691V26.5682H24.7604V28.6136H27.3691V31.3409H29.3256Z" fill="#333333" />
                        </g>
                        <defs>
                            <filter id="filter0_b_5582_16219" x="-4" y="-4" width="54" height="54" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feGaussianBlur in="BackgroundImageFix" stdDeviation="2" />
                                <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_5582_16219" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_5582_16219" result="shape" />
                            </filter>
                        </defs>
                    </svg>
                }
                onClick={handleViewPopup}

            />

            {/* Popup */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="p-8 bg-[rgb(30,30,30)] rounded-3xl w-[869px] h-[800px] overflow-y-auto my-event">
                        <div className="flex justify-between align-center">
                            <h2 className="text-2xl mb-6 text-white">Create Event</h2>
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

                            <div className="flex flex-col">
                                <label className="text-white mb-1">Title</label>
                                <input
                                    name="title"
                                    onChange={handleChange}
                                    required
                                    className="p-2 bg-[#333333] text-white rounded"
                                    type="text"
                                    placeholder="Title"
                                />
                            </div>

                            {/* First Name & Last Name */}
                            <div className="flex flex-col">
                                <label className="text-white mb-1">Description</label>
                                <input
                                    name="description"
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Description"
                                    className="p-2 bg-[#333333] text-white rounded"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col w-1/2">
                                    <label className="text-white mb-1">Date & Time</label>
                                    <input
                                        name="startDateTime"
                                        value={formData.startDateTime}
                                        onChange={handleChange}
                                        required
                                        type="date"
                                        placeholder="Start"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>
                                <div className="flex flex-col w-1/2">
                                    <label className="text-[#1e1e1e] mb-1">.</label>
                                    <input
                                        name="endDateTime"
                                        value={formData.endDateTime}
                                        required
                                        onChange={handleChange}
                                        type="date"
                                        placeholder="End"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex flex-col w-1/2">
                                    <label className="text-white mb-1">
                                        {formData.mode === "Online" ? "Event Link" : "Location"}
                                    </label>
                                    <input
                                        name="location"
                                        onChange={handleChange}
                                        className="p-2 bg-[#333333] text-white rounded"
                                        placeholder={formData.mode === "Online" ? "Event Link" : "Location"}
                                        value={formData.location}
                                    />
                                </div>
                                <div className="flex flex-col w-1/2">
                                    <label className="text-white mb-1">Mode</label>
                                    <Radio.Group
                                        options={['Offline', 'Online']}
                                        className="p-2 flex justify-start gap-5 text-white rounded"
                                        required
                                        value={formData.mode}
                                        onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                                    />
                                </div>
                            </div>


                            <div className="flex gap-4">
                                <div className="flex flex-col w-1/2">
                                    <label className="text-white mb-1">Type Of Event</label>
                                    <input
                                        name="typeOfEvent"
                                        onChange={handleChange}
                                        required
                                        placeholder="Type Of Event"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>
                                <div className="flex flex-col w-1/2">
                                    <label className="text-white mb-1">Event Fees*</label>
                                    <input
                                        name="eventFees"
                                        onChange={handleChange}
                                        required
                                        type="text"
                                        placeholder="Fees"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-white mb-1">Notification Setting</label>
                                <Checkbox.Group
                                    options={['Set Up Reminder', '7 days', '1 day', '1 hr', '30 minutes']}
                                    className="p-2 flex justify-between text-white rounded"
                                    value={
                                        formData.notificationSettings.setupReminder
                                            ? ['Set Up Reminder', ...formData.notificationSettings.reminders]
                                            : formData.notificationSettings.reminders
                                    }
                                    onChange={(checkedValues) => {
                                        const setupReminderSelected = checkedValues.includes('Set Up Reminder');
                                        const remindersWithoutSetup = checkedValues.filter(item => item !== 'Set Up Reminder');

                                        setFormData({
                                            ...formData,
                                            notificationSettings: {
                                                setupReminder: setupReminderSelected, // Set true if selected
                                                reminders: remindersWithoutSetup
                                            }
                                        });
                                    }}
                                />
                            </div>


                            <div className="flex gap-4">
                                <div className="flex flex-col w-1/2">
                                    <label className="text-white mb-1">Notification Content</label>
                                    <input
                                        name="notificationContent"
                                        onChange={handleChange}
                                        placeholder="You have the event [ Name ] coming up in [ time ]"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>
                            </div>


                            <div className="flex gap-4">
                                {/* Q&A Section */}
                                <div className="flex flex-col w-1/2">
                                    <label className="text-white mb-1">Engagement Tool</label>
                                    <Checkbox
                                        className="p-2 text-white rounded"
                                        checked={formData.engagementTools.qnaSection}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                engagementTools: {
                                                    ...formData.engagementTools,
                                                    qnaSection: e.target.checked, // Toggle between true/false
                                                },
                                            })
                                        }
                                    >
                                        Q&A Sections
                                    </Checkbox>
                                    <div onClick={openOnaPopup}>open qna</div>
                                </div>

                                {/* News Feed Connection */}
                                <div className="flex flex-col w-1/2">
                                    <label className="text-[#1e1e1e] mb-1">.</label>
                                    <Checkbox
                                        className="p-2 text-white rounded"
                                        checked={formData.engagementTools.newsFeedConnection}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                engagementTools: {
                                                    ...formData.engagementTools,
                                                    newsFeedConnection: e.target.checked, // Toggle between true/false
                                                },
                                            })
                                        }
                                    >
                                        News Feed Connection
                                    </Checkbox>
                                </div>
                            </div>



                            <div className="flex gap-4">
                                <div className="flex flex-col w-1/2">
                                    <label className="text-white mb-1">Attachments:</label>
                                    <label className="text-white mb-1">Event-Related Documents or Material, PDF, Docx</label>
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
                                            name="attachments"
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                </div>
                                <div className="flex flex-col w-1/2">
                                    <label className="text-[#1e1e1e] mb-1">.</label>
                                    <label className="text-white mb-1">Post-Event Follow-Up</label>
                                    <input
                                        name="postEventFollowUp"
                                        onChange={handleChange}
                                        placeholder="Follow-Up Actions"
                                        className="p-2 bg-[#333333] text-white rounded"
                                    />
                                </div>
                            </div>











                            <div className="flex gap-4 mt-4 w-full items-center justify-center">
                                <div className="flex flex-col w-40">
                                    <button
                                        type="submit"
                                        className="bg-[#F48567] px-4 py-2 rounded-xl text-[#000]"
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="flex flex-col w-40">
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

            {showOna && (
                <div className="popup-overlay flex flex-col">
                    <div className="p-8 bg-[rgb(30,30,30)] rounded-3xl w-[509px] h-[700px] overflow-y-auto my-event">
                        <div className="flex justify-between align-center">
                            <h2 className="text-2xl mb-6 text-white">Q&A Sections</h2>
                            <svg className="cursor-pointer mt-1" onClick={handleCloseQna}
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
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col">
                                <label className="text-white mb-1">Title</label>
                                <input
                                    name="title"
                                    value={fullQanda.title}
                                    onChange={handleQna}
                                    className="p-2 bg-[#333333] text-white rounded"
                                    type="text"
                                    placeholder="Event Title"
                                />
                            </div>

                            <div className="flex flex-col">
                                <div className="flex items-center justify-between">
                                    <label className="text-white ">Q&A</label>
                                    <div onClick={() => setShowQnaInput(true)} className="p-2 cursor-pointer">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.48218 10.4891C5.48218 10.2902 5.5612 10.0994 5.70185 9.95876C5.8425 9.81811 6.03327 9.73909 6.23218 9.73909H9.72518V6.24609C9.72518 6.04718 9.8042 5.85642 9.94485 5.71576C10.0855 5.57511 10.2763 5.49609 10.4752 5.49609C10.6741 5.49609 10.8649 5.57511 11.0055 5.71576C11.1462 5.85642 11.2252 6.04718 11.2252 6.24609V9.73909H14.7182C14.9171 9.73909 15.1079 9.81811 15.2485 9.95876C15.3892 10.0994 15.4682 10.2902 15.4682 10.4891C15.4682 10.688 15.3892 10.8788 15.2485 11.0194C15.1079 11.1601 14.9171 11.2391 14.7182 11.2391H11.2252V14.7321C11.2252 14.931 11.1462 15.1218 11.0055 15.2624C10.8649 15.4031 10.6741 15.4821 10.4752 15.4821C10.2763 15.4821 10.0855 15.4031 9.94485 15.2624C9.8042 15.1218 9.72518 14.931 9.72518 14.7321V11.2391H6.23218C6.03327 11.2391 5.8425 11.1601 5.70185 11.0194C5.5612 10.8788 5.48218 10.688 5.48218 10.4891Z" fill="#C7C7C7" />
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.79226 2.25879C8.90472 1.91374 12.0458 1.91374 15.1583 2.25879C16.9853 2.46279 18.4603 3.90179 18.6743 5.73879C19.0443 8.89579 19.0443 12.0848 18.6743 15.2418C18.4593 17.0788 16.9843 18.5168 15.1583 18.7218C12.0458 19.0669 8.90472 19.0669 5.79226 18.7218C3.96526 18.5168 2.49026 17.0788 2.27626 15.2418C1.90791 12.0848 1.90791 8.89575 2.27626 5.73879C2.49026 3.90179 3.96626 2.46279 5.79226 2.25879ZM14.9923 3.74879C11.9901 3.41602 8.9604 3.41602 5.95826 3.74879C5.4025 3.81045 4.88376 4.05767 4.48584 4.45051C4.08791 4.84335 3.83405 5.35887 3.76526 5.91379C3.40959 8.95476 3.40959 12.0268 3.76526 15.0678C3.83426 15.6225 4.08821 16.1378 4.48612 16.5305C4.88402 16.9231 5.40265 17.1702 5.95826 17.2318C8.93526 17.5638 12.0153 17.5638 14.9923 17.2318C15.5477 17.17 16.0661 16.9228 16.4638 16.5302C16.8615 16.1376 17.1153 15.6224 17.1843 15.0678C17.5399 12.0268 17.5399 8.95476 17.1843 5.91379C17.1151 5.35939 16.8612 4.84444 16.4635 4.45202C16.0658 4.05959 15.5475 3.81257 14.9923 3.75079" fill="#C7C7C7" />
                                        </svg>
                                    </div>
                                </div>

                                {showQnaInput && (
                                    <div className="mt-2 p-2 bg-[#444444] rounded-xl">
                                        <input
                                            name="question"
                                            value={currentQna.question}
                                            onChange={handleQna}
                                            className="p-2 bg-[#333333] text-white rounded w-full mb-2"
                                            type="text"
                                            placeholder="Question"
                                        />
                                        <textarea
                                            name="answer"
                                            value={currentQna.answer}
                                            onChange={handleQna}
                                            className="p-2 bg-[#333333] text-white rounded w-full"
                                            type="text"
                                            placeholder="Answer"
                                        />
                                        <button
                                            onClick={addOrUpdateQandA}
                                            className="bg-[#F48567] px-4 py-2 mt-2 rounded-xl text-[#000]"
                                        >
                                            {editingIndex !== null ? "Update" : "Save"}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <ul className="text-white">
                                    {fullQanda.qnaList.map((qna, index) => (
                                        <li key={index} className="mt-2 p-2 bg-[#333333] rounded-xl flex flex-row justify-between">
                                            <div className="QNAsection flex flex-col gap-3"><span>{qna.question}</span>
                                                <span>{qna.answer}</span></div>
                                            <div className="flex gap-2 mt-2">
                                                <button onClick={() => editQna(index)} className="p-1"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path opacity="0.16" d="M4.16671 13.3333L3.33337 16.6667L6.66671 15.8333L15 7.5L12.5 5L4.16671 13.3333Z" fill="#C7C7C7" />
                                                    <path d="M12.5 4.9991L15 7.4991M10.8334 16.6658H17.5M4.16671 13.3324L3.33337 16.6658L6.66671 15.8324L16.3217 6.17743C16.6342 5.86488 16.8097 5.44104 16.8097 4.9991C16.8097 4.55716 16.6342 4.13331 16.3217 3.82076L16.1784 3.67743C15.8658 3.36498 15.442 3.18945 15 3.18945C14.5581 3.18945 14.1343 3.36498 13.8217 3.67743L4.16671 13.3324Z" stroke="#C7C7C7" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                                </button>
                                                <button onClick={() => deleteQna(index)} className="p-1"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M7.4375 3.0625V3.375H10.5625V3.0625C10.5625 2.6481 10.3979 2.25067 10.1049 1.95765C9.81183 1.66462 9.4144 1.5 9 1.5C8.5856 1.5 8.18817 1.66462 7.89515 1.95765C7.60212 2.25067 7.4375 2.6481 7.4375 3.0625ZM6.1875 3.375V3.0625C6.1875 2.31658 6.48382 1.60121 7.01126 1.07376C7.53871 0.546316 8.25408 0.25 9 0.25C9.74592 0.25 10.4613 0.546316 10.9887 1.07376C11.5162 1.60121 11.8125 2.31658 11.8125 3.0625V3.375H16.5C16.6658 3.375 16.8247 3.44085 16.9419 3.55806C17.0592 3.67527 17.125 3.83424 17.125 4C17.125 4.16576 17.0592 4.32473 16.9419 4.44194C16.8247 4.55915 16.6658 4.625 16.5 4.625H15.5575L14.375 14.98C14.2878 15.7426 13.923 16.4465 13.3501 16.9573C12.7772 17.4682 12.0363 17.7504 11.2687 17.75H6.73125C5.96366 17.7504 5.22279 17.4682 4.64991 16.9573C4.07702 16.4465 3.7122 15.7426 3.625 14.98L2.4425 4.625H1.5C1.33424 4.625 1.17527 4.55915 1.05806 4.44194C0.940848 4.32473 0.875 4.16576 0.875 4C0.875 3.83424 0.940848 3.67527 1.05806 3.55806C1.17527 3.44085 1.33424 3.375 1.5 3.375H6.1875ZM7.75 7.4375C7.75 7.27174 7.68415 7.11277 7.56694 6.99556C7.44973 6.87835 7.29076 6.8125 7.125 6.8125C6.95924 6.8125 6.80027 6.87835 6.68306 6.99556C6.56585 7.11277 6.5 7.27174 6.5 7.4375V13.6875C6.5 13.8533 6.56585 14.0122 6.68306 14.1294C6.80027 14.2467 6.95924 14.3125 7.125 14.3125C7.29076 14.3125 7.44973 14.2467 7.56694 14.1294C7.68415 14.0122 7.75 13.8533 7.75 13.6875V7.4375ZM10.875 6.8125C10.7092 6.8125 10.5503 6.87835 10.4331 6.99556C10.3158 7.11277 10.25 7.27174 10.25 7.4375V13.6875C10.25 13.8533 10.3158 14.0122 10.4331 14.1294C10.5503 14.2467 10.7092 14.3125 10.875 14.3125C11.0408 14.3125 11.1997 14.2467 11.3169 14.1294C11.4342 14.0122 11.5 13.8533 11.5 13.6875V7.4375C11.5 7.27174 11.4342 7.11277 11.3169 6.99556C11.1997 6.87835 11.0408 6.8125 10.875 6.8125Z" fill="#DD441B" />
                                                </svg>
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>



                        </div>



                    </div>
                    <div className="flex gap-4 mt-4 w-[509px] items-center justify-center bg-[rgb(30,30,30)]  mt-[-60px] w-[509px] h-[70px] rounded-3xl">
                        <div className="flex flex-col w-40">
                            <button
                                onClick={handleCloseQna}
                                className="bg-[#F48567] px-4 py-2 rounded-xl text-[#000]"
                            >
                                Save
                            </button>
                        </div>
                        <div className="flex flex-col w-40">
                            {/* Save Button */}
                            <button

                                onClick={handleCloseQna}
                                className="bg-[#C7C7C7] px-4 py-2 rounded-xl text-[#000]"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>

            )}
        </ >
    );
};

export default ParentComponent;
