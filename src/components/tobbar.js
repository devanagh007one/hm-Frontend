import React from 'react'
import ThemeSwitcher from './ThemeSwitcher';
import Notification from './Notification';
import Searchbar from './SearchInput';
import Time from './Time';


const tobbar = () => {
  return (
    <div className='flex max-h-20 min-h-20  justify-between content-center flex-wrap w-full pl-8 pr-8 pt-4'>   
    <div><Searchbar /></div>  
       
       <div className='flex gap-3' >
            <Notification />
            <ThemeSwitcher />
            <Time />
            </div>
</div>
  )
}

export default tobbar