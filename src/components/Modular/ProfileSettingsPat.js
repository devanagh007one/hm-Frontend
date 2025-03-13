import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '../../redux/actions/notificationActions';
import { fetchUsers } from '../../redux/actions/authActions';
import { editUserProfile } from '../../redux/actions/alluserGet';
import CropImage from './Cropimage';
import CryptoJS from "crypto-js";

const EditableField = ({ label, value, onChange, isEditable }) => (
    <div className="text-xl flex items-center justify-between">
        <div className="flex items-center gap-2">{label}:</div>
        <input
            value={value}
            readOnly={!isEditable}
            onChange={(e) => onChange(e.target.value)}
            className={`bg-transparent border rounded p-1 text-xl outline-none w-3/5 ${isEditable ? 'border-green-500' : 'border-gray-300'}`}
        />
    </div>
);

const Profilecreads = () => {
    const [editStatus, setEditStatus] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const darkMode = useSelector((state) => state.theme.darkMode);
    const userData = useSelector((state) => state.auth.userData);

    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    useEffect(() => {
        if (userData) {
            setUserDetails({
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                userName: userData.userName || '',
                email: userData.email || '',
                mobile: userData.mobile || '',
                company: userData.company || '',
                country: userData.country || '',
                department: userData.department || '',
                doB: userData.doB || '',
                gender: userData.gender || '',
                goals: userData.goals || '',
                interests: userData.interests || '',
                totalAvailabilityHours: userData.totalAvailabilityHours || '',
                role: userData.roles?.[0] || '',
            });

            const initialEditStatus = {};
            Object.keys(userData).forEach((key) => {
                initialEditStatus[key] = false;
            });
            setEditStatus(initialEditStatus);
        }
    }, [userData]);

    const toggleEditAll = () => {
        const newEditStatus = Object.keys(editStatus).reduce((acc, key) => {
            acc[key] = !Object.values(editStatus).some(status => status === true);
            return acc;
        }, {});
        setEditStatus(newEditStatus);
        dispatch(showNotification(`You can now ${Object.values(editStatus).some(status => status === true) ? "stop editing" : "edit"} all fields`, 'success'));
    };

    const handleSave = () => {
        const formData = new FormData();
        Object.keys(userDetails).forEach((key) => {
            formData.append(key, userDetails[key]);
        });

        const encryptedId = localStorage.getItem("userId");
        let userId = null;

        if (encryptedId) {
            try {
                const bytes = CryptoJS.AES.decrypt(
                    encryptedId,
                    "477f58bc13b97959097e7bda64de165ab9d7496b7a15ab39697e6d31ac61cbd1"
                );
                userId = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            } catch (error) {
                console.error("Decryption error:", error);
                return;
            }
        }

        if (!userId) {
            console.error("Failed to retrieve userId");
            return;
        }

        dispatch(editUserProfile(userId, formData));
        dispatch(showNotification(`Profile updated successfully`, 'success'));
        handleCancel();
        dispatch(fetchUsers());
    };

    const handleCancel = () => {
        setEditStatus({});
    };

    return (
        <div className={`flex mr-3 justify-between items-center ${darkMode ? 'text-white' : 'text-black'}`}>
            <section className="w-full flex flex-col justify-center mt-10 items-center">
                <div className="flex w-3/4">
                    <img
                        src={`${process.env.REACT_APP_STATIC_API_URL}/${userData?.image?.replace(/^.*\/uploads\//, 'uploads/') || 'default.png'}`}
                        className="h-48 relative z-10 mt-[-2rem] w-48 rounded-full ml-16 bg-slate-500"
                        alt="Profile"
                    />
                    <div className="mt-[100px] ml-[-25px] relative z-20">
                        <CropImage />
                    </div>
                    <div className="mt-[90px] ml-2">
                        <h3 className="text-xl">{userDetails.firstName}</h3>
                        <span className="flex text-xs">{userDetails.email}</span>
                    </div>
                </div>

                <section className="flex w-3/4 mt-5 items-center">
                    <div className={`mt-5 w-full flex gap-7 ${darkMode ? 'text-gray-300' : 'text-black'}`}>
                        <div className="w-full flex flex-col gap-5 overflow-y-scroll h-[500px]">
                            {/* Edit Icon for All Fields */}
                            <div className="flex justify-end">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    onClick={toggleEditAll}
                                    className="cursor-pointer hover:opacity-70"
                                >
                                    <path d="M3 17.25V21H6.75L17.81 9.93997L14.06 6.18997L3 17.25ZM21.41 6.34003C21.79 5.96003 21.79 5.34003 21.41 4.96003L19.04 2.59003C18.66 2.21003 18.04 2.21003 17.66 2.59003L15.87 4.37003L19.63 8.13003L21.41 6.34003Z" fill="gray" />
                                </svg>
                            </div>

                            {/* Editable Fields */}
                            {Object.keys(userDetails).map((key) => (
                                <EditableField
                                    key={key}
                                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                                    value={userDetails[key]}
                                    isEditable={editStatus[key]}
                                    onChange={(newValue) =>
                                        setUserDetails((prev) => ({ ...prev, [key]: newValue }))
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {Object.values(editStatus).some(status => status === true) && (
                    <div className="flex gap-5 w-full items-center justify-center mt-20">
                        <button
                            className="w-28 p-3 rounded-2xl bg-[#F48567] text-white text-lg subpixel-antialiased"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                        <button
                            className="w-28 p-3 rounded-2xl bg-[#C7C7C7] text-white text-lg subpixel-antialiased"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Profilecreads;
