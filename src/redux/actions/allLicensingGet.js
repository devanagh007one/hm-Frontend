export const FETCH_LICENSINGS_SUCCESS = "FETCH_LICENSINGS_SUCCESS";
export const FETCH_LICENSINGS_FAILURE = "FETCH_LICENSINGS_FAILURE";
export const CREATE_LICENSING_SUCCESS = "CREATE_LICENSING_SUCCESS";
export const CREATE_LICENSING_FAILURE = "CREATE_LICENSING_FAILURE";
export const TOGGLE_LICENSE_STATUS_SUCCESS = "TOGGLE_LICENSE_STATUS_SUCCESS";
export const TOGGLE_LICENSE_STATUS_FAILURE = "TOGGLE_LICENSE_STATUS_FAILURE";
export const HR_LICENSE_STATUS_SUCCESS = "HR_LICENSE_STATUS_SUCCESS";
export const HR_LICENSE_STATUS_FAILURE = "HR_LICENSE_STATUS_FAILURE";
export const CHANGE_LICENSE_TYPE_SUCCESS = "CHANGE_LICENSE_TYPE_SUCCESS";
export const CHANGE_LICENSE_TYPE_FAILURE = "CHANGE_LICENSE_TYPE_FAILURE";
export const FETCH_LICENSE_DATA_SUCCESS = "FETCH_LICENSE_DATA_SUCCESS";
export const FETCH_LICENSE_DATA_FAILURE = "FETCH_LICENSE_DATA_FAILURE";
export const UPDATE_LICENSE_FAILURE = "UPDATE_LICENSE_FAILURE";
export const UPDATE_LICENSE_SUCCESS = "UPDATE_LICENSE_SUCCESS";
export const DELETE_LICENSE_SUCCESS = "DELETE_LICENSE_SUCCESS";
export const DELETE_LICENSE_FAILURE = "DELETE_LICENSE_FAILURE";

// Action for fetching all LICENSING
export const fetchAllLicensing = () => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/company/view-all-licences`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Licensing");
    }

    const data = await response.json();
    console.log(data.licenses);
    dispatch({ type: FETCH_LICENSINGS_SUCCESS, payload: data.licenses });
  } catch (error) {
    dispatch({ type: FETCH_LICENSINGS_FAILURE, payload: error.message });
  }
};

// Action for creating a licencing
export const licencingUser = (licencingData) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    // Construct FormData
    const formData = new FormData();
    for (const key in licencingData) {
      formData.append(key, licencingData[key]);
    }

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/company/licencing`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    // Check if the response contains a success message
    if (data.message === "Licensing created successfully") {
      dispatch({ type: CREATE_LICENSING_SUCCESS, payload: data });
    } else {
      throw new Error(data.message || "Failed to create user");
    }
  } catch (error) {
    dispatch({ type: CREATE_LICENSING_FAILURE, payload: error.message });
  }
};

// Action for toggling the license status
export const toggleLicenseStatus = (licenseId) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/company/licenses/toggle-status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ licenseId }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to toggle license status");
    }

    const data = await response.json();
    console.log(data);

    dispatch({ type: TOGGLE_LICENSE_STATUS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: TOGGLE_LICENSE_STATUS_FAILURE, payload: error.message });
  }
};

// Action for toggling the license status
// Action for getting HR license data
export const hrLicenseGet = (hrUser) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/hrL/license-summary`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hrUser }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get license status");
    }

    const data = await response.json();
    console.log(data);

    // Store license data in localStorage
    if (data.success && data.licenseDetails) {
      localStorage.setItem("totalLicenses", data.totalLicenses);
      localStorage.setItem("assignedLicenses", data.assignedLicenses);
      localStorage.setItem("remainingLicenses", data.remainingLicenses);
      localStorage.setItem(
        "licenseOrgName",
        data.licenseDetails.organisationName
      );
    }

    dispatch({ type: HR_LICENSE_STATUS_SUCCESS, payload: data });
    return data; // Return data for component use
  } catch (error) {
    dispatch({ type: HR_LICENSE_STATUS_FAILURE, payload: error.message });
    throw error;
  }
};

// Action for changing the license type (Paid/Subscription)
export const changeLicenseType = (licenseId, newPeriod) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    console.log(licenseId, newPeriod);
    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/company/change-type`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ licenseId, newPeriod }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to change license type");
    }

    const data = await response.json();
    console.log(data);

    dispatch({ type: CHANGE_LICENSE_TYPE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: CHANGE_LICENSE_TYPE_FAILURE, payload: error.message });
  }
};

// Action for fetching licensing data using POST
export const fetchLicenseData = (licenseId) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    console.log("Fetching license data for ID:", licenseId);
    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/company/license/${licenseId}`,
      {
        method: "POST", // Changed from GET to POST
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch license data");
    }

    const data = await response.json();

    dispatch({ type: FETCH_LICENSE_DATA_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_LICENSE_DATA_FAILURE, payload: error.message });
  }
};

export const updateLicense = (id, licenseData) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");
    if (!id) {
      console.error("License ID is missing.");
      return null;
    }

    const formData = new FormData();

    // Append all fields except 'uploaded_by'
    for (const key in licenseData) {
      if (
        licenseData.hasOwnProperty(key) &&
        key !== "uploaded_by" &&
        licenseData[key] !== null
      ) {
        formData.append(key, licenseData[key]);
      }
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_STATIC_API_URL}/api/company/license/edit/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to update license. Server response:", errorText);
        throw new Error("Failed to update license");
      }

      let data;
      try {
        data = await response.json();
        console.log("Parsed JSON:", data);
      } catch (error) {
        console.error("Failed to parse response JSON.", error);
        return;
      }

      if (
        data?.message === "License updated successfully" &&
        data?.license?._id
      ) {
        dispatch({ type: UPDATE_LICENSE_SUCCESS, payload: data.license });
        return data.license;
      } else {
        console.error("Unexpected response format:", data);
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      console.error("Error in updateLicense:", error);
      dispatch({ type: UPDATE_LICENSE_FAILURE, payload: error.message });
    }
  } catch (error) {
    console.error("Unexpected error in updateLicense:", error);
    dispatch({ type: UPDATE_LICENSE_FAILURE, payload: error.message });
  }
};

export const deleteLicence = (id) => async (dispatch) => {
  try {
    const authToken = localStorage.getItem("authToken");

    const requestBody = `{ "licenseIds": [ ${JSON.stringify(id)} ] }`;

    console.log("Sending:", requestBody);

    const response = await fetch(
      `${process.env.REACT_APP_STATIC_API_URL}/api/company/licenses-delete`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: requestBody,
      }
    );

    if (!response.ok) {
      let errorMessage = "Failed to delete users";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        console.error("Error parsing JSON response", e);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("Response Data:", data);

    dispatch({ type: DELETE_LICENSE_SUCCESS, payload: id });
  } catch (error) {
    console.error("Delete License Error:", error);
    dispatch({ type: DELETE_LICENSE_FAILURE, payload: error.message });
  }
};
