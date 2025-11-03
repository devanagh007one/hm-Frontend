import React, { useState, useMemo, useEffect } from "react";
import CryptoJS from "crypto-js";
import {
  updateEventStatus,
  deleteEvent,
} from "../../redux/actions/alleventGet.js";

import {
  fetchAllContent,
  patchTheContent,
  patchTheChallenge,
  deleteChallenge,
  deleteContent,
  setLearningVideoApproval,
  deleteLearningVideoAtIndex,
} from "../../redux/actions/allContentGet.js";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip, Badge, Space, Pagination, Select, Spin, Card } from "antd";
import CreateContent from "../CreateContent.js";
import { showNotification } from "../../redux/actions/notificationActions";
import ChallangeMannage from "./ContentMannage.js";
import ContentMannage from "./Modulechange.js";
import EventMannage from "./EventMannage.js";
import { IconSearch } from "@tabler/icons-react";
import EditContent from "../EditContent.js";
import ConfirmationModal from "../ConfirmationModal.js";

const SvgIcon = ({ onClick }) => (
  <svg
    width="13"
    height="12"
    viewBox="0 0 13 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
    style={{ cursor: "pointer" }}
  >
    <g clipPath="url(#clip0_3004_430)">
      <path
        d="M6.35996 4.18999C6.29675 4.25232 6.26089 4.3372 6.26026 4.42597C6.25964 4.51474 6.2943 4.60012 6.35663 4.66333C6.41895 4.72654 6.50384 4.7624 6.5926 4.76302C6.68137 4.76365 6.76675 4.72899 6.82996 4.66666L8.08329 3.42666V9.38999C8.08329 9.4784 8.11841 9.56318 8.18092 9.6257C8.24344 9.68821 8.32822 9.72333 8.41663 9.72333C8.50503 9.72333 8.58982 9.68821 8.65233 9.6257C8.71484 9.56318 8.74996 9.4784 8.74996 9.38999V3.42666L9.98329 4.66666C10.0144 4.69752 10.0512 4.72196 10.0917 4.73858C10.1323 4.75519 10.1757 4.76367 10.2195 4.76351C10.2633 4.76336 10.3066 4.75458 10.347 4.73767C10.3874 4.72077 10.4241 4.69607 10.455 4.66499C10.4858 4.63391 10.5103 4.59706 10.5269 4.55654C10.5435 4.51601 10.552 4.47261 10.5518 4.42882C10.5517 4.38502 10.5429 4.34168 10.526 4.30127C10.5091 4.26087 10.4844 4.22419 10.4533 4.19333L8.41663 2.15666L6.35996 4.18999Z"
        fill="#F48567"
      />
      <path
        d="M6.90017 7.58667C6.90055 7.52046 6.88121 7.45564 6.84461 7.40046C6.80801 7.34529 6.75581 7.30227 6.69466 7.27688C6.63351 7.25149 6.56619 7.24488 6.50127 7.25791C6.43636 7.27093 6.37679 7.30299 6.33017 7.35L5.0835 8.58667V2.62667C5.0835 2.53826 5.04838 2.45348 4.98587 2.39096C4.92336 2.32845 4.83857 2.29333 4.75017 2.29333C4.66176 2.29333 4.57698 2.32845 4.51447 2.39096C4.45195 2.45348 4.41683 2.53826 4.41683 2.62667V8.58667L3.1735 7.35C3.14242 7.31914 3.10557 7.2947 3.06504 7.27808C3.02452 7.26147 2.98112 7.25299 2.93732 7.25315C2.89352 7.2533 2.85019 7.26208 2.80978 7.27899C2.76938 7.29589 2.7327 7.32059 2.70183 7.35167C2.67097 7.38275 2.64654 7.4196 2.62992 7.46012C2.6133 7.50065 2.60483 7.54405 2.60498 7.58785C2.6053 7.6763 2.64073 7.76101 2.7035 7.82333L4.75017 9.86L6.79683 7.82333C6.82893 7.79274 6.85461 7.75605 6.87235 7.71541C6.89009 7.67478 6.89955 7.63101 6.90017 7.58667Z"
        fill="#F48567"
      />
    </g>
    <defs>
      <clipPath id="clip0_3004_430">
        <rect
          width="12"
          height="12"
          fill="white"
          transform="matrix(0 -1 1 0 0.75 12)"
        />
      </clipPath>
    </defs>
  </svg>
);

