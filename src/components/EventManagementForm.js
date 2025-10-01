import React, { useState, useEffect } from "react";
import { Button, Radio, Checkbox } from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createEvent } from "../redux/actions/alleventGet";
import { showNotification } from "../redux/actions/notificationActions";

const ParentComponent = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showQna, setShowQnaPopup] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [fileName, setFileName] = useState("Upload");
  const [fullQanda, setFullQanda] = useState({ title: "", qnaList: [] });
  const [currentQna, setCurrentQna] = useState({ question: "", answer: "" });
  const [showQnaInput, setShowQnaInput] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Initialize formData properly without circular dependency
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
      reminders: [],
    },
    notificationContent: "",
    engagementTools: {
      qnaSection: false,
      newsFeedConnection: false,
    },
    questionandanswer: { title: "", qnaList: [] }, // Initialize as empty object
    attachments: null,
    postEventFollowUp: "",
    status: "Pending",
  });

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.events);

  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      questionandanswer: fullQanda,
    }));
  }, [fullQanda]);

  // Debug useEffect to catch errors
  useEffect(() => {
    if (error) {
      console.error("Redux store error:", error);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  // FIXED: Handle submit like your working version
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    // Validate data before submission
    const submitData = {
      ...formData,
      questionandanswer:
        fullQanda.qnaList.length > 0 ? fullQanda : { title: "", qnaList: [] },
    };

    dispatch(createEvent(submitData))
      .then(() => {
        // FIXED: Use string parameters instead of object
        dispatch(showNotification("Event created successfully", "success"));
        handleClosePopup();
      })
      .catch((error) => {
        console.error("Error creating event:", error);
        dispatch(
          showNotification("Failed to create event: " + error.message, "error")
        );
      });
  };

  const handleViewPopup = () => setShowPopup(true);
  const openQnaPopup = () => setShowQnaPopup(true);
  const openVideoModal = () => setShowVideoModal(true);

  const handleClosePopup = () => {
    setShowPopup(false);
    setShowQnaPopup(false);
    setShowVideoModal(false);
    setFileName("Upload");
    setFullQanda({ title: "", qnaList: [] });
    setCurrentQna({ question: "", answer: "" });
    setShowQnaInput(false);
    setEditingIndex(null);
    setExpandedIndex(null);
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
        reminders: [],
      },
      notificationContent: "",
      engagementTools: {
        qnaSection: false,
        newsFeedConnection: false,
      },
      questionandanswer: { title: "", qnaList: [] },
      attachments: null,
      postEventFollowUp: "",
      status: "Pending",
    });
  };

  const handleCloseQna = () => setShowQnaPopup(false);
  const handleCloseVideoModal = () => setShowVideoModal(false);

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

  const handleModeChange = (e) => {
    const mode = e.target.value;
    setFormData({ ...formData, mode });
    if (mode === "Online") {
      setShowVideoModal(true);
    }
  };

  return (
    <>
      <Button
        className="trigger text-[#F48567] border-none bg-transparent hover:bg-[#F4856720] hover:text-[#F48567] p-2 rounded"
        icon={
          <svg
            width="46"
            height="46"
            viewBox="0 0 46 46"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_b_5582_16219)">
              <rect
                x="0.1"
                y="0.1"
                width="45.8"
                height="45.8"
                rx="11.9"
                stroke="#F48567"
                strokeWidth="0.2"
              />
              <path
                d="M34.25 29.25V18H16.75V29.25H34.25ZM34.25 11.75C34.913 11.75 35.5489 12.0134 36.0178 12.4822C36.4866 12.9511 36.75 13.587 36.75 14.25V29.25C36.75 29.913 36.4866 30.5489 36.0178 31.0178C35.5489 31.4866 34.913 31.75 34.25 31.75H16.75C16.087 31.75 15.4511 31.4866 14.9822 31.0178C14.5134 30.5489 14.25 29.913 14.25 29.25V14.25C14.25 13.587 14.5134 12.9511 14.9822 12.4822C15.4511 12.0134 16.087 11.75 16.75 11.75H18V9.25H20.5V11.75H30.5V9.25H33V11.75H34.25ZM11.75 34.25H29.25V36.75H11.75C11.087 36.75 10.4511 36.4866 9.98223 36.0178C9.51339 35.5489 9.25 34.913 9.25 34.25V19.25H11.75V34.25Z"
                fill="#F48567"
              />
              <path
                d="M32.13 23.6364C34.2169 25.825 34.2169 29.3568 32.13 31.5455C31.1261 32.593 29.7657 33.1813 28.3474 33.1813C26.929 33.1813 25.5686 32.593 24.5648 31.5455C23.5628 30.496 23 29.0737 23 27.5909C23 26.1081 23.5628 24.6858 24.5648 23.6364C26.6582 21.4545 30.0365 21.4545 32.13 23.6364ZM29.3256 31.3409V28.6136H31.9343V26.5682H29.3256V23.8409H27.3691V26.5682H24.7604V28.6136H27.3691V31.3409H29.3256Z"
                fill="#F48567"
              />
              <path
                d="M29.3256 31.3409V28.6136H31.9343V26.5682H29.3256V23.8409H27.3691V26.5682H24.7604V28.6136H27.3691V31.3409H29.3256Z"
                fill="#F48567"
              />
              <path
                d="M29.3256 31.3409V28.6136H31.9343V26.5682H29.3256V23.8409H27.3691V26.5682H24.7604V28.6136H27.3691V31.3409H29.3256Z"
                fill="#333333"
              />
            </g>
            <defs>
              <filter
                id="filter0_b_5582_16219"
                x="-4"
                y="-4"
                width="54"
                height="54"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="BackgroundImageFix" stdDeviation="2" />
                <feComposite
                  in2="SourceAlpha"
                  operator="in"
                  result="effect1_backgroundBlur_5582_16219"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_backgroundBlur_5582_16219"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        }
        onClick={handleViewPopup}
      />

      {/* Main Event Form Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="p-8 bg-[rgb(30,30,30)] rounded-3xl w-[869px] h-[800px] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl mb-6 text-white">Create Event</h2>
              <button onClick={handleClosePopup} className="cursor-pointer">
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
                      <rect
                        width="24"
                        height="24"
                        fill="white"
                        transform="translate(0 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </button>
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
                  <label className="text-white mb-1">Start Date & Time</label>
                  <input
                    name="startDateTime"
                    value={formData.startDateTime}
                    onChange={handleChange}
                    required
                    type="datetime-local"
                    className="p-2 bg-[#333333] text-white rounded"
                  />
                </div>
                <div className="flex flex-col w-1/2">
                  <label className="text-white mb-1">End Date & Time</label>
                  <input
                    name="endDateTime"
                    value={formData.endDateTime}
                    required
                    onChange={handleChange}
                    type="datetime-local"
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
                    placeholder={
                      formData.mode === "Online" ? "Event Link" : "Location"
                    }
                    value={formData.location}
                  />
                </div>
                <div className="flex flex-col w-1/2">
                  <label className="text-white mb-1">Mode</label>
                  <Radio.Group
                    options={["Offline", "Online"]}
                    className="p-2 flex justify-start gap-5 rounded [&_.ant-radio-wrapper]:text-white"
                    required
                    value={formData.mode}
                    onChange={handleModeChange}
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
                  options={[
                    "Set Up Reminder",
                    "7 days",
                    "1 day",
                    "1 hr",
                    "30 minutes",
                  ]}
                  className="p-2 flex justify-between text-white rounded [&_.ant-checkbox-wrapper]:text-white"
                  value={[
                    ...(formData.notificationSettings.setupReminder
                      ? ["Set Up Reminder"]
                      : []),
                    ...formData.notificationSettings.reminders,
                  ]}
                  onChange={(checkedValues) => {
                    const setupReminderSelected =
                      checkedValues.includes("Set Up Reminder");
                    const remindersWithoutSetup = checkedValues.filter(
                      (item) => item !== "Set Up Reminder"
                    );

                    setFormData({
                      ...formData,
                      notificationSettings: {
                        setupReminder: setupReminderSelected,
                        reminders: remindersWithoutSetup,
                      },
                    });
                  }}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col w-1/2">
                  <label className="text-white mb-1">
                    Notification Content
                  </label>
                  <input
                    name="notificationContent"
                    onChange={handleChange}
                    placeholder="You have the event [ Name ] coming up in [ time ]"
                    className="p-2 bg-[#333333] text-white rounded"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col w-1/2">
                  <label className="text-white mb-1">Engagement Tool</label>
                  <Checkbox
                    className="p-2 text-white rounded"
                    checked={formData.engagementTools.qnaSection}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        engagementTools: {
                          ...formData.engagementTools,
                          qnaSection: e.target.checked,
                        },
                      });
                      if (e.target.checked) {
                        openQnaPopup();
                      }
                    }}
                  >
                    Q&A Sections
                  </Checkbox>
                </div>

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
                          newsFeedConnection: e.target.checked,
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
                  <label className="text-white mb-1">
                    Event-Related Documents or Material, PDF, Docx
                  </label>
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
                  <label className="text-white mb-1">
                    Post-Event Follow-Up
                  </label>
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
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Next"}
                  </button>
                </div>
                <div className="flex flex-col w-40">
                  <button
                    type="button"
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

      {/* Video Conferencing Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="p-8 bg-[rgb(30,30,30)] rounded-3xl w-[616px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-white">Video conferencing</h2>
              <button
                onClick={handleCloseVideoModal}
                className="cursor-pointer"
              >
                <span className="text-white text-2xl">×</span>
              </button>
            </div>

            <div className="flex gap-4">
              <Link to="https://zoom.us/signin#/login">
                <div className="flex-1 bg-[#333333] p-6 rounded-xl cursor-pointer hover:bg-[#444444] transition w-[258px] h-[238px]">
                  <div className="mb-4">
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 64 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="64" height="64" rx="23" fill="#216DFA" />
                      <path
                        d="M15.1218 35.9773L14.4976 35.9495H8.89125L16.3686 28.4721L16.3409 27.8479C16.3265 27.3635 16.1277 26.903 15.7851 26.5604C15.4424 26.2177 14.9819 26.0189 14.4976 26.0045L13.875 25.9785H4.52655L4.56297 26.6011C4.63406 27.6138 5.37452 28.382 6.39416 28.4444L7.01843 28.4721H12.6369L5.14735 35.9495L5.1751 36.5738C5.19314 37.0569 5.39314 37.5154 5.735 37.8572C6.07686 38.1991 6.53531 38.3991 7.01843 38.4171L7.6427 38.4431H16.9912L16.9634 37.8206C16.8819 36.7992 16.1501 36.0501 15.1201 35.9877L15.1218 35.9773ZM22.6079 25.9802H22.5992C14.2912 25.9889 14.2981 38.4431 22.5992 38.4431C30.909 38.4431 30.909 25.9907 22.6079 25.9802ZM25.2454 34.8588C24.9014 35.2207 24.4883 35.5101 24.0305 35.7097C23.5728 35.9093 23.0797 36.0152 22.5803 36.021C22.081 36.0268 21.5855 35.9325 21.1232 35.7436C20.6609 35.5547 20.2412 35.2751 19.8888 34.9212C19.5362 34.5681 19.2576 34.1481 19.0695 33.6858C18.8815 33.2236 18.7877 32.7284 18.7936 32.2294C18.7996 31.7304 18.9053 31.2376 19.1044 30.78C19.3034 30.3224 19.592 29.9092 19.953 29.5646C23.4836 26.2144 28.5957 31.3264 25.2454 34.8588ZM55.0058 25.9802C53.5787 25.9802 52.2244 26.5924 51.2758 27.6675C50.4725 26.7593 49.3661 26.1743 48.1632 26.0218C46.9602 25.8693 45.7429 26.1596 44.7383 26.8386C44.2597 26.2959 43.1655 25.9802 42.5516 25.9802V38.4431L43.1759 38.4171C44.2146 38.3426 44.9724 37.6125 45.0088 36.5738L45.0435 35.9495V31.5866L45.0712 30.964C45.099 30.4941 45.1614 30.0779 45.3782 29.7172C45.7093 29.1451 46.2538 28.7277 46.8922 28.5564C47.5306 28.3851 48.2109 28.4739 48.7839 28.8033C49.1637 29.0201 49.4689 29.3374 49.6856 29.7068C49.9024 30.0762 49.9648 30.4923 49.9926 30.9623L50.029 31.5848V35.9478L50.055 36.5721C50.1192 37.583 50.8683 38.3408 51.8983 38.4154L52.5226 38.4414V31.5866L52.5486 30.964C52.5677 30.5045 52.6388 30.0692 52.8556 29.7085C53.0745 29.3293 53.3895 29.0146 53.769 28.7961C54.1484 28.5777 54.5788 28.4632 55.0166 28.4642C55.4545 28.4653 55.8843 28.5819 56.2627 28.8022C56.6411 29.0225 56.9546 29.3387 57.1717 29.7189C57.3798 30.0796 57.444 30.5045 57.47 30.9657L57.5064 31.5883V35.9512L57.5341 36.5755C57.5542 37.058 57.7548 37.5153 58.0962 37.8567C58.4377 38.1982 58.895 38.3988 59.3775 38.4189L60 38.4449V30.9675C59.9977 29.6445 59.4705 28.3764 58.5342 27.4417C57.5978 26.507 56.3289 25.982 55.0058 25.982V25.9802ZM31.287 27.8045C30.6833 28.3767 30.2004 29.064 29.8668 29.8259C29.5332 30.5878 29.3557 31.4089 29.3447 32.2406C29.3337 33.0722 29.4895 33.8977 29.8028 34.6681C30.1162 35.4386 30.5807 36.1385 31.1691 36.7264C31.7565 37.3158 32.4561 37.7815 33.2266 38.0959C33.997 38.4103 34.8227 38.567 35.6548 38.5569C36.4869 38.5467 37.3085 38.3698 38.071 38.0366C38.8336 37.7034 39.5216 37.2208 40.0944 36.6171C45.6851 30.7473 37.1586 22.2242 31.287 27.8045ZM38.3326 34.8588C37.9872 35.2156 37.5742 35.5002 37.1176 35.6957C36.6611 35.8913 36.1702 35.9939 35.6736 35.9978C35.1769 36.0016 34.6845 35.9064 34.225 35.7179C33.7656 35.5294 33.3482 35.2512 32.9974 34.8997C32.6465 34.5482 32.3692 34.1303 32.1816 33.6705C31.994 33.2106 31.8998 32.718 31.9046 32.2214C31.9094 31.7248 32.013 31.2341 32.2095 30.7779C32.4059 30.3218 32.6913 29.9093 33.0488 29.5646C36.5707 26.1328 41.773 31.3264 38.3326 34.8588Z"
                        fill="#DFFFFF"
                      />
                    </svg>
                  </div>
                  <h3 className="text-[#F48567] font-bold mb-2">Zoom</h3>
                  <p className="text-gray-400 text-sm">
                    Include Zoom details in your Calendly events
                  </p>
                </div>
              </Link>

              <Link to="https://meet.google.com/landing?pli=1">
                <div className="flex-1 bg-[#333333] p-6 rounded-xl cursor-pointer hover:bg-[#444444] transition w-[258px] h-[238px]">
                  <div className="mb-4">
                    <svg
                      width="64"
                      height="53"
                      viewBox="0 0 64 53"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_5593_29018)">
                        <path
                          d="M36.2054 26.3312L42.4447 33.463L50.8352 38.8242L52.2947 26.3762L50.8352 14.209L42.2839 18.9187L36.2054 26.3312Z"
                          fill="#00832D"
                        />
                        <path
                          d="M0 37.6653V48.2728C0 50.6948 1.966 52.6613 4.3885 52.6613H14.996L17.1925 44.6465L14.996 37.6653L7.7185 35.4688L0 37.6653Z"
                          fill="#0066DA"
                        />
                        <path
                          d="M14.996 0L0 14.996L7.719 17.1873L14.996 14.996L17.1525 8.10975L14.996 0Z"
                          fill="#E94235"
                        />
                        <path
                          d="M0.000244141 37.6701H14.996V14.9961H0.000244141V37.6701Z"
                          fill="#2684FC"
                        />
                        <path
                          d="M60.4147 6.34894L50.835 14.2079V38.8229L60.4542 46.7124C61.8942 47.8404 64.0007 46.8124 64.0007 44.9819V8.04444C64.0007 6.19369 61.844 5.17069 60.4145 6.34919"
                          fill="#00AC47"
                        />
                        <path
                          d="M36.2055 26.3301V37.6646H14.996V52.6606H46.447C48.8695 52.6606 50.8352 50.6941 50.8352 48.2721V38.8231L36.2055 26.3301Z"
                          fill="#00AC47"
                        />
                        <path
                          d="M46.447 0H14.996V14.996H36.2055V26.3305L50.8355 14.208V4.38875C50.8355 1.96625 48.8695 0.00025 46.447 0.00025"
                          fill="#FFBA00"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_5593_29018">
                          <rect width="64" height="52.75" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <h3 className="text-[#F48567] font-bold mb-2">Google Meet</h3>
                  <p className="text-gray-400 text-sm">
                    Include Google Meet details in your Calendly events
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Q&A Modal */}
      {showQna && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="flex flex-col">
            <div className="p-8 bg-[rgb(30,30,30)] rounded-3xl w-[509px] h-[700px] overflow-y-auto">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl mb-6 text-white">Q&A Sections</h2>
                <button
                  onClick={handleCloseQna}
                  className="cursor-pointer mt-1"
                >
                  <svg
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.516 20.985C2.36988 19.878 1.45569 18.5539 0.826781 17.0898C0.197873 15.6258 -0.133162 14.0511 -0.147008 12.4578C-0.160854 10.8644 0.142767 9.28428 0.746137 7.80953C1.34951 6.33477 2.24055 4.99495 3.36726 3.86823C4.49397 2.74152 5.83379 1.85048 7.30855 1.24711C8.78331 0.643743 10.3635 0.340123 11.9568 0.353969C13.5502 0.367815 15.1248 0.698849 16.5889 1.32776C18.0529 1.95667 19.377 2.87085 20.484 4.01697C22.6699 6.2802 23.8794 9.31143 23.8521 12.4578C23.8247 15.6042 22.5627 18.6139 20.3378 20.8388C18.1129 23.0637 15.1032 24.3257 11.9568 24.3531C8.81045 24.3804 5.77922 23.1709 3.516 20.985ZM5.208 19.293C7.00935 21.0943 9.4525 22.1063 12 22.1063C14.5475 22.1063 16.9906 21.0943 18.792 19.293C20.5933 17.4916 21.6053 15.0485 21.6053 12.501C21.6053 9.95348 20.5933 7.51032 18.792 5.70897C16.9906 3.90762 14.5475 2.89564 12 2.89564C9.4525 2.89564 7.00935 3.90762 5.208 5.70897C3.40665 7.51032 2.39466 9.95348 2.39466 12.501C2.39466 15.0485 3.40665 17.4916 5.208 19.293ZM17.088 9.10497L13.692 12.501L17.088 15.897L15.396 17.589L12 14.193L8.604 17.589L6.912 15.897L10.308 12.501L6.912 9.10497L8.604 7.41297L12 10.809L15.396 7.41297L17.088 9.10497Z"
                      fill="#C7C7C7"
                    />
                  </svg>
                </button>
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
                    <label className="text-white">Q&A</label>
                    <button
                      onClick={() => setShowQnaInput(true)}
                      className="p-2 cursor-pointer"
                    >
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 17 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.48218 8.48909C3.48218 8.29018 3.5612 8.09942 3.70185 7.95876C3.8425 7.81811 4.03327 7.73909 4.23218 7.73909H7.72518V3.48748L3.9001 5.43748L2.8501 4.34998L6.6001 0.599976L10.3501 4.34998L9.3001 5.43748L7.3501 3.48748V9.59998H5.8501ZM2.1001 12.6C1.6876 12.6 1.3346 12.4532 1.0411 12.1597C0.747598 11.8662 0.600598 11.513 0.600098 11.1V8.84998H2.1001V11.1H11.1001V8.84998H12.6001V11.1C12.6001 11.5125 12.4533 11.8657 12.1598 12.1597C11.8663 12.4537 11.5131 12.6005 11.1001 12.6H2.1001Z"
                          fill="#C7C7C7"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3.79226 0.258794C6.90472 -0.0862646 10.0458 -0.0862646 13.1583 0.258794C14.9853 0.462794 16.4603 1.90179 16.6743 3.73879C17.0443 6.89579 17.0443 10.0848 16.6743 13.2418C16.4593 15.0788 14.9843 16.5168 13.1583 16.7218C10.0458 17.0669 6.90472 17.0669 3.79226 16.7218C1.96526 16.5168 0.490257 15.0788 0.276257 13.2418C-0.0920857 10.0848 -0.0920857 6.89575 0.276257 3.73879C0.490257 1.90179 1.96626 0.462794 3.79226 0.258794ZM12.9923 1.74879C9.99012 1.41602 6.9604 1.41602 3.95826 1.74879C3.4025 1.81045 2.88376 2.05767 2.48584 2.45051C2.08791 2.84335 1.83405 3.35887 1.76526 3.91379C1.40959 6.95476 1.40959 10.0268 1.76526 13.0678C1.83426 13.6225 2.08821 14.1378 2.48612 16.5305C2.88402 16.9231 3.40265 17.1702 3.95826 17.2318C6.93526 17.5638 10.0153 17.5638 14.9923 17.2318C15.5477 17.17 16.0661 16.9228 16.4638 16.5302C16.8615 16.1376 17.1153 15.6224 17.1843 15.0678C17.5399 12.0268 17.5399 8.95476 17.1843 5.91379C17.1151 5.35939 16.8612 4.84444 16.4635 4.45202C16.0658 4.05959 15.5475 3.81257 14.9923 3.75079"
                          fill="#C7C7C7"
                        />
                      </svg>
                    </button>
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
                      <li key={index} className="mt-2 bg-[#333333] rounded-xl">
                        <div
                          className="flex flex-row justify-between items-center p-3 cursor-pointer"
                          onClick={() => toggleAccordion(index)}
                        >
                          <span className="font-semibold">{qna.question}</span>
                          <span className="text-white text-xl transition-transform duration-300">
                            {expandedIndex === index ? (
                              <svg
                                width="20"
                                height="10"
                                viewBox="0 0 20 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#clip0_5582_22695)">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M9.40755 1.53523L4.69338 6.2494L5.87172 7.42773L9.99672 3.30273L14.1217 7.42773L15.3 6.2494L10.5859 1.53523C10.4296 1.37901 10.2177 1.29125 9.99672 1.29125C9.77575 1.29125 9.56382 1.37901 9.40755 1.53523Z"
                                    fill="#C7C7C7"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_5582_22695">
                                    <rect
                                      width="10"
                                      height="20"
                                      fill="white"
                                      transform="matrix(0 -1 -1 0 20 10)"
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                            ) : (
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
                                  d="M5.40755 6.46477L0.693382 1.7506L1.87172 0.572266L5.99672 4.69727L10.1217 0.572266L11.3 1.7506L6.58588 6.46477C6.42961 6.62099 6.21769 6.70875 5.99672 6.70875C5.77575 6.70875 5.56382 6.62099 5.40755 6.46477Z"
                                  fill="#C7C7C7"
                                />
                              </svg>
                            )}
                          </span>
                        </div>
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            expandedIndex === index
                              ? "max-h-96 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="p-3 pt-0 text-gray-400 border-t border-gray-600">
                            {qna.answer}
                            <div className="flex gap-2 mt-2 justify-end">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  editQna(index);
                                }}
                                className="p-1 text-gray-300 hover:text-white"
                              >
                                <svg
                                  width="17"
                                  height="16"
                                  viewBox="0 0 17 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M10.5 2.9991L13 5.4991M8.83337 14.6658H15.5M2.16671 11.3324L1.33337 14.6658L4.66671 13.8324L14.3217 4.17743C14.6342 3.86488 14.8097 3.44104 14.8097 2.9991C14.8097 2.55716 14.6342 2.13331 14.3217 1.82076L14.1784 1.67743C13.8658 1.36498 13.442 1.18945 13 1.18945C12.5581 1.18945 12.1343 1.36498 11.8217 1.67743L2.16671 11.3324Z"
                                    stroke="#C7C7C7"
                                    strokeWidth="1.25"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteQna(index);
                                }}
                                className="p-1 text-gray-300 hover:text-white"
                              >
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 18 18"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M7.4375 3.0625V3.375H10.5625V3.0625C10.5625 2.6481 10.3979 2.25067 10.1049 1.95765C9.81183 1.66462 9.4144 1.5 9 1.5C8.5856 1.5 8.18817 1.66462 7.89515 1.95765C7.60212 2.25067 7.4375 2.6481 7.4375 3.0625ZM6.1875 3.375V3.0625C6.1875 2.31658 6.48382 1.60121 7.01126 1.07376C7.53871 0.546316 8.25408 0.25 9 0.25C9.74592 0.25 10.4613 0.546316 10.9887 1.07376C11.5162 1.60121 11.8125 2.31658 11.8125 3.0625V3.375H16.5C16.6658 3.375 16.8247 3.44085 16.9419 3.55806C17.0592 3.67527 17.125 3.83424 17.125 4C17.125 4.16576 17.0592 4.32473 16.9419 4.44194C16.8247 4.55915 16.6658 4.625 16.5 4.625H15.5575L14.375 14.98C14.2878 15.7426 13.923 16.4465 13.3501 16.9573C12.7772 17.4682 12.0363 17.7504 11.2687 17.75H6.73125C5.96366 17.7504 5.22279 17.4682 4.64991 16.9573C4.07702 16.4465 3.7122 15.7426 3.625 14.98L2.4425 4.625H1.5C1.33424 4.625 1.17527 4.55915 1.05806 4.44194C0.940848 4.32473 0.875 4.16576 0.875 4C0.875 3.83424 0.940848 3.67527 1.05806 3.55806C1.17527 3.44085 1.33424 3.375 1.5 3.375H6.1875ZM7.75 7.4375C7.75 7.27174 7.68415 7.11277 7.56694 6.99556C7.44973 6.87835 7.29076 6.8125 7.125 6.8125C6.95924 6.8125 6.80027 6.87835 6.68306 6.99556C6.56585 7.11277 6.5 7.27174 6.5 7.4375V13.6875C6.5 13.8533 6.56585 14.0122 6.68306 14.1294C6.80027 14.2467 6.95924 14.3125 7.125 14.3125C7.29076 14.3125 7.44973 14.2467 7.56694 14.1294C7.68415 14.0122 7.75 13.8533 7.75 13.6875V7.4375ZM10.875 6.8125C10.7092 6.8125 10.5503 6.87835 10.4331 6.99556C10.3158 7.11277 10.25 7.27174 10.25 7.4375V13.6875C10.25 13.8533 10.3158 14.0122 10.4331 14.1294C10.5503 14.2467 10.7092 14.3125 10.875 14.3125C11.0408 14.3125 11.1997 14.2467 11.3169 14.1294C11.4342 14.0122 11.5 13.8533 11.5 13.6875V7.4375C11.5 7.27174 11.4342 7.11277 11.3169 6.99556C11.1997 6.87835 11.0408 6.8125 10.875 6.8125Z"
                                    fill="#DD441B"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-4 w-[509px] items-center justify-center bg-[rgb(30,30,30)] h-[70px] rounded-3xl">
              <div className="flex flex-col w-40">
                <button
                  onClick={handleCloseQna}
                  className="bg-[#F48567] px-4 py-2 rounded-xl text-[#000]"
                >
                  Save
                </button>
              </div>
              <div className="flex flex-col w-40">
                <button
                  onClick={handleCloseQna}
                  className="bg-[#C7C7C7] px-4 py-2 rounded-xl text-[#000]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ParentComponent;
