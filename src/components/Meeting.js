import React, { useEffect, useState } from "react";
import { IconMail, IconAlarm, IconX } from '@tabler/icons-react';
import { fetchAllEvents } from '../redux/actions/alleventGet';
import { useDispatch, useSelector } from "react-redux";

const Meeting = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const { events } = useSelector((state) => state.events);
  const dispatch = useDispatch();
  
  const [selectedFilter, setSelectedFilter] = useState("Today");

  useEffect(() => {
    dispatch(fetchAllEvents());
  }, [dispatch]);

  const cardClass = `${darkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-black'}`;

  // Get today's and yesterday's date
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const formatDate = (date) => date.toISOString().split("T")[0];

  // First and last day of the current month
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Filter events based on selected filter
  const filteredEvents = events
    .filter(event => {
      const startDate = new Date(event.startDateTime);
      const endDate = new Date(event.endDateTime);

      if (selectedFilter === "Today") {
        return formatDate(startDate) === formatDate(today) || formatDate(endDate) === formatDate(today);
      } 
      if (selectedFilter === "Yesterday") {
        return formatDate(startDate) === formatDate(yesterday) || formatDate(endDate) === formatDate(yesterday);
      }
      if (selectedFilter === "Monthly") {
        return startDate <= lastDayOfMonth && endDate >= firstDayOfMonth;
      }
      return false;
    })
    .slice(0, 2); // Show only 2 events

    return (
      <section className={`flex flex-col gap-4 w-1/2 ${cardClass} p-4 rounded-xl`}>
        <div className='flex justify-between items-center text-lg font-semibold'>
          <div className='flex gap-2'>
            <span>All Events</span>
            <span>Scheduled</span>
          </div>
          <select 
            className={`px-3 py-1 rounded-md text-sm rounded-xl border border-gray-600 ${darkMode ? 'bg-[#414141] text-white' : 'bg-slate-100 text-black'}`}
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="Today">Today, {formatDate(today)}</option>
            <option value="Yesterday">Yesterday, {formatDate(yesterday)}</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>
    
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <div key={index} className={`p-4 flex justify-between rounded-lg flex flex-row shadow-indigo-500/40 ${darkMode ? 'bg-[#414141] text-white' : 'bg-slate-200 text-black'}`}>
              <div className='flex flex-col justify-between items-center'>
                <span className='font-semibold'>{event.description}</span>
                <span className='text-sm '>{event.location}</span>
              </div>
              <div className='flex flex-col justify-between text-sm mt-2'>
                <span>{event.mode}</span>
                <span className='text-sm '>{new Date(event.startDateTime).toLocaleDateString()}</span>
              </div>
              <div className='flex flex-col justify-between text-sm mt-2'>
                <span>{event.mode}</span>
                <span className='text-sm '>{new Date(event.startDateTime).toLocaleDateString()}</span>
              </div>
              <div className='flex justify-end gap-2 mt-2'>
                <IconMail size={18} className='cursor-pointer' />
                <IconAlarm size={18} className='cursor-pointer' />
                <IconX size={18} className='cursor-pointer text-red-500' />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 p-4">
            No Event Present
          </div>
        )}
    
        <div className='text-center text-orange-400 cursor-pointer mt-2'>
          See All Events
        </div>
      </section>
    );
    
};

export default Meeting;
