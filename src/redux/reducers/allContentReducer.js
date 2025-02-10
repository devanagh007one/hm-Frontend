import {
    FETCH_CONTENT_SUCCESS,
    FETCH_CONTENT_FAILURE,
    CREATE_CONTENT_SUCCESS,
    CREATE_CONTENT_FAILURE,
    CREATE_CHALLENGE_FAILURE,
    CREATE_CHALLENGE_SUCCESS,
    PATCH_CONTENT_SUCCESS,
    PATCH_CONTENT_FAILURE,
    PATCH_CHALLENGE_SUCCESS,
    PATCH_CHALLENGE_FAILURE,
    DELETE_CONTENT_FAILURE,
    DELETE_CONTENT_SUCCESS,
    DELETE_CHALLENGE_SUCCESS,
    DELETE_CHALLENGE_FAILURE
} from "../actions/allContentGet";

const initialState = {
    content: [], // Initialize 'content' as an empty array
    createcontent: [], // Initialize 'createcontent' as an empty array
    newcreatecontent: null, // Initialize 'newcreatecontent' as null
    createchallenge: [], // Initialize 'createchallenge' as an empty array
    newcreatechallenge: null, // Initialize 'newcreatechallenge' as null
    error: null, // To handle errors globally
    newContent: null, // For storing the created content
};

const contentReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CONTENT_SUCCESS:
            return {
                ...state,
                content: action.payload, // Update the content list from fetched data
                error: null, // Reset error state
            };

        case FETCH_CONTENT_FAILURE:
            return {
                ...state,
                content: [], // Clear content in case of failure
                error: action.payload, // Set error message
            };

        case CREATE_CONTENT_SUCCESS:
            return {
                ...state,
                createcontent: [action.payload, ...state.createcontent], // Add the new content directly to createcontent array
                createcontent: Array.isArray(state.content) ? [...state.content] : [], // Ensure content is always an array
                newcreatecontent: action.payload, // Store newly created content
                error: null,
            };

        case CREATE_CONTENT_FAILURE:
            return {
                ...state,
                error: action.payload, // Set error message for content creation
            };

        case CREATE_CHALLENGE_SUCCESS:
            return {
                ...state,
                createchallenge: [action.payload, ...state.createchallenge], // Add new challenge to createchallenge array
                newcreatechallenge: action.payload, // Store newly created challenge
                error: null, // Reset error state
            };

        case CREATE_CHALLENGE_FAILURE:
            return {
                ...state,
                error: action.payload, // Set error message for challenge creation
            };

        case PATCH_CONTENT_SUCCESS:
            return {
                ...state,
                content: state.content.map((item) =>
                    item._id === action.payload.id ? { ...item, isApproved: action.payload.isApproved } : item
                ),
                error: null, // Reset error state
            };

        case PATCH_CONTENT_FAILURE:
            return {
                ...state,
                error: action.payload, // Set error message for patch failure
            };

        case PATCH_CHALLENGE_SUCCESS:
            return {
                ...state,
                content: state.content.map((item) =>
                    item._id === action.payload.id ? { ...item, isApproved: action.payload.isApproved } : item
                ),
                error: null,
            };

        case PATCH_CHALLENGE_FAILURE:
            return {
                ...state,
                error: action.payload,
            };

        case DELETE_CONTENT_SUCCESS:
            return {
                ...state,
                content: state.content.filter((item) => item._id !== action.payload.id), // Remove the deleted content
                error: null, // Reset error state
            };

        case DELETE_CONTENT_FAILURE:
            return {
                ...state,
                error: action.payload, // Set error message for delete failure
            };

        case DELETE_CHALLENGE_SUCCESS:
            return {
                ...state,
                content: state.content.filter((item) => item._id !== action.payload.id), // Remove the deleted content
                error: null, // Reset error state
            };

        case DELETE_CHALLENGE_FAILURE:
            return {
                ...state,
                error: action.payload, // Set error message for delete failure
            };

        default:
            return state; // Return the unchanged state for unhandled action types
    }
};

export default contentReducer;
