// src/components/Notification.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  IconCircleDashedCheck,
  IconAlertCircle,
  IconMail,
  IconMessageDots,
  IconTrash,
} from "@tabler/icons-react";
import {
  hideNotification,
  removeNotification,
} from "../../redux/actions/notificationActions";

const Notification = ({ notification }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);

  useEffect(() => {
    if (notification.visible) {
      const autoCloseTimer = setTimeout(() => {
        dispatch(hideNotification(notification.id));

        const removeTimer = setTimeout(() => {
          dispatch(removeNotification(notification.id));
        }, 300);

        return () => clearTimeout(removeTimer);
      }, 5000);

      return () => {
        clearTimeout(autoCloseTimer);
      };
    }
  }, [notification, dispatch]);

  const handleClose = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    dispatch(hideNotification(notification.id));
    setTimeout(() => {
      dispatch(removeNotification(notification.id));
    }, 300);
  };

  // Prevent any click on notification from bubbling up
  const handleNotificationClick = (e) => {
    e.stopPropagation();
  };

  const renderIcon = (type) => {
    switch (type) {
      case "success":
        return <IconCircleDashedCheck className="w-6 h-6 text-green-500" />;
      case "error":
        return <IconAlertCircle className="w-6 h-6 text-red-500" />;
      case "mail":
        return <IconMail className="w-6 h-6 text-blue-500" />;
      case "message":
        return <IconMessageDots className="w-6 h-6 text-yellow-500" />;
      default:
        return <IconTrash className="w-6 h-6 text-gray-500" />;
    }
  };

  const getGlowColor = (type) => {
    switch (type) {
      case "success":
        return "shadow-green-500/50";
      case "error":
        return "shadow-red-500/50";
      case "mail":
        return "shadow-blue-500/50";
      case "message":
        return "shadow-yellow-500/50";
      default:
        return "shadow-gray-500/50";
    }
  };

  return (
    <div
      className={`
        flex items-center gap-3 p-4 rounded-2xl shadow-2xl transition-all duration-300
        ${
          darkMode
            ? "bg-zinc-800 text-zinc-300 border border-zinc-700"
            : "bg-white/80 text-gray-800 border border-white/30"
        }
        backdrop-blur-sm
        ${
          notification.visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        }
        min-w-[300px]
        max-w-[400px]
        cursor-default
      `}
      role="alert"
      aria-live="polite"
      onClick={handleNotificationClick}
      onMouseDown={handleNotificationClick} // Also prevent on mouse down
    >
      {/* Icon with glow effect */}
      <div
        className={`
          relative p-3 rounded-xl bg-transparent overflow-hidden
          ${getGlowColor(notification.type)}
          shadow-[0_0_20px_10px]
        `}
        onClick={handleNotificationClick}
      >
        {renderIcon(notification.type)}
        {/* Overlay with 30% opacity of current color */}
        <div
          className={`
          absolute inset-0 rounded-xl pointer-events-none
          ${notification.type === "success" ? "bg-green-500" : ""}
          ${notification.type === "error" ? "bg-red-500" : ""}
          ${notification.type === "mail" ? "bg-blue-500" : ""}
          ${notification.type === "message" ? "bg-yellow-500" : ""}
          ${
            !["success", "error", "mail", "message"].includes(notification.type)
              ? "bg-gray-500"
              : ""
          }
          opacity-30
        `}
        />
      </div>

      {/* Message */}
      <span className="flex-1 text-sm font-medium">{notification.message}</span>

      {/* Close button */}
      <button
        className={`
          bg-transparent border-none text-xl cursor-pointer ml-2
          transition-opacity duration-200 hover:opacity-70
          ${darkMode ? "text-zinc-300" : "text-gray-600"}
          w-6 h-6 flex items-center justify-center rounded
        `}
        onClick={handleClose}
        onMouseDown={handleClose}
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
};

const Notifications = () => {
  const notifications = useSelector((state) => state.notification);

  return (
    <div
      className="fixed top-4 right-4 flex flex-col items-end gap-3 z-50"
      onClick={(e) => e.stopPropagation()} // Prevent clicks on container
      onMouseDown={(e) => e.stopPropagation()} // Prevent mouse down on container
    >
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default Notifications;
