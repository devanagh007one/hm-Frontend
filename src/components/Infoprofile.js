import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../redux/actions/authActions';
import { fetchAllUsers } from '../redux/actions/alluserGet';

const Infoprofile = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const userData = useSelector((state) => state.auth.userData);
  const { users, error } = useSelector((state) => state.user);
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  // Filtering users with role "Partner"
  const partnerUsers = users ? users.filter(user => user.roles && user.roles.includes('Partner')) : [];
  const cardClass = `${darkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-black'}`;

  return (
    <section className='gap-4 flex flex-col w-2/4'>
      <div className='flex gap-3 h-full'>
        <div
          className={`card flex flex-col w-1/2 overflow-hidden p-5 relative ${cardClass}`}
          style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#D9AA58'
          }}
        >
          <span className='namedash'>{userData?.firstName || 'N/A'} {userData?.lastName || ''}</span>
          <span className='namedash mt-5 w-[30px]'>{userData?.roles?.[0] || 'No Role'}</span>

          <div className='pl-[20px] pr-[20px] pt-[15px] h-1/4 absolute bottom-0 left-0 w-full bg-[#FFFFFF] flex justify-between'>
            <div>
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="50" height="50" rx="6" fill="#D9D9D9" />
              </svg>
            </div>
            <div className='flex flex-col desination gap-2'>
              <span>{userData?.department || 'No Department'}</span>
              <span>{userData?.company || 'No Company'}</span>
            </div>
          </div>
        </div>
        <div className='flex flex-col justify-between w-1/2 gap-4 '>
          <div className={`card h-1/2 p-4 gap-2 flex flex-col ${cardClass}`}>
            <div className='text-2xl'>Clients</div>
            <div className='nubbox text-3xl'>{users ? users.length : 0}</div>
          </div>
          <div className={`card h-1/2 p-4 gap-2 flex flex-col ${cardClass}`}>
            <div className='text-2xl'>Partners</div>
            <div className='nubbox text-3xl'>{partnerUsers.length}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Infoprofile;
