import {
    FETCH_NOTIFICATION_SUCCESS,
    FETCH_NOTIFICATION_FAILURE,
    MARK_NOTIFICATION_READ_SUCCESS,
    FETCH_DASHBOARD_SUCCESS,
    FETCH_DASHBOARD_FAILURE
} from "../actions/allNotifications";


const initialState = {
    notifications: [], // Ensuring it always remains an array
    dashboardData: null, // Holds the dashboard data
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

        case FETCH_DASHBOARD_SUCCESS:
            return {
                ...state,
                dashboardData: action.payload, // Store the dashboard data
                error: null
            };

        case FETCH_DASHBOARD_FAILURE:
            return {
                ...state,
                dashboardData: null, 
                error: action.payload
            };

        default:
            return state;
    }
};

export default dashnotifications;
