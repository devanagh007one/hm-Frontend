import React from 'react';
import { IconSearch } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
const SearchInput = () => {
  const darkMode = useSelector(state => state.theme.darkMode);

  return (
    <div className={`flex justify-center content-center rounded-lg max-h-12 relative ${darkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-black'} transition-colors duration-300`}>
      <input
        type="text"
        placeholder="Search here"
        className="px-4 py-2 pl-10 rounded-lg focus:outline-none bg-transparent w-96" 
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <IconSearch size={20} strokeWidth={1.5} className="" />
      </div>
    </div>
  );
};

export default SearchInput;
