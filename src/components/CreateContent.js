import React, { useState, useEffect } from "react";
import { Spin, Progress } from "antd";
import "./popup.css"; // Import custom CSS
import "./popup2.css"; // Import custom CSS
import { useSelector, useDispatch } from "react-redux";
import {
  createContent,
  createchallenge,
  fetchAllContent,
} from "../redux/actions/allContentGet";
import { showNotification } from "../redux/actions/notificationActions"; // Import showNotification
import { SquarePlus, Pencil, Upload } from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";

const ParentComponent = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);

  const [showPopup, setShowPopup] = useState(false);
  const [showChallangePopup, setChallangePopup] = useState(false);
  const [isSectionVisible, setIsSectionVisible] = useState(true);
  const [isSection2Visible, setIsSection2Visible] = useState(false);
  const [isCreatedModuleVisible, setisCreatedModuleVisible] = useState(false);
  const [isCreatedContentVisible, setisCreatedContentVisible] = useState(false);
  const [isSection3Visible, setIsSection3Visible] = useState(false);
  const [isLoadingLink, setLoadingLink] = useState(false);
  const [isOpenTrack, setIsOpenTrack] = useState(false);
  const [isOpenPartner, setIsOpenPartner] = useState(false);
  const [isOpenModule, setIsOpenModule] = useState(false);
  const [fileProfile, setFileProfile] = useState("Upload Cover Photo");
  const [selectedContent, setSelectedContent] = useState(null);
  const [isChallengeSelected, setIsChallengeSelected] = useState(false);
  const [time, settime] = useState({
    duration: 0, // Initialize with 0 or any default value you prefer
  });
  const [editTrack, setEditTrack] = useState(null);
  const [editModule, setEditModule] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);

  const generateUniqueId = () => {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
  };

  const initialModuleData = {
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
    content: "",
  };
  const initialChallangeData = {
    uniChallengeId: generateUniqueId(),
    challengeName: "",
    module: "688216e9156bc704ef0b6816",
    challenge_benefits: "",
    challenge_Description: "",
    duration: time.duration,
    isApproved: "pending",
    difficulty_Level: "",
    uploaded_by: "",
    video_or_image: "",
  };

  const [formData, setFormData] = useState(initialModuleData);
  const [challengeData, setChallengeData] = useState(initialChallangeData);
  const [challenges, setChallenges] = useState([]);
  const [editingChallengeIndex, setEditingChallengeIndex] = useState(null);
  const [progress, setProgress] = useState(0);
  const [modules, setModules] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [modulesFromStorage, setModulesFromStorage] = useState([]);

  //confirmation model
  const [moduleToDelete, setModuleToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [showChallengeSubmitConfirmation, setShowChallengeSubmitConfirmation] =
    useState(false);
  const [showChallengeCancelConfirmation, setShowChallengeCancelConfirmation] =
    useState(false);
  const [showChallengeSuccess, setShowChallengeSuccess] = useState(false);
  const [challengeToDelete, setChallengeToDelete] = useState(null);
  const [showChallengeDeleteModal, setShowChallengeDeleteModal] =
    useState(false);

  // console.log(modules, challenges);
  const toggleTrackOpen = () => setIsOpenTrack(!isOpenTrack);
  const togglePartnerOpen = () => setIsOpenPartner(!isOpenPartner);
  const toggleModuleOpen = () => setIsOpenModule(!isOpenModule);

  useEffect(() => {
    // Load modules from local storage when component mounts
    const storedModules = localStorage.getItem("moduleInfo");
    if (storedModules) {
      try {
        const parsedModules = JSON.parse(storedModules);
        setModulesFromStorage(parsedModules);
      } catch (error) {
        console.error("Error parsing stored modules:", error);
      }
    }
  }, []);

  const handleSelectTracks = (option) => {
    setFormData((prevData) => ({
      ...prevData,
      tracks: option,
    }));

    setIsOpenTrack(false); // Close dropdown after selection
  };

  const tracks = [
    "Values",
    "Dance",
    "Fitness",
    "Mindfulness",
    "Music",
    "Art",
    "Cooking",
    "Yoga",
  ];

  const handleSelectPartner = (option) => {
    setFormData((prevData) => ({
      ...prevData,
      partner: option,
    }));

    setIsOpenPartner(false); // Close dropdown after selection
  };

  const partner = [
    "partner 1",
    "partner 2",
    "partner 3",
    "partner 4",
    "partner 5",
    "partner 6",
    "partner 7",
  ];

  const handleSelectModule = (module) => {
    setSelectedModule(module);
    localStorage.setItem("selectedModule", JSON.stringify(module));

    setFormData((prevData) => ({
      ...prevData,
      module: module.id,
      moduleName: module.name,
    }));

    setChallengeData((prevData) => ({
      ...prevData,
      module: module.id,
    }));

    setIsOpenModule(false);
  };

  const module = [
    "module 1",
    "module 2",
    "module 3",
    "module 4",
    "module 5",
    "module 6",
    "module 7",
  ];

  const handleOpenLearningVideo = () => {
    setIsSectionVisible(false);
    setIsSection2Visible(true);
  };

  const handleOpenChallange = () => {
    setIsSectionVisible(false);
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

  const [loading, setLoading] = useState(false);

  const handleViewPopup = () => setShowPopup(true);
  const handleClosePopup = () => {
    setShowPopup(false);
    setChallengeData(initialChallangeData);
    setFormData(initialModuleData);
    settime({ duration: 0 }); // Reset time state
    setIsSectionVisible(true);
    setIsSection2Visible(false);
    setIsSection3Visible(false);
    setisCreatedModuleVisible(false);
    setIsOpenTrack(false);
    setFileProfile("Upload Cover Photo");
    setSelectedContent(null);
    setIsChallengeSelected(false);
    setModules([]);
    setChallenges([]);
  };

  const handleEditTrack = (track) => {
    setEditTrack(track);
  };

  const handelCancelTrack = (track) => {
    setEditTrack(track);
  };

  const handleModuleEdit = (module) => {
    setEditModule(module);
  };

  const handleModuleCancel = (module) => {
    setEditModule(module);
  };

  const adjustTime = (change) => {
    settime((prevData) => {
      // Extract current hours and minutes
      const prevDuration = prevData.duration || "0h 00 min";
      const match = prevDuration.match(/(\d+)h (\d+) min/);
      let hours = match ? parseInt(match[1], 10) : 0;
      let minutes = match ? parseInt(match[2], 10) : 0;

      // Calculate new duration
      let totalMinutes = hours * 60 + minutes + change;
      if (totalMinutes < 0) totalMinutes = 0; // Prevent negative time

      // Convert back to hours and minutes
      hours = Math.floor(totalMinutes / 60);
      minutes = totalMinutes % 60;

      const newDuration = `${hours}h ${minutes
        .toString()
        .padStart(2, "0")} min`;

      setChallengeData((prevChallengeData) => ({
        ...prevChallengeData,
        duration: newDuration,
      }));

      return { duration: newDuration };
    });
  };

  const handleDurationChange = (e) => {
    const value = e.target.value.replace(" min", "").replace("h", "").trim();
    const parts = value.split(" ");

    let hours = parseInt(parts[0], 10) || 0;
    let minutes = parseInt(parts[1], 10) || 0;

    const newDuration = `${hours}h ${minutes.toString().padStart(2, "0")} min`;

    settime({ duration: newDuration });
    setChallengeData((prevChallengeData) => ({
      ...prevChallengeData,
      duration: newDuration,
    }));
  };

  const handleAddModule = () => {
    if (!formData.moduleName) {
      setisCreatedModuleVisible(true);
      setIsSection2Visible(false);
      return;
    }

    const trackValue = modules[0]?.tracks || formData.tracks;
    const newModule = {
      ...formData,
      tracks: trackValue,
      tracks: trackValue,
      uniqueUploadId: generateUniqueId(),
    };

    if (editingIndex !== null) {
      const updatedModules = [...modules];
      updatedModules[editingIndex] = newModule;
      setModules(updatedModules);
      setEditingIndex(null);
    } else {
      setModules([...modules, newModule]);
    }

    setFormData({
      ...initialModuleData,
      uniqueUploadId: generateUniqueId(),
      tracks: trackValue,
    });
    setIsSection2Visible(false);
    setisCreatedModuleVisible(true);
  };

  const handleAddModulefromavilable = () => {
    if (!formData.moduleName) {
      dispatch(
        showNotification("Title is required to create Module.", "error")
      );
      return;
    }

    const trackValue = modules[0]?.tracks || formData.tracks;
    const newModule = {
      ...formData,
      tracks: trackValue,
      uniqueUploadId: generateUniqueId(),
    };

    const updatedModules =
      editingIndex !== null
        ? [
            ...modules.slice(0, editingIndex),
            newModule,
            ...modules.slice(editingIndex + 1),
          ]
        : [...modules, newModule];

    setModules(updatedModules);
    setFormData({
      ...initialModuleData,
      uniqueUploadId: generateUniqueId(),
      tracks: trackValue,
    });
    setIsSection2Visible(true);
    setisCreatedModuleVisible(false);
    setEditingIndex(null);
  };

  const handleDeleteModule = (index) => {
    setModuleToDelete(index);
    setShowDeleteModal(true);
  };

  const confirmDeleteModule = () => {
    if (moduleToDelete !== null) {
      setModules(modules.filter((_, i) => i !== moduleToDelete));
      setModuleToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleAddModulefromavilablenew = () => {
    setIsSection2Visible(true);
    setisCreatedModuleVisible(false);
  };

  const handleAddChallenge = () => {
    if (!challengeData.challengeName) {
      dispatch(showNotification("Challenge Name is required.", "error"));
      return;
    }

    const newChallenge = {
      ...challengeData,
      uniChallengeId: generateUniqueId(),
      module: formData.module, // This comes from the dropdown selection
    };

    // Rest of your existing challenge creation logic...
    if (editingChallengeIndex !== null) {
      const updatedChallenges = [...challenges];
      updatedChallenges[editingChallengeIndex] = newChallenge;
      setChallenges(updatedChallenges);
      setEditingChallengeIndex(null);
      settime({ duration: 0 });
    } else {
      setChallenges([...challenges, newChallenge]);
    }

    setChallengeData({
      ...initialChallangeData,
      uniChallengeId: generateUniqueId(),
    });
    settime({ duration: "" });
    setIsSection3Visible(true);
  };

  const handleAddChallengeWithout = () => {
    if (!challengeData.challengeName) {
      setIsSection3Visible(false);
      setisCreatedContentVisible(true);
      return;
    }
    const newChallenge = {
      ...challengeData,
      uniChallengeId: generateUniqueId(),
    };

    if (editingChallengeIndex !== null) {
      const updatedChallenges = [...challenges];
      updatedChallenges[editingChallengeIndex] = newChallenge;
      setChallenges(updatedChallenges);
      setEditingChallengeIndex(null);
      settime({
        duration: 0,
      });
    } else {
      setChallenges([...challenges, newChallenge]);
    }

    // Reset both challengeData and time
    setChallengeData({
      ...initialChallangeData,
      uniChallengeId: generateUniqueId(),
    });
    settime({ duration: "" }); // Reset duration
    setIsSection3Visible(false);
    setisCreatedContentVisible(true);
  };

  const handleEditChallenge = (index) => {
    setChallengeData(challenges[index]);
    setEditingChallengeIndex(index);
    setIsSection3Visible(true);
    setisCreatedContentVisible(false);
  };

  const handleAddChallengefromavilablenew = () => {
    setIsSection3Visible(true);
    setisCreatedContentVisible(false);
  };

  const handleRemoveFile = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: null, // Reset the specific field to null
    }));
  };
  const handleRemoveChaFile = (field) => {
    setChallengeData((prev) => ({
      ...prev,
      [field]: null, // Reset the specific field to null
    }));
  };

  const handleDeleteChallenge = (index) => {
    setChallengeToDelete(index);
    setShowChallengeDeleteModal(true);
  };

  const confirmDeleteChallenge = () => {
    if (challengeToDelete !== null) {
      setChallenges(challenges.filter((_, i) => i !== challengeToDelete));
      setChallengeToDelete(null);
      setShowChallengeDeleteModal(false);
    }
  };

  const handleSubmitChallange = () => {
    setShowChallengeSubmitConfirmation(true);
  };

  const handleSave = async () => {
    const selectedModule = JSON.parse(localStorage.getItem("selectedModule"));

    if (!selectedModule?.id) {
      dispatch(showNotification("No module selected", "error"));
      return;
    }

    setLoadingLink(true);
    setShowChallengeSubmitConfirmation(false);

    try {
      for (const challenge of challenges) {
        const formData = new FormData();

        // Required fields
        formData.append(
          "uniChallengeId",
          challenge.uniChallengeId || generateUniqueId()
        );
        formData.append("challengeName", challenge.challengeName || "");
        formData.append("module", selectedModule.id);
        formData.append(
          "challenge_Description",
          challenge.challenge_Description || ""
        );

        // Use the uploadedById from the selected module
        formData.append("uploaded_by", selectedModule.uploadedById);

        // Optional fields with defaults
        formData.append("duration", challenge.duration || "0h 00 min");
        formData.append(
          "challenge_benefits",
          challenge.challenge_benefits || ""
        );
        formData.append(
          "difficulty_Level",
          challenge.difficulty_Level || "Medium"
        );

        // File upload
        if (challenge.video_or_image) {
          formData.append("video_or_image", challenge.video_or_image);
        }

        const response = await dispatch(createchallenge(formData));

        if (!response?.success) {
          console.error("API Error Response:", response);
          throw new Error(response?.message || "Challenge submission failed");
        }
      }

      dispatch(
        showNotification("Challenges submitted successfully!", "success")
      );

      handleClosePopup();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Submission error:", error);
      dispatch(showNotification(error.message, "error"));
    } finally {
      setLoadingLink(false);
    }
  };

  const handleCancelConfirmation = () => {
    setShowCancelConfirmation(true);
  };

  const confirmCancel = () => {
    // Clear all data and close the modal
    setShowCancelConfirmation(false);
    handleClosePopup(); // Your existing function that resets everything
  };

  const rejectCancel = () => {
    setShowCancelConfirmation(false);
    // User chose not to cancel, so we stay in the current state
  };

  const handleConfirmSubmitModule = async () => {
    setShowSubmitConfirmation(true);
  };

  const handleCreateContent = async () => {
    // Before the for-loop in handleSave()
    setShowSubmitConfirmation(false);
    setIsSection2Visible(false);
    setisCreatedModuleVisible(false);
    setLoadingLink(true);
    setIsSection2Visible(false);
    setisCreatedModuleVisible(false);
    setLoadingLink(true);
    let progressCount = 0;
    const totalSteps = modules.length;

    const smoothProgressUpdate = (target) => {
      let current = progress;
      const interval = setInterval(() => {
        if (current < target) {
          current += 1;
          setProgress(current);
        } else {
          clearInterval(interval);
        }
      }, 50);
    };

    try {
      for (let i = 0; i < modules.length; i++) {
        const payload = modules[i];
        const response = await dispatch(createContent(payload));

        if (response?._id) {
          progressCount++;
          smoothProgressUpdate((progressCount / totalSteps) * 100);
        } else {
          dispatch(showNotification("Failed to upload module.", "error"));
          setLoadingLink(false);
          return;
        }
      }

      dispatch(
        showNotification(
          "Your Modules have been successfully submitted for approval.",
          "success"
        )
      );
      setShowPopup(false);
      localStorage.setItem("activeComponent", "ContentManagement");
      handleClosePopup?.();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      setShowSuccessModal(true);
    } catch (error) {
      dispatch(
        showNotification("An error occurred during submission.", "error")
      );
      setLoadingLink(false);
    }
  };

  const handleChallengeCancelConfirmation = () => {
    if (challenges.length > 0) {
      setShowChallengeCancelConfirmation(true);
    } else {
      handleClosePopup();
    }
  };

  const confirmChallengeCancel = () => {
    setShowChallengeCancelConfirmation(false);
    handleClosePopup();
  };

  const handleChallengeSuccessOK = () => {
    setShowChallengeSuccess(false);
    // Reset to initial state but keep popup open
    setIsSectionVisible(true);
    setIsSection3Visible(false);
    setisCreatedContentVisible(false);
    setChallenges([]);
    setChallengeData(initialChallangeData);
  };

  return (
    <>
      <div onClick={handleViewPopup}>
        <svg
          width="46"
          height="46"
          viewBox="0 0 46 46"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_b_4249_1934)">
            <rect
              x="0.1"
              y="0.1"
              width="45.8"
              height="45.8"
              rx="11.9"
              stroke="#F48567"
              stroke-width="0.2"
            />
            <path
              d="M21.75 28V17.8125L18.5 21.0625L16.75 19.25L23 13L29.25 19.25L27.5 21.0625L24.25 17.8125V28H21.75ZM15.5 33C14.8125 33 14.2242 32.7554 13.735 32.2663C13.2458 31.7771 13.0008 31.1883 13 30.5V26.75H15.5V30.5H30.5V26.75H33V30.5C33 31.1875 32.7554 31.7763 32.2663 32.2663C31.7771 32.7563 31.1883 33.0008 30.5 33H15.5Z"
              fill="#F48567"
            />
          </g>
          <defs>
            <filter
              id="filter0_b_4249_1934"
              x="-4"
              y="-4"
              width="54"
              height="54"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feGaussianBlur in="BackgroundImageFix" stdDeviation="2" />
              <feComposite
                in2="SourceAlpha"
                operator="in"
                result="effect1_backgroundBlur_4249_1934"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_backgroundBlur_4249_1934"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div
            className={`rounded-2xl border border-[#FFFFFF59]  shadow-[0_1px_6px_rgba(230,230,230,0.35)] focus:outline-none-lg w-[460px] overflow-y-scroll max-w-3xl p-8 relative flex flex-col max-h-[700px]   ${
              darkMode ? "bg-[#1E1E1E] text-white" : "bg-[#fff] text-dark"
            }`}
            onClick={(e) => e.stopPropagation()} // Prevent closing popup on click inside
          >
            <div className="flex justify-between items-center">
              {isSectionVisible && (
                <h2 className="text-2xl mb-6 ">Upload Content</h2>
              )}
              {isSection2Visible && (
                <h2 className="text-2xl mb-6 ">Track: {formData.tracks}</h2>
              )}
              {isCreatedModuleVisible && (
                <h2 className="text-2xl mb-6 ">Track: {formData.tracks}</h2>
              )}
              {isSection3Visible && (
                <h2 className="text-2xl mb-6 ">Track: {formData.tracks}</h2>
              )}
              {isCreatedContentVisible && (
                <h2 className="text-2xl mb-6 ">Track: {formData.tracks}</h2>
              )}
              {!isLoadingLink && (
                <svg
                  className="cursor-pointer mb-5"
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
              )}
            </div>

            <div>
              {/* First Section */}
              <div>
                {isSectionVisible && (
                  <div>
                    {!isChallengeSelected && (
                      <div className="flex flex-col">
                        <div className="flex flex-col w-full">
                          <label className=" mb-1">
                            Choose a Track{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="dropdown-container mb-3">
                            <div
                              className={`dropdown-btn flex p-2 rounded-md ${
                                darkMode ? "bg-[#333333]" : "bg-gray-200"
                              } focus:outline-none mb-2 cursor-pointer w-[380px] h-[40px]`}
                              onClick={toggleTrackOpen}
                            >
                              <span className="text-[13px]">
                                {formData.tracks || "Track Name"}
                              </span>
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
                            {isOpenTrack && (
                              <div
                                className={`dropdown-menu flex flex-col items-center w-full p-2 rounded-md  focus:outline-none mb-3 ${
                                  darkMode ? "bg-[#333333]" : "bg-gray-200"
                                } `}
                              >
                                {tracks.map((track, index) => (
                                  <div
                                    key={index}
                                    className={`dropdown-item flex flex-col w-full p-2  rounded-md mb-2 ${
                                      darkMode ? "bg-[#333333]" : "bg-gray-200 "
                                    } `}
                                  >
                                    <div
                                      className="flex items-center gap-2 justify-between cursor-pointer"
                                      onClick={() => handleSelectTracks(track)}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-full border-2 border-[#F48567] flex items-center justify-center">
                                          {formData.tracks === track && (
                                            <span className="w-2 h-2 rounded-full bg-[#F48567]" />
                                          )}
                                        </span>
                                        <div
                                          className={`text-sm text-white${
                                            darkMode
                                              ? "text-white "
                                              : "text-black"
                                          }`}
                                        >
                                          {track}
                                        </div>
                                      </div>

                                      <Pencil
                                        size={16}
                                        onClick={(e) => {
                                          e.stopPropagation(); // prevents parent click
                                          handleEditTrack(track);
                                        }}
                                      />
                                    </div>

                                    {/* Expanded Edit Section */}
                                    {editTrack === track && (
                                      <div className="mt-2 flex flex-col gap-2 text-white ">
                                        <input
                                          type="text"
                                          placeholder="Track Name"
                                          className={`p-2 rounded-md border border-gray-600 focus:outline-none bg-inherit placeholder-gray-400 text-sm ${
                                            darkMode
                                              ? "bg-[#333333] text-white "
                                              : "bg-white text-black "
                                          }`}
                                          value={formData.tracks}
                                          onChange={(e) =>
                                            setFormData({
                                              ...formData,
                                              tracks: e.target.value,
                                            })
                                          }
                                        />

                                        <label
                                          className={`flex items-center justify-between p-2 cursor-pointer w-full  rounded-md border border-gray-600 focus:outline-non ${
                                            darkMode
                                              ? "bg-inherit text-white"
                                              : "bg-inherit text-black"
                                          }`}
                                        >
                                          <span className="text-sm  text-gray-400">
                                            Uploaded Track Photo
                                          </span>
                                          <Upload size={16} />
                                          <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) =>
                                              setFormData({
                                                ...formData,
                                                trackPhoto: e.target.files[0],
                                              })
                                            }
                                          />
                                        </label>

                                        <div className="flex gap-2 justify-between mt-2">
                                          <button
                                            className="bg-[#F48567] px-4 py-1 rounded-md text-sm w-[145px] text-black"
                                            onClick={() => {
                                              // handle save logic here
                                              setEditTrack(null);
                                            }}
                                          >
                                            Save
                                          </button>
                                          <button
                                            className="bg-[#C7C7C7] px-4 py-1 rounded-md text-sm w-[145px] text-black"
                                            onClick={handelCancelTrack}
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col w-full">
                          <label className=" mb-1">
                            Choose a partner{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="dropdown-container mb-3">
                            <div
                              className={`dropdown-btn flex p-2 rounded-md ${
                                darkMode ? "bg-[#333333]" : "bg-gray-200"
                              } focus:outline-none mb-2 cursor-pointer w-[380px] h-[40px]`}
                              onClick={togglePartnerOpen}
                            >
                              <span className="text-[13px]">
                                {formData.partner || "Partner Name"}
                              </span>
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
                            {isOpenPartner && (
                              <div
                                className={`dropdown-menu flex flex-col items-center w-full p-2 rounded-md  focus:outline-none mb-3 ${
                                  darkMode ? "bg-[#333333]" : "bg-gray-200"
                                } `}
                              >
                                {partner.map((partner, index) => (
                                  <div
                                    key={index}
                                    className="dropdown-item flex items-start w-full p-2  cursor-pointer"
                                    onClick={() => handleSelectPartner(partner)}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="w-4 h-4 rounded-full border-2 border-[#F48567] flex items-center justify-center">
                                        {formData.partner === partner && (
                                          <span className="w-2 h-2 rounded-full bg-[#F48567]" />
                                        )}
                                      </span>
                                      <span
                                        className={`text-sm text-white${
                                          darkMode
                                            ? "text-white "
                                            : "text-black"
                                        }`}
                                      >
                                        {partner}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col w-full">
                          <label className="mb-1">
                            Choose a Module{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="dropdown-container mb-3">
                            <div
                              className={`dropdown-btn flex p-2 rounded-md ${
                                darkMode ? "bg-[#333333]" : "bg-gray-200"
                              } focus:outline-none mb-2 cursor-pointer w-[380px] h-[40px]`}
                              onClick={toggleModuleOpen}
                            >
                              <span className="text-[13px]">
                                {formData.moduleName || "Module Name"}
                              </span>
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

                            {isOpenModule && (
                              <div
                                className={`dropdown-menu flex flex-col items-center w-full p-2 rounded-md focus:outline-none mb-3 ${
                                  darkMode ? "bg-[#333333]" : "bg-gray-200"
                                }`}
                              >
                                {modulesFromStorage.map((module, index) => (
                                  <div
                                    key={index}
                                    className="dropdown-item flex items-start w-full p-2 cursor-pointer"
                                    onClick={() => handleSelectModule(module)}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="w-4 h-4 rounded-full border-2 border-[#F48567] flex items-center justify-center">
                                        {formData.module === module.id && (
                                          <span className="w-2 h-2 rounded-full bg-[#F48567]" />
                                        )}
                                      </span>
                                      <span
                                        className={`text-sm ${
                                          darkMode ? "text-white" : "text-black"
                                        }`}
                                      >
                                        {module.name}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-row justify-between items-center w-full">
                      <button
                        type="submit"
                        className={`px-4 py-2 w-[180px] h-[40px] rounded-lg focus:outline-none-xl text-[#F48567]   ${
                          formData.partner && formData.tracks && formData.module
                            ? " cursor-pointer"
                            : " cursor-not-allowed"
                        } ${darkMode ? "bg-[#333333]" : "bg-gray-200"}
                           
                      }`}
                        onClick={handleOpenLearningVideo}
                        disabled={!formData.partner}
                      >
                        <div className="flex  justify-between items-center">
                          <span>Learning Video</span>
                          <SquarePlus />
                        </div>
                      </button>
                      <button
                        type="submit"
                        className={`px-4 py-2 w-[180px] h-[40px] rounded-lg focus:outline-none-xl text-[#F48567]   ${
                          formData.partner
                            ? " cursor-pointer"
                            : " cursor-not-allowed"
                        } ${darkMode ? "bg-[#333333]" : "bg-gray-200"}
                           
                      }`}
                        onClick={handleOpenChallange}
                        disabled={!formData.partner}
                      >
                        <div className="flex  justify-between items-center">
                          <span>Challenge</span>
                          <SquarePlus />
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                {isSection2Visible && (
                  <div>
                    {true && (
                      <section>
                        <div className="flex flex-col">
                          <button
                            type="button"
                            className=" mb-3 px-4 py-2 rounded-xl border border-gray-600 focus:outline-none-xl text-[#F48567] flex items-center justify-center"
                            onClick={handleAddModulefromavilable}
                          >
                            Add Module
                          </button>
                        </div>

                        {/* Form for adding/editing module */}
                        <label className="mb-5">
                          Module {modules.length + 1}
                        </label>

                        <div className="flex mt-3 flex-col">
                          <label className=" mb-1">Title</label>
                          <input
                            name="moduleName"
                            required
                            type="text"
                            placeholder="Title"
                            className="p-2   rounded-xl border border-gray-600 focus:outline-none"
                            value={formData.moduleName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                moduleName: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="flex flex-col mt-3">
                          <label className=" mb-1">Description</label>
                          <textarea
                            name="description"
                            required
                            placeholder="Enter Description"
                            className="p-2   rounded-xl border border-gray-600 focus:outline-none"
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                          />
                        </div>

                        {/* Upload sections */}
                        <div className="flex flex-col w-full  mt-3">
                          <label className=" mb-1">
                            Upload Cover Photo (Optional)
                          </label>
                          <label className="p-2 pl-4 pr-4   rounded-xl border border-gray-600 focus:outline-none flex items-center justify-between cursor-pointer">
                            <div>
                              {formData.cover_Photo?.name ||
                                "Upload Cover Photo"}
                            </div>
                            <div className="flex items-center">
                              <input
                                name="cover_Photo"
                                type="file"
                                className="hidden"
                                onChange={(e) =>
                                  handleFileChange(e, "cover_Photo")
                                }
                              />
                              {formData.cover_Photo ? (
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 18 18"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent file input dialog from opening
                                    handleRemoveFile("cover_Photo");
                                  }}
                                  className="cursor-pointer ml-2"
                                >
                                  <path
                                    d="M9 0.25C4.125 0.25 0.25 4.125 0.25 9C0.25 13.875 4.125 17.75 9 17.75C13.875 17.75 17.75 13.875 17.75 9C17.75 4.125 13.875 0.25 9 0.25ZM12.375 13.375L9 10L5.625 13.375L4.625 12.375L8 9L4.625 5.625L5.625 4.625L9 8L12.375 4.625L13.375 5.625L10 9L13.375 12.375L12.375 13.375Z"
                                    fill="#DD441B"
                                  />
                                </svg>
                              ) : (
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
                              )}
                            </div>
                          </label>
                        </div>

                        <div className="flex flex-col w-full  mt-3">
                          <label className=" mb-1">
                            Upload Module Video (Optional)
                          </label>
                          <label className="p-2 pl-4 pr-4   rounded-xl border border-gray-600 focus:outline-none flex items-center justify-between cursor-pointer">
                            <div>
                              {formData.videoFile_introduction?.name ||
                                "Upload Module Video"}
                            </div>
                            <div className="flex items-center">
                              <input
                                name="videoFile_introduction"
                                type="file"
                                className="hidden"
                                onChange={(e) =>
                                  handleFileChange(e, "videoFile_introduction")
                                }
                              />
                              {formData.videoFile_introduction ? (
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 18 18"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent file input dialog from opening
                                    handleRemoveFile("videoFile_introduction");
                                  }}
                                  className="cursor-pointer ml-2"
                                >
                                  <path
                                    d="M9 0.25C4.125 0.25 0.25 4.125 0.25 9C0.25 13.875 4.125 17.75 9 17.75C13.875 17.75 17.75 13.875 17.75 9C17.75 4.125 13.875 0.25 9 0.25ZM12.375 13.375L9 10L5.625 13.375L4.625 12.375L8 9L4.625 5.625L5.625 4.625L9 8L12.375 4.625L13.375 5.625L10 9L13.375 12.375L12.375 13.375Z"
                                    fill="#DD441B"
                                  />
                                </svg>
                              ) : (
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
                              )}
                            </div>
                          </label>
                        </div>

                        <div className="flex flex-col w-full  mt-3">
                          <label className=" mb-1">
                            Upload Explanatory Video (Optional)
                          </label>
                          <label className="p-2 pl-4 pr-4   rounded-xl border border-gray-600 focus:outline-none flex items-center justify-between cursor-pointer">
                            <div>
                              {formData.videoFile_description?.name ||
                                "Upload Explanatory Video"}
                            </div>
                            <div className="flex items-center">
                              <input
                                name="videoFile_description"
                                type="file"
                                className="hidden"
                                onChange={(e) =>
                                  handleFileChange(e, "videoFile_description")
                                }
                              />
                              {formData.videoFile_description ? (
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 18 18"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent file input dialog from opening
                                    handleRemoveFile("videoFile_description");
                                  }}
                                  className="cursor-pointer ml-2"
                                >
                                  <path
                                    d="M9 0.25C4.125 0.25 0.25 4.125 0.25 9C0.25 13.875 4.125 17.75 9 17.75C13.875 17.75 17.75 13.875 17.75 9C17.75 4.125 13.875 0.25 9 0.25ZM12.375 13.375L9 10L5.625 13.375L4.625 12.375L8 9L4.625 5.625L5.625 4.625L9 8L12.375 4.625L13.375 5.625L10 9L13.375 12.375L12.375 13.375Z"
                                    fill="#DD441B"
                                  />
                                </svg>
                              ) : (
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
                              )}
                            </div>
                          </label>
                        </div>

                        <div className="flex gap-4 mt-4 w-full">
                          <div className="flex flex-col w-full">
                            <button
                              type="button"
                              className="bg-[#F48567] px-4 py-2 rounded-xl border border-gray-600 focus:outline-none-xl text-[#000] flex items-center justify-center"
                              onClick={handleAddModule}
                              disabled={loading}
                            >
                              {loading ? (
                                <Spin size="small" />
                              ) : editingIndex !== null ? (
                                "Update Module"
                              ) : (
                                "Save"
                              )}
                            </button>
                          </div>

                          <div className="flex flex-col w-full">
                            <button
                              onClick={handleClosePopup}
                              className="bg-[#C7C7C7] px-4 py-2 rounded-xl border border-gray-600 focus:outline-none-xl text-[#000]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </section>
                    )}
                  </div>
                )}

                {isCreatedModuleVisible && (
                  <section className="flex flex-col space-y-4">
                    <button
                      type="button"
                      className=" px-4 py-2 rounded-xl border border-gray-600 focus:outline-none-xl text-[#F48567] flex items-center justify-center"
                      onClick={handleAddModulefromavilablenew}
                    >
                      {editingIndex !== null ? "" : "Add Module"}
                    </button>

                    {modules.map((module, index) => {
                      const coverPhotoURL = module.cover_Photo
                        ? URL.createObjectURL(module.cover_Photo)
                        : null;
                      const videoIntroURL = module.videoFile_introduction
                        ? URL.createObjectURL(module.videoFile_introduction)
                        : null;
                      const videoDescURL = module.videoFile_description
                        ? URL.createObjectURL(module.videoFile_description)
                        : null;

                      return (
                        <div className="">
                          <label className=" mb-1">Module {index + 1}</label>
                          <div className="flex justify-between items-start gap-2">
                            <div
                              key={module.uniqueUploadId}
                              className="w-full  p-2 rounded-xl border border-gray-600 focus:outline-none shadow-md"
                            >
                              {/* Module Header with Dropdown Toggle */}
                              <div
                                className="flex justify-between items-center cursor-pointer"
                                onClick={() =>
                                  setExpandedIndex(
                                    expandedIndex === index ? null : index
                                  )
                                }
                              >
                                <h3 className="">Module {index + 1}</h3>
                                <span className="text-gray-400">
                                  {expandedIndex === index}
                                </span>

                                <svg
                                  width="12"
                                  height="7"
                                  viewBox="0 0 12 7"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className={`transition-transform duration-300 ${
                                    expandedIndex === index ? "rotate-180" : ""
                                  }`}
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M5.15828 0.536211L0.444115 5.25038L1.62245 6.42871L5.74745 2.30371L9.87245 6.42871L11.0508 5.25038L6.33662 0.536211C6.18034 0.379985 5.96842 0.292222 5.74745 0.292222C5.52648 0.292222 5.31455 0.379985 5.15828 0.536211Z"
                                    fill="#C7C7C7"
                                  />
                                </svg>
                              </div>

                              {/* Dropdown Content */}
                              {expandedIndex === index && (
                                <div className="mt-2 p-2 ">
                                  <div className="flex justify-between">
                                    <span>
                                      <p className="text-sm">Title</p>
                                      <p className="text-sm mt-2">
                                        {module.moduleName}
                                      </p>
                                    </span>
                                    <svg
                                      onClick={() => {
                                        setFormData(module);
                                        setEditingIndex(index);
                                        setIsSection2Visible(true); // Show edit section
                                        setisCreatedModuleVisible(false); // Hide available modules
                                      }}
                                      className="cursor-pointer"
                                      width="21"
                                      height="20"
                                      viewBox="0 0 21 20"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        opacity="0.16"
                                        d="M4.91732 13.3333L4.08398 16.6667L7.41732 15.8333L15.7507 7.5L13.2507 5L4.91732 13.3333Z"
                                        fill="#C7C7C7"
                                      />
                                      <path
                                        d="M13.2507 5.00007L15.7507 7.50007M11.584 16.6667H18.2507M4.91732 13.3334L4.08398 16.6667L7.41732 15.8334L17.0723 6.17841C17.3848 5.86586 17.5603 5.44201 17.5603 5.00007C17.5603 4.55813 17.3848 4.13429 17.0723 3.82174L16.929 3.67841C16.6164 3.36596 16.1926 3.19043 15.7507 3.19043C15.3087 3.19043 14.8849 3.36596 14.5723 3.67841L4.91732 13.3334Z"
                                        stroke="#C7C7C7"
                                        stroke-width="1.25"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                  </div>
                                  <div className="mt-4">
                                    <p className="text-sm">Description</p>
                                    <p className="text-sm mt-2">
                                      {module.description}
                                    </p>
                                  </div>
                                  <section className="flex justify-between w-[90%] mt-4">
                                    <div>
                                      <p className="text-sm">Cover Photo</p>
                                      {coverPhotoURL && (
                                        <img
                                          src={coverPhotoURL}
                                          alt="Cover"
                                          className="w-20 h-20 object-cover rounded-xl border border-gray-600 focus:outline-none-md mt-2"
                                        />
                                      )}
                                    </div>

                                    <div>
                                      <p className="text-sm">Module Video:</p>
                                      {videoIntroURL && (
                                        <video
                                          src={videoIntroURL}
                                          controls
                                          className="w-20 h-20 focus:outline-none-md object-cover rounded-xl border border-gray-600 focus:outline-none-md mt-2"
                                        />
                                      )}
                                    </div>
                                    <div>
                                      <p className="text-sm">
                                        Explanatory Video:
                                      </p>
                                      {videoDescURL && (
                                        <video
                                          src={videoDescURL}
                                          controls
                                          className="w-20 h-20  focus:outline-none-md object-cover rounded-xl border border-gray-600 focus:outline-none-md mt-2"
                                        />
                                      )}
                                    </div>
                                  </section>
                                </div>
                              )}
                            </div>
                            <svg
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteModule(index);
                              }}
                              className="cursor-pointer mt-3"
                              width="17"
                              height="18"
                              viewBox="0 0 17 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7.3125 2.8125V3.125H10.4375V2.8125C10.4375 2.3981 10.2729 2.00067 9.97985 1.70765C9.68683 1.41462 9.2894 1.25 8.875 1.25C8.4606 1.25 8.06317 1.41462 7.77015 1.70765C7.47712 2.00067 7.3125 2.3981 7.3125 2.8125ZM6.0625 3.125V2.8125C6.0625 2.06658 6.35882 1.35121 6.88626 0.823762C7.41371 0.296316 8.12908 0 8.875 0C9.62092 0 10.3363 0.296316 10.8637 0.823762C11.3912 1.35121 11.6875 2.06658 11.6875 2.8125V3.125H16.375C16.5408 3.125 16.6997 3.19085 16.8169 3.30806C16.9342 3.42527 17 3.58424 17 3.75C17 3.91576 16.9342 4.07473 16.8169 4.19194C16.6997 4.30915 16.5408 4.375 16.375 4.375H15.4325L14.25 14.73C14.1628 15.4926 13.798 16.1965 13.2251 16.7073C12.6522 17.2182 11.9113 17.5004 11.1437 17.5H6.60625C5.83866 17.5004 5.09779 17.2182 4.52491 16.7073C3.95202 16.1965 3.5872 15.4926 3.5 14.73L2.3175 4.375H1.375C1.20924 4.375 1.05027 4.30915 0.933058 4.19194C0.815848 4.07473 0.75 3.91576 0.75 3.75C0.75 3.58424 0.815848 3.42527 0.933058 3.30806C1.05027 3.19085 1.20924 3.125 1.375 3.125H6.0625ZM7.625 7.1875C7.625 7.02174 7.55915 6.86277 7.44194 6.74556C7.32473 6.62835 7.16576 6.5625 7 6.5625C6.83424 6.5625 6.67527 6.62835 6.55806 6.74556C6.44085 6.86277 6.375 7.02174 6.375 7.1875V13.4375C6.375 13.6033 6.44085 13.7622 6.55806 13.8794C6.67527 13.9967 6.83424 14.0625 7 14.0625C7.16576 14.0625 7.32473 13.9967 7.44194 13.8794C7.55915 13.7622 7.625 13.6033 7.625 13.4375V7.1875ZM10.75 6.5625C10.5842 6.5625 10.4253 6.62835 10.3081 6.74556C10.1908 6.86277 10.125 7.02174 10.125 7.1875V13.4375C10.125 13.6033 10.1908 13.7622 10.3081 13.8794C10.4253 13.9967 10.5842 14.0625 10.75 14.0625C10.9158 14.0625 11.0747 13.9967 11.1919 13.8794C11.3092 13.7622 11.375 13.6033 11.375 13.4375V7.1875C11.375 7.02174 11.3092 6.86277 11.1919 6.74556C11.0747 6.62835 10.9158 6.5625 10.75 6.5625Z"
                                fill="#DD441B"
                              />
                            </svg>
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex gap-4 mt-4 w-full">
                      <div className="flex flex-col w-full">
                        <button
                          type="button"
                          className="bg-[#F48567] px-4 py-2 rounded-xl border border-gray-600 focus:outline-none-xl text-[#000] flex items-center justify-center"
                          onClick={handleConfirmSubmitModule}
                        >
                          Submit
                        </button>
                      </div>

                      <div className="flex flex-col w-full">
                        <button
                          onClick={handleCancelConfirmation}
                          className="bg-[#C7C7C7] px-4 py-2 rounded-xl border border-gray-600 focus:outline-none-xl text-[#000]"
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
                      <button
                        type="button"
                        className=" px-4 py-2 mb-3 rounded-xl border border-gray-600 focus:outline-none-xl text-[#F48567] flex items-center justify-center"
                        onClick={handleAddChallenge}
                      >
                        {editingIndex !== null ? "" : "Add Challenge"}
                      </button>
                    </div>

                    <label className="mb-5">
                      Challenge {challenges.length + 1}
                    </label>

                    <div className="flex mt-3 flex-col">
                      <label className=" mb-1">Challenge Name</label>
                      <input
                        name="challengeName"
                        required
                        type="text"
                        placeholder="Challenge Name"
                        className="p-2   rounded-xl border border-gray-600 focus:outline-none"
                        value={challengeData.challengeName}
                        onChange={(e) =>
                          setChallengeData({
                            ...challengeData,
                            challengeName: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex flex-col mt-2">
                      <label className=" mb-1">Description</label>
                      <textarea
                        name="challenge_Description"
                        required
                        type="text"
                        placeholder="How to do the challenge"
                        className="p-2   rounded-xl border border-gray-600 focus:outline-none"
                        value={challengeData.challenge_Description}
                        onChange={(e) =>
                          setChallengeData({
                            ...challengeData,
                            challenge_Description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-col mt-2">
                      <label className=" mb-1">Benefits</label>
                      <input
                        name="challenge_benefits"
                        required
                        type="text"
                        placeholder="Benefits"
                        className="p-2   rounded-xl border border-gray-600 focus:outline-none"
                        value={challengeData.challenge_benefits}
                        onChange={(e) =>
                          setChallengeData({
                            ...challengeData,
                            challenge_benefits: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-col mt-2">
                      <label className=" mb-1">Duration</label>
                      <div className="flex items-center space-x-2">
                        <input
                          name="duration"
                          required
                          type="text"
                          placeholder="3h 00 mn"
                          className="p-2   rounded-xl border border-gray-600 focus:outline-none w-full"
                          value={challengeData.duration || time.duration} // Correct format
                          onChange={handleDurationChange}
                        />
                        <div className="flex flex-col">
                          <button
                            type="button"
                            className="p-[6.5px]   rounded-xl border border-gray-600 focus:outline-none"
                            onClick={() => adjustTime(30)} // Add 30 min
                          >
                            <svg
                              width="11"
                              height="7"
                              viewBox="0 0 11 7"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.8925 0.295001L10.6067 5.00917L9.42833 6.1875L5.30333 2.0625L1.17833 6.1875L0 5.00917L4.71417 0.295001C4.87044 0.138774 5.08236 0.0510116 5.30333 0.0510116C5.5243 0.0510116 5.73623 0.138774 5.8925 0.295001Z"
                                fill="#C7C7C7"
                              />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="p-[6.5px]   rounded-xl border border-gray-600 focus:outline-none"
                            onClick={() => adjustTime(-30)} // Subtract 30 min
                          >
                            <svg
                              width="11"
                              height="7"
                              viewBox="0 0 11 7"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.8925 6.08L10.6067 1.36583L9.42833 0.1875L5.30333 4.3125L1.17833 0.1875L0 1.36583L4.71417 6.08C4.87044 6.23623 5.08236 6.32399 5.30333 6.32399C5.5243 6.32399 5.73623 6.23623 5.8925 6.08Z"
                                fill="#C7C7C7"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col mt-2">
                      <label className=" mb-1">Difficulty Level</label>
                      <select
                        name="difficulty_Level"
                        required
                        className="p-2   rounded-xl border border-gray-600 focus:outline-none"
                        value={challengeData.difficulty_Level}
                        onChange={(e) =>
                          setChallengeData({
                            ...challengeData,
                            difficulty_Level: e.target.value,
                          })
                        }
                      >
                        <option value="" disabled>
                          Select Difficulty
                        </option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div className="flex flex-col w-full mt-2">
                      <label className=" mb-1">Upload Photo or Video</label>
                      <label className="p-2 pl-4 pr-4   rounded-xl border border-gray-600 focus:outline-none flex items-center justify-between cursor-pointer">
                        <div>
                          {challengeData.video_or_image?.name ||
                            "Upload Photo or Video"}
                        </div>
                        <input
                          name="video_or_image"
                          type="file"
                          className="hidden"
                          onChange={(e) =>
                            handleVideoChange(e, "video_or_image")
                          }
                        />
                        {challengeData.video_or_image ? (
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent file input dialog from opening
                              handleRemoveChaFile("video_or_image");
                            }}
                            className="cursor-pointer ml-2"
                          >
                            <path
                              d="M9 0.25C4.125 0.25 0.25 4.125 0.25 9C0.25 13.875 4.125 17.75 9 17.75C13.875 17.75 17.75 13.875 17.75 9C17.75 4.125 13.875 0.25 9 0.25ZM12.375 13.375L9 10L5.625 13.375L4.625 12.375L8 9L4.625 5.625L5.625 4.625L9 8L12.375 4.625L13.375 5.625L10 9L13.375 12.375L12.375 13.375Z"
                              fill="#DD441B"
                            />
                          </svg>
                        ) : (
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
                        )}
                      </label>
                    </div>
                    <div className="flex gap-4 mt-6 w-full">
                      <div className="flex flex-col w-full">
                        <button
                          type="submit"
                          className="bg-[#F48567] px-4 py-2 rounded-xl border border-gray-600 focus:outline-none-xl text-[#000] flex items-center justify-center"
                          onClick={handleAddChallengeWithout}
                        >
                          Save
                        </button>
                      </div>

                      <div className="flex flex-col w-full">
                        <button
                          onClick={() => {
                            setisCreatedContentVisible(true);
                          }}
                          className="bg-[#C7C7C7] px-4 py-2 rounded-xl border border-gray-600 focus:outline-none-xl text-[#000]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </section>
                )}

                {isCreatedContentVisible && (
                  <section className="flex flex-col space-y-4">
                    <button
                      type="button"
                      className=" px-4 py-2 rounded-xl border border-gray-600 focus:outline-none-xl text-[#F48567] flex items-center justify-center"
                      onClick={handleAddChallengefromavilablenew}
                    >
                      {editingIndex !== null ? "" : "Add Challenge"}
                    </button>

                    {challenges.map((challenge, index) => {
                      const videoOrImageURL = challenge.video_or_image
                        ? URL.createObjectURL(challenge.video_or_image)
                        : null;

                      return (
                        <div className="">
                          <label className=" mb-1">Challenge {index + 1}</label>
                          <div className="flex justify-between items-start gap-2">
                            <div
                              key={challenge.uniqueUploadId}
                              className="w-full  p-2 rounded-xl border border-gray-600 focus:outline-none shadow-md"
                            >
                              {/* Module Header with Dropdown Toggle */}
                              <div
                                className="flex justify-between items-center cursor-pointer"
                                onClick={() =>
                                  setExpandedIndex(
                                    expandedIndex === index ? null : index
                                  )
                                }
                              >
                                <h3 className="">Challenge {index + 1}</h3>
                                <span className="text-gray-400">
                                  {expandedIndex === index}
                                </span>

                                <svg
                                  width="12"
                                  height="7"
                                  viewBox="0 0 12 7"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className={`transition-transform duration-300 ${
                                    expandedIndex === index ? "rotate-180" : ""
                                  }`}
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M5.15828 0.536211L0.444115 5.25038L1.62245 6.42871L5.74745 2.30371L9.87245 6.42871L11.0508 5.25038L6.33662 0.536211C6.18034 0.379985 5.96842 0.292222 5.74745 0.292222C5.52648 0.292222 5.31455 0.379985 5.15828 0.536211Z"
                                    fill="#C7C7C7"
                                  />
                                </svg>
                              </div>

                              {/* Dropdown Content */}
                              {expandedIndex === index && (
                                <div className="mt-2 p-2 rounded-xl ">
                                  <div className="flex justify-between">
                                    <span>
                                      <p className="text-sm">Challenge Name</p>
                                      <p className="text-sm mt-2">
                                        {challenge.challengeName}
                                      </p>
                                    </span>
                                    <svg
                                      onClick={() => {
                                        setFormData(module);
                                        handleEditChallenge(index);
                                        setIsSection3Visible(true); // Show edit section
                                        setisCreatedModuleVisible(false); // Hide available modules
                                      }}
                                      className="cursor-pointer"
                                      width="21"
                                      height="20"
                                      viewBox="0 0 21 20"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        opacity="0.16"
                                        d="M4.91732 13.3333L4.08398 16.6667L7.41732 15.8333L15.7507 7.5L13.2507 5L4.91732 13.3333Z"
                                        fill="#C7C7C7"
                                      />
                                      <path
                                        d="M13.2507 5.00007L15.7507 7.50007M11.584 16.6667H18.2507M4.91732 13.3334L4.08398 16.6667L7.41732 15.8334L17.0723 6.17841C17.3848 5.86586 17.5603 5.44201 17.5603 5.00007C17.5603 4.55813 17.3848 4.13429 17.0723 3.82174L16.929 3.67841C16.6164 3.36596 16.1926 3.19043 15.7507 3.19043C15.3087 3.19043 14.8849 3.36596 14.5723 3.67841L4.91732 13.3334Z"
                                        stroke="#C7C7C7"
                                        stroke-width="1.25"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                  </div>
                                  <div className="mt-4">
                                    <p className="text-sm">Description</p>
                                    <p className="text-sm mt-2">
                                      {challenge.challenge_Description}
                                    </p>
                                  </div>
                                  <div className="mt-4">
                                    <p className="text-sm">Benefits</p>
                                    <p className="text-sm mt-2">
                                      {challenge.challenge_benefits}
                                    </p>
                                  </div>
                                  <div className="mt-4">
                                    <p className="text-sm">Duration</p>
                                    <p className="text-sm mt-2">
                                      {challenge.duration}
                                    </p>
                                  </div>
                                  <div className="mt-4">
                                    <p className="text-sm">Difficulty Level</p>
                                    <p className="text-sm mt-2">
                                      {challenge.difficulty_Level}
                                    </p>
                                  </div>
                                  <section className="flex justify-between w-[90%] mt-4">
                                    <div>
                                      <p className="text-sm">
                                        Challenge Video:
                                      </p>
                                      {videoOrImageURL && (
                                        <div className="mt-4">
                                          <p className="text-sm">
                                            Challenge Media:
                                          </p>
                                          {challenge.video_or_image.type.includes(
                                            "video"
                                          ) ? (
                                            <video
                                              src={videoOrImageURL}
                                              controls
                                              className="w-20 h-20 rounded-xl border border-gray-600 focus:outline-none-md object-cover mt-2"
                                            />
                                          ) : (
                                            <img
                                              src={videoOrImageURL}
                                              alt="Uploaded content"
                                              className="w-20 h-20 rounded-xl border border-gray-600 focus:outline-none-md object-cover mt-2"
                                            />
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </section>
                                </div>
                              )}
                            </div>
                            <svg
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteChallenge(index);
                              }}
                              className="cursor-pointer mt-3"
                              width="17"
                              height="18"
                              viewBox="0 0 17 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7.3125 2.8125V3.125H10.4375V2.8125C10.4375 2.3981 10.2729 2.00067 9.97985 1.70765C9.68683 1.41462 9.2894 1.25 8.875 1.25C8.4606 1.25 8.06317 1.41462 7.77015 1.70765C7.47712 2.00067 7.3125 2.3981 7.3125 2.8125ZM6.0625 3.125V2.8125C6.0625 2.06658 6.35882 1.35121 6.88626 0.823762C7.41371 0.296316 8.12908 0 8.875 0C9.62092 0 10.3363 0.296316 10.8637 0.823762C11.3912 1.35121 11.6875 2.06658 11.6875 2.8125V3.125H16.375C16.5408 3.125 16.6997 3.19085 16.8169 3.30806C16.9342 3.42527 17 3.58424 17 3.75C17 3.91576 16.9342 4.07473 16.8169 4.19194C16.6997 4.30915 16.5408 4.375 16.375 4.375H15.4325L14.25 14.73C14.1628 15.4926 13.798 16.1965 13.2251 16.7073C12.6522 17.2182 11.9113 17.5004 11.1437 17.5H6.60625C5.83866 17.5004 5.09779 17.2182 4.52491 16.7073C3.95202 16.1965 3.5872 15.4926 3.5 14.73L2.3175 4.375H1.375C1.20924 4.375 1.05027 4.30915 0.933058 4.19194C0.815848 4.07473 0.75 3.91576 0.75 3.75C0.75 3.58424 0.815848 3.42527 0.933058 3.30806C1.05027 3.19085 1.20924 3.125 1.375 3.125H6.0625ZM7.625 7.1875C7.625 7.02174 7.55915 6.86277 7.44194 6.74556C7.32473 6.62835 7.16576 6.5625 7 6.5625C6.83424 6.5625 6.67527 6.62835 6.55806 6.74556C6.44085 6.86277 6.375 7.02174 6.375 7.1875V13.4375C6.375 13.6033 6.44085 13.7622 6.55806 13.8794C6.67527 13.9967 6.83424 14.0625 7 14.0625C7.16576 14.0625 7.32473 13.9967 7.44194 13.8794C7.55915 13.7622 7.625 13.6033 7.625 13.4375V7.1875ZM10.75 6.5625C10.5842 6.5625 10.4253 6.62835 10.3081 6.74556C10.1908 6.86277 10.125 7.02174 10.125 7.1875V13.4375C10.125 13.6033 10.1908 13.7622 10.3081 13.8794C10.4253 13.9967 10.5842 14.0625 10.75 14.0625C10.9158 14.0625 11.0747 13.9967 11.1919 13.8794C11.3092 13.7622 11.375 13.6033 11.375 13.4375V7.1875C11.375 7.02174 11.3092 6.86277 11.1919 6.74556C11.0747 6.62835 10.9158 6.5625 10.75 6.5625Z"
                                fill="#DD441B"
                              />
                            </svg>
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex gap-4 mt-6 w-full">
                      <div className="flex flex-col w-full">
                        <button
                          type="submit"
                          className="bg-[#F48567] px-4 py-2 rounded-xl border border-gray-600 focus:outline-none-xl text-[#000] flex items-center justify-center"
                          onClick={handleSubmitChallange}
                        >
                          Submit
                        </button>
                      </div>

                      <div className="flex flex-col w-full">
                        <button
                          onClick={handleChallengeCancelConfirmation}
                          className="bg-[#C7C7C7] px-4 py-2 rounded-xl border border-gray-600 focus:outline-none-xl text-[#000]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </section>
                )}

                {isLoadingLink && (
                  <section className="flex flex-col w-full">
                    <Progress
                      percent={progress}
                      percentPosition={{ align: "center", type: "inner" }}
                      size={[400, 20]}
                      strokeColor="#F48567"
                    />
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteModule}
        message="Are you sure?"
        confirmText="Delete"
        cancelText="Cancel"
        darkMode={darkMode}
      />

      <ConfirmationModal
        isOpen={showSubmitConfirmation}
        onClose={() => setShowSubmitConfirmation(false)}
        onConfirm={handleCreateContent}
        message="If you submit now all data will be stored into the system. Are you sure ?"
        confirmText="Submit"
        cancelText="Cancel"
        darkMode={darkMode}
      />

      <ConfirmationModal
        isOpen={showCancelConfirmation}
        onClose={rejectCancel}
        onConfirm={confirmCancel}
        message="If you cancel now all data will be removed from the system. Are you sure ?"
        confirmText="Yes"
        cancelText="Cancel"
        darkMode={darkMode}
      />

      <ConfirmationModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          handleClosePopup(); // Reset to first step
        }}
        onConfirm={() => {
          setShowSuccessModal(false);
          handleClosePopup(); // Reset to first step
        }}
        message="Your Learning Data Successfully Submitted."
        confirmText="OK"
        showCancel={false} // Add this prop to your ConfirmationModal to hide cancel button
        darkMode={darkMode}
      />

      <ConfirmationModal
        isOpen={showChallengeSubmitConfirmation}
        onClose={() => setShowChallengeSubmitConfirmation(false)}
        onConfirm={handleSave}
        message="If you submit now all data will be stored into the system.Are you sure ?"
        confirmText="Submit"
        cancelText="Cancel"
        darkMode={darkMode}
      />

      {/* Challenge Cancel Confirmation */}
      <ConfirmationModal
        isOpen={showChallengeCancelConfirmation}
        onClose={() => setShowChallengeCancelConfirmation(false)}
        onConfirm={confirmChallengeCancel}
        message="If you cancel now all data will be removed from the system.Are you sure ?"
        confirmText="Yes, Cancel"
        cancelText="No, Continue Editing"
        darkMode={darkMode}
      />

      <ConfirmationModal
        isOpen={showChallengeSuccess}
        onClose={() => {
          setShowChallengeSuccess(false);
          handleClosePopup(); // Reset to first step
        }}
        onConfirm={() => {
          setShowChallengeSuccess(false);
          handleClosePopup(); // Reset to first step
        }}
        message="Your Challenge Data Successfully Submitted."
        confirmText="OK"
        showCancel={false}
        darkMode={darkMode}
      />

      <ConfirmationModal
        isOpen={showChallengeDeleteModal}
        onClose={() => setShowChallengeDeleteModal(false)}
        onConfirm={confirmDeleteChallenge}
        message="Are you sure ?"
        confirmText="Delete"
        cancelText="Cancel"
        darkMode={darkMode}
      />
    </>
  );
};

export default ParentComponent;
