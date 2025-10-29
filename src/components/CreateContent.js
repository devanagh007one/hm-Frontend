import React, { useState, useEffect } from "react";
import { Spin, Progress } from "antd";
import "./popup.css"; // Import custom CSS
import "./popup2.css"; // Import custom CSS
import { useSelector, useDispatch } from "react-redux";
import {
  createContent,
  createchallenge,
  fetchAllContent,
  updateContent,
  fetchAllTracks,
  updateTrack,
  startFresh,
  fetchModulesByTrack,
} from "../redux/actions/allContentGet";
import { showNotification } from "../redux/actions/notificationActions"; // Import showNotification
import { SquarePlus, Pencil, Upload } from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";

const ParentComponent = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);
  const userRole = localStorage.getItem("userRole");

  // State declarations
  const [modules, setModules] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [modulesFromStorage, setModulesFromStorage] = useState([]);

  const [trackModules, setTrackModules] = useState({});
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
  const [partners, setPartners] = useState([]);
  const [navigationHistory, setNavigationHistory] = useState(["section1"]);
  const [showStartFreshModal, setShowStartFreshModal] = useState(false);
  const [startFreshLoading, setStartFreshLoading] = useState(false);
  const [showUpdateSuccessModal, setShowUpdateSuccessModal] = useState(false);
  const [showTrackActionModal, setShowTrackActionModal] = useState(false);
  const [selectedTrackForAction, setSelectedTrackForAction] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [modulesLoading, setModulesLoading] = useState(false);

  const handleBack = () => {
    if (navigationHistory.length <= 1) return; // Don't go back from first section

    const newHistory = [...navigationHistory];
    newHistory.pop(); // Remove current section
    const previousSection = newHistory[newHistory.length - 1];

    // Reset all sections first
    setIsSectionVisible(false);
    setIsSection2Visible(false);
    setIsSection3Visible(false);
    setisCreatedModuleVisible(false);
    setisCreatedContentVisible(false);

    // Navigate to previous section
    switch (previousSection) {
      case "section1":
        setIsSectionVisible(true);
        break;
      case "section2":
        setIsSection2Visible(true);
        break;
      case "section3":
        setIsSection3Visible(true);
        break;
      case "createdModule":
        setisCreatedModuleVisible(true);
        break;
      case "createdContent":
        setisCreatedContentVisible(true);
        break;
      default:
        setIsSectionVisible(true);
    }

    setNavigationHistory(newHistory);
  };

  useEffect(() => {
    const partnerUsers = JSON.parse(localStorage.getItem("partnerUsers")) || [];
    setPartners(partnerUsers); // Store the full objects, not just names
  }, []);

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
    existingIntroVideos: [],
    existingDescVideos: [],
    videoFile_introduction: [],
    videoFile_description: [],
    learningVideoTitles: [],
    learningVideoCovers: [],
    description_videofile_text: [],
    content: "",
    partnerId: "",
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

  const [editingChallengeIndex, setEditingChallengeIndex] = useState(null);
  const [progress, setProgress] = useState(0);

  const [editingIndex, setEditingIndex] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

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

  const [learningVideoSubmitted, setLearningVideoSubmitted] = useState(false);
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);

  // console.log(modules, challenges);
  const toggleTrackOpen = () => setIsOpenTrack(!isOpenTrack);
  const togglePartnerOpen = () => setIsOpenPartner(!isOpenPartner);
  const toggleModuleOpen = () => setIsOpenModule(!isOpenModule);

  useEffect(() => {
    const fetchModulesForTrack = async () => {
      if (formData.tracks) {
        setModulesLoading(true);
        try {
          const modulesData = await dispatch(
            fetchModulesByTrack(formData.tracks)
          );
          setModulesFromStorage(modulesData?.items || []);
        } catch (error) {
          console.error("Failed to load modules for track:", error);
          setModulesFromStorage([]);
        } finally {
          setModulesLoading(false);
        }
      } else {
        setModulesFromStorage([]);
        setModulesLoading(false);
      }
    };

    fetchModulesForTrack();
  }, [formData.tracks, dispatch]);

  // Update getSelectedDataFromStorage to be more defensive
  const getSelectedDataFromStorage = () => {
    try {
      const data = localStorage.getItem("selectedTrackModule");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error reading from storage:", error);
      return null;
    }
  };

  // Only clear storage when explicitly needed (like when closing popup)
  const clearSelectedDataFromStorage = () => {
    localStorage.removeItem("selectedTrackModule");
    // Also reset form data partner fields if needed
    setFormData((prev) => ({
      ...prev,
      partner: "",
      partnerId: "",
    }));
    console.log("Cleared storage including partner data");
  };

  const [tracks, setTracks] = useState([]);

  // Add this useEffect - place it with your other useEffect hooks
  useEffect(() => {
    const loadTracks = async () => {
      try {
        const tracksData = await dispatch(fetchAllTracks());
        setTracks(tracksData || []);
      } catch (error) {
        console.error("Failed to load tracks:", error);
      }
    };

    loadTracks();
  }, [dispatch]);

  const saveSelectedDataToStorage = (track, module, partner, partnerId) => {
    const selectedData = {
      track: track,
      module: module,
      partner: partner,
      partnerId: partnerId,
      timestamp: Date.now(),
    };
    localStorage.setItem("selectedTrackModule", JSON.stringify(selectedData));
    console.log("Saved to storage:", selectedData);
  };

  // Update handleSelectTracks to save partner data
  const handleSelectTracks = async (trackName) => {
    setFormData((prevData) => ({
      ...prevData,
      tracks: trackName,
      module: "", // Reset module when track changes
      moduleName: "", // Reset module name
    }));

    // Also reset challenge data module reference
    setChallengeData((prevData) => ({
      ...prevData,
      module: "",
    }));

    // Save to localStorage with partner data
    const currentSelected = getSelectedDataFromStorage();
    saveSelectedDataToStorage(
      trackName,
      currentSelected?.module || "",
      currentSelected?.partner || formData.partner,
      currentSelected?.partnerId || formData.partnerId
    );

    setIsOpenTrack(false);
  };

  // Update handleSelectPartner to save data
  const handleSelectPartner = (partnerObj) => {
    const partnerName = partnerObj.firstName + " " + partnerObj.lastName;
    const partnerId = partnerObj._id || partnerObj.id;

    setFormData((prevData) => ({
      ...prevData,
      partner: partnerName,
      partnerId: partnerId,
    }));

    // Save to localStorage
    const currentSelected = getSelectedDataFromStorage();
    saveSelectedDataToStorage(
      currentSelected?.track || formData.tracks,
      currentSelected?.module || formData.module,
      partnerName,
      partnerId
    );

    setIsOpenPartner(false);
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
    setNavigationHistory((prev) => [...prev, "section2"]);
  };

  const handleOpenChallange = () => {
    setIsSectionVisible(false);
    setIsSection3Visible(true);
    setNavigationHistory((prev) => [...prev, "section3"]);
  };

  // Function to remove specific video from array
  const handleRemoveVideoFromArray = (fieldName, index) => {
    if (fieldName === "videoFile_introduction") {
      // Remove from BOTH introduction and description when removing learning videos
      setFormData((prev) => ({
        ...prev,
        videoFile_introduction: prev.videoFile_introduction.filter(
          (_, i) => i !== index
        ),
        videoFile_description: prev.videoFile_description.filter(
          (_, i) => i !== index
        ),
      }));
    } else {
      // For other fields, remove only from that field
      setFormData((prev) => ({
        ...prev,
        [fieldName]: prev[fieldName].filter((_, i) => i !== index),
      }));
    }
  };

  const handleFileChange = (e, fieldName) => {
    const files = e.target.files;

    if (fieldName === "videoFile_introduction") {
      // For learning videos, set BOTH introduction and description fields
      const fileArray = Array.from(files);
      setFormData((prevData) => ({
        ...prevData,
        videoFile_introduction: [
          ...(prevData.videoFile_introduction || []),
          ...fileArray,
        ],
        videoFile_description: [
          ...(prevData.videoFile_description || []),
          ...fileArray,
        ], // Set same files for description
      }));
    } else if (fieldName === "videoFile_description") {
      // Handle description videos separately if needed (though hidden in UI)
      const fileArray = Array.from(files);
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: [...(prevData[fieldName] || []), ...fileArray],
      }));
    } else {
      // For single file fields like cover_Photo
      const file = files[0];
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: file,
      }));
    }
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
    // setChallengeData(initialChallangeData);
    // setFormData(initialModuleData);
    setFormData({
      ...initialModuleData,
      // ✅ PRESERVE DROPDOWN SELECTIONS
      tracks: formData.tracks,
      module: formData.module,
      partner: formData.partner,
      partnerId: formData.partnerId,
    });

    settime({ duration: 0 });
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
    setNavigationHistory(["section1"]);

    // setLearningVideoSubmitted(false);
    // setChallengeSubmitted(false);

    // clearSelectedDataFromStorage();
  };

  useEffect(() => {
    if (showPopup) {
      const storedData = getSelectedDataFromStorage();
      if (storedData) {
        setFormData((prev) => ({
          ...prev,
          tracks: storedData.track || prev.tracks,
          module: storedData.module || prev.module,
          // ✅ ADD THESE LINES - Missing partner data
          partner: storedData.partner || prev.partner,
          partnerId: storedData.partnerId || prev.partnerId,
        }));
      }
    }
  }, [showPopup]);

  const handleEditTrack = (trackObj) => {
    setEditTrack(trackObj);
  };

  const handelCancelTrack = () => {
    setEditTrack(null);
  };

  const handleModuleEdit = (module) => {
    // Set the edit module with only name and trackPhoto
    setEditModule({
      id: module.id,
      name: module.name,
      trackPhoto: null, // Reset file input
    });
  };

  // Add these handler functions with your other handlers
  const handleUpdateTrack = async () => {
    if (!editTrack?._id) return;

    setActionLoading(true);
    try {
      // Call updateTrack API with the edited track data
      await dispatch(updateTrack(editTrack._id, editTrack));

      // Refresh tracks after successful update
      const updatedTracks = await dispatch(fetchAllTracks());
      setTracks(updatedTracks || []);
      setEditTrack(null);
      setShowTrackActionModal(false);
      setSelectedAction(null);

      // Check if any modules were updated
      const hasUpdates = modules.some(
        (m) => m.isExistingModule === true || editingIndex !== null
      );

      dispatch(
        showNotification(
          "Your Modules have been successfully submitted for approval.",
          "success"
        )
      );

      setLoadingLink(false);

      // Show appropriate success modal
      if (hasUpdates) {
        setShowUpdateSuccessModal(true);
      } else {
        setShowSuccessModal(true);
      }

      setLoadingLink(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Update track error:", error);
      dispatch(
        showNotification("Failed to update track. Please try again.", "error")
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Handler for Start Fresh
  const handleStartFresh = async () => {
    if (!editTrack?._id) return;

    setStartFreshLoading(true);
    try {
      // Call startFresh API (this will delete all related content)
      const response = await dispatch(startFresh(editTrack._id));

      if (response) {
        // Refresh tracks after successful start fresh
        const updatedTracks = await dispatch(fetchAllTracks());
        setTracks(updatedTracks || []);
        setEditTrack(null);
        setShowTrackActionModal(false);

        dispatch(
          showNotification(
            "Track started fresh successfully! All related content has been deleted.",
            "success"
          )
        );
      }
    } catch (error) {
      console.error("Start fresh error:", error);
      dispatch(
        showNotification("Failed to start fresh. Please try again.", "error")
      );
    } finally {
      setStartFreshLoading(false);
    }
  };

  // Add this handler for when user saves the track update
  const handleSaveTrackUpdate = async () => {
    if (!editTrack?._id) return;

    setUpdateLoading(true);
    try {
      // Call updateTrack API with the edited track data
      await dispatch(updateTrack(editTrack._id, editTrack));

      // Refresh tracks after successful update
      const updatedTracks = await dispatch(fetchAllTracks());
      setTracks(updatedTracks || []);
      setEditTrack(null);

      dispatch(showNotification("Track updated successfully!", "success"));
    } catch (error) {
      console.error("Update track error:", error);
      dispatch(
        showNotification("Failed to update track. Please try again.", "error")
      );
    } finally {
      setUpdateLoading(false);
    }
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

  // Add this helper function at the top with your other functions
  const isModuleAlreadyInList = (moduleId) => {
    return modules.some((m) => m._id === moduleId);
  };

  const handleAddModule = async () => {
    // Validate that all uploaded videos have titles
    if (formData.videoFile_introduction.length > 0) {
      const hasEmptyTitles = formData.learningVideoTitles.some(
        (title, idx) =>
          idx < formData.videoFile_introduction.length && !title?.trim()
      );
      if (hasEmptyTitles) {
        dispatch(
          showNotification(
            "Please provide titles for all learning videos.",
            "error"
          )
        );
        return;
      }
    }

    const selectedModule = JSON.parse(localStorage.getItem("selectedModule"));
    const storedData = getSelectedDataFromStorage();

    if (editingIndex !== null) {
      const updatedModule = {
        ...modules[editingIndex],
        moduleName: formData.moduleName,
        description: formData.description,
        content: formData.content,
        tracks: storedData?.track || formData.tracks,
        // ✅ ADD THIS LINE
        uploaded_by: formData.partnerId || modules[editingIndex].uploaded_by,
        cover_Photo: formData.cover_Photo || modules[editingIndex].cover_Photo,
        videoFile_introduction: [
          ...(modules[editingIndex].videoFile_introduction || []),
          ...(Array.isArray(formData.videoFile_introduction)
            ? formData.videoFile_introduction.filter(
                (file) => file instanceof File
              )
            : []),
        ],
        videoFile_description: [
          ...(modules[editingIndex].videoFile_description || []),
          ...(Array.isArray(formData.videoFile_description)
            ? formData.videoFile_description.filter(
                (file) => file instanceof File
              )
            : []),
        ],
        learningVideoTitles: [
          ...(modules[editingIndex].learningVideoTitles || []),
          ...(formData.learningVideoTitles || []),
        ],
        learningVideoCovers: [
          ...(modules[editingIndex].learningVideoCovers || []),
          ...(formData.learningVideoCovers || []),
        ],
        description_videofile_text: [
          ...(modules[editingIndex].description_videofile_text || []),
          ...(formData.description_videofile_text || []),
        ],
        _id: formData._id,
        isExistingModule: formData.isExistingModule,
        entryNumber: formData.entryNumber || editingIndex + 1,
      };

      const updatedModules = [...modules];
      updatedModules[editingIndex] = updatedModule;
      setModules(updatedModules);
      setEditingIndex(null);
    } else {
      const newLearningVideoEntry = {
        ...formData,
        tracks: storedData?.track || formData.tracks,
        uniqueUploadId: generateUniqueId(),
        _id: selectedModule?.id || formData._id,
        moduleName: formData.moduleName,
        isExistingModule: true,
        // ✅ ADD THIS LINE
        uploaded_by: formData.partnerId || selectedModule?.uploadedById,
        cover_Photo: formData.cover_Photo,
        videoFile_introduction: Array.isArray(formData.videoFile_introduction)
          ? formData.videoFile_introduction.map((file) => file)
          : [],
        videoFile_description: Array.isArray(formData.videoFile_description)
          ? formData.videoFile_description.map((file) => file)
          : [],
        learningVideoTitles: formData.learningVideoTitles || [],
        learningVideoCovers: formData.learningVideoCovers || [],
        description_videofile_text: formData.description_videofile_text || [],
        entryNumber: modules.length + 1,
      };

      setModules((prevModules) => [...prevModules, newLearningVideoEntry]);
    }

    // Reset form
    const resetFormData = {
      uniqueUploadId: generateUniqueId(),
      tracks: storedData?.track || formData.tracks,
      moduleName: formData.moduleName,
      moduleType: "Module",
      fileSize: "",
      isApproved: "pending",
      description: formData.description,
      cover_Photo: null,
      videoFile_introduction: [],
      videoFile_description: [],
      learningVideoTitles: [],
      learningVideoCovers: [],
      description_videofile_text: [],
      content: "",
      module: formData.module,
      _id: selectedModule?.id || formData._id,
      // ✅ Keep partnerId in reset form data
      partner: formData.partner, // Add this line
      partnerId: formData.partnerId,
    };

    setFormData(resetFormData);
    setIsSection2Visible(false);
    setisCreatedModuleVisible(true);
    setNavigationHistory((prev) => [...prev, "createdModule"]);
  };
  // STEP 4: CRITICAL FIX - Update handleCreateContent to merge ALL videos
  const handleCreateContent = async () => {
    setShowSubmitConfirmation(false);
    setIsSection2Visible(false);
    setisCreatedModuleVisible(false);
    setLoadingLink(true);
    let progressCount = 0;

    const storedData = getSelectedDataFromStorage();

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
      // Group all learning video entries by module ID
      const moduleGroups = modules.reduce((acc, entry) => {
        const moduleId = entry._id;
        if (!acc[moduleId]) {
          acc[moduleId] = [];
        }
        acc[moduleId].push(entry);
        return acc;
      }, {});

      const totalSteps = Object.keys(moduleGroups).length;

      console.log("📦 Starting bulk update for", totalSteps, "modules");

      // Process each module
      for (const [moduleId, entries] of Object.entries(moduleGroups)) {
        console.log(
          `\n🔄 Processing module ${moduleId} with ${entries.length} entries`
        );

        // Collect ALL NEW videos - now only for description
        const allNewVideos = [];
        const allNewCovers = []; // NEW: Collect learning video covers
        let latestEntry = entries[0];
        let coverPhoto = null;
        let description = "";
        let allVideoTitles = [];
        let allVideoDescriptions = []; // NEW: Collect learning video descriptions

        entries.forEach((entry, idx) => {
          console.log(`  Entry ${idx + 1}:`, {
            newVideos: entry.videoFile_description?.length || 0,
            newCovers: entry.learningVideoCovers?.length || 0, // NEW
            newDescriptions: entry.description_videofile_text?.length || 0, // NEW
          });

          // Collect NEW videos for description field only
          if (Array.isArray(entry.videoFile_description)) {
            entry.videoFile_description.forEach((video) => {
              if (video instanceof File) {
                allNewVideos.push(video);
              }
            });
          }

          // NEW: Collect learning video covers
          if (Array.isArray(entry.learningVideoCovers)) {
            entry.learningVideoCovers.forEach((cover) => {
              if (cover instanceof File) {
                allNewCovers.push(cover);
              }
            });
          }

          // NEW: Collect learning video descriptions
          if (Array.isArray(entry.description_videofile_text)) {
            allVideoDescriptions = [
              ...allVideoDescriptions,
              ...entry.description_videofile_text.filter(
                (text) => text && text.trim()
              ),
            ];
          }

          // Collect learning video titles
          if (Array.isArray(entry.learningVideoTitles)) {
            allVideoTitles = [
              ...allVideoTitles,
              ...entry.learningVideoTitles.filter(
                (title) => title && title.trim()
              ),
            ];
          }

          if (entry.cover_Photo instanceof File) {
            coverPhoto = entry.cover_Photo;
          }
          if (entry.description) {
            description = entry.description;
          }
        });

        console.log("📊 Video Summary:", {
          newVideos: allNewVideos.length,
          newCovers: allNewCovers.length, // NEW
          newDescriptions: allVideoDescriptions.length, // NEW
          videoNames: allNewVideos.map((v) => v.name),
          coverNames: allNewCovers.map((c) => c.name), // NEW
        });

        // Create FormData for multipart upload
        const formDataToSend = new FormData();

        formDataToSend.append("uniqueUploadId", latestEntry.uniqueUploadId);
        formDataToSend.append("moduleName", latestEntry.moduleName || "");
        formDataToSend.append(
          "tracks",
          storedData?.track || latestEntry.tracks || ""
        );
        formDataToSend.append("moduleType", latestEntry.moduleType || "Module");
        formDataToSend.append("fileSize", latestEntry.fileSize || "");
        formDataToSend.append(
          "isApproved",
          latestEntry.isApproved || "pending"
        );
        formDataToSend.append("uploaded_by", formData.partnerId || "");
        // CRITICAL: Set append flag for description videos only
        formDataToSend.append("append_desc", "true");

        // Add description field - THIS WAS MISSING
        if (description) {
          formDataToSend.append("description", description);
        }

        if (coverPhoto instanceof File) {
          formDataToSend.append("cover_Photo", coverPhoto);
        }

        // Add learning video titles
        if (allVideoTitles.length > 0) {
          formDataToSend.append(
            "learningVideoTitles",
            JSON.stringify(allVideoTitles)
          );
        }

        // NEW: Add learning video descriptions
        if (allVideoDescriptions.length > 0) {
          formDataToSend.append(
            "description_videofile_text",
            JSON.stringify(allVideoDescriptions)
          );
        }

        // FIX: Send videos ONLY to description field (removed introduction)
        allNewVideos.forEach((video, index) => {
          formDataToSend.append("videoFile_description", video);
          console.log(`  ➕ Adding video ${index + 1}: ${video.name}`);
        });

        // NEW: Send learning video covers
        allNewCovers.forEach((cover, index) => {
          formDataToSend.append("learningVideoCovers", cover);
          console.log(`  🖼️ Adding cover ${index + 1}: ${cover.name}`);
        });

        if (latestEntry.content) {
          formDataToSend.append("content", latestEntry.content);
        }

        console.log(`\n🚀 Sending to API with all fields`);

        try {
          const authToken = localStorage.getItem("authToken");

          const response = await fetch(
            `${process.env.REACT_APP_STATIC_API_URL}/api/contant/contants/${moduleId}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
              body: formDataToSend,
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Failed to update content:", errorText);
            throw new Error(errorText || "Failed to update content");
          }

          const data = await response.json();

          console.log("✅ Update response:", {
            success: data?.success,
            finalVideoCount: data?.content?.videoFile_description?.length,
            hasDescription: !!data?.content?.description,
            learningVideoTitles: data?.content?.learningVideoTitles,
            description_videofile_text:
              data?.content?.description_videofile_text, // NEW
            learningVideoCovers: data?.content?.learningVideoCovers, // NEW
            message: data?.message,
          });

          if (data && (data.success || data._id || data.id)) {
            progressCount++;
            smoothProgressUpdate((progressCount / totalSteps) * 100);
          } else {
            throw new Error("Invalid response");
          }
        } catch (error) {
          console.error("❌ Update error:", error);
          dispatch(
            showNotification(
              `Failed to update module: ${latestEntry.moduleName}`,
              "error"
            )
          );
          setLoadingLink(false);
          return;
        }
      }

      dispatch(
        showNotification(
          "Your Learning Videos have been successfully added to the module!",
          "success"
        )
      );

      setLoadingLink(false);
      setShowUpdateSuccessModal(true);
    } catch (error) {
      console.error("Submission error:", error);
      dispatch(
        showNotification("An error occurred during submission.", "error")
      );
      setLoadingLink(false);
    }
  };

  // Also update the handleSelectModule function to NOT set editingIndex
  const handleSelectModule = async (module) => {
    setSelectedModule(module);

    const isTemplateModule = module._id?.startsWith("template-");

    if (isTemplateModule) {
      setFormData((prevData) => ({
        ...prevData,
        module: module._id,
        moduleName: "",
        description: "",
        cover_Photo: null,
        videoFile_introduction: [],
        videoFile_description: [],
        content: "",
      }));
    } else {
      // ✅ FIX: Populate existing module data including description and cover photo
      setFormData((prevData) => ({
        ...prevData,
        module: module._id,
        moduleName: module.moduleName || "",
        description: module.description || "", // ✅ Populate existing description
        cover_Photo: module.cover_Photo || null, // ✅ Populate existing cover photo
        videoFile_introduction: [], // Empty for NEW videos
        videoFile_description: [], // Empty for NEW videos
        content: module.content || "",
        fileSize: module.fileSize || "",
        isApproved: module.isApproved || "pending",
        moduleType: module.moduleType || "Module",
        tracks: module.tracks || formData.tracks,
        _id: module._id,
      }));
    }

    setChallengeData((prevData) => ({
      ...prevData,
      module: module._id,
    }));

    const currentSelected = getSelectedDataFromStorage();
    saveSelectedDataToStorage(
      currentSelected?.track || formData.tracks,
      module._id,
      currentSelected?.partner || formData.partner,
      currentSelected?.partnerId || formData.partnerId
    );

    const selectedModuleData = {
      id: module._id,
      moduleName: module.moduleName,
      uploadedById: module.uploaded_by || "68b5596571d47f3ed464a8f0",
    };
    localStorage.setItem("selectedModule", JSON.stringify(selectedModuleData));

    setIsOpenModule(false);
    setEditingIndex(null);
  };
  // Then create a separate function to handle the actual submission
  const handleConfirmModuleSubmit = async () => {
    setShowSubmitConfirmation(false);

    // Just navigate to the created modules section
    setIsSection2Visible(false);
    setisCreatedModuleVisible(true);
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
    setNavigationHistory((prev) => [...prev, "section2"]);
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
    setNavigationHistory((prev) => [...prev, "createdContent"]);
  };

  // Handler for editing existing modules (name only)
  const handleEditExistingModule = (module) => {
    // Open a simple modal or form to edit just the module name
    const newName = prompt("Enter new module name:", module.moduleName);
    if (newName && newName.trim() !== "") {
      // Call API to update module name only
      dispatch(updateContent(module._id, { moduleName: newName.trim() }))
        .then(() => {
          // Refresh modules after successful update
          dispatch(fetchModulesByTrack(formData.tracks));
          dispatch(showNotification("Module updated successfully!", "success"));
        })
        .catch((error) => {
          dispatch(showNotification("Failed to update module", "error"));
        });
    }
  };

  // Handler for saving existing module (name only)
  const handleSaveExistingModule = async () => {
    if (!editModule?._id || !editModule.moduleName) return;

    try {
      const updateData = {
        moduleName: editModule.moduleName,
        tracks: formData.tracks,
      };

      // Add cover photo if it's a new file upload
      if (editModule.cover_Photo instanceof File) {
        updateData.cover_Photo = editModule.cover_Photo;
      }

      await dispatch(updateContent(editModule._id, updateData));

      // Refresh modules
      const modulesData = await dispatch(fetchModulesByTrack(formData.tracks));
      setModulesFromStorage(modulesData?.items || []);
      setEditModule(null);

      dispatch(showNotification("Module updated successfully!", "success"));
    } catch (error) {
      dispatch(showNotification("Failed to update module", "error"));
    }
  };

  const handleCreateNewModule = async () => {
    if (!editModule?.moduleName) {
      dispatch(showNotification("Module name is required", "error"));
      return;
    }

    if (!formData.partnerId) {
      dispatch(showNotification("Please select a partner first", "error"));
      return;
    }

    try {
      const storedData = getSelectedDataFromStorage();

      const selectedModuleData = {
        id: editModule._id,
        moduleName: editModule.moduleName,
        // ✅ Use partner ID instead of user ID
        uploadedById: formData.partnerId || "", // Use partner ID only
      };

      localStorage.setItem(
        "selectedModule",
        JSON.stringify(selectedModuleData)
      );

      // Use stored track data
      const newModule = {
        uniqueUploadId: generateUniqueId(),
        tracks: storedData?.track || formData.tracks,
        moduleName: editModule.moduleName,
        moduleType: "Module",
        fileSize: "",
        isApproved: "pending",
        description: "",
        cover_Photo: editModule.cover_Photo,
        videoFile_introduction: null,
        videoFile_description: null,
        content: "",
        // ✅ SEND ONLY PARTNER ID - remove user ID fallback
        uploaded_by: formData.partnerId, // Only partner ID, no fallback
      };

      console.log(
        "Creating new module with uploaded_by (partner only):",
        newModule.uploaded_by
      );

      const response = await dispatch(createContent(newModule));

      if (response?._id) {
        const modulesData = await dispatch(
          fetchModulesByTrack(formData.tracks)
        );
        setModulesFromStorage(modulesData?.items || []);
        setEditModule(null);

        const updatedSelectedModule = {
          id: response._id,
          moduleName: editModule.moduleName,
          // ✅ Keep using partner ID
          uploadedById: formData.partnerId || "",
        };
        localStorage.setItem(
          "selectedModule",
          JSON.stringify(updatedSelectedModule)
        );

        // Update the modules array with stored track
        setModules((prevModules) =>
          prevModules.map((module) =>
            module.uniqueUploadId === editModule._id
              ? {
                  ...module,
                  _id: response._id,
                  uniqueUploadId: response._id,
                  moduleName: editModule.moduleName,
                  tracks: storedData?.track || module.tracks,
                  // ✅ Use partner ID only
                  uploaded_by: formData.partnerId,
                }
              : module
          )
        );

        setFormData((prev) => ({
          ...prev,
          module: response._id,
          moduleName: editModule.moduleName,
          tracks: storedData?.track || prev.tracks,
        }));

        setChallengeData((prev) => ({
          ...prev,
          module: response._id,
        }));

        dispatch(showNotification("Module created successfully!", "success"));
        setIsOpenModule(false);
      }
    } catch (error) {
      console.error("Module creation error:", error);
      dispatch(showNotification("Failed to create module", "error"));
    }
  };

  const handleAddChallengefromavilablenew = () => {
    setIsSection3Visible(true);
    setisCreatedContentVisible(false);
    setNavigationHistory((prev) => [...prev, "section3"]);
  };

  const handleRemoveFile = (field) => {
    if (field === "videoFile_introduction") {
      // Clear BOTH introduction and description arrays
      setFormData((prev) => ({
        ...prev,
        videoFile_introduction: [],
        videoFile_description: [],
      }));
    } else if (field === "videoFile_description") {
      // Clear only description if needed
      setFormData((prev) => ({
        ...prev,
        [field]: [],
      }));
    } else {
      // Single file fields
      setFormData((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
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
        formData.append(
          "uploaded_by",
          formData.partnerId || selectedModule.uploadedById
        );
        formData.append("duration", challenge.duration || "0h 00 min");
        formData.append(
          "challenge_benefits",
          challenge.challenge_benefits || ""
        );
        formData.append(
          "difficulty_Level",
          challenge.difficulty_Level || "Medium"
        );

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

      setLoadingLink(false);
      setShowChallengeSuccess(true);
    } catch (error) {
      console.error("Submission error:", error);
      dispatch(showNotification(error.message, "error"));
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
            <div className="flex justify-between items-center ">
              <div className="flex flex-col mb-6  w-full">
                <div className="flex justify-between items-center  w-full">
                  <div className="">
                    {!isSectionVisible && !isLoadingLink && (
                      <button
                        onClick={handleBack}
                        className={`p-2 rounded-lg transition-colors ${
                          darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        }`}
                        aria-label="Go back"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.5 15L7.5 10L12.5 5"
                            stroke={darkMode ? "#FFFFFF" : "#000000"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">
                      {formData.tracks
                        ? `Track: ${formData.tracks}`
                        : "Upload Content"}
                    </h1>
                  </div>

                  <div>
                    {!isLoadingLink && (
                      <svg
                        className="cursor-pointer "
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
                </div>

                <div className="flex items-center text-sm text-gray-500 mt-1">
                  {isSectionVisible && (
                    <span className="text-white text-xl"></span>
                  )}

                  {isSection2Visible && (
                    <div className="flex justify-start items-start">
                      <span className="text-md text-[#F48567] mt-2">
                        {formData.moduleName || "New Module"}
                      </span>
                      <span className="mx-2 text-xl mt-1">/</span>
                      <span className="text-sm text-[#F48567] mt-2">
                        Learning Video
                      </span>
                    </div>
                  )}

                  {isSection3Visible && (
                    <>
                      <span className="text-white text-xl">
                        {formData.moduleName || "Module"}
                      </span>
                      <span className="mx-2">/</span>
                      <span className="text-white text-sm">Learning Video</span>
                      <span className="mx-2 text-lg">/</span>
                      <span className="text-sm text-[#F48567]  mt-1">
                        Challenge
                      </span>
                    </>
                  )}
                </div>
              </div>
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
                                    key={track._id}
                                    className={`dropdown-item flex flex-col w-full p-2 rounded-md mb-2 ${
                                      darkMode ? "bg-[#333333]" : "bg-gray-200 "
                                    }`}
                                  >
                                    <div
                                      className="flex items-center gap-2 justify-between cursor-pointer"
                                      onClick={() =>
                                        handleSelectTracks(track.tracksName)
                                      }
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-full border-2 border-[#F48567] flex items-center justify-center">
                                          {formData.tracks ===
                                            track.tracksName && (
                                            <span className="w-2 h-2 rounded-full bg-[#F48567]" />
                                          )}
                                        </span>
                                        <div
                                          className={`text-sm ${
                                            darkMode
                                              ? "text-white"
                                              : "text-black"
                                          }`}
                                        >
                                          {track.tracksName}
                                        </div>
                                      </div>

                                      <Pencil
                                        size={16}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditTrack(track);
                                        }}
                                      />
                                    </div>

                                    {/* Expanded Edit Section */}
                                    {editTrack &&
                                      editTrack._id === track._id && (
                                        <div className="mt-2 flex flex-col gap-2 text-white ">
                                          <input
                                            type="text"
                                            placeholder="Track Name"
                                            className={`p-2 rounded-md border border-gray-600 focus:outline-none bg-inherit placeholder-gray-400 text-sm ${
                                              darkMode
                                                ? "bg-[#333333] text-white "
                                                : "bg-white text-black "
                                            }`}
                                            value={editTrack.tracksName || ""}
                                            onChange={(e) =>
                                              setEditTrack({
                                                ...editTrack,
                                                tracksName: e.target.value,
                                              })
                                            }
                                          />

                                          <label
                                            className={`flex items-center justify-between p-2 cursor-pointer w-full rounded-md border border-gray-600 focus:outline-none ${
                                              darkMode
                                                ? "bg-inherit text-white"
                                                : "bg-inherit text-black"
                                            }`}
                                          >
                                            <div className="flex flex-col flex-1">
                                              <span className="text-sm text-gray-400">
                                                {editTrack.trackImage
                                                  ? "Change Track Image"
                                                  : "Upload Track Image"}
                                              </span>
                                              {editTrack.trackImage &&
                                                typeof editTrack.trackImage ===
                                                  "object" && (
                                                  <span className="text-xs text-[#F48567] mt-1 truncate">
                                                    {editTrack.trackImage.name}
                                                  </span>
                                                )}
                                              {editTrack.trackImage &&
                                                typeof editTrack.trackImage ===
                                                  "string" && (
                                                  <span className="text-xs text-[#F48567] mt-1 truncate">
                                                    {editTrack.trackImage
                                                      .split("/")
                                                      .pop()}
                                                  </span>
                                                )}
                                            </div>
                                            <div className="flex items-center">
                                              {editTrack.trackImage ? (
                                                <svg
                                                  width="18"
                                                  height="18"
                                                  viewBox="0 0 18 18"
                                                  fill="none"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditTrack({
                                                      ...editTrack,
                                                      trackImage: null,
                                                    });
                                                  }}
                                                  className="cursor-pointer ml-2"
                                                >
                                                  <path
                                                    d="M9 0.25C4.125 0.25 0.25 4.125 0.25 9C0.25 13.875 4.125 17.75 9 17.75C13.875 17.75 17.75 13.875 17.75 9C17.75 4.125 13.875 0.25 9 0.25ZM12.375 13.375L9 10L5.625 13.375L4.625 12.375L8 9L4.625 5.625L5.625 4.625L9 8L12.375 4.625L13.375 5.625L10 9L13.375 12.375L12.375 13.375Z"
                                                    fill="#DD441B"
                                                  />
                                                </svg>
                                              ) : (
                                                <Upload size={16} />
                                              )}
                                              <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) =>
                                                  setEditTrack({
                                                    ...editTrack,
                                                    trackImage:
                                                      e.target.files[0],
                                                  })
                                                }
                                              />
                                            </div>
                                          </label>

                                          {/* Track Icon Upload */}
                                          <label
                                            className={`flex items-center justify-between p-2 cursor-pointer w-full rounded-md border border-gray-600 focus:outline-none ${
                                              darkMode
                                                ? "bg-inherit text-white"
                                                : "bg-inherit text-black"
                                            }`}
                                          >
                                            <div className="flex flex-col flex-1">
                                              <span className="text-sm text-gray-400">
                                                {editTrack.trackIcon
                                                  ? "Change Track Icon"
                                                  : "Upload Track Icon"}
                                              </span>
                                              {editTrack.trackIcon &&
                                                typeof editTrack.trackIcon ===
                                                  "object" && (
                                                  <span className="text-xs text-[#F48567] mt-1 truncate">
                                                    {editTrack.trackIcon.name}
                                                  </span>
                                                )}
                                              {editTrack.trackIcon &&
                                                typeof editTrack.trackIcon ===
                                                  "string" && (
                                                  <span className="text-xs text-[#F48567] mt-1 truncate">
                                                    {editTrack.trackIcon
                                                      .split("/")
                                                      .pop()}
                                                  </span>
                                                )}
                                            </div>
                                            <div className="flex items-center">
                                              {editTrack.trackIcon ? (
                                                <svg
                                                  width="18"
                                                  height="18"
                                                  viewBox="0 0 18 18"
                                                  fill="none"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditTrack({
                                                      ...editTrack,
                                                      trackIcon: null,
                                                    });
                                                  }}
                                                  className="cursor-pointer ml-2"
                                                >
                                                  <path
                                                    d="M9 0.25C4.125 0.25 0.25 4.125 0.25 9C0.25 13.875 4.125 17.75 9 17.75C13.875 17.75 17.75 13.875 17.75 9C17.75 4.125 13.875 0.25 9 0.25ZM12.375 13.375L9 10L5.625 13.375L4.625 12.375L8 9L4.625 5.625L5.625 4.625L9 8L12.375 4.625L13.375 5.625L10 9L13.375 12.375L12.375 13.375Z"
                                                    fill="#DD441B"
                                                  />
                                                </svg>
                                              ) : (
                                                <Upload size={16} />
                                              )}
                                              <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) =>
                                                  setEditTrack({
                                                    ...editTrack,
                                                    trackIcon:
                                                      e.target.files[0],
                                                  })
                                                }
                                              />
                                            </div>
                                          </label>

                                          <div className="flex gap-2 justify-between mt-2">
                                            <button
                                              className="bg-[#F48567] px-4 py-1 rounded-md text-sm w-[145px] text-black"
                                              onClick={() =>
                                                setShowTrackActionModal(true)
                                              }
                                            >
                                              Save
                                            </button>

                                            <button
                                              className="bg-[#C7C7C7] px-4 py-1 rounded-md text-sm w-[145px] text-black"
                                              onClick={() => setEditTrack(null)}
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
                        {!["HR", "Partner"].includes(userRole) && (
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

                              {isOpenPartner && (
                                <div
                                  className={`dropdown-menu flex flex-col items-center w-full p-2 rounded-md  focus:outline-none mb-3 ${
                                    darkMode ? "bg-[#333333]" : "bg-gray-200"
                                  } `}
                                >
                                  {partners.map((partner, index) => (
                                    <div
                                      key={partner._id || partner.id}
                                      className="dropdown-item flex items-start w-full p-2 cursor-pointer"
                                      onClick={() =>
                                        handleSelectPartner(partner)
                                      } // Pass full partner object
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-full border-2 border-[#F48567] flex items-center justify-center">
                                          {formData.partner ===
                                            `${partner.firstName} ${partner.lastName}` && (
                                            <span className="w-2 h-2 rounded-full bg-[#F48567]" />
                                          )}
                                        </span>
                                        <span
                                          className={`text-sm ${
                                            darkMode
                                              ? "text-white"
                                              : "text-black"
                                          }`}
                                        >
                                          {partner.firstName} {partner.lastName}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col w-full">
                          <label className="mb-1">
                            Module: {formData.moduleName}
                            {modules[0]?.videoFile_introduction?.length > 0 &&
                              ` (${modules[0].videoFile_introduction.length} videos)`}
                          </label>
                          <div className="dropdown-container mb-3">
                            <div
                              className={`dropdown-btn flex p-2 rounded-md ${
                                darkMode ? "bg-[#333333]" : "bg-gray-200"
                              } focus:outline-none mb-2 cursor-pointer w-[380px] h-[40px] ${
                                !formData.tracks
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              onClick={() =>
                                formData.tracks && toggleModuleOpen()
                              }
                            >
                              <span className="text-[13px]">
                                {modulesLoading
                                  ? "Loading modules..."
                                  : formData.moduleName ||
                                    (formData.tracks
                                      ? "Select Module"
                                      : "Select Track First")}
                              </span>
                              <span>
                                {modulesLoading ? (
                                  <Spin size="small" />
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
                                      d="M6.59245 6.46417L11.3066 1.75L10.1283 0.571671L6.00328 4.69667L1.87828 0.571671L0.699951 1.75L5.41412 6.46417C5.57039 6.6204 5.78231 6.70816 6.00328 6.70816C6.22425 6.70816 6.43618 6.6204 6.59245 6.46417Z"
                                      fill="#C7C7C7"
                                    />
                                  </svg>
                                )}
                              </span>
                            </div>

                            {isOpenModule &&
                              formData.tracks &&
                              !modulesLoading && (
                                <div
                                  className={`dropdown-menu flex flex-col items-center w-full p-2 rounded-md ${
                                    darkMode ? "bg-[#333333]" : "bg-gray-200"
                                  } max-h-60 overflow-y-auto`}
                                >
                                  {/* Show existing modules */}
                                  {modulesFromStorage.length > 0 ? (
                                    <>
                                      {modulesFromStorage.map((module) => (
                                        <div
                                          key={module._id}
                                          className={`dropdown-item flex flex-col w-full p-2 rounded-md mb-2 ${
                                            darkMode
                                              ? "bg-[#333333]"
                                              : "bg-gray-200"
                                          }`}
                                        >
                                          <div className="flex items-center justify-between cursor-pointer">
                                            <div
                                              className="flex items-center gap-2 flex-1"
                                              onClick={() =>
                                                handleSelectModule(module)
                                              }
                                            >
                                              <span className="w-4 h-4 rounded-full border-2 border-[#F48567] flex items-center justify-center">
                                                {formData.module ===
                                                  module._id && (
                                                  <span className="w-2 h-2 rounded-full bg-[#F48567]" />
                                                )}
                                              </span>
                                              <span
                                                className={`text-sm ${
                                                  darkMode
                                                    ? "text-white"
                                                    : "text-black"
                                                }`}
                                              >
                                                {module.moduleName}
                                              </span>
                                            </div>

                                            {/* Pencil for existing modules - edit name only */}
                                            <Pencil
                                              size={14}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setEditModule(
                                                  module._id === editModule?._id
                                                    ? null
                                                    : module
                                                );
                                              }}
                                              className="ml-2"
                                            />
                                          </div>

                                          {/* Edit Section for Existing Module - Name + Cover Photo */}
                                          {editModule &&
                                            editModule._id === module._id && (
                                              <div className="mt-2 flex flex-col gap-2 text-white">
                                                <input
                                                  type="text"
                                                  placeholder="Module Name"
                                                  className={`p-2 rounded-md border border-gray-600 focus:outline-none bg-inherit placeholder-gray-400 text-sm ${
                                                    darkMode
                                                      ? "bg-[#333333] text-white"
                                                      : "bg-white text-black"
                                                  }`}
                                                  value={
                                                    editModule.moduleName || ""
                                                  }
                                                  onChange={(e) =>
                                                    setEditModule({
                                                      ...editModule,
                                                      moduleName:
                                                        e.target.value,
                                                    })
                                                  }
                                                />

                                                {/* Cover Photo Upload for Existing Module */}
                                                <label
                                                  className={`flex items-center justify-between p-2 cursor-pointer w-full rounded-md border border-gray-600 focus:outline-none ${
                                                    darkMode
                                                      ? "bg-inherit text-white"
                                                      : "bg-inherit text-black"
                                                  }`}
                                                >
                                                  <div className="flex flex-col flex-1">
                                                    <span className="text-sm text-gray-400">
                                                      {editModule.cover_Photo
                                                        ? "Change Cover Photo"
                                                        : "Upload Cover Photo"}
                                                    </span>
                                                    {editModule.cover_Photo && (
                                                      <span className="text-xs text-[#F48567] mt-1 truncate">
                                                        {typeof editModule.cover_Photo ===
                                                        "object"
                                                          ? editModule
                                                              .cover_Photo.name
                                                          : editModule.cover_Photo
                                                              .split("/")
                                                              .pop()}
                                                      </span>
                                                    )}
                                                  </div>
                                                  <div className="flex items-center">
                                                    {editModule.cover_Photo ? (
                                                      <svg
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 18 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          setEditModule({
                                                            ...editModule,
                                                            cover_Photo: null,
                                                          });
                                                        }}
                                                        className="cursor-pointer ml-2"
                                                      >
                                                        <path
                                                          d="M9 0.25C4.125 0.25 0.25 4.125 0.25 9C0.25 13.875 4.125 17.75 9 17.75C13.875 17.75 17.75 13.875 17.75 9C17.75 4.125 13.875 0.25 9 0.25ZM12.375 13.375L9 10L5.625 13.375L4.625 12.375L8 9L4.625 5.625L5.625 4.625L9 8L12.375 4.625L13.375 5.625L10 9L13.375 12.375L12.375 13.375Z"
                                                          fill="#DD441B"
                                                        />
                                                      </svg>
                                                    ) : (
                                                      <Upload size={16} />
                                                    )}
                                                    <input
                                                      type="file"
                                                      accept="image/*"
                                                      className="hidden"
                                                      onChange={(e) => {
                                                        const file =
                                                          e.target.files[0];
                                                        if (file) {
                                                          setEditModule({
                                                            ...editModule,
                                                            cover_Photo: file,
                                                          });
                                                        }
                                                      }}
                                                    />
                                                  </div>
                                                </label>

                                                <div className="flex gap-2 justify-between mt-2">
                                                  <button
                                                    className="bg-[#F48567] px-4 py-1 rounded-md text-sm w-[145px] text-black"
                                                    onClick={() =>
                                                      handleSaveExistingModule()
                                                    }
                                                  >
                                                    Save
                                                  </button>

                                                  <button
                                                    className="bg-[#C7C7C7] px-4 py-1 rounded-md text-sm w-[145px] text-black"
                                                    onClick={() =>
                                                      setEditModule(null)
                                                    }
                                                  >
                                                    Cancel
                                                  </button>
                                                </div>
                                              </div>
                                            )}
                                        </div>
                                      ))}

                                      {/* Show template modules for remaining slots (up to 15 total) */}
                                      {Array.from({
                                        length: Math.max(
                                          0,
                                          15 - modulesFromStorage.length
                                        ),
                                      }).map((_, index) => {
                                        const moduleNumber =
                                          modulesFromStorage.length + index + 1;
                                        const templateModule = {
                                          _id: `template-${moduleNumber}`,
                                          moduleName: `Module ${moduleNumber}`,
                                          isTemplate: true,
                                        };

                                        return (
                                          <div
                                            key={templateModule._id}
                                            className={`dropdown-item flex flex-col w-full p-2 rounded-md mb-2 opacity-70 ${
                                              darkMode
                                                ? "bg-[#333333]"
                                                : "bg-gray-200"
                                            }`}
                                          >
                                            <div className="flex items-center justify-between cursor-pointer">
                                              <div
                                                className="flex items-center gap-2 flex-1"
                                                onClick={() =>
                                                  handleSelectModule(
                                                    templateModule
                                                  )
                                                }
                                              >
                                                <span className="w-4 h-4 rounded-full border-2 border-[#F48567] flex items-center justify-center">
                                                  {formData.module ===
                                                    templateModule._id && (
                                                    <span className="w-2 h-2 rounded-full bg-[#F48567]" />
                                                  )}
                                                </span>
                                                <span
                                                  className={`text-sm ${
                                                    darkMode
                                                      ? "text-white"
                                                      : "text-black"
                                                  }`}
                                                >
                                                  {templateModule.moduleName}
                                                </span>
                                              </div>

                                              {/* Pencil for template modules - create new module */}
                                              <Pencil
                                                size={14}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setEditModule(
                                                    templateModule._id ===
                                                      editModule?._id
                                                      ? null
                                                      : templateModule
                                                  );
                                                }}
                                                className="ml-2"
                                              />
                                            </div>

                                            {/* Create Section for Template Module - Name + Cover Photo */}
                                            {editModule &&
                                              editModule._id ===
                                                templateModule._id && (
                                                <div className="mt-2 flex flex-col gap-2 text-white">
                                                  <input
                                                    type="text"
                                                    placeholder="Module Name"
                                                    className={`p-2 rounded-md border border-gray-600 focus:outline-none bg-inherit placeholder-gray-400 text-sm ${
                                                      darkMode
                                                        ? "bg-[#333333] text-white"
                                                        : "bg-white text-black"
                                                    }`}
                                                    value={
                                                      editModule.moduleName ||
                                                      ""
                                                    }
                                                    onChange={(e) =>
                                                      setEditModule({
                                                        ...editModule,
                                                        moduleName:
                                                          e.target.value,
                                                      })
                                                    }
                                                  />

                                                  {/* Cover Photo Upload for New Module */}
                                                  {/* Cover Photo Upload for New Module */}
                                                  <label
                                                    className={`flex items-center justify-between p-2 cursor-pointer w-full rounded-md border border-gray-600 focus:outline-none ${
                                                      darkMode
                                                        ? "bg-inherit text-white"
                                                        : "bg-inherit text-black"
                                                    }`}
                                                  >
                                                    <div className="flex flex-col flex-1">
                                                      <span className="text-sm text-gray-400">
                                                        {editModule.cover_Photo
                                                          ? "Change Cover Photo"
                                                          : "Upload Cover Photo"}
                                                      </span>
                                                      {editModule.cover_Photo && (
                                                        <span className="text-xs text-[#F48567] mt-1 truncate">
                                                          {
                                                            editModule
                                                              .cover_Photo.name
                                                          }
                                                        </span>
                                                      )}
                                                    </div>
                                                    <div className="flex items-center">
                                                      {editModule.cover_Photo ? (
                                                        <svg
                                                          width="18"
                                                          height="18"
                                                          viewBox="0 0 18 18"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditModule({
                                                              ...editModule,
                                                              cover_Photo: null,
                                                            });
                                                          }}
                                                          className="cursor-pointer ml-2"
                                                        >
                                                          <path
                                                            d="M9 0.25C4.125 0.25 0.25 4.125 0.25 9C0.25 13.875 4.125 17.75 9 17.75C13.875 17.75 17.75 13.875 17.75 9C17.75 4.125 13.875 0.25 9 0.25ZM12.375 13.375L9 10L5.625 13.375L4.625 12.375L8 9L4.625 5.625L5.625 4.625L9 8L12.375 4.625L13.375 5.625L10 9L13.375 12.375L12.375 13.375Z"
                                                            fill="#DD441B"
                                                          />
                                                        </svg>
                                                      ) : (
                                                        <Upload size={16} />
                                                      )}
                                                      <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                          const file =
                                                            e.target.files[0];
                                                          if (file) {
                                                            setEditModule({
                                                              ...editModule,
                                                              cover_Photo: file,
                                                            });
                                                          }
                                                        }}
                                                      />
                                                    </div>
                                                  </label>

                                                  <div className="flex gap-2 justify-between mt-2">
                                                    <button
                                                      className="bg-[#F48567] px-4 py-1 rounded-md text-sm w-[145px] text-black"
                                                      onClick={() =>
                                                        handleCreateNewModule()
                                                      }
                                                    >
                                                      Save
                                                    </button>

                                                    <button
                                                      className="bg-[#C7C7C7] px-4 py-1 rounded-md text-sm w-[145px] text-black"
                                                      onClick={() =>
                                                        setEditModule(null)
                                                      }
                                                    >
                                                      Cancel
                                                    </button>
                                                  </div>
                                                </div>
                                              )}
                                          </div>
                                        );
                                      })}
                                    </>
                                  ) : (
                                    // If no modules exist, show 15 template modules
                                    Array.from({ length: 15 }).map(
                                      (_, index) => {
                                        const moduleNumber = index + 1;
                                        const templateModule = {
                                          _id: `template-${moduleNumber}`,
                                          moduleName: `Module ${moduleNumber}`,
                                          isTemplate: true,
                                        };

                                        return (
                                          <div
                                            key={templateModule._id}
                                            className={`dropdown-item flex flex-col w-full p-2 rounded-md mb-2 opacity-70 ${
                                              darkMode
                                                ? "bg-[#333333]"
                                                : "bg-gray-200"
                                            }`}
                                          >
                                            <div className="flex items-center justify-between cursor-pointer">
                                              <div
                                                className="flex items-center gap-2 flex-1"
                                                onClick={() =>
                                                  handleSelectModule(
                                                    templateModule
                                                  )
                                                }
                                              >
                                                <span className="w-4 h-4 rounded-full border-2 border-[#F48567] flex items-center justify-center">
                                                  {formData.module ===
                                                    templateModule._id && (
                                                    <span className="w-2 h-2 rounded-full bg-[#F48567]" />
                                                  )}
                                                </span>
                                                <span
                                                  className={`text-sm ${
                                                    darkMode
                                                      ? "text-white"
                                                      : "text-black"
                                                  }`}
                                                >
                                                  {templateModule.moduleName}
                                                </span>
                                              </div>

                                              {/* Pencil for template modules - create new module */}
                                              <Pencil
                                                size={14}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setEditModule(
                                                    templateModule._id ===
                                                      editModule?._id
                                                      ? null
                                                      : templateModule
                                                  );
                                                }}
                                                className="ml-2"
                                              />
                                            </div>

                                            {/* Create Section for Template Module - Name + Cover Photo */}
                                            {editModule &&
                                              editModule._id ===
                                                templateModule._id && (
                                                <div className="mt-2 flex flex-col gap-2 text-white">
                                                  <input
                                                    type="text"
                                                    placeholder="Module Name"
                                                    className={`p-2 rounded-md border border-gray-600 focus:outline-none bg-inherit placeholder-gray-400 text-sm ${
                                                      darkMode
                                                        ? "bg-[#333333] text-white"
                                                        : "bg-white text-black"
                                                    }`}
                                                    value={
                                                      editModule.moduleName ||
                                                      ""
                                                    }
                                                    onChange={(e) =>
                                                      setEditModule({
                                                        ...editModule,
                                                        moduleName:
                                                          e.target.value,
                                                      })
                                                    }
                                                  />

                                                  {/* Cover Photo Upload for New Module */}
                                                  <label
                                                    className={`flex items-center justify-between p-2 cursor-pointer w-full rounded-md border border-gray-600 focus:outline-none ${
                                                      darkMode
                                                        ? "bg-inherit text-white"
                                                        : "bg-inherit text-black"
                                                    }`}
                                                  >
                                                    <div className="flex flex-col flex-1">
                                                      <span className="text-sm text-gray-400">
                                                        {editModule.cover_Photo
                                                          ? "Change Cover Photo"
                                                          : "Upload Cover Photo"}
                                                      </span>
                                                      {editModule.cover_Photo && (
                                                        <span className="text-xs text-[#F48567] mt-1 truncate">
                                                          {editModule
                                                            .cover_Photo.name ||
                                                            editModule.cover_Photo}
                                                        </span>
                                                      )}
                                                    </div>
                                                    <div className="flex items-center">
                                                      {editModule.cover_Photo ? (
                                                        <svg
                                                          width="18"
                                                          height="18"
                                                          viewBox="0 0 18 18"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditModule({
                                                              ...editModule,
                                                              cover_Photo: null,
                                                            });
                                                          }}
                                                          className="cursor-pointer ml-2"
                                                        >
                                                          <path
                                                            d="M9 0.25C4.125 0.25 0.25 4.125 0.25 9C0.25 13.875 4.125 17.75 9 17.75C13.875 17.75 17.75 13.875 17.75 9C17.75 4.125 13.875 0.25 9 0.25ZM12.375 13.375L9 10L5.625 13.375L4.625 12.375L8 9L4.625 5.625L5.625 4.625L9 8L12.375 4.625L13.375 5.625L10 9L13.375 12.375L12.375 13.375Z"
                                                            fill="#DD441B"
                                                          />
                                                        </svg>
                                                      ) : (
                                                        <Upload size={16} />
                                                      )}
                                                      <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) =>
                                                          setEditModule({
                                                            ...editModule,
                                                            cover_Photo:
                                                              e.target.files[0],
                                                          })
                                                        }
                                                      />
                                                    </div>
                                                  </label>

                                                  <div className="flex gap-2 justify-between mt-2">
                                                    <button
                                                      className="bg-[#F48567] px-4 py-1 rounded-md text-sm w-[145px] text-black"
                                                      onClick={() =>
                                                        handleCreateNewModule()
                                                      }
                                                    >
                                                      Save
                                                    </button>

                                                    <button
                                                      className="bg-[#C7C7C7] px-4 py-1 rounded-md text-sm w-[145px] text-black"
                                                      onClick={() =>
                                                        setEditModule(null)
                                                      }
                                                    >
                                                      Cancel
                                                    </button>
                                                  </div>
                                                </div>
                                              )}
                                          </div>
                                        );
                                      }
                                    )
                                  )}
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
                            : "cursor-pointer "
                        } ${darkMode ? "bg-[#333333]" : "bg-gray-200"}`}
                        onClick={handleOpenLearningVideo}
                        disabled={learningVideoSubmitted}
                      >
                        <div className="flex justify-between items-center">
                          <span>
                            {learningVideoSubmitted
                              ? "Submitted"
                              : "Learning Video"}
                          </span>
                          {learningVideoSubmitted ? (
                            // ✅ Checkmark SVG
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M16.8134 9.93536C16.1884 13.0604 13.8321 16.0029 10.5259 16.6604C8.91338 16.9815 7.24066 16.7857 5.7459 16.1008C4.25114 15.416 3.01054 14.277 2.20076 12.8461C1.39098 11.4152 1.05329 9.76522 1.23578 8.1312C1.41827 6.49718 2.11163 4.96239 3.21714 3.74536C5.48464 1.24786 9.31339 0.56036 12.4384 1.81036"
                                stroke="#F48567"
                                stroke-width="1.875"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M6.1875 8.68652L9.3125 11.8115L16.8125 3.68652"
                                stroke="#F48567"
                                stroke-width="1.875"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          ) : (
                            // ➕ Square plus icon
                            <SquarePlus />
                          )}
                        </div>
                      </button>
                      <button
                        type="submit"
                        className={`px-4 py-2 w-[180px] h-[40px] rounded-lg focus:outline-none-xl text-[#F48567]   ${
                          formData.partner
                            ? " cursor-pointer"
                            : "cursor-pointer "
                        } ${darkMode ? "bg-[#333333]" : "bg-gray-200"}`}
                        onClick={handleOpenChallange}
                        // disabled={!learningVideoSubmitted}
                      >
                        <div className="flex justify-between items-center">
                          <span>
                            {challengeSubmitted ? "Submitted" : "Challenge"}
                          </span>
                          {challengeSubmitted ? (
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M16.8134 9.93536C16.1884 13.0604 13.8321 16.0029 10.5259 16.6604C8.91338 16.9815 7.24066 16.7857 5.7459 16.1008C4.25114 15.416 3.01054 14.277 2.20076 12.8461C1.39098 11.4152 1.05329 9.76522 1.23578 8.1312C1.41827 6.49718 2.11163 4.96239 3.21714 3.74536C5.48464 1.24786 9.31339 0.56036 12.4384 1.81036"
                                stroke="#F48567"
                                stroke-width="1.875"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M6.1875 8.68652L9.3125 11.8115L16.8125 3.68652"
                                stroke="#F48567"
                                stroke-width="1.875"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          ) : (
                            <SquarePlus />
                          )}
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
                          {/* <button
            type="button"
            className=" mb-3 px-4 py-2 rounded-xl border border-gray-600 focus:outline-none-xl text-[#F48567] flex items-center justify-center"
            onClick={handleAddModulefromavilable}
          >
            Add Module
          </button> */}
                        </div>
                        {/* Always show multiple title inputs */}
                        <div className="flex flex-col mt-3 space-y-2">
                          <label className="mb-1">
                            Learning Video {modules.length + 1}
                          </label>
                          <label className="mb-1">Learning Video Titles </label>

                          {Array.from({
                            length: Math.max(
                              1,
                              formData.videoFile_introduction.length
                            ),
                          }).map((_, index) => (
                            <div
                              key={index}
                              className="space-y-3 border border-gray-600 p-3 rounded-xl"
                            >
                              {/* 1. Video Title */}
                              <input
                                type="text"
                                placeholder={"Title for Video"}
                                className="p-2 rounded-xl border border-gray-600 focus:outline-none w-full"
                                value={
                                  formData.learningVideoTitles[index] || ""
                                }
                                onChange={(e) => {
                                  const newTitles = [
                                    ...(formData.learningVideoTitles || []),
                                  ];
                                  newTitles[index] = e.target.value;
                                  setFormData({
                                    ...formData,
                                    learningVideoTitles: newTitles,
                                  });
                                }}
                              />

                              {/* 2. Video Description */}
                              <textarea
                                placeholder={"Description for Video"}
                                className="p-2 rounded-xl border border-gray-600 focus:outline-none w-full min-h-[80px]"
                                value={
                                  formData.description_videofile_text[index] ||
                                  ""
                                }
                                onChange={(e) => {
                                  const newDescriptions = [
                                    ...(formData.description_videofile_text ||
                                      []),
                                  ];
                                  newDescriptions[index] = e.target.value;
                                  setFormData({
                                    ...formData,
                                    description_videofile_text: newDescriptions,
                                  });
                                }}
                              />

                              {/* 3. Video Cover Photo */}
                              <div className="flex flex-col w-full">
                                <label className="mb-1 text-sm">
                                  Cover Photo for Video
                                </label>
                                <label className="p-2 pl-4 pr-4 rounded-xl border border-gray-600 focus:outline-none flex items-center justify-between cursor-pointer">
                                  <div className="flex-1">
                                    {formData.learningVideoCovers[index]
                                      ?.name || "Upload Cover for Video"}
                                  </div>
                                  <div className="flex items-center">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                          const newCovers = [
                                            ...(formData.learningVideoCovers ||
                                              []),
                                          ];
                                          newCovers[index] = file;
                                          setFormData({
                                            ...formData,
                                            learningVideoCovers: newCovers,
                                          });
                                        }
                                      }}
                                    />
                                    {formData.learningVideoCovers[index] ? (
                                      <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 18 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const newCovers = [
                                            ...(formData.learningVideoCovers ||
                                              []),
                                          ];
                                          newCovers[index] = null;
                                          setFormData({
                                            ...formData,
                                            learningVideoCovers: newCovers,
                                          });
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
                            </div>
                          ))}
                        </div>
                        {/* Module Description (Keep this outside the map - it's for the entire module) */}
                        <div className="flex flex-col mt-3">
                          <label className="mb-1">Description</label>
                          <textarea
                            name="description"
                            placeholder="Provide a brief description"
                            className="p-2 rounded-xl border border-gray-600 focus:outline-none min-h-[100px]"
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="flex flex-col w-full mt-3">
                          <label className="mb-1">Upload Cover Photo</label>

                          <label className="p-2 pl-4 pr-4 rounded-xl border border-gray-600 focus:outline-none flex items-center justify-between cursor-pointer">
                            <div>
                              {formData.cover_Photo instanceof File
                                ? formData.cover_Photo.name
                                : formData.cover_Photo
                                ? "Change Cover Photo"
                                : "Upload Cover Photo"}
                            </div>
                            <div className="flex items-center">
                              <input
                                name="cover_Photo"
                                type="file"
                                accept="image/*"
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
                                    e.stopPropagation();
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
                        {/* Learning Videos Upload Section - This will handle BOTH introduction and description */}
                        <div className="flex flex-col w-full mt-3">
                          <label className="mb-1">
                            Upload Learning Video(s)
                          </label>

                          {/* Show existing learning videos */}
                          {Array.isArray(formData.videoFile_introduction) &&
                            formData.videoFile_introduction.length > 0 && (
                              <div className="mb-2 space-y-2">
                                {formData.videoFile_introduction.map(
                                  (video, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-md"
                                    >
                                      <span className="text-sm truncate flex-1">
                                        {video instanceof File
                                          ? video.name
                                          : video.split("/").pop()}
                                      </span>
                                      <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 18 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        onClick={() =>
                                          handleRemoveVideoFromArray(
                                            "videoFile_introduction",
                                            index
                                          )
                                        }
                                        className="cursor-pointer ml-2"
                                      >
                                        <path
                                          d="M9 0.25C4.125 0.25 0.25 4.125 0.25 9C0.25 13.875 4.125 17.75 9 17.75C13.875 17.75 17.75 13.875 17.75 9C17.75 4.125 13.875 0.25 9 0.25ZM12.375 13.375L9 10L5.625 13.375L4.625 12.375L8 9L4.625 5.625L5.625 4.625L9 8L12.375 4.625L13.375 5.625L10 9L13.375 12.375L12.375 13.375Z"
                                          fill="#DD441B"
                                        />
                                      </svg>
                                    </div>
                                  )
                                )}
                              </div>
                            )}

                          {/* Upload button for learning videos */}
                          <label className="p-2 pl-4 pr-4 rounded-xl border border-gray-600 focus:outline-none flex items-center justify-between cursor-pointer">
                            <div>
                              {formData.videoFile_introduction?.length > 0
                                ? `${formData.videoFile_introduction.length} video(s) selected - Add more`
                                : "Upload Learning Video(s)"}
                            </div>
                            <div className="flex items-center">
                              <input
                                name="videoFile_introduction"
                                type="file"
                                multiple
                                accept="video/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleFileChange(e, "videoFile_introduction")
                                }
                              />
                              {formData.videoFile_introduction?.length > 0 ? (
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 18 18"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveFile("videoFile_introduction");
                                  }}
                                  className="cursor-pointer"
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
                          <p className="text-xs text-[#C7C7C7]">
                            Max 25 MB per file & landscape format. You can
                            select multiple videos.
                          </p>
                        </div>
                        <div className="flex gap-4 mt-4 w-full">
                          <div className="flex flex-col w-full">
                            <button
                              type="button"
                              className="bg-[#F48567] px-4 py-2 rounded-xl border border-gray-600 focus:outline-none-xl text-[#000] flex items-center justify-center"
                              onClick={handleAddModule} // This should call handleAddModule
                              disabled={loading}
                            >
                              {loading ? <Spin size="small" /> : "Save"}
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

                        {formData.partner && (
                          <div className="w-full mt-4 text-sm text-white flex justify-end">
                            Partner: {formData.partner}
                          </div>
                        )}
                      </section>
                    )}
                  </div>
                )}

                {isCreatedModuleVisible && (
                  <section className="flex flex-col space-y-4">
                    <button
                      type="button"
                      className=" px-4 py-2 rounded-xl bg-[#333333] focus:outline-none-xl text-[#F48567] flex items-center justify-center gap-2"
                      onClick={handleAddModulefromavilablenew}
                    >
                      {editingIndex !== null ? "" : "Learning Video"}
                      <SquarePlus />
                    </button>

                    {modules &&
                      modules.map((module, index) => {
                        // Safe URL creation with validation
                        const createSafeURL = (fileData) => {
                          if (!fileData) return null;

                          if (
                            fileData instanceof File ||
                            fileData instanceof Blob
                          ) {
                            try {
                              return URL.createObjectURL(fileData);
                            } catch (error) {
                              console.error(
                                "Error creating object URL:",
                                error
                              );
                              return null;
                            }
                          }

                          if (
                            typeof fileData === "string" &&
                            fileData.startsWith("http")
                          ) {
                            return fileData;
                          }

                          return null;
                        };

                        const coverPhotoURL = createSafeURL(module.cover_Photo);

                        // Handle video arrays
                        const videoIntroURLs = Array.isArray(
                          module.videoFile_introduction
                        )
                          ? module.videoFile_introduction
                              .map(createSafeURL)
                              .filter(Boolean)
                          : [];

                        const videoDescURLs = Array.isArray(
                          module.videoFile_description
                        )
                          ? module.videoFile_description
                              .map(createSafeURL)
                              .filter(Boolean)
                          : [];

                        return (
                          <div className="" key={module.uniqueUploadId}>
                            <label className="mb-1">
                              Learning Video {module.entryNumber || index + 1}
                            </label>
                            <div className="flex justify-between items-start gap-2">
                              <div className="w-full p-2 rounded-xl border border-gray-600 focus:outline-none shadow-md">
                                {/* Module Header with Dropdown Toggle */}
                                <div
                                  className="flex justify-between items-center cursor-pointer"
                                  onClick={() =>
                                    setExpandedIndex(
                                      expandedIndex === index ? null : index
                                    )
                                  }
                                >
                                  <h3 className="">
                                    Learning Video{" "}
                                    {module.entryNumber || index + 1}
                                  </h3>
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
                                      expandedIndex === index
                                        ? "rotate-180"
                                        : ""
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
                                  <div className="mt-2 p-2">
                                    {/* Module Name Header */}
                                    <div className="flex justify-between">
                                      <span>
                                        <p className="text-sm">Module</p>
                                        <p className="text-sm mt-2">
                                          {module.moduleName}
                                        </p>
                                      </span>
                                      <svg
                                        onClick={() => {
                                          setFormData(module);
                                          setEditingIndex(index);
                                          setIsSection2Visible(true);
                                          setisCreatedModuleVisible(false);
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
                                          strokeWidth="1.25"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </div>

                                    {/* Learning Video Titles */}
                                    {module.learningVideoTitles?.length > 0 && (
                                      <div className="mt-4">
                                        <p className="text-sm font-medium">
                                          Learning Video Titles:
                                        </p>
                                        <div className="mt-2 space-y-1">
                                          {module.learningVideoTitles.map(
                                            (title, idx) => (
                                              <p
                                                key={idx}
                                                className="text-sm text-gray-300 pl-2"
                                              >
                                                {idx + 1}.{" "}
                                                {title || `Video ${idx + 1}`}
                                              </p>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Description */}
                                    <div className="mt-4">
                                      <p className="text-sm">Description</p>
                                      <p className="text-sm mt-2">
                                        {module.description}
                                      </p>
                                    </div>

                                    {/* Media Section */}
                                    <section className="mt-4">
                                      <div className="grid grid-cols-1 gap-4">
                                        {/* Cover Photo */}
                                        <div>
                                          <p className="text-sm mb-2">
                                            Cover Photo
                                          </p>
                                          {coverPhotoURL && (
                                            <img
                                              src={coverPhotoURL}
                                              alt="Cover"
                                              className="w-full h-32 object-cover rounded-xl border border-gray-600"
                                            />
                                          )}
                                        </div>

                                        {/* Introduction Videos */}
                                        {videoIntroURLs.length > 0 && (
                                          <div>
                                            <p className="text-sm mb-2">
                                              Learning Videos (
                                              {videoIntroURLs.length})
                                            </p>
                                            <div className="grid grid-cols-2 gap-2">
                                              {videoIntroURLs.map(
                                                (url, vidIndex) => (
                                                  <div
                                                    key={vidIndex}
                                                    className="relative"
                                                  >
                                                    <video
                                                      src={url}
                                                      controls
                                                      className="w-full h-32 object-cover rounded-xl border border-gray-600"
                                                    />
                                                    {module
                                                      .learningVideoTitles?.[
                                                      vidIndex
                                                    ] && (
                                                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 rounded-b-xl truncate">
                                                        {
                                                          module
                                                            .learningVideoTitles[
                                                            vidIndex
                                                          ]
                                                        }
                                                      </div>
                                                    )}
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        )}

                                        {/* Description Videos */}
                                        {videoDescURLs.length > 0 && (
                                          <div>
                                            <p className="text-sm mb-2">
                                              Explanatory Videos (
                                              {videoDescURLs.length})
                                            </p>
                                            <div className="grid grid-cols-2 gap-2">
                                              {videoDescURLs.map(
                                                (url, vidIndex) => (
                                                  <video
                                                    key={vidIndex}
                                                    src={url}
                                                    controls
                                                    className="w-full h-32 object-cover rounded-xl border border-gray-600"
                                                  />
                                                )
                                              )}
                                            </div>
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
                      {/* <button
                        type="button"
                        className=" px-4 py-2 mb-3 rounded-xl bg-[#333333] focus:outline-none-xl text-[#F48567] flex items-center justify-center"
                        onClick={handleAddChallenge}
                      >
                        {editingIndex !== null ? "" : "Add Challenge"}
                      </button> */}
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
                          // onClick={() => {
                          //   setisCreatedContentVisible(true);
                          // }}
                          onClick={handleClosePopup}
                          className="bg-[#C7C7C7] px-4 py-2 rounded-xl border border-gray-600 focus:outline-none-xl text-[#000]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                    {formData.partner && (
                      <div className="w-full mt-4 text-sm text-white flex justify-end">
                        Partner: {formData.partner}
                      </div>
                    )}
                  </section>
                )}

                {isCreatedContentVisible && (
                  <section className="flex flex-col space-y-4">
                    <button
                      type="button"
                      className=" px-4 py-2 rounded-xl bg-[#333333] focus:outline-none-xl text-[#F48567] flex items-center justify-center"
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
                                        // handleEditChallenge(index);
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
          setIsSectionVisible(true);
          setIsSection2Visible(false);
          setisCreatedModuleVisible(false);
          setModules([]);

          setFormData({
            ...formData, // Keep track, module, partner selections
            description: "",
            cover_Photo: null,
            videoFile_introduction: [],
            videoFile_description: [],
            learningVideoTitles: [],
            learningVideoCovers: [],
            description_videofile_text: [],
            content: "",
          });

          setLearningVideoSubmitted(true);
        }}
        onConfirm={() => {
          setShowSuccessModal(false);
          setIsSectionVisible(true);
          setIsSection2Visible(false);
          setisCreatedModuleVisible(false);
          setModules([]);

          // ✅ CORRECT: Only preserve dropdown data, clear file uploads
          setFormData({
            ...formData, // Keep track, module, partner selections
            description: "",
            cover_Photo: null,
            videoFile_introduction: [],
            videoFile_description: [],
            learningVideoTitles: [],
            content: "",
          });

          setLearningVideoSubmitted(true);
        }}
        message="Your Learning Data Successfully Submitted."
        confirmText="OK"
        showCancel={false}
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
        message="If you cancel now all data will be removed from the system. Are you sure ?"
        confirmText="Yes"
        cancelText="No"
        darkMode={darkMode}
      />

      {/* <ConfirmationModal
        isOpen={showChallengeSuccess}
        onClose={() => {
          setShowChallengeSuccess(false);

          setIsSectionVisible(true);
          setIsSection3Visible(false);
          setisCreatedContentVisible(false);
          setChallenges([]);
          setChallengeData({
            ...challengeData, // This preserves module reference
            challengeName: "",
            challenge_Description: "",
            challenge_benefits: "",
            duration: "0h 00 min",
            difficulty_Level: "",
            video_or_image: null,
          });
          // setChallengeData(initialChallangeData);
          settime({ duration: 0 });

          // Set submitted state
          setChallengeSubmitted(true);

          // Reset after 2 seconds
          // setTimeout(() => {
          //   setChallengeSubmitted(false);
          // }, 2000);
        }}
        onConfirm={() => {
          setShowChallengeSuccess(false);
          // Reset to first section and show "Submitted" text
          setIsSectionVisible(true);
          setIsSection3Visible(false);
          setisCreatedContentVisible(false);
          setChallenges([]);
          setChallengeData(initialChallangeData);
          settime({ duration: 0 });

          // Set submitted state
          setChallengeSubmitted(true);

          // Reset after 2 seconds
          // setTimeout(() => {
          //   setChallengeSubmitted(false);
          // }, 2000);
        }}
        message="Your Challenge Data Successfully Submitted."
        confirmText="OK"
        showCancel={false}
        darkMode={darkMode}
      /> */}

      <ConfirmationModal
        isOpen={showChallengeSuccess}
        onClose={() => {
          setShowChallengeSuccess(false);
          handleClosePopup(); // Close modal on close too
        }}
        onConfirm={() => {
          setShowChallengeSuccess(false);
          handleClosePopup(); // Close modal on OK click
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

      <ConfirmationModal
        isOpen={showTrackActionModal}
        onClose={() => {
          setShowTrackActionModal(false);
          setSelectedTrackForAction(null);
          setSelectedAction(null); // Reset selection when closing
        }}
        message={
          <div className="text-center w-full">
            <div className="text-lg font-semibold mb-4">
              Choose Action for Track
            </div>

            <div className="flex flex-col gap-3 w-full mb-4">
              {/* Update Track Details Button */}
              <button
                className={`px-4 py-3 rounded-md text-sm flex items-center justify-center gap-2 w-full transition-colors border-2 ${
                  selectedAction === "update"
                    ? "bg-[#F48567] text-black border-[#F48567]"
                    : "bg-transparent text-white border-gray-300 hover:border-[#F48567] hover:text-[#F48567]"
                } ${darkMode ? "border-gray-600 text-white" : ""}`}
                onClick={() => setSelectedAction("update")}
                disabled={actionLoading}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M13.3333 2L14 2.66667L8 8.66667L4 4.66667L4.66667 4L8 7.33333L13.3333 2Z"
                    fill={
                      selectedAction === "update" ? "black" : "currentColor"
                    }
                  />
                  <path
                    d="M12.6667 8.66667V12.6667H3.33333V3.33333H7.33333V2H2.66667C2.29867 2 2 2.29867 2 2.66667V13.3333C2 13.7013 2.29867 14 2.66667 14H13.3333C13.7013 14 14 13.7013 14 13.3333V8.66667H12.6667Z"
                    fill={
                      selectedAction === "update" ? "black" : "currentColor"
                    }
                  />
                </svg>
                Update Track Details
              </button>

              {/* Start Fresh Button */}
              <button
                className={`px-4 py-3 rounded-md text-sm flex items-center justify-center gap-2 w-full transition-colors border-2 ${
                  selectedAction === "startFresh"
                    ? "bg-[#FF6B6B] text-white border-[#FF6B6B]"
                    : "bg-transparent text-white border-gray-300 hover:border-[#FF6B6B] hover:text-[#FF6B6B]"
                } ${darkMode ? "border-gray-600 text-white" : ""}`}
                onClick={() => setSelectedAction("startFresh")}
                disabled={actionLoading}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2ZM10.5 8.5H5.5V7.5H10.5V8.5Z"
                    fill={
                      selectedAction === "startFresh" ? "white" : "currentColor"
                    }
                  />
                </svg>
                Start Fresh (Delete All Content)
              </button>
            </div>

            {/* Show action description when an option is selected */}
            {selectedAction && (
              <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                <p className="text-sm">
                  {selectedAction === "update"
                    ? "You are about to update the track details."
                    : "Warning: This will delete all modules and content associated with this track."}
                </p>
              </div>
            )}
          </div>
        }
        confirmText={actionLoading ? "Processing..." : "Confirm"}
        cancelText="Cancel"
        showConfirm={selectedAction !== null} // Only show confirm button when an action is selected
        showCancel={true}
        onConfirm={() => {
          if (selectedAction === "update") {
            handleUpdateTrack();
          } else if (selectedAction === "startFresh") {
            setShowTrackActionModal(false);
            setShowStartFreshModal(true);
          }
        }}
        onCancel={() => {
          setShowTrackActionModal(false);
          setSelectedTrackForAction(null);
          setSelectedAction(null);
        }}
        confirmDisabled={actionLoading}
        darkMode={darkMode}
      />

      {/* Start Fresh Confirmation Modal */}
      <ConfirmationModal
        isOpen={showStartFreshModal}
        onClose={() => {
          setShowStartFreshModal(false);
          setSelectedTrackForAction(null);
        }}
        onConfirm={handleStartFresh}
        message={
          <div className="text-center">
            <div className="text-lg font-semibold text-red-500 mb-2">
              Warning: Start Fresh
            </div>
            <div className="text-sm">
              This action will{" "}
              <span className="font-bold text-red-500">
                DELETE ALL MODULES AND CONTENT
              </span>{" "}
              related to the track "{selectedTrackForAction?.tracksName}".
              <br />
              <br />
              This action cannot be undone. Are you sure you want to continue?
            </div>
            <div className="mt-4 text-xs text-gray-500">
              The track information will be preserved, but all associated
              modules and challenges will be permanently deleted.
            </div>
          </div>
        }
        confirmText={startFreshLoading ? "Processing..." : "Yes, Start Fresh"}
        cancelText="Cancel"
        confirmColor="red"
        darkMode={darkMode}
        disabled={startFreshLoading}
      />

      {/* Track Edit Modal */}
      {editTrack && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`rounded-2xl border border-[#FFFFFF59] shadow-[0_1px_6px_rgba(230,230,230,0.35)] w-96 p-6 relative ${
              darkMode ? "bg-[#1E1E1E] text-white" : "bg-[#fff] text-dark"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Update Track</h2>
              <button
                onClick={() => setEditTrack(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Track Name</label>
                <input
                  type="text"
                  placeholder="Track Name"
                  className={`p-2 rounded-md border border-gray-600 focus:outline-none w-full ${
                    darkMode ? "bg-[#333333] text-white" : "bg-white text-black"
                  }`}
                  value={editTrack.tracksName || ""}
                  onChange={(e) =>
                    setEditTrack({
                      ...editTrack,
                      tracksName: e.target.value,
                    })
                  }
                />
              </div>

              {/* Add file upload fields here if needed */}

              <div className="flex gap-2 mt-6">
                <button
                  className="bg-[#F48567] px-4 py-2 rounded-md text-sm text-black flex-1 flex items-center justify-center gap-2"
                  onClick={handleSaveTrackUpdate}
                  disabled={updateLoading}
                >
                  {updateLoading ? "Updating..." : "Save Changes"}
                </button>
                <button
                  className="bg-[#C7C7C7] px-4 py-2 rounded-md text-sm text-black flex-1"
                  onClick={() => setEditTrack(null)}
                  disabled={updateLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmationModal
        isOpen={showUpdateSuccessModal}
        onClose={() => {
          setShowUpdateSuccessModal(false);
          setIsSectionVisible(true);
          setIsSection2Visible(false);
          setisCreatedModuleVisible(false);
          setModules([]);

          // ✅ CORRECT: Only preserve dropdown data, clear file uploads
          setFormData({
            ...formData, // Keep track, module, partner selections
            description: "",
            cover_Photo: null,
            videoFile_introduction: [],
            videoFile_description: [],
            learningVideoTitles: [],
            content: "",
          });

          setLearningVideoSubmitted(true);
        }}
        onConfirm={() => {
          setShowUpdateSuccessModal(false);
          setIsSectionVisible(true);
          setIsSection2Visible(false);
          setisCreatedModuleVisible(false);
          setModules([]);

          // ✅ CORRECT: Only preserve dropdown data, clear file uploads
          setFormData({
            ...formData, // Keep track, module, partner selections
            description: "",
            cover_Photo: null,
            videoFile_introduction: [],
            videoFile_description: [],
            learningVideoTitles: [],
            content: "",
          });

          setLearningVideoSubmitted(true);
        }}
        message="Your Learning Video Successfully Updated."
        confirmText="OK"
        showCancel={false}
        darkMode={darkMode}
      />
    </>
  );
};

export default ParentComponent;
