const initialState = {
  events: [],
  error: null,
};

const eventReducer = (state = initialState, action) => {
  switch (action.type) {
      case "FETCH_EVENTS_SUCCESS":
          return { ...state, events: action.payload, error: null };

      case "FETCH_EVENTS_FAILURE":
          return { ...state, error: action.payload };

      case "CREATE_EVENT_SUCCESS":
          return { ...state, events: [...state.events, action.payload], error: null };

      case "CREATE_EVENT_FAILURE":
          return { ...state, error: action.payload };

      case "UPDATE_EVENT_STATUS_SUCCESS":
          return {
              ...state,
              events: state.events.map((event) =>
                  event.id === action.payload.id
                      ? { ...event, status: action.payload.status } // Update status dynamically
                      : event
              ),
              error: null,
          };

      case "UPDATE_EVENT_STATUS_FAILURE":
          return { ...state, error: action.payload };

      case "DELETE_EVENT_SUCCESS":
          return {
              ...state,
              events: state.events.filter((event) => event.id !== action.payload), // Remove deleted event
              error: null,
          };

      case "DELETE_EVENT_FAILURE":
          return { ...state, error: action.payload };

      default:
          return state;
  }
};

export default eventReducer;
