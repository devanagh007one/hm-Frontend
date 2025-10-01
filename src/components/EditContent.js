import React, { useState, useEffect } from "react";
import { Spin, Progress } from "antd";
import "./popup.css"; // Import custom CSS
import "./popup2.css"; // Import custom CSS
import { useSelector, useDispatch } from "react-redux";
import { updateContent, updateChallenge } from "../redux/actions/allContentGet";
import { showNotification } from "../redux/actions/notificationActions";
import { Pencil, Upload } from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";
import CryptoJS from "crypto-js";

const EditContent = ({ contentData }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);

  const [showPopup, setShowPopup] = useState(false);
  const [isLoadingLink, setLoadingLink] = useState(false);
  const [fileProfile, setFileProfile] = useState("Upload Cover Photo");
  const [editModule, setEditModule] = useState(null);
  const [progress, setProgress] = useState(0);
  const [userRoles, setUserRoles] = useState([]);

  // Confirmation modals
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    tracks: "",
    moduleName: "",
    challengeName: "",
    moduleType: "Module",
    description: "",
    challenge_Description: "",
    challenge_benefits: "",
    duration: "",
    difficulty_Level: "",
    cover_Photo: "",
    videoFile_introduction: "",
    videoFile_description: null,
    video_or_image: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);

  // Get user roles from localStorage on component mount
  useEffect(() => {
    const encryptedRoles = localStorage.getItem("encryptedRoles");
    let roles = [];

    if (encryptedRoles) {
      try {
        const bytes = CryptoJS.AES.decrypt(
          encryptedRoles,
          "477f58bc13b97959097e7bda64de165ab9d7496b7a15ab39697e6d31ac61cbd1"
        );
        roles = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } catch (error) {
        console.error("Error decrypting roles:", error);
      }
    }
    setUserRoles(roles);
  }, []);

  useEffect(() => {
    if (contentData) {
      // Populate form with existing data based on content type
      if (contentData.moduleName) {
        // It's a module
        setFormData({
          tracks: contentData.tracks || "",
          moduleName: contentData.moduleName || "",
          moduleType: contentData.moduleType || "Module",
          description: contentData.description || "",
          cover_Photo: contentData.cover_Photo || "",
          videoFile_introduction: contentData.videoFile_introduction || "",
          videoFile_description: contentData.videoFile_description || null,
          content: contentData.content || "",
        });
      } else if (contentData.challengeName) {
        // It's a challenge
        setFormData({
          tracks: contentData.tracks || contentData.module?.tracks || "",
          challengeName: contentData.challengeName || "",
          challenge_Description: contentData.challenge_Description || "",
          challenge_benefits: contentData.challenge_benefits || "",
          duration: contentData.duration || "",
          difficulty_Level: contentData.difficulty_Level || "",
          video_or_image: contentData.video_or_image || "",
        });
      }
    }
  }, [contentData]);

  // Check if user can edit challenges
  const canEditChallenges = () => {
    const allowedRoles = ["Super Admin", "Admin"];
    return userRoles.some((role) => allowedRoles.includes(role));
  };

  // Check if user can edit this specific content
  const canEditContent = () => {
    const isChallenge = contentData?.challengeName;

    if (isChallenge) {
      return canEditChallenges();
    }

    // For modules, all roles can edit
    return true;
  };

  const handleViewPopup = () => {
    if (!canEditContent()) {
      dispatch(
        showNotification(
          "You don't have permission to edit challenges. Only Admin and Super Admin can edit challenges.",
          "error"
        )
      );
      return;
    }
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setFormData({
      tracks: "",
      moduleName: "",
      challengeName: "",
      moduleType: "Module",
      description: "",
      challenge_Description: "",
      challenge_benefits: "",
      duration: "",
      difficulty_Level: "",
      cover_Photo: "",
      videoFile_introduction: "",
      videoFile_description: null,
      video_or_image: "",
      content: "",
    });
    setEditModule(null);
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: file,
    }));
  };

  const handleRemoveFile = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  const handleCancelConfirmation = () => {
    setShowCancelConfirmation(true);
  };

  const confirmCancel = () => {
    setShowCancelConfirmation(false);
    handleClosePopup();
  };

  const rejectCancel = () => {
    setShowCancelConfirmation(false);
  };

  const handleConfirmSubmit = async () => {
    // Double check permissions before showing confirmation
    if (!canEditContent()) {
      dispatch(
        showNotification(
          "You don't have permission to edit this content.",
          "error"
        )
      );
      return;
    }
    setShowSubmitConfirmation(true);
  };

  const handleUpdateContent = async () => {
    setShowSubmitConfirmation(false);
    setLoadingLink(true);

    try {
      if (!contentData?._id) {
        dispatch(showNotification("No content selected for update", "error"));
        return;
      }

      // Final permission check before API call
      if (!canEditContent()) {
        dispatch(
          showNotification(
            "You don't have permission to edit this content.",
            "error"
          )
        );
        setLoadingLink(false);
        return;
      }

      // Prepare update data based on content type
      let updateData = {};
      let updateFunction = null;

      if (contentData.moduleName) {
        // Update module
        updateData = {
          moduleName: formData.moduleName,
          description: formData.description,
          tracks: formData.tracks,
          isApproved: "pending", // Reset approval status when updating
        };
        updateFunction = updateContent;
      } else if (contentData.challengeName) {
        // Update challenge
        updateData = {
          challengeName: formData.challengeName,
          challenge_Description: formData.challenge_Description,
          challenge_benefits: formData.challenge_benefits,
          duration: formData.duration,
          difficulty_Level: formData.difficulty_Level,
          isApproved: "pending", // Reset approval status when updating
        };
        updateFunction = updateChallenge;
      }

      // Call the update API
      await dispatch(updateFunction(contentData._id, updateData));

      dispatch(showNotification("Content updated successfully!", "success"));
      setShowSuccessModal(true);
      setLoadingLink(false);
    } catch (error) {
      console.error("Error updating content:", error);
      dispatch(
        showNotification("Failed to update content. Please try again.", "error")
      );
      setLoadingLink(false);
    }
  };

  const handleSuccessOK = () => {
    setShowSuccessModal(false);
    handleClosePopup();
    setEditModule(null);
  };

  const isModule = contentData?.moduleName;
  const isChallenge = contentData?.challengeName;

  // Show different pencil icon based on permissions
  const getPencilIcon = () => {
    if (!canEditContent()) {
      return (
        <Pencil
          size={16}
          className="cursor-not-allowed text-gray-400 opacity-50"
          title="You don't have permission to edit this content"
        />
      );
    }

    return (
      <Pencil
        size={16}
        className="cursor-pointer text-[#C7C7C7] hover:text-[#F48567]"
      />
    );
  };

  return (
    <>
      <div onClick={handleViewPopup}>{getPencilIcon()}</div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div
            className={`rounded-2xl border border-[#FFFFFF59] shadow-[0_1px_6px_rgba(230,230,230,0.35)] focus:outline-none-lg w-[460px] overflow-y-scroll max-w-3xl p-8 relative flex flex-col max-h-[700px] ${
              darkMode ? "bg-[#1E1E1E] text-white" : "bg-[#fff] text-dark"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <div className="flex flex-col mb-6 w-full">
                <div className="flex justify-between items-center w-full">
                  <div></div>
                  <div>
                    <h1 className="text-2xl font-bold">
                      Edit {isModule ? "Module" : "Challenge"}
                    </h1>
                  </div>
                  <div>
                    {!isLoadingLink && (
                      <svg
                        className="cursor-pointer"
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
                  <span>
                    Editing:{" "}
                    {isModule ? formData.moduleName : formData.challengeName}
                  </span>
                </div>

                {/* Permission warning for challenges */}
                {isChallenge && !canEditChallenges() && (
                  <div className="mt-2 p-2 bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg">
                    <p className="text-yellow-500 text-sm">
                      ⚠️ Only Admin and Super Admin can edit challenges
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              {/* Edit Form Section */}
              <section>
                {isModule && (
                  <>
                    <div className="flex mt-3 flex-col">
                      <label className="mb-1">Title</label>
                      <input
                        name="moduleName"
                        required
                        type="text"
                        placeholder="Title"
                        className="p-2 rounded-xl border border-gray-600 focus:outline-none"
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
                      <label className="mb-1">Description</label>
                      <textarea
                        name="description"
                        required
                        placeholder="Enter Description"
                        className="p-2 rounded-xl border border-gray-600 focus:outline-none"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex flex-col mt-3">
                      <label className="mb-1">Track</label>
                      <input
                        name="tracks"
                        required
                        type="text"
                        placeholder="Track"
                        className="p-2 rounded-xl border border-gray-600 focus:outline-none"
                        value={formData.tracks}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tracks: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Upload sections for modules */}
                    <div className="flex flex-col w-full mt-3">
                      <label className="mb-1">Upload Cover Photo</label>
                      <label className="p-2 pl-4 pr-4 rounded-xl border border-gray-600 focus:outline-none flex items-center justify-between cursor-pointer">
                        <div>
                          {formData.cover_Photo?.name || "Upload Cover Photo"}
                        </div>
                        <div className="flex items-center">
                          <input
                            name="cover_Photo"
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, "cover_Photo")}
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
                  </>
                )}

                {isChallenge && (
                  <>
                    {/* Permission check for challenge editing */}
                    {!canEditChallenges() ? (
                      <div className="p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-center">
                        <p className="text-red-500 font-semibold">
                          Access Denied
                        </p>
                        <p className="text-red-400 text-sm mt-1">
                          Only Admin and Super Admin users can edit challenges.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex mt-3 flex-col">
                          <label className="mb-1">Challenge Name</label>
                          <input
                            name="challengeName"
                            required
                            type="text"
                            placeholder="Challenge Name"
                            className="p-2 rounded-xl border border-gray-600 focus:outline-none"
                            value={formData.challengeName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                challengeName: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="flex flex-col mt-2">
                          <label className="mb-1">Description</label>
                          <textarea
                            name="challenge_Description"
                            required
                            type="text"
                            placeholder="How to do the challenge"
                            className="p-2 rounded-xl border border-gray-600 focus:outline-none"
                            value={formData.challenge_Description}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                challenge_Description: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="flex flex-col mt-2">
                          <label className="mb-1">Benefits</label>
                          <input
                            name="challenge_benefits"
                            required
                            type="text"
                            placeholder="Benefits"
                            className="p-2 rounded-xl border border-gray-600 focus:outline-none"
                            value={formData.challenge_benefits}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                challenge_benefits: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="flex flex-col mt-2">
                          <label className="mb-1">Duration</label>
                          <input
                            name="duration"
                            required
                            type="text"
                            placeholder="3h 00 min"
                            className="p-2 rounded-xl border border-gray-600 focus:outline-none w-full"
                            value={formData.duration}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                duration: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="flex flex-col mt-2">
                          <label className="mb-1">Difficulty Level</label>
                          <select
                            name="difficulty_Level"
                            required
                            className="p-2 rounded-xl border border-gray-600 focus:outline-none"
                            value={formData.difficulty_Level}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
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
                          <label className="mb-1">Upload Photo or Video</label>
                          <label className="p-2 pl-4 pr-4 rounded-xl border border-gray-600 focus:outline-none flex items-center justify-between cursor-pointer">
                            <div>
                              {formData.video_or_image?.name ||
                                "Upload Photo or Video"}
                            </div>
                            <input
                              name="video_or_image"
                              type="file"
                              className="hidden"
                              onChange={(e) =>
                                handleFileChange(e, "video_or_image")
                              }
                            />
                            {formData.video_or_image ? (
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFile("video_or_image");
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
                      </>
                    )}
                  </>
                )}

                <div className="flex gap-4 mt-6 w-full">
                  <div className="flex flex-col w-full">
                    <button
                      type="button"
                      className="bg-[#F48567] px-4 py-2 rounded-xl border border-gray-600 focus:outline-none-xl text-[#000] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleConfirmSubmit}
                      disabled={
                        loading || (isChallenge && !canEditChallenges())
                      }
                    >
                      {loading ? (
                        <Spin size="small" />
                      ) : isChallenge && !canEditChallenges() ? (
                        "No Permission"
                      ) : (
                        `Update ${isModule ? "Module" : "Challenge"}`
                      )}
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

              {isLoadingLink && (
                <section className="flex flex-col w-full mt-4">
                  <Progress
                    percent={progress}
                    percentPosition={{ align: "center", type: "inner" }}
                    size={[400, 20]}
                    strokeColor="#F48567"
                  />
                  <p className="text-center mt-2">Updating content...</p>
                </section>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showSubmitConfirmation}
        onClose={() => setShowSubmitConfirmation(false)}
        onConfirm={handleUpdateContent}
        message={`Are you sure you want to update this ${
          isModule ? "module" : "challenge"
        }?`}
        confirmText="Update"
        cancelText="Cancel"
        darkMode={darkMode}
      />

      <ConfirmationModal
        isOpen={showCancelConfirmation}
        onClose={rejectCancel}
        onConfirm={confirmCancel}
        message="If you cancel now, all unsaved changes will be lost. Are you sure?"
        confirmText="Yes"
        cancelText="No"
        darkMode={darkMode}
      />

      <ConfirmationModal
        isOpen={showSuccessModal}
        onClose={handleSuccessOK}
        onConfirm={handleSuccessOK}
        message={`${isModule ? "Module" : "Challenge"} updated successfully!`}
        confirmText="OK"
        showCancel={false}
        darkMode={darkMode}
      />
    </>
  );
};

export default EditContent;
