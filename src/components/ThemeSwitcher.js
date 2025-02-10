import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, setTheme } from '../redux/actions/themeActions';
import { IconBrightnessDownFilled, IconMoon } from '@tabler/icons-react';

const ThemeSwitcher = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector(state => state.theme.darkMode);

  // Load saved theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = JSON.parse(localStorage.getItem('darkMode'));
    if (savedTheme !== null) {
      dispatch(setTheme(savedTheme));
    }
  }, [dispatch]);

  // Add/remove 'dark-mode' class to body based on darkMode state
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Toggle theme mode on button click
  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
      <div
        onClick={handleToggle}
        className={`button-big cursor-pointer ${darkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-black'}`}
      >
        {darkMode ? <IconMoon stroke={2} /> : <IconBrightnessDownFilled stroke={2} />}
      </div>
  );
};

export default ThemeSwitcher;
