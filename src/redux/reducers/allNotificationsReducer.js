import {
    FETCH_NOTIFICATION_SUCCESS,
    FETCH_NOTIFICATION_FAILURE,
    MARK_NOTIFICATION_READ_SUCCESS
} from "../actions/allNotifications";

const initialState = {
    notifications: [], // Ensuring it always remains an array
    error: null,
};

const dashnotifications = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_NOTIFICATION_SUCCESS:
            return { 
                ...state, 
                notifications: action.payload?.notifications || [], 
                error: null 
            };

        case FETCH_NOTIFICATION_FAILURE:
            return { 
                ...state, 
                notifications: [], 
                error: action.payload 
            };

        case MARK_NOTIFICATION_READ_SUCCESS:
            return {
                ...state,
                notifications: state.notifications.map(notification =>
                    notification._id === action.payload.notificationId
                        ? { ...notification, read: true } // Mark as read
                        : notification
                )
            };

        default:
            return state;
    }
};

export default dashnotifications;
