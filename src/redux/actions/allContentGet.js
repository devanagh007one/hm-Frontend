import CryptoJS from "crypto-js"; // Ensure you have imported CryptoJS

export const FETCH_CONTENT_SUCCESS = "FETCH_CONTENT_SUCCESS";
export const FETCH_CONTENT_FAILURE = "FETCH_CONTENT_FAILURE";
export const CREATE_CONTENT_SUCCESS = "CREATE_CONTENT_SUCCESS";
export const CREATE_CONTENT_FAILURE = "CREATE_CONTENT_FAILURE";
export const CREATE_CHALLENGE_SUCCESS = "CREATE_CHALLENGE_SUCCESS";
export const CREATE_CHALLENGE_FAILURE = "CREATE_CHALLENGE_FAILURE";
export const PATCH_CONTENT_SUCCESS = "PATCH_CONTENT_SUCCESS";
export const PATCH_CONTENT_FAILURE = "PATCH_CONTENT_FAILURE";
export const UPDATE_CONTENT_SUCCESS = "UPDATE_CONTENT_SUCCESS";
export const UPDATE_CONTENT_FAILURE = "UPDATE_CONTENT_FAILURE";
export const PATCH_CHALLENGE_SUCCESS = "PATCH_CHALLENGE_SUCCESS";
export const PATCH_CHALLENGE_FAILURE = "PATCH_CHALLENGE_FAILURE";
export const DELETE_CONTENT_SUCCESS = "DELETE_CONTENT_SUCCESS";
export const DELETE_CONTENT_FAILURE = "DELETE_CONTENT_FAILURE";
export const DELETE_CHALLENGE_SUCCESS = "DELETE_CHALLENGE_SUCCESS";
export const DELETE_CHALLENGE_FAILURE = "DELETE_CHALLENGE_FAILURE";
export const FETCH_TRACKS_SUCCESS = "FETCH_TRACKS_SUCCESS";
export const FETCH_TRACKS_FAILURE = "FETCH_TRACKS_FAILURE";
export const UPDATE_TRACK_SUCCESS = "UPDATE_TRACK_SUCCESS";
export const UPDATE_TRACK_FAILURE = "UPDATE_TRACK_FAILURE";
export const START_FRESH_SUCCESS = "START_FRESH_SUCCESS";
export const START_FRESH_FAILURE = "START_FRESH_FAILURE";
export const FETCH_MODULES_BY_TRACK_SUCCESS = "FETCH_MODULES_BY_TRACK_SUCCESS";
export const FETCH_MODULES_BY_TRACK_FAILURE = "FETCH_MODULES_BY_TRACK_FAILURE";
export const UPDATE_LEARNING_VIDEO_SUCCESS = "UPDATE_LEARNING_VIDEO_SUCCESS";
export const UPDATE_LEARNING_VIDEO_FAILURE = "UPDATE_LEARNING_VIDEO_FAILURE";

// Action for fetching all content
export const fetchAllContent = () => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/v1/challenge-and-modules-for-admin`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch content");
    }

    const data = await response.json();
    console.log("Data from API:", data);

    const { challenges, modules } = data.data;

    if (Array.isArray(challenges) && Array.isArray(modules)) {
      const moduleMap = modules.map((mod) => ({
        id: mod._id,
        name: mod.moduleName,
        uploadedById: mod.uploaded_by?._id, // Make sure this is included
      }));

      localStorage.setItem("moduleInfo", JSON.stringify(moduleMap));

      // Optional: Log it to verify
      console.log("Saved module info to localStorage:", moduleMap);

      // Dispatch success action with full data (challenges + modules)
      dispatch({ type: FETCH_CONTENT_SUCCESS, payload: data });
    } else {
      throw new Error("Challenges or modules are not arrays");
    }
  } catch (error) {
    console.error("Error in fetchAllContent:", error);
    dispatch({ type: FETCH_CONTENT_FAILURE, payload: error.message });
  }
};

// Action for Patching the content (existing PATCH method)
export const patchTheContent = (userId, status) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    // Construct the request payload
    const updatedData = {
      id: userId,
      isApproved: status, // "approved" or "rejected"
    };

    console.log("Sending Patch Request:", updatedData);

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/contant/contants/approval`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updatedData), // Send updated data in the request body
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update content");
    }

    const data = await response.json();
    console.log("Updated Content:", data);

    // Dispatch PATCH_CONTENT_SUCCESS with updated content
    dispatch({ type: PATCH_CONTENT_SUCCESS, payload: data });
  } catch (error) {
    console.error("Error in patchTheContent:", error);
    dispatch({ type: PATCH_CONTENT_FAILURE, payload: error.message });
  }
};

