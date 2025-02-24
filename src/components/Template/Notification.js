// src/components/Notification.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconCircleDashedCheck, IconAlertCircle, IconMail, IconMessageDots, IconTrash } from '@tabler/icons-react';
import { hideNotification, removeNotification } from '../../redux/actions/notificationActions';
import './Notification.css';

const Notification = ({ notification }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);
  const notificationClass = `${darkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-[rgba(255,255,255,0.35)] text-black'} ${notification.visible ? 'visible' : ''}`;

  useEffect(() => {
    if (notification.visible) {
      const autoCloseTimer = setTimeout(() => {
        dispatch(hideNotification(notification.id));
        setTimeout(() => {
          dispatch(removeNotification(notification.id));
        }, 5000); // delay for transition effect
      }, 5000);

      return () => {
        clearTimeout(autoCloseTimer);
      };
    }
  }, [notification, dispatch]);

  const handleClose = () => {
    dispatch(hideNotification(notification.id));
    setTimeout(() => {
      dispatch(removeNotification(notification.id));
    }, 5000); // delay for transition effect
  };

    const renderIcon = (type) => {
      switch (type) {
        case 'success':
          return <IconCircleDashedCheck className="icon success" />;
        case 'error':
          return <IconAlertCircle className="icon error" />;
        case 'mail':
          return <IconMail className="icon info" />;
        case 'message':
          return <IconMessageDots className="icon warning" />;
        default:
          return <IconTrash className="icon" />;
      }
    };
  
    return (
      <div
        className={`notification shadow-2xl ${
          notification.visible ? 'visible' : ''
        } ${notificationClass} ${darkMode ? 'dark-mode' : 'light-mode'}`}
      >
        
        <div
          className={`button-big-in ${notification.type}`}
        >
          {renderIcon(notification.type)}
        </div>
        <span>{notification.message}</span>
        <button
          className={`close-button ${notificationClass}`}
          onClick={handleClose}
        >
          &times;
        </button>
      </div>
    );
  };
  

const Notifications = () => {
  const notifications = useSelector(state => state.notification);

  return (
    <div className="notifications-container">
      {notifications.map(notification => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default Notifications;
