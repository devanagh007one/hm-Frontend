import React from 'react';
import { IconLogout } from '@tabler/icons-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { handleLogout } from '../redux/actions/logoutActions';
import { showNotification } from '../redux/actions/notificationActions';
import Notification from './Template/Notification';
import { fetchUsers } from '../redux/actions/authActions';
import { useState, useEffect } from 'react';



const Profilecreads = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Create navigate function
    const darkMode = useSelector((state) => state.theme.darkMode);
    const userData = useSelector((state) => state.auth.userData); // Assuming the userData is in auth reducer

    useEffect(() => {
        dispatch(fetchUsers());
      }, [dispatch]);

    const userEmail = userData?.email || 'error';

    const handleLogoutClick = async () => {
        try {
            await dispatch(handleLogout());
            navigate('/login'); // Navigate to login page
        } catch (error) {
            dispatch(showNotification('Logout failed', 'error'));
        }
    };

    return (
        <div className={`flex justify-between items-center ${darkMode ? 'text-white' : 'text-black'}`} onClick={handleLogoutClick}
            style={{ cursor: 'pointer' }}>
            <div className={`sidebartab flex items-center`}>
                <div>
                    <IconLogout
                        className={`${darkMode ? 'text-zinc-500' : 'text-gray-600'} rotate-180	mr-2`}
                        stroke={2} />
                </div>
                <div>
                    <span  className={`flex text-sm font-medium ${darkMode ? 'text-zinc-500' : 'text-gray-600'}`}>
                    Sign Out
                    </span>
                <div className={`flex flex-row ${darkMode ? 'text-zinc-500' : 'text-gray-600'} text-xs `}><span>Email id </span>
                    <span className={`flex flex-row ${darkMode ? 'text-zinc-500' : 'text-gray-600'} text-xs ml-2`}> {userEmail}</span>
                </div>
                </div>
            </div>
            <Notification />
        </div>
    );
};

export default Profilecreads;
