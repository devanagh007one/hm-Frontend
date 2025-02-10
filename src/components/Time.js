import React from 'react';
import { format } from 'date-fns';
import { IconCalendarFilled } from '@tabler/icons-react';
import { useSelector } from 'react-redux'; 


const Time = () => {
  const currentDate = new Date();
  const formattedDate = format(currentDate, 'd MMM yyyy'); 
  const darkMode = useSelector(state => state.theme.darkMode);

  return (
    <div className={`button-big gap-2 flex justify-center w-36 ${darkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-black'}`}>
      <IconCalendarFilled size={24} />
      <span>{formattedDate}</span>
    </div>
  );
};

export default Time;
