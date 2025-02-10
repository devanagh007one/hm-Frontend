import React from 'react';
import { IconLogout } from '@tabler/icons-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { handleLogout } from '../redux/actions/logoutActions'; 
import { showNotification } from '../redux/actions/notificationActions';
import Notification from './Template/Notification'; 

const Profilecreads = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Create navigate function
    const darkMode = useSelector((state) => state.theme.darkMode);
    const userData = useSelector((state) => state.session.userData);

    const userName = userData?.name || 'error';
    const userEmail = userData?.email || 'error';
    const userImage = userData?.image || 'default.png';

    const handleLogoutClick = async () => {
        try {
            await dispatch(handleLogout());
            navigate('/login'); // Navigate to login page
        } catch (error) {
            dispatch(showNotification('Logout failed', 'error'));
        }
    };

    return (
        <div className={`flex justify-between items-center ${darkMode ? 'text-white' : 'text-black'}`}>
            <img
                className="w-12 h-12 rounded-full object-cover"
                src={`${process.env.STATIC_API_URL}/${userImage}`}
                alt="Profile"
            />
            <div>
                <h3>{userName}</h3>
                <span className={`flex text-sm ${darkMode ? 'text-zinc-500' : 'text-gray-600'}`}>{userEmail}</span>
            </div>
            <div>
                <IconLogout
                    className={`${darkMode ? 'text-zinc-500' : 'text-gray-600'}`}
                    stroke={2}
                    onClick={handleLogoutClick}
                    style={{ cursor: 'pointer' }}
                />
            </div>
            <Notification />
        </div>
    );
};

export default Profilecreads;
