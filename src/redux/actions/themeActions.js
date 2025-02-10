export const TOGGLE_THEME = 'TOGGLE_THEME';
export const SET_THEME = 'SET_THEME';

export const toggleTheme = () => ({
  type: TOGGLE_THEME,
});

export const setTheme = (darkMode) => ({
  type: SET_THEME,
  payload: darkMode,
});
