import {
  ASSIGN_TEAMS_REQUEST,
  ASSIGN_TEAMS_SUCCESS,
  ASSIGN_TEAMS_FAILURE,
} from "../actions/AllteamAction";

const initialState = {
  loading: false,
  error: null,
};

const teamReducer = (state = initialState, action) => {
  switch (action.type) {
    case ASSIGN_TEAMS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ASSIGN_TEAMS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case ASSIGN_TEAMS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default teamReducer;
