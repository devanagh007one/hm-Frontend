import { SHOW_NOTIFICATION, HIDE_NOTIFICATION, REMOVE_NOTIFICATION } from '../actions/notificationActions';

const initialState = [];

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return [...state, { ...action.payload, visible: true }];
    case HIDE_NOTIFICATION:
      return state.map(notification =>
        notification.id === action.payload
          ? { ...notification, visible: false }
          : notification
      );
    case REMOVE_NOTIFICATION:
      return state.filter(notification => notification.id !== action.payload);
    default:
      return state;
  }
};

export default notificationReducer;