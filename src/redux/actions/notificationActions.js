export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';
export const HIDE_NOTIFICATION = 'HIDE_NOTIFICATION';
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';

export const showNotification = (message, type) => ({
  type: SHOW_NOTIFICATION,
  payload: { message, type, id: Date.now() }
});

export const hideNotification = (id) => ({
  type: HIDE_NOTIFICATION,
  payload: id
});

export const removeNotification = (id) => ({
  type: REMOVE_NOTIFICATION,
  payload: id
});