const ContentManagement = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const { content: contents } = useSelector((state) => state.content);
  const dispatch = useDispatch();
  const [loadingRecordId, setLoadingRecordId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDownloadForm, setshowDownloadForm] = useState(false);
  const [showImportForm, setshowImportForm] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [filter, setFilter] = useState("all");
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    showCancel: true,
    confirmText: "Confirm",
    record: null,
    actionType: "",
  });

  // Fetch users on mount
  useEffect(() => {
    dispatch(fetchAllContent());
  }, [dispatch]);

  console.log(contents);

  const showConfirmationModal = (config) => {
    setConfirmationModal({
      isOpen: true,
      ...config,
    });
  };

  // Function to close confirmation modal
  const closeConfirmationModal = () => {
    setConfirmationModal({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: null,
      showCancel: true,
      confirmText: "Confirm",
      record: null,
      actionType: "",
    });
  };

  // Function to handle confirmation
  const handleConfirmAction = () => {
    if (confirmationModal.onConfirm) {
      confirmationModal.onConfirm();
    }
    closeConfirmationModal();
  };

  const handleVideoApprovalAction = async (record, videoIndex, status) => {
    try {
      setLoadingRecordId(record._id);

      console.log("=== VIDEO APPROVAL START ===");
      console.log("Record:", record);
      console.log("Video Index:", videoIndex);
      console.log("Status:", status);

      // For learning video entries
      if (record.entryType === "learningVideo" || record.individualVideoTitle) {
        const actualVideoIndex =
          record.videoIndex !== undefined ? record.videoIndex : videoIndex;

        console.log(
          "Processing learning video - Actual Index:",
          actualVideoIndex
        );

        // FIX: Wait for the response and handle it
        const result = await dispatch(
          setLearningVideoApproval(record._id, actualVideoIndex, {
            approvalStatus: status,
          })
        );

        console.log("Dispatch result:", result);

        if (result) {
          // Update local state immediately for better UX
          dispatch(
            showNotification(
              `Successfully ${status} video: ${record.individualVideoTitle}`,
              "success"
            )
          );

          // Refresh content to get updated data from server
          setTimeout(() => {
            dispatch(fetchAllContent());
          }, 500);
        }
      }
      // For modules with multiple videos
      else if (record.moduleName && record.videoFile_description?.length > 0) {
        console.log("Processing module video - Index:", videoIndex);

        const result = await dispatch(
          setLearningVideoApproval(record._id, videoIndex, {
            approvalStatus: status,
          })
        );

        console.log("Dispatch result:", result);

        if (result) {
          dispatch(
            showNotification(
              `Successfully ${status} video in ${record.moduleName}`,
              "success"
            )
          );

          setTimeout(() => {
            dispatch(fetchAllContent());
          }, 500);
        }
      } else {
        dispatch(
          showNotification(
            "This content type doesn't support per-video approval",
            "warning"
          )
        );
      }

      console.log("=== VIDEO APPROVAL END ===");
    } catch (error) {
      console.error("=== VIDEO APPROVAL ERROR ===", error);
      dispatch(
        showNotification(
          `Failed to update video approval: ${error.message}`,
          "error"
        )
      );
    } finally {
      setLoadingRecordId(null);
    }
  };

  const handleDeleteVideoAction = async (record) => {
    try {
      setLoadingRecordId(record._id);

      const videoIndex = record.videoIndex || 0;
      const contentId = record._id;

      console.log("Deleting video:", { contentId, videoIndex });

      const result = await dispatch(
        deleteLearningVideoAtIndex(contentId, videoIndex)
      );

      if (result) {
        dispatch(
          showNotification(
            `Successfully deleted video: ${record.individualVideoTitle}`,
            "success"
          )
        );

        // Refresh content to get updated data from server
        setTimeout(() => {
          dispatch(fetchAllContent());
        }, 500);
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      dispatch(
        showNotification(`Failed to delete video: ${error.message}`, "error")
      );
    } finally {
      setLoadingRecordId(null);
    }
  };

  const handleApprovalAction = async (record, status) => {
    const {
      _id,
      challengeName,
      moduleName,
      currentStatus,
      typeOfEvent,
      videoFile_description,
    } = record;

    // Convert status for display
    const formattedStatus =
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    const lowerCaseStatus = status.toLowerCase();

    // Check if already in the target status
    if (currentStatus === formattedStatus) {
      dispatch(
        showNotification(
          `${
            challengeName || moduleName || typeOfEvent || "Record"
          } is already ${formattedStatus}`,
          "info"
        )
      );
      return;
    }

    try {
      setLoadingRecordId(record._id);

      // For MODULES - only approve the module itself, NOT the videos
      if (typeof moduleName === "string" && moduleName.trim() !== "") {
        await dispatch(patchTheContent(_id, lowerCaseStatus));

        dispatch(
          showNotification(
            `Successfully ${status} module. Videos require separate approval.`,
            "success"
          )
        );
      }
      // For other content types (challenges, events) - normal flow
      else if (typeof typeOfEvent === "string" && typeOfEvent.trim() !== "") {
        await dispatch(updateEventStatus(_id, formattedStatus));
        dispatch(
          showNotification(
            `Successfully updated event status to ${formattedStatus}`,
            "success"
          )
        );
      } else if (
        typeof challengeName === "string" &&
        challengeName.trim() !== ""
      ) {
        await dispatch(patchTheChallenge(_id, lowerCaseStatus));
        dispatch(
          showNotification(
            `Successfully updated challenge status to ${formattedStatus}`,
            "success"
          )
        );
      } else {
        dispatch(showNotification("Invalid record type", "error"));
      }

      // Refresh data
      dispatch(fetchAllContent());
    } catch (error) {
      dispatch(
        showNotification(`Failed to update status: ${error.message}`, "error")
      );
    } finally {
      setLoadingRecordId(null);
    }
  };

  const handleDeleteAction = (record) => {
    const { _id, challengeName, moduleName, typeOfEvent } = record;

    if (typeof typeOfEvent === "string" && typeOfEvent.trim() !== "") {
      dispatch(deleteEvent(_id))
        .then(() => {
          dispatch(showNotification(`Successfully deleted event`, "success"));
          dispatch(fetchAllContent());
        })
        .catch(() => {
          dispatch(showNotification(`Failed to delete event`, "error"));
        });
    } else if (
      typeof challengeName === "string" &&
      challengeName.trim() !== ""
    ) {
      dispatch(deleteChallenge(_id))
        .then(() => {
          dispatch(
            showNotification(`Successfully deleted challenge`, "success")
          );
          dispatch(fetchAllContent());
        })
        .catch(() => {
          dispatch(showNotification(`Failed to delete challenge`, "error"));
        });
    } else if (typeof moduleName === "string" && moduleName.trim() !== "") {
      dispatch(deleteContent(_id))
        .then(() => {
          dispatch(showNotification(`Successfully deleted content`, "success"));
          dispatch(fetchAllContent());
        })
        .catch(() => {
          dispatch(showNotification(`Failed to delete content`, "error"));
        });
    } else {
      dispatch(showNotification("Invalid record type", "error"));
    }
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to page 1 when the page size changes
  };
  const [specificSearchQuery, setSpecificSearchQuery] = useState("");
  const handlesetSpecificSearchQueryChange = (e) => {
    setSpecificSearchQuery(e.target.value);
  };

  const filteredData = useMemo(() => {
    const { challenges = [], modules = [], events = [] } = contents.data || {};

    let combinedData = [];
    let unmatchedChallenges = [];

    // Process modules - create separate entries for module AND individual videos
    const moduleEntries = modules.flatMap((module) => {
      const moduleEntries = [];

      // 1. Add the MODULE itself as a separate entry
      moduleEntries.push({
        ...module,
        entryType: "module", // Mark as module entry
        totalVideos: module.videoFile_description?.length || 0,
        // Clear video arrays for module entry to avoid duplication
        videoFile_description: [],
        videoFile_introduction: [],
        learningVideoTitles: [],
        description_videofile_text: [],
        learningVideoCovers: [],
        learningVideoPermissions: [],
      });

      // 2. Add individual learning videos ONLY if module has videos
      if (
        module.videoFile_description &&
        module.videoFile_description.length > 0
      ) {
        const videoEntries = module.videoFile_description.map(
          (video, index) => ({
            ...module,
            // Override these fields for individual video display
            uniqueUploadId: `${
              module.uniqueUploadId || module._id
            }-video-${index}`,
            videoIndex: index,
            totalVideos: module.videoFile_description.length,
            entryType: "learningVideo", // Mark as learning video entry
            // Store individual video data
            individualVideo: video,
            individualVideoTitle:
              module.learningVideoTitles?.[index] || `Video ${index + 1}`,
            individualVideoDescription:
              module.description_videofile_text?.[index] || "",
            individualVideoCover: module.learningVideoCovers?.[index] || null,
            // Keep only this specific video data
            videoFile_description: [video],
            videoFile_introduction: module.videoFile_introduction?.[index]
              ? [module.videoFile_introduction[index]]
              : [],
            learningVideoTitles: [
              module.learningVideoTitles?.[index] || `Video ${index + 1}`,
            ],
            description_videofile_text: [
              module.description_videofile_text?.[index] || "",
            ],
            learningVideoCovers: module.learningVideoCovers?.[index]
              ? [module.learningVideoCovers[index]]
              : [],
            learningVideoPermissions: module.learningVideoPermissions?.[index]
              ? [module.learningVideoPermissions[index]]
              : [],
          })
        );
        moduleEntries.push(...videoEntries);
      }

      return moduleEntries;
    });

    // Combine challenges and modules in pairs
    challenges.forEach((challenge, index) => {
      const matchingModule = modules[index];

      if (matchingModule) {
        combinedData.push({
          ...challenge,
          entryType: "challenge",
        });
      } else {
        unmatchedChallenges.push({
          ...challenge,
          entryType: "challenge",
        });
      }
    });

    // Add remaining modules that don't have matching challenges
    const remainingModules = modules.slice(challenges.length);

    // Add events to the combined data
    const formattedEvents = events.map((event) => ({
      ...event,
      entryType: "event",
    }));

    combinedData = [
      ...combinedData,
      ...unmatchedChallenges,
      ...moduleEntries, // This now includes both modules and their videos
      ...formattedEvents,
    ];

    // Apply filters
    let filteredCombinedData = combinedData;

    if (filter === "active") {
      filteredCombinedData = filteredCombinedData.filter(
        (data) => data.isApproved === "approved" || data.status === "Approved"
      );
    } else if (filter === "inactive") {
      filteredCombinedData = filteredCombinedData.filter(
        (data) => data.isApproved === "pending" || data.status === "Pending"
      );
    } else if (filter === "rejected") {
      filteredCombinedData = filteredCombinedData.filter(
        (data) => data.isApproved === "rejected" || data.status === "Rejected"
      );
    }

    // Apply specific search query filtering
    if (specificSearchQuery) {
      const lowerCaseQuery = specificSearchQuery.toLowerCase();

      filteredCombinedData = filteredCombinedData.filter((item) => {
        const valuesToCheck = [
          item?.uniChallengeId,
          item?.uniqueUploadId,
          item?.challengeName?.uploaded_by?.firstName,
          item?.challengeName?.uploaded_by?.lastName,
          item?.moduleName,
          item?.individualVideoTitle, // Include individual video titles in search
          item?.uploaded_by?.firstName,
          item?.uploaded_by?.lastName,
          item?.title, // For events
        ].filter(Boolean);

        if (
          valuesToCheck.some((val) =>
            val.toString().toLowerCase().includes(lowerCaseQuery)
          )
        ) {
          return true;
        }

        return (item?.roles || []).some((role) =>
          role.toLowerCase().includes(lowerCaseQuery)
        );
      });
    }

    // Apply sorting
    switch (filter) {
      case "newestFirst":
        filteredCombinedData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;

      case "1234":
        filteredCombinedData.sort((a, b) => {
          const getNumericId = (item) => {
            if (item.uniChallengeId)
              return parseInt(item.uniChallengeId) || Number.MAX_VALUE;
            if (item.uniqueUploadId) {
              // Handle video IDs like "4720021-video-0"
              const baseId = item.uniqueUploadId.split("-")[0];
              return parseInt(baseId) || Number.MAX_VALUE;
            }
            return Number.MAX_VALUE;
          };

          const idA = getNumericId(a);
          const idB = getNumericId(b);
          return idA - idB;
        });
        break;

      case "ABCD":
        filteredCombinedData.sort((a, b) => {
          const getName = (item) => {
            if (item.entryType === "module")
              return `${item.moduleName} (Module)`;
            if (item.entryType === "learningVideo")
              return `${item.moduleName} - ${item.individualVideoTitle}`;
            if (item.challengeName) return item.challengeName;
            if (item.moduleName) return item.moduleName;
            if (item.title) return item.title;
            return "";
          };

          const nameA = getName(a);
          const nameB = getName(b);
          return nameA.localeCompare(nameB);
        });
        break;

      case "endDate":
        filteredCombinedData.sort((a, b) => {
          const getLastEditDate = (logs) => {
            if (!Array.isArray(logs) || logs.length === 0) return new Date(0);
            return new Date(logs[logs.length - 1].date);
          };

          return getLastEditDate(b.editLogs) - getLastEditDate(a.editLogs);
        });
        break;

      case "startDate":
        filteredCombinedData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;

      case "type":
        filteredCombinedData.sort((a, b) => {
          const getType = (item) => {
            if (item.entryType === "module") return "module";
            if (item.entryType === "learningVideo") return "learningVideo";
            if (item.challengeName) return "challenge";
            if (item.typeOfEvent) return "event";
            return "other";
          };

          const typeA = getType(a);
          const typeB = getType(b);
          return typeA.localeCompare(typeB);
        });
        break;

      case "track":
        filteredCombinedData.sort((a, b) => {
          const trackA = a.tracks || a.module?.tracks || "";
          const trackB = b.tracks || b.module?.tracks || "";
          return trackA.localeCompare(trackB);
        });
        break;

      case "inactiveFirst":
        filteredCombinedData.sort((a, b) => {
          // For video entries, use video-level status
          const getStatus = (item) => {
            if (item.entryType === "learningVideo") {
              const videoIndex = item.videoIndex || 0;
              const videoPermissions =
                item.learningVideoPermissions?.[videoIndex];
              return videoPermissions?.approvalStatus || "pending";
            }
            return (
              item.isApproved?.toLowerCase() ||
              item.status?.toLowerCase() ||
              "pending"
            );
          };

          const statusA = getStatus(a);
          const statusB = getStatus(b);

          const statusOrder = { pending: 0, rejected: 1, approved: 2 };
          return (statusOrder[statusA] || 3) - (statusOrder[statusB] || 3);
        });
        break;

      default:
        break;
    }
    filteredCombinedData = filteredCombinedData.filter(
      (item) => item.entryType !== "module"
    );

    return filteredCombinedData;
  }, [filter, contents, specificSearchQuery]);

  const contentSlice = Array.isArray(filteredData)
    ? filteredData.slice(0, 50)
    : [];

  // Function to determine the background color for the status
  const getStatusBgColor = (status) => {
    switch (status) {
      case "Approved":
        return "#00FF0033";
      case "Pending":
        return "#FFA50033";
      case "Rejected":
        return "#DD441B33";
      default:
        return "#A6970C33";
    }
  };

  const cardData = [
    {
      title: "Total Content",
      value: filteredData.length,
      filter: "all",
    },
    {
      title: "Approved Content",
      value: filteredData.filter(
        (content) =>
          content.isApproved === "approved" || content.status === "Approved"
      ).length,
      filter: "active",
    },
    {
      title: "Pending Content",
      value: filteredData.filter(
        (content) =>
          content.isApproved === "pending" || content.status === "Pending"
      ).length,
      filter: "inactive",
    },
    {
      title: "Rejected Content",
      value: filteredData.filter(
        (content) =>
          content.isApproved === "rejected" || content.status === "Rejected"
      ).length,
      filter: "rejected",
    },
  ];

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = currentPage * pageSize;
    return contentSlice.slice(start, end);
  }, [currentPage, pageSize, contentSlice]);

  // Handle row selection
  const handleSelection = (index) => {
    const absoluteIndex = (currentPage - 1) * pageSize + index;
    setSelectedIndices((prev) =>
      prev.includes(absoluteIndex)
        ? prev.filter((i) => i !== absoluteIndex)
        : [...prev, absoluteIndex]
    );
  };

  const handleSelectAll = () => {
    setSelectedIndices((prev) => {
      const allSelected = prev.length === filteredData.length;
      return allSelected ? [] : filteredData.map((_, i) => i);
    });
  };

  const [selectedCard, setSelectedCard] = useState(0);

  const encryptedRoles = localStorage.getItem("encryptedRoles");

  let userRoles = [];

  if (encryptedRoles) {
    try {
      const bytes = CryptoJS.AES.decrypt(
        encryptedRoles,
        "477f58bc13b97959097e7bda64de165ab9d7496b7a15ab39697e6d31ac61cbd1"
      );
      userRoles = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error("Error decrypting roles:", error);
    }
  }

  // Function to handle edit for both modules and challenges
  const handleEditContent = (record) => {
    localStorage.setItem("editContentData", JSON.stringify(record));
    console.log("Editing content:", record);
  };

  const columns = [
    {
      title: (
        <div className="flex items-center">
          <SvgIcon
            onClick={() => setFilter((prev) => (prev === "1234" ? "" : "1234"))}
          />
          <span style={{ color: "#F48567", marginLeft: "8px" }}>Upload ID</span>
        </div>
      ),
      key: "uniqueUploadId || uniChallengeId",
      render: (text, record) => {
        const id = record.uniqueUploadId || record.uniChallengeId || record._id;
        return id ? id.toString().slice(0, 7) : "";
      },
    },
    {
      title: (
        <div className="flex items-center">
          <SvgIcon />
          <span style={{ color: "#F48567", marginLeft: "8px" }}>
            Partner Name
          </span>
        </div>
      ),
      dataIndex: "record",
      key: "record",
      render: (text, record) => {
        const uploadedBy =
          typeof record?.uploaded_by === "object" &&
          record?.uploaded_by !== null
            ? record.uploaded_by
            : record?.module?.uploaded_by;

        const user =
          uploadedBy ||
          (typeof record?.createdBy === "object" && record?.createdBy !== null
            ? record.createdBy
            : record?.module?.createdBy);

        if (!user) {
          return "N/A";
        }

        const firstName = user?.firstName ?? "N/A";
        const lastName = user?.lastName ?? "";

        return `${firstName} ${lastName}`.trim() || "N/A";
      },
    },
    {
      title: (
        <div className="flex items-center">
          <SvgIcon
            onClick={() => setFilter((prev) => (prev === "ABCD" ? "" : "ABCD"))}
          />
          <span style={{ color: "#F48567", marginLeft: "8px" }}>
            Content Name
          </span>
        </div>
      ),
      dataIndex: "moduleName",
      key: "moduleName || challengeName || individualVideoTitle",
      render: (text, record) => {
        let contentName;

        // For MODULE entry (the module itself)
        if (record.entryType === "module") {
          contentName = `${record.moduleName} (Module)`;
          if (record.totalVideos > 0) {
            contentName += ` - ${record.totalVideos} videos`;
          }
        }
        // For individual learning videos
        else if (
          record.individualVideoTitle ||
          record.entryType === "learningVideo"
        ) {
          contentName = `${record.moduleName} - ${record.individualVideoTitle}`;
          if (record.totalVideos > 1) {
            contentName += ` (${record.videoIndex + 1}/${record.totalVideos})`;
          }
        }
        // For challenges
        else if (record.challengeName) {
          contentName =
            record?.module?.moduleName ||
            record?.moduleName ||
            record.challengeName;
        }
        // For modules without entryType (backward compatibility)
        else if (record.moduleName) {
          contentName = record.moduleName;
          if (record.videoFile_description?.length > 0) {
            contentName += ` (${record.videoFile_description.length} videos)`;
          }
        }
        // For events
        else if (record.title) {
          contentName = record.title;
        } else {
          contentName = "N/A";
        }

        return contentName.length > 20 ? (
          <Tooltip title={contentName}>
            <span>{contentName.substring(0, 20)}...</span>
          </Tooltip>
        ) : (
          <span>{contentName}</span>
        );
      },
    },
    {
      title: (
        <div className="flex items-center">
          <SvgIcon
            onClick={() =>
              setFilter((prev) => (prev === "track" ? "" : "track"))
            }
          />
          <span style={{ color: "#F48567", marginLeft: "8px" }}>Tracks</span>
        </div>
      ),
      key: "tracks",
      render: (text, record) =>
        record.tracks || record.module?.tracks || record.typeOfEvent,
    },
    {
      title: (
        <div className="flex items-center">
          <SvgIcon
            onClick={() => setFilter((prev) => (prev === "type" ? "" : "type"))}
          />
          <span style={{ color: "#F48567", marginLeft: "8px" }}>Type</span>
        </div>
      ),
      key: "moduleType",
      render: (text, record) => {
        if (record?.typeOfEvent) {
          return "Event";
        }
        if (record?.entryType === "module") {
          return "Module";
        }
        if (
          record?.individualVideoTitle ||
          record?.entryType === "learningVideo"
        ) {
          return "Learning Video";
        }
        if (record?.challengeName) {
          return "Challenge";
        }
        return "Content";
      },
    },
    {
      title: (
        <div className="flex items-center">
          <SvgIcon
            onClick={() =>
              setFilter((prev) => (prev === "newestFirst" ? "" : "newestFirst"))
            }
          />
          <span style={{ color: "#F48567", marginLeft: "8px" }}>
            Date Uploaded
          </span>
        </div>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => {
        if (!createdAt) return "N/A";
        const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        return formattedDate;
      },
    },
    {
      title: (
        <div className="flex items-center">
          <SvgIcon
            onClick={() =>
              setFilter((prev) => (prev === "fileSize" ? "" : "fileSize"))
            }
          />
          <span style={{ color: "#F48567", marginLeft: "8px" }}>File Size</span>
        </div>
      ),
      key: "fileSize",
      render: (text, record) => {
        const size = record?.fileSize;
        return size && size !== "" ? size : "N/A";
      },
    },
    {
      title: (
        <div className="flex items-center">
          <SvgIcon
            onClick={() =>
              setFilter((prev) =>
                prev === "inactiveFirst" ? "" : "inactiveFirst"
              )
            }
          />
          <span style={{ color: "#F48567", marginLeft: "8px" }}>Status</span>
        </div>
      ),
      dataIndex: "isApproved",
      key: "isApproved",
      render: (isApproved, record) => {
        let status;
        let isLoading = loadingRecordId === record._id;

        // Improved status extraction for learning videos
        if (
          record.entryType === "learningVideo" ||
          record.individualVideoTitle
        ) {
          const videoIndex = record.videoIndex || 0;
          const videoApprovalArray = record.learningVideoApproval;

          console.log("Video Status Debug:", {
            recordId: record._id,
            videoIndex,
            videoApprovalArray,
            finalStatus: videoApprovalArray?.[videoIndex] || "pending",
          });

          const videoStatus = videoApprovalArray?.[videoIndex] || "pending";

          const statusMap = {
            approved: "Approved",
            pending: "Pending",
            rejected: "Rejected",
          };
          status = statusMap[videoStatus] || "Pending";
        }
        // For module entries (the module itself)
        else if (record.entryType === "module") {
          const statusMap = {
            approved: "Approved",
            pending: "Pending",
            rejected: "Rejected",
          };
          status = statusMap[isApproved?.toLowerCase()] || "Pending";
        }
        // For challenges and events
        else {
          const statusMap = {
            approved: "Approved",
            pending: "Pending",
            rejected: "Rejected",
          };
          status =
            statusMap[(isApproved || record.status)?.toLowerCase()] ||
            "Pending";
        }

        return (
          <Badge
            color={
              status === "Approved"
                ? "green"
                : status === "Pending"
                ? "orange"
                : "red"
            }
            text={isLoading ? <Spin size="small" /> : status}
            style={{
              backgroundColor: getStatusBgColor(status),
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "7px",
              color: darkMode ? "white" : "black",
              cursor: isLoading ? "not-allowed" : "pointer",
              width: "90px",
            }}
          />
        );
      },
    },
    {
      title: (
        <div className="flex items-center">
          <SvgIcon />
          <span style={{ color: "#F48567", marginLeft: "8px" }}>Actions</span>
        </div>
      ),
      key: "actions",
      render: (_, record) => {
        const statusColors = {
          approved: "#00FF00",
          pending: "#FFA500",
          rejected: "#DD441B",
        };

        // Determine status based on entry type
        let status;
        if (
          record.entryType === "learningVideo" ||
          record.individualVideoTitle
        ) {
          const videoIndex = record.videoIndex || 0;
          status = record.learningVideoApproval?.[videoIndex] || "pending";
        } else if (record.entryType === "module") {
          status = record.isApproved?.toLowerCase();
        } else {
          status =
            record.isApproved?.toLowerCase() || record.status?.toLowerCase();
        }

        const svgColor = statusColors[status] || "#A6970C";

        return (
          <div>
            <Space>
              {record.typeOfEvent ? (
                <EventMannage data={record} />
              ) : record.entryType === "module" || record.moduleName ? (
                <ContentMannage
                  data={record}
                  onVideoApproval={(videoIndex, newStatus) =>
                    handleVideoApprovalAction(record, videoIndex, newStatus)
                  }
                />
              ) : record.challengeName ? (
                <ChallangeMannage data={record} />
              ) : null}
              <EditContent contentData={record} />

              {/* MODULE LEVEL APPROVAL/REJECTION */}
              {record.entryType === "module" && (
                <>
                  {/* Reject Module Button */}
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      showConfirmationModal({
                        title: "Reject Module",
                        message: `Are you sure you want to reject the module "${record.moduleName}"?`,
                        onConfirm: () =>
                          handleApprovalAction(record, "rejected"),
                        record: record,
                        actionType: "reject",
                      })
                    }
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 0.25C4.125 0.25 0.25 4.125 0.25 9C0.25 13.875 4.125 17.75 9 17.75C13.875 17.75 17.75 13.875 17.75 9C17.75 4.125 13.875 0.25 9 0.25ZM12.375 13.375L9 10L5.625 13.375L4.625 12.375L8 9L4.625 5.625L5.625 4.625L9 8L12.375 4.625L13.375 5.625L10 9L13.375 12.375L12.375 13.375Z"
                        fill="#DD441B"
                      />
                    </svg>
                  </div>

                  {/* Approve Module Button */}
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      showConfirmationModal({
                        title: "Approve Module",
                        message: `Are you sure you want to approve the module "${record.moduleName}"?`,
                        onConfirm: () =>
                          handleApprovalAction(record, "approved"),
                        record: record,
                        actionType: "approve",
                      })
                    }
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_4249_2052)">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.66933 0.087785C9.77004 0.030258 9.88402 0 10 0C10.116 0 10.23 0.030258 10.3307 0.087785L19.664 5.42112C19.766 5.4794 19.8509 5.56362 19.9099 5.66524C19.9689 5.76686 20 5.88228 20 5.99979V6.95978C20 9.90108 19.0418 12.7623 17.2704 15.1104C15.4991 17.4584 13.0109 19.1655 10.1827 19.9731C10.0633 20.0071 9.93674 20.0071 9.81733 19.9731C6.98931 19.1651 4.50142 17.458 2.73009 15.11C0.958768 12.762 0.00040046 9.90097 0 6.95978L0 5.99979C3.79027e-05 5.88228 0.031135 5.76686 0.0901407 5.66524C0.149146 5.56362 0.233964 5.4794 0.336 5.42112L9.66933 0.087785ZM9.42933 14.2811L15.1867 7.08245L14.1467 6.25045L9.23733 12.3851L5.76 9.48779L4.90667 10.5118L9.42933 14.2811Z"
                          fill={svgColor}
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_4249_2052">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </>
              )}

              {/* LEARNING VIDEO LEVEL APPROVAL/REJECTION */}
              {(record.entryType === "learningVideo" ||
                record.individualVideoTitle) && (
                <>
                  {/* Reject Video Button */}
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      showConfirmationModal({
                        title: "Reject Video",
                        message: `Are you sure you want to reject the video "${record.individualVideoTitle}"?`,
                        onConfirm: () =>
                          handleVideoApprovalAction(
                            record,
                            record.videoIndex || 0,
                            "rejected"
                          ),
                        record: record,
                        actionType: "reject",
                      })
                    }
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 0.25C4.125 0.25 0.25 4.125 0.25 9C0.25 13.875 4.125 17.75 9 17.75C13.875 17.75 17.75 13.875 17.75 9C17.75 4.125 13.875 0.25 9 0.25ZM12.375 13.375L9 10L5.625 13.375L4.625 12.375L8 9L4.625 5.625L5.625 4.625L9 8L12.375 4.625L13.375 5.625L10 9L13.375 12.375L12.375 13.375Z"
                        fill="#DD441B"
                      />
                    </svg>
                  </div>

                  {/* Approve Video Button */}
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      showConfirmationModal({
                        title: "Approve Video",
                        message: `Are you sure you want to approve the video "${record.individualVideoTitle}"?`,
                        onConfirm: () =>
                          handleVideoApprovalAction(
                            record,
                            record.videoIndex || 0,
                            "approved"
                          ),
                        record: record,
                        actionType: "approve",
                      })
                    }
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_4249_2052)">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.66933 0.087785C9.77004 0.030258 9.88402 0 10 0C10.116 0 10.23 0.030258 10.3307 0.087785L19.664 5.42112C19.766 5.4794 19.8509 5.56362 19.9099 5.66524C19.9689 5.76686 20 5.88228 20 5.99979V6.95978C20 9.90108 19.0418 12.7623 17.2704 15.1104C15.4991 17.4584 13.0109 19.1655 10.1827 19.9731C10.0633 20.0071 9.93674 20.0071 9.81733 19.9731C6.98931 19.1651 4.50142 17.458 2.73009 15.11C0.958768 12.762 0.00040046 9.90097 0 6.95978L0 5.99979C3.79027e-05 5.88228 0.031135 5.76686 0.0901407 5.66524C0.149146 5.56362 0.233964 5.4794 0.336 5.42112L9.66933 0.087785ZM9.42933 14.2811L15.1867 7.08245L14.1467 6.25045L9.23733 12.3851L5.76 9.48779L4.90667 10.5118L9.42933 14.2811Z"
                          fill={svgColor}
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_4249_2052">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>

                  {/* Delete Video Button */}
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      showConfirmationModal({
                        title: "Delete Video",
                        message: `Are you sure you want to delete the video "${record.individualVideoTitle}"? This action cannot be undone.`,
                        onConfirm: () => handleDeleteVideoAction(record),
                        record: record,
                        actionType: "deleteVideo",
                        confirmText: "Delete",
                      })
                    }
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
                  </div>
                </>
              )}

              {/* CHALLENGE/EVENT APPROVAL/REJECTION */}
              {(record.entryType === "challenge" || record.typeOfEvent) && (
                <>
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      showConfirmationModal({
                        title: "Reject Content",
                        message: `Are you sure you want to reject this ${
                          record.entryType === "challenge"
                            ? "challenge"
                            : "event"
                        }?`,
                        onConfirm: () =>
                          handleApprovalAction(record, "rejected"),
                        record: record,
                        actionType: "reject",
                      })
                    }
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 0.25C4.125 0.25 0.25 4.125 0.25 9C0.25 13.875 4.125 17.75 9 17.75C13.875 17.75 17.75 13.875 17.75 9C17.75 4.125 13.875 0.25 9 0.25ZM12.375 13.375L9 10L5.625 13.375L4.625 12.375L8 9L4.625 5.625L5.625 4.625L9 8L12.375 4.625L13.375 5.625L10 9L13.375 12.375L12.375 13.375Z"
                        fill="#DD441B"
                      />
                    </svg>
                  </div>

                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      showConfirmationModal({
                        title: "Approve Content",
                        message: `Are you sure you want to approve this ${
                          record.entryType === "challenge"
                            ? "challenge"
                            : "event"
                        }?`,
                        onConfirm: () =>
                          handleApprovalAction(record, "approved"),
                        record: record,
                        actionType: "approve",
                      })
                    }
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_4249_2052)">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.66933 0.087785C9.77004 0.030258 9.88402 0 10 0C10.116 0 10.23 0.030258 10.3307 0.087785L19.664 5.42112C19.766 5.4794 19.8509 5.56362 19.9099 5.66524C19.9689 5.76686 20 5.88228 20 5.99979V6.95978C20 9.90108 19.0418 12.7623 17.2704 15.1104C15.4991 17.4584 13.0109 19.1655 10.1827 19.9731C10.0633 20.0071 9.93674 20.0071 9.81733 19.9731C6.98931 19.1651 4.50142 17.458 2.73009 15.11C0.958768 12.762 0.00040046 9.90097 0 6.95978L0 5.99979C3.79027e-05 5.88228 0.031135 5.76686 0.0901407 5.66524C0.149146 5.56362 0.233964 5.4794 0.336 5.42112L9.66933 0.087785ZM9.42933 14.2811L15.1867 7.08245L14.1467 6.25045L9.23733 12.3851L5.76 9.48779L4.90667 10.5118L9.42933 14.2811Z"
                          fill={svgColor}
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_4249_2052">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </>
              )}

              {/* Delete Button (only for non-Admin users) - For non-video content */}
              {!userRoles.includes("Admin") && !record.individualVideoTitle && (
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    showConfirmationModal({
                      title: "Delete Content",
                      message: `Are you sure you want to delete this content? This action cannot be undone.`,
                      onConfirm: () => handleDeleteAction(record),
                      record: record,
                      actionType: "deleteContent",
                      confirmText: "Delete",
                    })
                  }
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
                </div>
              )}
            </Space>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div
        className={`flex justify-center content-center rounded-lg max-h-14 absolute right-[300px] top-[25px] ${
          darkMode ? "bg-zinc-800 text-zinc-300" : "bg-slate-100 text-black"
        } transition-colors duration-300`}
      >
        <input
          value={specificSearchQuery}
          onChange={handlesetSpecificSearchQueryChange}
          type="text"
          placeholder="Search by Content ID, Title or Author"
          className="px-4 py-3 pl-10 rounded-lg focus:outline-none bg-transparent w-96"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <IconSearch size={20} strokeWidth={1.5} className="" />
        </div>
      </div>

      <div className="flex flex-col  p-5  thescreanhe">
        {/* Page Header */}
        <div
          className={`flex justify-between items-center mb-6 px-12 py-1 rounded-lg mt- ${
            darkMode ? "bg-[#333333]" : "bg-[#f1f5f9]"
          }`}
        >
          <h1 className="text-2xl ml-[-20px] text-[#F48567]">Content</h1>
          <div className="flex gap-6">
            <CreateContent />
          </div>
        </div>

        {/* User Metrics Section */}
        <div className="flex justify-between space-x-4 mb-6 px-8">
          {cardData.map((card, index) => (
            <Card
              key={index}
              className={`flex-grow ${
                darkMode
                  ? "bg-[#1E1E1E] text-[#C7C7C7]"
                  : "bg-gray-100 text-black"
              } shadow-lg rounded-lg transition-all duration-300 ease-in-out rounded-[10px]
                                    ${
                                      selectedCard === index
                                        ? "bg-[#FFC9BB33] bg-opacity-30 border-[#F48567]"
                                        : "hover:bg-[#f486673a]"
                                    }`}
              bordered={true}
              onClick={() => {
                setSelectedCard(selectedCard === index ? null : index);
                setFilter(card.filter);
              }}
            >
              <h2
                className={`text-xl font-semibold ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                {card.title}
              </h2>
              <p className="text-3xl" style={{ color: "#F48567" }}>
                {card.value}
              </p>
            </Card>
          ))}
        </div>
        <div className="flex-grow overflow-x-auto h-11 px-8 theusertab">
          <div className={darkMode ? "dark-mode" : "light-mode"}></div>
          <div className="relative">
            {/* Select All Checkbox */}
            <div className="absolute z-50 left-[-22px] top-6">
              <input
                className="custom-checkbox border-[#F48567] rounded-full"
                type="checkbox"
                checked={
                  paginatedData.length > 0 &&
                  paginatedData.every((_, index) =>
                    selectedIndices.includes(
                      (currentPage - 1) * pageSize + index
                    )
                  )
                }
                onChange={handleSelectAll}
              />
            </div>

            <div
              className={`table-container ${
                darkMode ? "bg-[#333333]" : "bg-[#f1f5f9]"
              } rounded-lg`}
            >
              <table
                className={`custom-table ${
                  darkMode ? "bg-[#18181b]" : "bg-white"
                }`}
                style={{
                  width: "100%",
                  borderCollapse: "separate",
                  borderSpacing: "0 10px",
                }}
              >
                <thead
                  className={`custom-table ${
                    darkMode ? "bg-[#18181b]" : "bg-[#f1f5f9]"
                  }`}
                >
                  <tr
                    className={`rounded-custom ${
                      darkMode ? "bg-[#18181b]" : "bg-[#f1f5f9]"
                    }`}
                  >
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        className={`headtextxx headtable${index + 1} ${
                          darkMode ? "bg-[#333333]" : "bg-white"
                        } text-white`}
                        style={{
                          cursor: "default",
                          userSelect: "none",
                          backgroundColor:
                            selectedIndices.length > 0
                              ? "#F48567"
                              : darkMode
                              ? "#333333"
                              : "#ffffff",
                          color:
                            selectedIndices.length > 0 ? "#ffffff" : "#F48567",
                          padding: "10px",
                          border: "none",
                        }}
                      >
                        {typeof column.title === "string"
                          ? column.title
                          : column.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row, rowIndex) => {
                    const absoluteIndex =
                      (currentPage - 1) * pageSize + rowIndex;

                    return (
                      <tr
                        key={row.key || absoluteIndex}
                        className={`table-text rounded-lg ${
                          darkMode ? "bg-[#333333] text-white" : "bg-[#f1f5f9]"
                        }  ${
                          selectedIndices.includes(absoluteIndex)
                            ? "bg-[#f486673a]"
                            : ""
                        } headoptions`}
                        style={{ cursor: "pointer" }}
                      >
                        {columns.map((column, colIndex) => (
                          <td
                            key={colIndex}
                            style={{
                              padding: "10px 10px",
                              border: "none",
                            }}
                          >
                            {column.render
                              ? column.render(row[column.dataIndex], row)
                              : row[column.dataIndex] || "N/A"}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="absolute left-[-20px] bottom-0 flex flex-col items-center justify h-full pt-[45px]">
              {paginatedData.map((_, index) => {
                const absoluteIndex = (currentPage - 1) * pageSize + index;
                return (
                  <span
                    key={absoluteIndex}
                    className="h-[60px] flex justify-center items-center"
                  >
                    <input
                      className="custom-checkbox peer/draft border-[#F48567] rounded-full"
                      type="checkbox"
                      checked={selectedIndices.includes(absoluteIndex)}
                      onChange={() => handleSelection(index)}
                    />
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-center gap-5 items-center mt-6 px-8">
          {/* Pagination Controls */}
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredData.length}
            onChange={handleChangePage}
            onShowSizeChange={(_, size) => handlePageSizeChange(size)}
            itemRender={(page, type, originalElement) => {
              if (type === "page") {
                return (
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 cursor-pointer ${
                      page === currentPage
                        ? "bg-[#F48567] text-white hover:text-white"
                        : "bg-transparent text-black hover:bg-[#F48567] hover:text-white"
                    }`}
                  >
                    {page}
                  </span>
                );
              }
              if (type === "prev") {
                return (
                  <span
                    className={`inline-flex items-center justify-center w-20 h-8 cursor-pointer bg-[#333333] text-white border hover:bg-[#F48567] hover:text-white`}
                  >
                    Back
                  </span>
                );
              }
              if (type === "next") {
                return (
                  <span
                    className={`inline-flex items-center justify-center w-20 h-8 cursor-pointer bg-[#333333] text-white border hover:bg-[#F48567] hover:text-white`}
                  >
                    Next
                  </span>
                );
              }
              return originalElement;
            }}
          />

          {/* Page Size Selector */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400 whitespace-nowrap">
              Results per page
            </span>
            <Select
              defaultValue={pageSize}
              value={pageSize}
              onChange={handlePageSizeChange}
              style={{ width: 100, backgroundColor: "#333333", color: "#fff" }}
              options={[
                { value: 10, label: "10" },
                { value: 20, label: "20" },
                { value: 30, label: "30" },
                { value: 50, label: "50" },
              ]}
            />
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirmAction}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        cancelText="Cancel"
        showCancel={confirmationModal.showCancel}
        darkMode={darkMode}
      />
    </>
  );
};

export default ContentManagement;