// NEW Action for updating content using PUT method
export const updateContent = (contentId, updateData) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    // Use FormData for file uploads
    const formData = new FormData();

    // Append all text fields
    formData.append("moduleName", updateData.moduleName || "");
    formData.append("description", updateData.description || "");
    formData.append("isApproved", updateData.isApproved || "pending");
    formData.append("tracks", updateData.tracks || "");
    formData.append("moduleType", updateData.moduleType || "Module");
    formData.append("fileSize", updateData.fileSize || "");

    // Append files if they exist
    if (updateData.cover_Photo && updateData.cover_Photo instanceof File) {
      formData.append("cover_Photo", updateData.cover_Photo);
    }
    if (
      updateData.videoFile_introduction &&
      updateData.videoFile_introduction instanceof File
    ) {
      formData.append(
        "videoFile_introduction",
        updateData.videoFile_introduction
      );
    }
    if (
      updateData.videoFile_description &&
      updateData.videoFile_description instanceof File
    ) {
      formData.append(
        "videoFile_description",
        updateData.videoFile_description
      );
    }

    console.log("Sending PUT Request for Content ID:", contentId);
    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/contant/contants/${contentId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          // Don't set Content-Type - let browser set it with boundary for FormData
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to update content. Server response:", errorText);
      throw new Error(errorText || "Failed to update content");
    }

    const data = await response.json();
    console.log("Updated Content via PUT:", data);

    dispatch({ type: UPDATE_CONTENT_SUCCESS, payload: data });
    return data;
  } catch (error) {
    console.error("Error in updateContent:", error);
    dispatch({ type: UPDATE_CONTENT_FAILURE, payload: error.message });
    throw error;
  }
};
// Action for Patching the Challenge
export const patchTheChallenge = (challengeId, status) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    // Construct the request payload
    const updatedData = {
      rejectionReason: "Dont Know",
      isApproved: status, // "approved" or "rejected"
    };

    console.log("Sending Patch Request for Challenge:", updatedData);

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/challenge/approve-reject-challenge/${challengeId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updatedData), // Send updated data in the request body
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update challenge");
    }

    const data = await response.json();
    console.log("Updated Challenge:", data);

    // Dispatch PATCH_CHALLENGE_SUCCESS with updated challenge data
    dispatch({ type: PATCH_CHALLENGE_SUCCESS, payload: data });
  } catch (error) {
    console.error("Error in patchTheChallenge:", error);
    dispatch({ type: PATCH_CHALLENGE_FAILURE, payload: error.message });
  }
};

// Action for Deleting the Content
export const deleteContent = (contentId) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    // Log the action for deleting content
    console.log("Sending Delete Request for Content ID:", contentId);

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/contant/contants/${contentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete content");
    }

    const data = await response.json();
    console.log("Deleted Content:", data);

    // Dispatch DELETE_CONTENT_SUCCESS with the response data
    dispatch({ type: DELETE_CONTENT_SUCCESS, payload: data });
  } catch (error) {
    console.error("Error in deleteContent:", error);
    dispatch({ type: DELETE_CONTENT_FAILURE, payload: error.message });
  }
};

