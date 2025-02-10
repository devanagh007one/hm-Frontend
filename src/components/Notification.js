import React from 'react'
import { IconBell } from '@tabler/icons-react';
import { useSelector } from 'react-redux';


const Notification = () => {
    const darkMode = useSelector(state => state.theme.darkMode);
  return (
    <div className={`button-big ${darkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-black'}`}><IconBell stroke={2} />
</div>
  )
}

export default Notification