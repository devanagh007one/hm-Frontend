import React from 'react'
import Infoprofilehr from '../Infoprofilehr.js';
import MyProjects from '../MyProjects2.js';
import Statistic from '../Statistic';
import Reports from '../Reports2';
import { useSelector, useDispatch } from 'react-redux';
import Meeting from '../Meeting2';
import Bars from '../Bars2';
import { fetchDashboardData } from '../../redux/actions/allNotifications'

const Dashboard = () => {
  const dispatch = useDispatch();

  const handleFetchData = () => {

    dispatch(fetchDashboardData("2024-01-01", "2025-02-20"));

  };


  return (
    <div className='flex flex-wrap gap-5 p-5  thescreanhe overflow-y-scroll'>
      <h1 className='text-4xl'>Dashboard Overview</h1>
      {/* <button onClick={handleFetchData}>hello</button> */}
      <div className='flex gap-5 w-full'>
        <Infoprofilehr />
        <MyProjects />
      </div>
      <div className='flex gap-5 w-full '>
        {/* <Meeting /> */}
        <Statistic />

        <Reports />
      </div>
      <div className='flex gap-5 w-full'>
        {/* <Bars /> */}
      </div>
    </div>
  )
}

export default Dashboard