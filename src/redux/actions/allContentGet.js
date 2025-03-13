import CryptoJS from 'crypto-js'; // Ensure you have imported CryptoJS

export const FETCH_CONTENT_SUCCESS = "FETCH_CONTENT_SUCCESS";
export const FETCH_CONTENT_FAILURE = "FETCH_CONTENT_FAILURE";
export const CREATE_CONTENT_SUCCESS = "CREATE_CONTENT_SUCCESS";
export const CREATE_CONTENT_FAILURE = "CREATE_CONTENT_FAILURE";
export const CREATE_CHALLENGE_SUCCESS = "CREATE_CHALLENGE_SUCCESS";
export const CREATE_CHALLENGE_FAILURE = "CREATE_CHALLENGE_FAILURE";
export const PATCH_CONTENT_SUCCESS = "PATCH_CONTENT_SUCCESS";
export const PATCH_CONTENT_FAILURE = "PATCH_CONTENT_FAILURE";
export const PATCH_CHALLENGE_SUCCESS = "PATCH_CHALLENGE_SUCCESS";
export const PATCH_CHALLENGE_FAILURE = "PATCH_CHALLENGE_FAILURE";
export const DELETE_CONTENT_SUCCESS = "DELETE_CONTENT_SUCCESS";
export const DELETE_CONTENT_FAILURE = "DELETE_CONTENT_FAILURE";
export const DELETE_CHALLENGE_SUCCESS = "DELETE_CHALLENGE_SUCCESS";
export const DELETE_CHALLENGE_FAILURE = "DELETE_CHALLENGE_FAILURE";


// Action for fetching all content
export const fetchAllContent = () => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    // Fetch all content
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

    // Access the nested 'data' object
    const { challenges, modules } = data.data;

    // Check if challenges and modules exist and are arrays
    if (Array.isArray(challenges) && Array.isArray(modules)) {
      // Combine challenges and modules into one array
      const combinedData = [...challenges, ...modules];
      // console.log("Combined Data:", combinedData);

      // Dispatch FETCH_CONTENT_SUCCESS with the combined data
      dispatch({ type: FETCH_CONTENT_SUCCESS, payload: data });
    } else {
      throw new Error("Challenges or modules are not arrays");
    }
  } catch (error) {
    console.error("Error in fetchAllContent:", error);
    dispatch({ type: FETCH_CONTENT_FAILURE, payload: error.message });
  }
};




// Action for Patching the content
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

    const encryptedId = localStorage.getItem('userId');
    if (!encryptedId) {
      console.error('Encrypted user ID is missing.');
      return null;
    }

    let userId = null;
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedId, '477f58bc13b97959097e7bda64de165ab9d7496b7a15ab39697e6d31ac61cbd1');
      userId = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error('Error decrypting user ID:', error);
      return null;
    }

    const formData = new FormData();
    formData.append('uploaded_by', userId);



    // Check and append other content data
    for (const key in contentData) {
      if (contentData.hasOwnProperty(key)) {
        if (key === "formData" && typeof contentData[key] === "object" && !Array.isArray(contentData[key])) {
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


export const createchallenge = (challengeData) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");
    console.log(challengeData);

    const encryptedId = localStorage.getItem('userId');
    if (!encryptedId) {
      console.error('Encrypted user ID is missing.');
      return null;
    }

    let userId = null;
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedId, '477f58bc13b97959097e7bda64de165ab9d7496b7a15ab39697e6d31ac61cbd1');
      userId = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error('Error decrypting user ID:', error);
      return null;
    }

    const formData = new FormData();
    formData.append('uploaded_by', userId);

    // Check and append other content data
    for (const key in challengeData) {
      if (challengeData.hasOwnProperty(key)) {
        if (key === "formData" && typeof challengeData[key] === "object" && !Array.isArray(challengeData[key])) {
          // Handle the nested formData object
          for (const subKey in challengeData[key]) {
            if (challengeData[key].hasOwnProperty(subKey)) {
              formData.append(subKey, challengeData[key][subKey]);
            }
          }
        } else if (key !== "formData" && challengeData[key] !== null) {
          formData.append(key, challengeData[key]);
        }
      }
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_STATIC_API_URL}/api/challenge/create-challenge`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to create content. Server response:", errorText);
        throw new Error("Failed to create content");
      }

      let data;
      try {
        data = await response.json();
        console.log("Content created successfully:", data);
      } catch (error) {
        const rawResponse = await response.text();
        console.error("Failed to parse response JSON. Raw response:", rawResponse);
        return;
      }

      if (data) {
        dispatch({ type: CREATE_CHALLENGE_SUCCESS, payload: data });
        return data; // Return content object including _id
      }

    } catch (error) {
      console.error("Error in createContent:", error);
      dispatch({ type: CREATE_CHALLENGE_FAILURE, payload: error.message });
    }
  } catch (error) {
    console.error("Unexpected error in createContent:", error);
    dispatch({ type: CREATE_CHALLENGE_FAILURE, payload: error.message });
  }
};
