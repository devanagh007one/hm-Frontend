import React, { useState, useRef, useEffect } from "react";
import "../popup.css"; // Import custom CSS
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import CryptoJS from "crypto-js";

import {
  patchTheContent,
  fetchAllContent,
} from "../../redux/actions/allContentGet.js";

import { showNotification } from "../../redux/actions/notificationActions"; // Import showNotification

const ContentManagement = ({ data }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  const { content: contents } = useSelector((state) => state.content);

  const handleViewPopup = () => setShowPopup(true);
  const handleClosePopup = () => setShowPopup(false);

  const dispatch = useDispatch();

  // Decrypt user roles from localStorage
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

  // Check if user has admin or super admin privileges
  const isAdminUser =
    userRoles.includes("Admin") || userRoles.includes("Super Admin");

  // Define fields to display dynamically
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toDateString(); // Example: "Mon Oct 09 2023"
  };
  const modules = contents?.data?.modules || [];

  // Fetch content when the component mounts
  useEffect(() => {
    dispatch(fetchAllContent());
  }, [dispatch]);

  useEffect(() => {
    if (data?._id && modules.length > 0) {
      const defaultModule = modules.find((module) => module._id === data._id);
      setSelectedModule(defaultModule || null);
    }
  }, [data?._id, modules]);

  // Handle module selection change
  const handleModuleChange = (event) => {
    const selectedModuleId = event.target.value;
    const newModule = modules.find((module) => module._id === selectedModuleId);
    setSelectedModule(newModule || null);
  };

  // Dynamically update uploaded_by based on the selected module
  const uploadedBy = selectedModule?.uploaded_by || data?.uploaded_by || {};

  // Fields array with dynamic Modules field
  const fields = [
    {
      label: "Author",
      value: `${uploadedBy?.firstName} ${uploadedBy?.lastName}`,
    },
    {
      label: "Date created",
      value: formatDate(selectedModule?.createdAt || data?.createdAt),
    },
    {
      label: "Last modified",
      value: formatDate(selectedModule?.updatedAt || data?.updatedAt),
    },
    { label: "Track", value: selectedModule?.tracks || data?.tracks },
    {
      label: "Modules",
      value: selectedModule ? selectedModule.moduleName : "Not Found",
    },
    {
      label: "Challenges",
      value: selectedModule?.uploadDate || data?.uploadDate,
    },
    {
      label: "Module Name",
      value: selectedModule?.moduleName || data?.moduleName,
    },
    {
      label: "Descriptions",
      value: selectedModule?.description || data?.description,
    },
    {
      label: "Upload ID",
      value: selectedModule?.uniqueUploadId || data?.uniqueUploadId,
    },
    { label: "Approve", value: selectedModule?.isApproved || data?.isApproved },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const videoRef = useRef(null);

  const handleOpenModal = (content, index = 0) => {
    if (Array.isArray(content?.src)) {
      // If it's an array, use the first video or a specific index
      if (content.src.length > 0) {
        setModalContent({ ...content, src: content.src[index] });
        setIsModalOpen(true);
      }
    } else if (content?.src) {
      setModalContent(content);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const mediaItems = [
    { type: "image", src: data?.cover_Photo },
    // Handle arrays by taking the first video or mapping all videos
    ...(Array.isArray(data?.videoFile_description)
      ? data.videoFile_description.map((video) => ({
          type: "video",
          src: video,
        }))
      : data?.videoFile_description
      ? [{ type: "video", src: data.videoFile_description }]
      : []),
    ...(Array.isArray(data?.videoFile_introduction)
      ? data.videoFile_introduction.map((video) => ({
          type: "video",
          src: video,
        }))
      : data?.videoFile_introduction
      ? [{ type: "video", src: data.videoFile_introduction }]
      : []),
  ].filter((item) => item.src); // Ensure only valid items are processed

  const handleUpdateStatus = (id, status) => {
    dispatch(patchTheContent(id, status))
      .then(() => {
        dispatch(
          showNotification(
            `Successfully updated challenge status to ${status}`,
            "success"
          )
        );
        dispatch(fetchAllContent());
        handleClosePopup();
      })
      .catch(() => {
        dispatch(
          showNotification(
            `Failed to update challenge status to ${status}`,
            "error"
          )
        );
      });
  };

  // Helper function to get full URL
  const getMediaUrl = (src) => {
    if (!src) return "/fallback-image.jpg";
    return `${process.env.REACT_APP_STATIC_API_URL}/${src.replace(
      /^\/root\/happme_adminuser_management\//,
      ""
    )}`;
  };

  return (
    <>
      <div
        onClick={handleViewPopup}
        className="trigger text-[#F48567] border-none bg-transparent hover:bg-transparent hover:text-[#F48567] p-0 rounded"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.9532 9.20417C18.2065 9.55917 18.3332 9.7375 18.3332 10C18.3332 10.2633 18.2065 10.4408 17.9532 10.7958C16.8148 12.3925 13.9073 15.8333 9.99984 15.8333C6.0915 15.8333 3.18484 12.3917 2.0465 10.7958C1.79317 10.4408 1.6665 10.2625 1.6665 10C1.6665 9.73667 1.79317 9.55917 2.0465 9.20417C3.18484 7.6075 6.09234 4.16667 9.99984 4.16667C13.9082 4.16667 16.8148 7.60833 17.9532 9.20417Z"
            stroke="#C7C7C7"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.5 10C12.5 9.33696 12.2366 8.70107 11.7678 8.23223C11.2989 7.76339 10.663 7.5 10 7.5C9.33696 7.5 8.70107 7.76339 8.23223 8.23223C7.76339 8.70107 7.5 9.33696 7.5 10C7.5 10.663 7.76339 11.2989 8.23223 11.7678C8.70107 12.2366 9.33696 12.5 10 12.5C10.663 12.5 11.2989 12.2366 11.7678 11.7678C12.2366 11.2989 12.5 10.663 12.5 10Z"
            stroke="#C7C7C7"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showPopup && (
        <div className="popup-overlay boldpopup">
          <div className="p-8 bg-[rgb(30,30,30)] rounded-3xl w-[70%] h-[850px] overflow-y-auto flex">
            <section className="w-1/2 p-6">
              <h2 className="text-2xl mb-6 text-white flex gap-4">
                <svg
                  width="29"
                  height="31"
                  viewBox="0 0 29 31"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23 30.5L20.9 28.3625L23.2625 26H14V23H23.2625L20.9 20.6L23 18.5L29 24.5L23 30.5ZM27.5 15.5H24.5V6.5H21.5V11H6.5V6.5H3.5V27.5H11V30.5H3.5C2.675 30.5 1.969 30.2065 1.382 29.6195C0.795 29.0325 0.501 28.326 0.5 27.5V6.5C0.5 5.675 0.794 4.969 1.382 4.382C1.97 3.795 2.676 3.501 3.5 3.5H9.7625C10.0375 2.625 10.575 1.9065 11.375 1.3445C12.175 0.7825 13.05 0.501 14 0.5C15 0.5 15.894 0.7815 16.682 1.3445C17.47 1.9075 18.001 2.626 18.275 3.5H24.5C25.325 3.5 26.0315 3.794 26.6195 4.382C27.2075 4.97 27.501 5.676 27.5 6.5V15.5ZM14 6.5C14.425 6.5 14.7815 6.356 15.0695 6.068C15.3575 5.78 15.501 5.424 15.5 5C15.499 4.576 15.355 4.22 15.068 3.932C14.781 3.644 14.425 3.5 14 3.5C13.575 3.5 13.219 3.644 12.932 3.932C12.645 4.22 12.501 4.576 12.5 5C12.499 5.424 12.643 5.7805 12.932 6.0695C13.221 6.3585 13.577 6.502 14 6.5Z"
                    fill="#F48567"
                  />
                </svg>
                <span>MODULE DETAILS</span>
              </h2>
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={index}
                    className="flex justify-start items-center p-1"
                  >
                    <span className="font-medium capitalize w-[150px]">
                      {field.label}:
                    </span>
                    <span className="ml-4">{field.value || "N/A"}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3 mt-3">
                <div className="flex justify-start items-center p-1">
                  {mediaItems.length === 3 ? (
                    <span className="font-medium capitalize w-[550px]">
                      Cover Photo&nbsp;&nbsp;&nbsp; Module Video&nbsp;&nbsp;
                      Explanatory Video
                    </span>
                  ) : mediaItems.length === 2 ? (
                    <span className="font-medium capitalize w-[550px]">
                      Cover Photo &nbsp;&nbsp; Module Video
                    </span>
                  ) : (
                    <span className="font-medium capitalize w-[550px]">
                      Cover Photo
                    </span>
                  )}
                </div>
                <div className="flex justify-start items-center p-1 gap-3">
                  {mediaItems.map((item, index) => (
                    <div key={index}>
                      {item.type === "image" ? (
                        <img
                          src={getMediaUrl(item.src)}
                          alt="Cover"
                          className="w-24 h-24 object-cover cursor-pointer"
                          onClick={() => handleOpenModal(item)}
                        />
                      ) : Array.isArray(item.src) ? (
                        item.src
                          .slice(0, 1)
                          .map((video, videoIndex) => (
                            <video
                              key={videoIndex}
                              src={getMediaUrl(video)}
                              className="w-24 h-24 object-cover cursor-pointer"
                              onClick={() => handleOpenModal(item, videoIndex)}
                            />
                          ))
                      ) : (
                        <video
                          src={getMediaUrl(item.src)}
                          className="w-24 h-24 object-cover cursor-pointer"
                          onClick={() => handleOpenModal(item)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Only show approve/reject buttons for Admin/Super Admin users */}
              {isAdminUser && (
                <div className="flex gap-4 mt-12 w-full items-center justify-center">
                  <div className="flex flex-col w-[150px]">
                    <button
                      type="submit"
                      className="bg-[#F48567] px-3 py-4 rounded-xl text-[#000]"
                      onClick={() => handleUpdateStatus(data._id, "approved")}
                    >
                      Approve
                    </button>
                  </div>

                  <div className="flex flex-col w-[150px]">
                    {/* Save Button */}
                    <button
                      onClick={() => handleUpdateStatus(data._id, "rejected")}
                      className="bg-[#C7C7C7] px-4 py-4 rounded-xl text-[#000]"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </section>
            <div className="mt-9 mr-[50px] ml-[50px]">
              <svg
                width="8"
                height="600"
                viewBox="0 0 8 600"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="4.5" x2="4.5" y2="600" stroke="white" />
                <rect y="10" width="8" height="60" rx="4" fill="#F48567" />
              </svg>
            </div>
            <section className="w-1/2">
              <div className="flex justify-between align-center mt-6">
                <h2 className="text-2xl mb-6 text-white">PROFILE DETAILS</h2>
                <svg
                  className="cursor-pointer mt-1"
                  onClick={handleClosePopup}
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_3261_1019)">
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
              </div>
              <div className="flex justify-center mb-8">
                <svg width="180" height="193" viewBox="0 0 180 193" fill="none">
                  <path
                    d="M0.5 0.5H179.5V147.408L90 172.481L0.5 147.408V0.5Z"
                    fill="#D9D9D9"
                    stroke="black"
                  />
                  <rect
                    x="0"
                    y="-30"
                    width="100%"
                    height="100%"
                    fill="url(#pattern0_3001_1137)"
                  />
                  <path
                    d="M180 131V166.197C176.154 169.298 171.73 172.293 166.648 175.127C146.016 186.624 118.795 192.95 89.9978 192.95C61.2003 192.95 33.9841 186.624 13.3518 175.127C8.27042 172.293 3.8461 169.303 0 166.197V131C9.01949 144.28 39.9284 163.867 89.9978 163.867C140.067 163.867 170.98 144.28 180 131Z"
                    fill="#F48567"
                  />
                  <defs>
                    <pattern
                      id="pattern0_3001_1137"
                      patternContentUnits="objectBoundingBox"
                      width="1"
                      height="1"
                    >
                      <use
                        href="#image0_3001_1137"
                        transform="scale(0.00675676)"
                      />
                    </pattern>
                    <image
                      id="image0_3001_1137"
                      width="180"
                      height="173"
                      href={
                        uploadedBy?.image
                          ? `${
                              process.env.REACT_APP_STATIC_API_URL
                            }${uploadedBy.image.replace(
                              /^\/root\/happme_adminuser_management/,
                              ""
                            )}`
                          : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"
                      }
                    />
                  </defs>
                </svg>
              </div>

              {/* Content Section */}
              <div className="overflow-y-auto flex flex-col space-y-6 text-[#C7C7C7] h-[50vh]">
                <div className="space-y-3">
                  {Object.entries(uploadedBy)
                    .filter(
                      ([key]) =>
                        ![
                          "_id",
                          "blocked",
                          "editLogs",
                          "__v",
                          "activityLogs",
                          "availability",
                          "totalAvailabilityHours",
                          "password",
                          "image",
                          "roles",
                          "macAddresses",
                          "passwordChangedAt",
                        ].includes(key)
                    )
                    .map(([key, value]) => (
                      <div
                        className="flex justify-start items-center p-1"
                        key={key}
                      >
                        <span className="font-medium capitalize w-[150px]">
                          {key.replace(/([A-Z])/g, " $1")}:
                        </span>
                        <span className="ml-4">
                          {typeof value === "object" && value !== null
                            ? JSON.stringify(value, null, 2)
                            : value || "N/A"}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* MODAL FOR MAGNIFIED IMAGE AND VIDEO PLAYBACK */}
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width="90%"
        centered
        closeIcon={
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "50%",
              padding: "4px",
            }}
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        styles={{
          body: {
            padding: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#000",
            minHeight: "70vh",
          },
        }}
      >
        {modalContent && (
          <div className="flex justify-center items-center w-full h-full">
            {modalContent.type === "image" ? (
              <img
                src={getMediaUrl(modalContent.src)}
                alt="Magnified"
                style={{
                  width: "100%",
                  height: "70vh",
                  objectFit: "contain",
                }}
              />
            ) : (
              <video
                ref={videoRef}
                src={getMediaUrl(modalContent.src)}
                controls
                autoPlay
                style={{
                  width: "100%",
                  height: "70vh",
                  objectFit: "contain",
                }}
              />
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default ContentManagement;
