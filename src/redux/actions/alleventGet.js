import CryptoJS from 'crypto-js'; // Ensure you have imported CryptoJS

export const FETCH_EVENTS_SUCCESS = "FETCH_EVENTS_SUCCESS";
export const FETCH_EVENTS_FAILURE = "FETCH_EVENTS_FAILURE";
export const CREATE_EVENT_SUCCESS = "CREATE_EVENT_SUCCESS";
export const CREATE_EVENT_FAILURE = "CREATE_EVENT_FAILURE";
export const UPDATE_EVENT_STATUS_SUCCESS = "UPDATE_EVENT_STATUS_SUCCESS";
export const UPDATE_EVENT_STATUS_FAILURE = "UPDATE_EVENT_STATUS_FAILURE";
export const DELETE_CHALLENGE_SUCCESS = "DELETE_CHALLENGE_SUCCESS";
export const DELETE_CHALLENGE_FAILURE = "DELETE_CHALLENGE_FAILURE";


// Action for fetching all Events without filtering
export const fetchAllEvents = () => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    // Fetch all Events
    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/E1/all`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();
console.log(data.events)
    // Dispatch FETCH_EVENTS_SUCCESS with the full user list
    dispatch({ type: FETCH_EVENTS_SUCCESS, payload: data.events });
  } catch (error) {
    console.error("Error in fetchAllUsers:", error);
    dispatch({ type: FETCH_EVENTS_FAILURE, payload: error.message });
  }
};


export const createEvent = (eventData) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");
    console.log(eventData);

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
    formData.append('createdBy', userId);

    for (const key in eventData) {
      if (eventData.hasOwnProperty(key)) {
        if (key === "notificationSettings" || key === "engagementTools" || key === "questionandanswer") {
          formData.append(key, JSON.stringify(eventData[key])); // Convert objects to JSON
        } else if (Array.isArray(eventData[key])) {
          eventData[key].forEach(value => formData.append(`${key}[]`, value));
        } else if (typeof eventData[key] === "object" && eventData[key] !== null) {
          formData.append(key, JSON.stringify(eventData[key])); // Convert other objects
        } else if (eventData[key] !== null) {
          formData.append(key, eventData[key]);
        }
      }
    }
    
    
    
    // // Debugging: Log FormData before sending
    // console.log("Final FormData being sent:");
    // for (let pair of formData.entries()) {
    //   console.log(`${pair[0]}: ${pair[1]}`);
    // }
    

    

    try {
      const response = await fetch(
        `${process.env.REACT_APP_STATIC_API_URL}/api/E1/create-event`,
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
        console.error("Failed to create event. Server response:", errorText);
        throw new Error("Failed to create event");
      }

      let data;
      try {
        data = await response.json();
        console.log("Event created successfully:", data);
      } catch (error) {
        const rawResponse = await response.text();
        console.error("Failed to parse response JSON. Raw response:", rawResponse);
        return;
      }

      if (data) {
        dispatch({ type: "CREATE_EVENT_SUCCESS", payload: data });
        return data;
      }
    } catch (error) {
      console.error("Error in createEvent:", error);
      dispatch({ type: "CREATE_EVENT_FAILURE", payload: error.message });
    }
  } catch (error) {
    console.error("Unexpected error in createEvent:", error);
    dispatch({ type: "CREATE_EVENT_FAILURE", payload: error.message });
  }
};


// Action for updating event status
export const updateEventStatus = (eventId, status) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");
    console.log({ status })

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/v1/approve-reject/event/${eventId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status }), // Sending dynamic status
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update the event status");
    }

    const data = await response.json();
    console.log("Event Status Updated:", data);

    // Dispatch an action to update the event status in Redux store
    dispatch({ type: UPDATE_EVENT_STATUS_SUCCESS, payload: { id: eventId, status } });

  } catch (error) {
    console.error("Error updating event status:", error);
    dispatch({ type: UPDATE_EVENT_STATUS_FAILURE, payload: error.message });
  }
};

// Action for deleting a challenge
export const deleteEvent = (challengeId) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/v1/delete/event/${challengeId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete challenge");
    }

    // Optionally, handle the response
    const data = await response.json();
    console.log("Challenge Deleted:", data);

    // Dispatch a success action (if needed)
    dispatch({ type: "DELETE_CHALLENGE_SUCCESS", payload: challengeId });

  } catch (error) {
    console.error("Error in deleteChallenge:", error);
    dispatch({ type: "DELETE_CHALLENGE_FAILURE", payload: error.message });
  }
};
