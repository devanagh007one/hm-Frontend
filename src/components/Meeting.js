import React from 'react';
import { useSelector } from 'react-redux';
import { IconMail, IconAlarm, IconX } from '@tabler/icons-react';

const Meeting = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const cardClass = `${darkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-black'}`;

  const meetings = [
    {
      title: 'Yoga For Beginners',
      instructor: 'John Doe',
      type: 'Yoga',
      mode: 'Online',
      status: 'Scheduled',
      date: '10-15-2024'
    },
    {
      title: 'Meditation Techniques',
      instructor: 'Jane Smith',
      type: 'Yoga',
      mode: 'Online',
      status: 'Scheduled',
      date: '10-15-2024'
    }
  ];

  return (
    <section className={`flex flex-col gap-4 w-1/2 ${cardClass} p-4 rounded-xl text-white`}>
      <div className='flex justify-between items-center text-lg font-semibold'>
        <span>All Events</span>
        <span>Scheduled</span>
      </div>
      <div className='flex justify-end'>
        <button className='bg-gray-700 px-3 py-1 rounded-md text-sm'>Today, 09-10-2024 ▼</button>
      </div>
      {meetings.map((meeting, index) => (
        <div key={index} className={`p-4 flex justify-between rounded-lg flex flex-row bg-[#333333]`}>
          <div className='flex flex-col justify-between items-center'>
            <span className='font-semibold'>{meeting.title}</span>
            <span className='text-sm text-gray-400'>{meeting.instructor}</span>

          </div>
          <div className='flex flex-col justify-between text-sm mt-2'>
            <span>{meeting.mode}</span>
            <span className='text-sm text-gray-400'>{meeting.type}</span>
          </div>
          <div className='flex flex-col justify-between text-sm mt-2'>
            <span>{meeting.mode}</span>
            <span className='text-sm text-gray-400'>{meeting.date}</span>
          </div>
          <div className='flex justify-end gap-2 mt-2'>
            <IconMail size={18} className='cursor-pointer' />
            <IconAlarm size={18} className='cursor-pointer' />
            <IconX size={18} className='cursor-pointer text-red-500' />
          </div>
        </div>
      ))}
      <div className='text-center text-orange-400 cursor-pointer mt-2'>
        See All Events
      </div>
    </section>
  );
};

export default Meeting;