// Action for Deleting the Challenge
export const deleteChallenge = (challengeId) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    // Log the action for deleting the challenge
    console.log("Sending Delete Request for Challenge ID:", challengeId);

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/challenge/deletechallenge/${challengeId}`, // Adjust the URL if needed
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete challenge");
    }

    const data = await response.json();
    console.log("Deleted Challenge:", data);

    // Dispatch DELETE_CHALLENGE_SUCCESS with the response data
    dispatch({ type: DELETE_CHALLENGE_SUCCESS, payload: data });
  } catch (error) {
    console.error("Error in deleteChallenge:", error);
    dispatch({ type: DELETE_CHALLENGE_FAILURE, payload: error.message });
  }
};

export const createContent = (contentData) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");
    console.log(contentData);

    const encryptedId = localStorage.getItem("userId");
    if (!encryptedId) {
      console.error("Encrypted user ID is missing.");
      return null;
    }

    let userId = null;
    try {
      const bytes = CryptoJS.AES.decrypt(
        encryptedId,
        "477f58bc13b97959097e7bda64de165ab9d7496b7a15ab39697e6d31ac61cbd1"
      );
      userId = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error("Error decrypting user ID:", error);
      return null;
    }

    const formData = new FormData();
    formData.append("uploaded_by", userId);

    // Check and append other content data
    for (const key in contentData) {
      if (contentData.hasOwnProperty(key)) {
        if (
          key === "formData" &&
          typeof contentData[key] === "object" &&
          !Array.isArray(contentData[key])
        ) {
          // Handle nested formData object correctly
          for (const subKey in contentData[key]) {
            if (contentData[key].hasOwnProperty(subKey)) {
              formData.append(subKey, contentData[key][subKey]);
            }
          }
        } else if (key !== "formData" && contentData[key] !== null) {
          formData.append(key, contentData[key]);
        }
      }
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_STATIC_API_URL}/api/contant/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text(); // Error text for debugging
        console.error("Failed to create content. Server response:", errorText);
        throw new Error("Failed to create content");
      }

      let data;
      try {
        // Directly parse the response as JSON
        data = await response.json();
        console.log("Parsed JSON:", data);
      } catch (error) {
        console.error("Failed to parse response JSON.", error);
        return;
      }

      if (data?.success === true && data?.content?._id) {
        dispatch({ type: CREATE_CONTENT_SUCCESS, payload: data.content });
        return data.content;
      } else {
        console.error("Unexpected response format:", data);
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      console.error("Error in createContent:", error);
      dispatch({ type: CREATE_CONTENT_FAILURE, payload: error.message });
    }
  } catch (error) {
    console.error("Unexpected error in createContent:", error);
    dispatch({ type: CREATE_CONTENT_FAILURE, payload: error.message });
  }
};

export const createchallenge = (formData) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    // Debug: Log the FormData before sending
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/challenge/create-challenge`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData, // Directly use the FormData object
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to create challenge. Server response:", errorText);
      throw new Error(errorText || "Failed to create challenge");
    }

    const data = await response.json();

    if (!data.success) {
      console.error("Challenge creation failed:", data.message);
      throw new Error(data.message || "Challenge creation failed");
    }

    dispatch({ type: CREATE_CHALLENGE_SUCCESS, payload: data });
    return data;
  } catch (error) {
    console.error("Error in createchallenge:", error);
    dispatch({ type: CREATE_CHALLENGE_FAILURE, payload: error.message });
    throw error; // Re-throw to handle in the component
  }
};

