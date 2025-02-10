import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { showNotification } from '../../redux/actions/notificationActions';
import Notification from '../Template/Notification';
import { useState, useEffect } from 'react';
import { fetchUsers } from '../../redux/actions/authActions';
import { editUserProfile } from '../../redux/actions/alluserGet';
import CropImage from './Cropimage';
import CryptoJS from "crypto-js";


const EditableField = ({ label, value, onChange, isEditable, onEditClick }) => (
    <div className='text-xl flex items-center justify-between'>
        <div className='flex items-center gap-2'>
            <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={onEditClick}
                className='cursor-pointer'
            >
                <path opacity="0.16" d="M4.16665 13.3333L3.33331 16.6667L6.66665 15.8333L15 7.5L12.5 5L4.16665 13.3333Z" fill="#C7C7C7" />
                <path d="M12.5 5L15 7.5M10.8333 16.6667H17.5M4.16665 13.3333L3.33331 16.6667L6.66665 15.8333L16.3216 6.17833C16.6341 5.86578 16.8096 5.44194 16.8096 5C16.8096 4.55806 16.6341 4.13421 16.3216 3.82166L16.1783 3.67833C15.8658 3.36588 15.4419 3.19035 15 3.19035C14.558 3.19035 14.1342 3.36588 13.8216 3.67833L4.16665 13.3333Z" stroke="#C7C7C7" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {label}:
        </div>
        <input
            value={value}
            readOnly={!isEditable}
            onChange={(e) => onChange(e.target.value)}
            className={`bg-transparent border rounded p-1 text-xl outline-none w-3/5 ${isEditable ? 'border-green-500' : 'border-gray-300'}`}
        />
    </div>
);


const Profilecreads = () => {
    const [editStatus, setEditStatus] = useState({
        userName: false,
        organizationName: false,
        mobile: false,
        email: false,
        address: false
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const darkMode = useSelector((state) => state.theme.darkMode);
    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const [userNameset, setuserName] = useState(userData?.userName);
    const [organizationName, setOrganizationName] = useState(userData?.company);
    const [userMobileno, setuserMobile] = useState(userData?.mobile);
    const [userEmailadd, setuserEmail] = useState(userData?.email);
    const [Address, setAddress] = useState(userData?.address);
    const [isEditable5, setIsEditable5] = useState(false);

    const joinedAt = userData?.joinedAt || 'Na'; // Declare joinedAt before usage
    const datejoin = new Date(joinedAt); // Initialize datejoin after joinedAt

    const formattedDate = datejoin.toLocaleString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    });

    useEffect(() => {
        if (userData) {
            setuserName(userData.userName || 'error');
            setOrganizationName(userData.company || 'error');
            setuserMobile(userData.mobile || 'Na');
            setuserEmail(userData.email || 'error');
            setAddress(userData.address || 'Na');
        }
    }, [userData]);

    const toggleEdit = (field) => {
        setEditStatus(prevState => ({
            ...prevState,
            [field]: !prevState[field]
        }));
        dispatch(showNotification(`Now you can edit ${field}`, 'success'));
    };

    const toggleEdit5 = () => {
        setIsEditable5(prevState => !prevState);
        dispatch(showNotification('Now you can edit Address ', 'success'));
    };

    const handleSave = () => {
        const formData = new FormData();
        formData.append("userName", userNameset);
        formData.append("company", organizationName);
        formData.append("mobile", userMobileno);
        formData.append("email", userEmailadd);
        formData.append("address", Address);

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

        // Dispatch the form data along with the userId
        dispatch(editUserProfile(userId, formData));
        dispatch(showNotification(`Profile edited successfully`, 'success'));
        handleCancel();
        dispatch(fetchUsers());
    };

    const handleCancel = () => {
        setEditStatus({
            userName: false,
            organizationName: false,
            mobile: false,
            email: false,
            address: false
        });
    };

    const totalAvailabilityHours = userData?.totalAvailabilityHours || 'Na';
    const userroles = userData?.roles[0] || 'Na';

    const allFieldsTrue = Object.values(editStatus).some(status => status === true);

    return (
        <div className={`flex mr-3 justify-between items-center ${darkMode ? 'text-white' : 'text-black'}`}>
            <section className='w-full'>
                <div>
                    <img
                        src='https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                        className='w-full relative z-0'
                        style={{ maxHeight: '248px', borderRadius: '20px' }}
                        alt='Descriptive text'
                    />
                    <div className='flex'>
                    <img
    src={`${process.env.REACT_APP_STATIC_API_URL}/${userData?.image?.replace(/^.*\/uploads\//, 'uploads/') || 'default.png'}`}
    className='h-48 relative z-10 mt-[-7rem] w-48 rounded-full ml-16 bg-slate-500'
    alt='Profile'
/>

                        <div className='mt-6 ml-[-25px] relative z-20'>
                            <CropImage />
                        </div>
                        <div className='mt-4 ml-5'>
                            <h3 className='text-xl'>{userNameset}</h3>
                            <span className={`flex text-xs`}>{userEmailadd}</span>
                        </div>
                    </div>
                </div>

                <section className='flex w-full justify-between'>
                    <div className={`mt-5 w-1/2 flex gap-7 ${darkMode ? 'text-gray-300' : 'text-black'}`}>
                        <div className='w-full flex flex-col gap-5'>
                            <EditableField
                                label="UserName"
                                value={userNameset}
                                isEditable={editStatus.userName}
                                onChange={setuserName}
                                onEditClick={() => toggleEdit('userName')}
                            />
                            <EditableField
                                label="Organization Name"
                                value={organizationName}
                                onChange={setOrganizationName}
                            />
                            <EditableField
                                label="Phone Number"
                                value={userMobileno}
                                isEditable={editStatus.mobile}
                                onChange={setuserMobile}
                                onEditClick={() => toggleEdit('mobile')}
                            />
                            <EditableField
                                label="Email Address"
                                value={userEmailadd}
                                isEditable={editStatus.email}
                                onChange={setuserEmail}
                                onEditClick={() => toggleEdit('email')}
                            />
                            <EditableField
                                label="Address"
                                value={Address}
                                isEditable={editStatus.address}
                                onChange={setAddress}
                                onEditClick={() => toggleEdit('address')}
                            />
                        </div>
                    </div>

                    <div className='w-2/5 border rounded-xl p-3'>
                        <div className='text-lg font-medium	'> Role : <span className='text-[#F48567] font-medium'>{userroles}</span></div>
                        <div className='mt-6 ml-3 flex flex-col gap-12'>
                            <div className='flex flex-col font-medium'>
                                Joined On :
                                <span className='ml-2 mt-2 font-light'>{formattedDate}</span>
                            </div>
                            <div className='flex flex-col font-medium'>
                                Last Updated :
                                <span className='ml-2 mt-2 font-light'>{formattedDate}</span>
                            </div>
                            <div className='flex flex-col font-medium'>
                                Time Spent:
                                <span className='ml-2 mt-2 font-light'>{totalAvailabilityHours} hrs</span>
                            </div>
                        </div>
                    </div>
                </section>
                {allFieldsTrue && (
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
