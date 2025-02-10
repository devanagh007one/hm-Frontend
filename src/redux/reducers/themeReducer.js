import { TOGGLE_THEME, SET_THEME } from '../actions/themeActions';

const initialState = {
  darkMode: JSON.parse(localStorage.getItem('darkMode')) || false,
};

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_THEME:
      const newDarkMode = !state.darkMode;
      localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
      return {
        ...state,
        darkMode: newDarkMode,
      };
    case SET_THEME:
      return {
        ...state,
        darkMode: action.payload,
      };
    default:
      return state;
  }
};

export default themeReducer;