// New Action for updating (editing) a Challenge using PUT
export const updateChallenge =
  (challengeId, updateData) => async (dispatch) => {
    try {
      const authToken = localStorage.getItem("authToken");

      // Construct payload
      const requestPayload = {
        ...updateData, // include all fields that may be updated (title, description, etc.)
      };

      console.log(
        "Sending PUT Request for Challenge ID:",
        challengeId,
        requestPayload
      );

      const response = await fetch(
        `${process.env.REACT_APP_STATIC_API_URL}/api/challenge/editchallenge/${challengeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(requestPayload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "Failed to update challenge. Server response:",
          errorText
        );
        throw new Error(errorText || "Failed to update challenge");
      }

      const data = await response.json();
      console.log("Updated Challenge via PUT:", data);

      // Dispatch PATCH_CHALLENGE_SUCCESS (you may also define UPDATE_CHALLENGE_SUCCESS for clarity)
      dispatch({ type: PATCH_CHALLENGE_SUCCESS, payload: data });

      return data; // so component can use it
    } catch (error) {
      console.error("Error in updateChallenge:", error);
      dispatch({ type: PATCH_CHALLENGE_FAILURE, payload: error.message });
      throw error; // rethrow so component can catch it
    }
  };
export const fetchAllTracks = () => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/v1/get-all-tracks`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch tracks");
    }

    const data = await response.json();
    console.log("Tracks data from API:", data);

    // Dispatch success action with tracks data
    dispatch({ type: FETCH_TRACKS_SUCCESS, payload: data.items });

    return data.items; // Return tracks for component use
  } catch (error) {
    console.error("Error in fetchAllTracks:", error);
    dispatch({ type: FETCH_TRACKS_FAILURE, payload: error.message });
    throw error;
  }
};
export const updateTrack = (trackId, trackData) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");
    const formData = new FormData();

    // Append fields if they exist
    if (trackData.tracksName)
      formData.append("tracksName", trackData.tracksName);
    if (trackData.trackImage)
      formData.append("trackImage", trackData.trackImage);
    if (trackData.trackIcon) formData.append("trackIcon", trackData.trackIcon);

    console.log("Sending PUT Request for Track ID:", trackId);

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/v1/edit-single-track/${trackId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update track");
    }

    const data = await response.json();
    console.log("Updated Track:", data);

    dispatch({ type: UPDATE_TRACK_SUCCESS, payload: data });
    return data;
  } catch (error) {
    console.error("Error in updateTrack:", error);
    dispatch({ type: UPDATE_TRACK_FAILURE, payload: error.message });
    throw error;
  }
};
// Action for starting fresh (deleting all related content for a track)
export const startFresh = (trackId) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    console.log("Sending Start Fresh Request for Track ID:", trackId);

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/v1/start-fresh/${trackId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to start fresh. Server response:", errorText);
      throw new Error(errorText || "Failed to start fresh");
    }

    const data = await response.json();
    console.log("Start Fresh Response:", data);

    // Dispatch success action with the response data
    dispatch({ type: START_FRESH_SUCCESS, payload: data });

    return data; // Return data for component use
  } catch (error) {
    console.error("Error in startFresh:", error);
    dispatch({ type: START_FRESH_FAILURE, payload: error.message });
    throw error; // Re-throw to handle in component
  }
};
// Action for fetching modules by track
export const fetchModulesByTrack = (trackName) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    console.log("Fetching modules for track:", trackName);

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/contant/by-track`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          tracks: trackName,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch modules by track");
    }

    const data = await response.json();
    console.log("Modules by track data:", data);

    // Dispatch success action with modules data
    dispatch({ type: FETCH_MODULES_BY_TRACK_SUCCESS, payload: data });

    return data; // Return modules for component use
  } catch (error) {
    console.error("Error in fetchModulesByTrack:", error);
    dispatch({ type: FETCH_MODULES_BY_TRACK_FAILURE, payload: error.message });
    throw error;
  }
};
export const updateLearningVideos =
  (videoId, updateData) => async (dispatch) => {
    try {
      const authToken = localStorage.getItem("authToken");
      const formData = new FormData();

      // Append new files if provided
      if (updateData.videoFile_introduction instanceof File) {
        formData.append(
          "videoFile_introduction",
          updateData.videoFile_introduction
        );
      }
      if (updateData.videoFile_description instanceof File) {
        formData.append(
          "videoFile_description",
          updateData.videoFile_description
        );
      }

      // Append remove flags if present
      if (updateData.remove_videoFile_introduction)
        formData.append(
          "remove_videoFile_introduction",
          updateData.remove_videoFile_introduction
        );
      if (updateData.remove_videoFile_description)
        formData.append(
          "remove_videoFile_description",
          updateData.remove_videoFile_description
        );

      console.log("Sending PUT Request for Learning Video:", videoId);
      for (let [key, val] of formData.entries()) console.log(key, val);

      const response = await fetch(
        `${process.env.REACT_APP_STATIC_API_URL}/api/contant/learning-videos/${videoId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${authToken}` },
          body: formData,
        }
      );

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || "Failed to update learning video");
      }

      const data = await response.json();
      console.log("Updated Learning Video:", data);

      dispatch({ type: UPDATE_LEARNING_VIDEO_SUCCESS, payload: data });
      return data;
    } catch (error) {
      console.error("Error in updateLearningVideos:", error);
      dispatch({ type: UPDATE_LEARNING_VIDEO_FAILURE, payload: error.message });
      throw error;
    }
  };
