import React, { useState, useEffect } from "react";
import { IconBell } from '@tabler/icons-react';
import { fetchAllUsers } from '../redux/actions/alluserGet';

import { fetchAllNotifications, markNotificationAsRead } from '../redux/actions/allNotifications';
import { useDispatch, useSelector } from 'react-redux';
import CryptoJS from 'crypto-js';

const Notification = () => {
  const { notifications, error } = useSelector((state) => state.dashnotifications);
  const { users } = useSelector((state) => state.user);
  const darkMode = useSelector(state => state.theme.darkMode);
  const dispatch = useDispatch();
  const encryptedRoles = localStorage.getItem("uniqueid");

  let userRoles = [];
  if (encryptedRoles) {
    try {
      const bytes = CryptoJS.AES.decrypt(
        encryptedRoles,
        "477f58bc13b97959097e7bda64de165ab9d7496b7a15ab39697e6d31ac61cbd1"
      );
      userRoles = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error("Error decrypting roles:", error);
    }
  }

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    dispatch(fetchAllNotifications(userRoles));
    dispatch(fetchAllUsers());
  }, [dispatch, userRoles]);
  console.log(notifications)


  const handleViewPopup = () => setShowPopup(prev => !prev);
  const handleClosePopup = () => setShowPopup(false);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays === 1) return `Yesterday, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    if (diffInDays > 1 && diffInDays <= 10) return `${diffInDays} days ago`;

    return date.toLocaleDateString();
  };

  const breakLongWords = (text, maxLen = 15) => {
    if (typeof text !== "string") return text;
    return text.replace(new RegExp(`(\\S{${maxLen}})`, "g"), "$1 ");
  };

  const formatMessage = (message) => {
    // Extract the user ID from the message
    const idMatch = message.match(/by ([a-f0-9]{24})/);
    if (idMatch) {
      const userId = idMatch[1]; // Get the matched ID
      const user = users.find((user) => user._id === userId); // Find user by ID

      if (user) {
        // Replace the ID with "firstName,"
        message = message.replace(userId, `${user.firstName},`);
      }
    }

    return message
      .split(/"([^"]+)"/g) // Split at quoted text
      .map((part, index) =>
        index % 2 === 1 ? (
          <strong key={index} className="break-words">{breakLongWords(part)}</strong>
        ) : (
          breakLongWords(part)
        )
      );
  };


  const now = new Date();
  const [filter, setFilter] = useState("all"); // Default: Show all notifications


  const filteredNotifications = filter === "unread"
    ? notifications?.filter((n) => !n.read) || []
    : notifications || [];

  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div className="relative">
        <div
          onClick={handleViewPopup}
          className={`cursor-pointer flex items-center justify-center button-big ${darkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-black'}`}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.25 10.3663V8.75H15V10.625C15 10.7907 15.0659 10.9497 15.1831 11.0669L16.875 12.7587V13.75H3.125V12.7587L4.81687 11.0669C4.93409 10.9497 4.99996 10.7907 5 10.625V8.125C4.99837 7.2468 5.2285 6.38372 5.66716 5.62292C6.10583 4.86212 6.73748 4.23054 7.49833 3.79197C8.25919 3.35341 9.12229 3.12337 10.0005 3.12511C10.8787 3.12685 11.7409 3.3603 12.5 3.80188V2.40375C11.905 2.14037 11.2723 1.97247 10.625 1.90625V0.625H9.375V1.90625C7.83411 2.06308 6.4061 2.7857 5.36711 3.93436C4.32811 5.08303 3.75194 6.57615 3.75 8.125V10.3663L2.05812 12.0581C1.94091 12.1753 1.87504 12.3343 1.875 12.5V14.375C1.875 14.5408 1.94085 14.6997 2.05806 14.8169C2.17527 14.9342 2.33424 15 2.5 15H6.875V15.625C6.875 16.4538 7.20424 17.2487 7.79029 17.8347C8.37634 18.4208 9.1712 18.75 10 18.75C10.8288 18.75 11.6237 18.4208 12.2097 17.8347C12.7958 17.2487 13.125 16.4538 13.125 15.625V15H17.5C17.6658 15 17.8247 14.9342 17.9419 14.8169C18.0592 14.6997 18.125 14.5408 18.125 14.375V12.5C18.125 12.3343 18.0591 12.1753 17.9419 12.0581L16.25 10.3663ZM11.875 15.625C11.875 16.1223 11.6775 16.5992 11.3258 16.9508C10.9742 17.3025 10.4973 17.5 10 17.5C9.50272 17.5 9.02581 17.3025 8.67417 16.9508C8.32254 16.5992 8.125 16.1223 8.125 15.625V15H11.875V15.625Z" fill="white" />
            <path d="M16.25 7.5C17.6307 7.5 18.75 6.38071 18.75 5C18.75 3.61929 17.6307 2.5 16.25 2.5C14.8693 2.5 13.75 3.61929 13.75 5C13.75 6.38071 14.8693 7.5 16.25 7.5Z" fill="white" />
          </svg>

          {/* Filter only unread notifications */}
          {notifications?.filter(n => !n.read).length > 0 && (
            <div className="absolute -top-1 -right-1 bg-[#DD441B] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {notifications.filter(n => !n.read).length}
            </div>
          )}
        </div>
      </div>



      {showPopup && (
        <div className="flex bottom-0 z-[999] fixed top-[9%] right-[20px] w-[447px] shadow-md">
          <div className={`rounded-2xl border border-gray-600 shadow-lg w-full overflow-y-scroll max-w-[447px] p-4 relative flex flex-col max-h-[90%] ${darkMode ? 'bg-zinc-800 text-white' : 'bg-[#fff] text-dark'}`}>
            <div className="flex justify-between align-center">
              <h2 className="text-2xl">Notification</h2>
              <div className="mt-2" onClick={() => setShowDetails(!showDetails)}
              >
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g filter="url(#filter0_d_3334_27)">
                    <rect x="2" y="2" width="28" height="28" rx="6" fill="#545454" shape-rendering="crispEdges" />
                    <path d="M12.5 16C12.5 16.9665 11.7165 17.75 10.75 17.75C9.7835 17.75 9 16.9665 9 16C9 15.0335 9.7835 14.25 10.75 14.25C11.7165 14.25 12.5 15.0335 12.5 16Z" fill="#C7C7C7" />
                    <path d="M17.75 16C17.75 16.9665 16.9665 17.75 16 17.75C15.0335 17.75 14.25 16.9665 14.25 16C14.25 15.0335 15.0335 14.25 16 14.25C16.9665 14.25 17.75 15.0335 17.75 16Z" fill="#C7C7C7" />
                    <path d="M21.25 17.75C22.2165 17.75 23 16.9665 23 16C23 15.0335 22.2165 14.25 21.25 14.25C20.2835 14.25 19.5 15.0335 19.5 16C19.5 16.9665 20.2835 17.75 21.25 17.75Z" fill="#C7C7C7" />
                  </g>
                  <defs>
                    <filter id="filter0_d_3334_27" x="0" y="0" width="36" height="36" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                      <feFlood flood-opacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dx="2" dy="2" />
                      <feGaussianBlur stdDeviation="2" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3334_27" />
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3334_27" result="shape" />
                    </filter>
                  </defs>
                </svg>

              </div>
            </div>
            {showDetails && (
              <div
                className={`mt-2 p-3 flex-col rounded-xl absolute w-[90%] mt-[45px] flex gap-4 shadow-lg hover:shadow-xl transition-shadow ${darkMode ? 'bg-[#333333]' : 'bg-slate-100'}`}
                onClick={() => {
                  const unreadNotifications = notifications.filter(n => !n.read) || [];

                  unreadNotifications.forEach(notification => {
                    dispatch(markNotificationAsRead(notification._id));
                  });

                  // Wait a bit to ensure all updates are dispatched before fetching
                  setTimeout(() => {
                    dispatch(fetchAllNotifications(userRoles));
                  }, 500);
                }}
              >
                <div className="flex gap-2 cursor-pointer">
                  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.6001 13.7813L8.4001 18.5813L20.4001 6.5813" stroke="#C7C7C7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Mark all as read
                </div>

                <div className="flex gap-2"><svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12.563 3.7813H11.437L10.792 6.3593L10.145 6.5593C9.76798 6.67547 9.40271 6.8268 9.054 7.0113L8.455 7.3283L6.175 5.9603L5.379 6.7573L6.747 9.0373L6.43 9.6353C6.24516 9.98397 6.0935 10.3492 5.977 10.7263L5.778 11.3733L3.2 12.0183V13.1443L5.778 13.7893L5.978 14.4363C6.09333 14.815 6.244 15.1786 6.43 15.5273L6.747 16.1263L5.379 18.4063L6.176 19.2023L8.456 17.8343L9.054 18.1513C9.40267 18.3366 9.76633 18.4876 10.145 18.6043L10.792 18.8033L11.437 21.3813H12.563L13.208 18.8033L13.855 18.6033C14.232 18.4871 14.5973 18.3358 14.946 18.1513L15.545 17.8343L17.825 19.2023L18.621 18.4053L17.253 16.1253L17.57 15.5273C17.7553 15.1786 17.9063 14.815 18.023 14.4363L18.222 13.7893L20.8 13.1443V12.0183L18.222 11.3733L18.022 10.7263C17.9058 10.3493 17.7545 9.98401 17.57 9.6353L17.253 9.0363L18.621 6.7563L17.824 5.9603L15.544 7.3283L14.946 7.0113C14.5973 6.82646 14.2321 6.6748 13.855 6.5583L13.208 6.3593L12.563 3.7813ZM15.508 5.9513L17.341 4.8513C17.5321 4.73666 17.7561 4.68916 17.9773 4.71633C18.1985 4.74351 18.4043 4.84381 18.562 5.0013L19.58 6.0193C19.7375 6.177 19.8378 6.38279 19.865 6.604C19.8921 6.82522 19.8446 7.04917 19.73 7.2403L18.63 9.0733C18.85 9.48663 19.03 9.91997 19.17 10.3733L21.243 10.8923C21.4592 10.9465 21.6512 11.0713 21.7883 11.2471C21.9255 11.4228 22 11.6394 22 11.8623V13.3003C22 13.5232 21.9255 13.7398 21.7883 13.9155C21.6512 14.0913 21.4592 14.2161 21.243 14.2703L19.17 14.7893C19.03 15.2426 18.85 15.676 18.63 16.0893L19.73 17.9223C19.8446 18.1134 19.8921 18.3374 19.865 18.5586C19.8378 18.7798 19.7375 18.9856 19.58 19.1433L18.562 20.1613C18.4043 20.3188 18.1985 20.4191 17.9773 20.4463C17.7561 20.4734 17.5321 20.4259 17.341 20.3113L15.508 19.2113C15.0947 19.4313 14.6613 19.6113 14.208 19.7513L13.689 21.8243C13.6348 22.0405 13.51 22.2325 13.3342 22.3696C13.1585 22.5068 12.9419 22.5813 12.719 22.5813H11.281C11.0581 22.5813 10.8415 22.5068 10.6658 22.3696C10.49 22.2325 10.3652 22.0405 10.311 21.8243L9.792 19.7513C9.3427 19.6125 8.90744 19.4317 8.492 19.2113L6.659 20.3113C6.46787 20.4259 6.24392 20.4734 6.02271 20.4463C5.80149 20.4191 5.5957 20.3188 5.438 20.1613L4.42 19.1433C4.26251 18.9856 4.16221 18.7798 4.13504 18.5586C4.10786 18.3374 4.15536 18.1134 4.27 17.9223L5.37 16.0893C5.14964 15.6739 4.96885 15.2386 4.83 14.7893L2.757 14.2703C2.54092 14.2162 2.3491 14.0914 2.21196 13.9159C2.07483 13.7404 2.00023 13.5241 2 13.3013V11.8633C2.00001 11.6404 2.0745 11.4238 2.21166 11.2481C2.34881 11.0723 2.54075 10.9475 2.757 10.8933L4.83 10.3743C4.97 9.92097 5.15 9.48763 5.37 9.0743L4.27 7.2413C4.15536 7.05017 4.10786 6.82622 4.13504 6.605C4.16221 6.38379 4.26251 6.178 4.42 6.0203L5.438 5.0013C5.5957 4.84381 5.80149 4.74351 6.02271 4.71633C6.24392 4.68916 6.46787 4.73666 6.659 4.8513L8.492 5.9513C8.90533 5.7313 9.33867 5.5513 9.792 5.4113L10.311 3.3383C10.3651 3.12222 10.4899 2.9304 10.6654 2.79326C10.8409 2.65613 11.0572 2.58153 11.28 2.5813H12.718C12.9409 2.5813 13.1575 2.6558 13.3332 2.79295C13.509 2.93011 13.6338 3.12205 13.688 3.3383L14.207 5.4113C14.6603 5.5513 15.0937 5.7313 15.507 5.9513H15.508ZM12 15.3813C12.7426 15.3813 13.4548 15.0863 13.9799 14.5612C14.505 14.0361 14.8 13.3239 14.8 12.5813C14.8 11.8387 14.505 11.1265 13.9799 10.6014C13.4548 10.0763 12.7426 9.7813 12 9.7813C11.2574 9.7813 10.5452 10.0763 10.0201 10.6014C9.495 11.1265 9.2 11.8387 9.2 12.5813C9.2 13.3239 9.495 14.0361 10.0201 14.5612C10.5452 15.0863 11.2574 15.3813 12 15.3813ZM12 16.5813C10.9391 16.5813 9.92172 16.1599 9.17157 15.4097C8.42143 14.6596 8 13.6422 8 12.5813C8 11.5204 8.42143 10.503 9.17157 9.75287C9.92172 9.00273 10.9391 8.5813 12 8.5813C13.0609 8.5813 14.0783 9.00273 14.8284 9.75287C15.5786 10.503 16 11.5204 16 12.5813C16 13.6422 15.5786 14.6596 14.8284 15.4097C14.0783 16.1599 13.0609 16.5813 12 16.5813Z" fill="#C7C7C7" />
                </svg>
                  Notification Setting</div>
                <div className="flex gap-2"><svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 14.3618V4.41057C2.30589 4.06283 2.50393 3.5813 2.85106 3.5813C3.1982 3.5813 16.4681 3.5813 16.4681 3.5813M2 14.3618V16.0203C2 16.0203 2 17.2642 2.85106 17.2642C3.70213 17.2642 9.65957 17.2642 9.65957 17.2642M2 14.3618H16.4681M22 14.3618V16.0203C22 16.0203 22 17.2642 21.1489 17.2642C20.2979 17.2642 14.766 17.2642 14.766 17.2642M22 14.3618H16.4681M22 14.3618V8.55691M16.4681 14.3618V8.55691M16.4681 3.5813C16.4681 3.5813 20.7234 3.58136 21.1489 3.5813C21.5745 3.58124 22 4.41057 22 4.41057V6.89837M16.4681 3.5813V6.89837M9.65957 17.2642V20.1667M9.65957 17.2642H14.766M9.65957 20.5813V20.1667M9.65957 20.1667H6.68085H14.766M14.766 20.1667V17.2642M14.766 20.1667H17.7447M16.4681 6.89837H22M16.4681 6.89837V7.72764M22 6.89837V7.72764M22 7.72764H16.4681M22 7.72764V8.55691M16.4681 7.72764V8.55691M16.4681 8.55691H22" stroke="#C7C7C7" />
                </svg>
                  Open Notification</div>

              </div>
            )}


            <section className="flex flex-col mt-3">
              <div className="flex gap-3">
                <span
                  className={`pt-2 pb-2 pr-3 pl-3 rounded-xl cursor-pointer ${filter === "all" ? "active text-[#F48567] bg-[#FFC9BB33]" : ""
                    }`}
                  onClick={() => setFilter("all")}
                >
                  All
                </span>
                <span
                  className={`pt-2 pb-2 pr-3 pl-3 rounded-xl cursor-pointer ${filter === "unread" ? "active text-[#F48567] bg-[#FFC9BB33]" : ""
                    }`}
                  onClick={() => setFilter("unread")}
                >
                  Unread
                </span>
              </div>
              <main className="p-3 gap-4 flex flex-col">
                {filteredNotifications.length > 0 && (
                  <>
                    {/* New Notifications */}
                    {filteredNotifications.some(notification => {
                      const createdAt = new Date(notification.createdAt);
                      return (new Date() - createdAt) / (1000 * 60 * 60) < 24; // Check if there's at least one new notification
                    }) && (
                        <>
                          <div className="flex justify-between mt- p-3">
                            <span className="font-bold">New</span>
                            <span className="text-blue-500 cursor-pointer">See All</span>
                          </div>
                          {filteredNotifications
                            .filter(notification => {
                              const createdAt = new Date(notification.createdAt);
                              return (new Date() - createdAt) / (1000 * 60 * 60) < 24; // Less than 24 hours old
                            })
                            .map((notification, index) => (
                              <div key={index} className={`flex items-center p-2 p-2 gap-4 mb-3 rounded-xl  cursor-pointer  ${darkMode ? 'hover:bg-[#333333]' : 'hover:bg-slate-100'}`} onClick={() => {
                                dispatch(markNotificationAsRead(notification._id)).then(() => {
                                  dispatch(fetchAllNotifications(userRoles));
                                });
                              }}
                              >
                                <img
                                  src="https://png.pngtree.com/png-clipart/20190925/original/pngtree-no-image-vector-illustration-isolated-png-image_4979075.jpg"
                                  className="rounded-full w-16 h-16"
                                  alt="Notification"
                                />
                                <div className="flex flex-col">
                                  <span className="text-sm w-[88%] break-words">{formatMessage(notification.message)}</span>
                                  <span className="text-gray-500 text-sm">{formatTime(notification.createdAt)}</span>
                                </div>
                                {!notification.read && (
                                  <div>
                                    <span className="bg-[#F48567] w-[15px] h-[15px] flex rounded-full"></span>
                                  </div>
                                )}
                              </div>
                            ))
                          }
                        </>
                      )}

                    {/* Earlier Notifications */}
                    {filteredNotifications.some(notification => {
                      const createdAt = new Date(notification.createdAt);
                      return (new Date() - createdAt) / (1000 * 60 * 60) >= 24; // Check if there's at least one earlier notification
                    }) && (
                        <>
                          <div className="flex justify-between mt- p-3">
                            <span className="font-bold">Earlier</span>
                            <span className="text-blue-500 cursor-pointer">See All</span>
                          </div>
                          {filteredNotifications
                            .filter(notification => {
                              const createdAt = new Date(notification.createdAt);
                              return (new Date() - createdAt) / (1000 * 60 * 60) >= 24; // 24 hours or older
                            })
                            .map((notification, index) => (
                              <div key={index} className={`flex items-center p-2 p-2 gap-4 mb-3 rounded-xl  cursor-pointer  ${darkMode ? 'hover:bg-[#333333]' : 'hover:bg-slate-100'}`} onClick={() => {
                                dispatch(markNotificationAsRead(notification._id)).then(() => {
                                  dispatch(fetchAllNotifications(userRoles));
                                });
                              }}
                              >
                                <img
                                  src="https://png.pngtree.com/png-clipart/20190925/original/pngtree-no-image-vector-illustration-isolated-png-image_4979075.jpg"
                                  className="rounded-full w-16 h-16"
                                  alt="Notification"
                                />
                                <div className="flex flex-col">
                                  <span className="text-sm w-[88%] break-words">{formatMessage(notification.message)}</span>
                                  <span className="text-gray-500 text-sm">{formatTime(notification.createdAt)}</span>
                                </div>
                                {!notification.read && (
                                  <div>
                                    <span className="bg-[#F48567] w-[15px] h-[15px] flex rounded-full"></span>
                                  </div>
                                )}
                              </div>
                            ))
                          }
                        </>
                      )}
                  </>
                )}
              </main>


            </section>
          </div>
        </div>
      )}
    </>
  );
};

export default Notification;
