import React from 'react'
import Infoprofile from '../Infoprofile';
import MyProjects from '../MyProjects';
import Statistic from '../Statistic';
import Reports from '../Reports';
import { useSelector, useDispatch } from 'react-redux';
import Meeting from '../Meeting';
import Bars from '../Bars';
import { fetchDashboardData } from '../../redux/actions/allNotifications'

const Dashboard = () => {
  const dispatch = useDispatch();

  const handleFetchData = () => {
    // const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    // const last7Days = new Date();
    // last7Days.setDate(new Date().getDate() - 7);
    // const startDate = last7Days.toISOString().split("T")[0];

    // dispatch(fetchDashboardData(startDate, today));
    dispatch(fetchDashboardData("2024-01-01", "2025-02-20"));

  };


  return (
    <div className='flex flex-wrap gap-5 p-5  thescreanhe overflow-y-scroll'>
      <h1 className='text-4xl'>Dashboard Overview</h1>
      {/* <button onClick={handleFetchData}>hello</button> */}
      <div className='flex gap-5 w-full'>
        <Infoprofile />
        <MyProjects />
      </div>
      <div className='flex gap-5 w-full '>
        <Meeting />
        <Reports />
      </div>
      <div className='flex gap-5 w-full'>
        <Bars />
        <Statistic />
      </div>
    </div>
  )
}

export default Dashboard