import axios from "axios";

// Action types
export const ASSIGN_TEAMS_REQUEST = "ASSIGN_TEAMS_REQUEST";
export const ASSIGN_TEAMS_SUCCESS = "ASSIGN_TEAMS_SUCCESS";
export const ASSIGN_TEAMS_FAILURE = "ASSIGN_TEAMS_FAILURE";

// Action creators
export const assignTeamsRequest = () => ({
  type: ASSIGN_TEAMS_REQUEST,
});

export const assignTeamsSuccess = () => ({
  type: ASSIGN_TEAMS_SUCCESS,
});

export const assignTeamsFailure = (error) => ({
  type: ASSIGN_TEAMS_FAILURE,
  payload: error,
});

// Thunk action to assign teams
// Updated assignTeams action (if needed)
export const assignTeams = (hrUserId, targetUserId, teamIds) => {
  return async (dispatch, getState) => {
    try {
      dispatch(assignTeamsRequest());

      const { auth } = getState();
      const token = auth.token;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const body = {
        hrUserId,
        targetUserId,
        teamIds, // Changed from teamNames to teamIds
      };

      await axios.post(
        `${process.env.REACT_APP_STATIC_API_URL}/api/teamops/assign-teams`,
        body,
        config
      );

      dispatch(assignTeamsSuccess());
      dispatch("Teams assigned successfully");
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      dispatch(assignTeamsFailure(errorMsg));
      dispatch(errorMsg);
    }
  };
};
