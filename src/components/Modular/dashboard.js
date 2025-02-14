import React from 'react'
import Infoprofile from '../Infoprofile';
import MyProjects from '../MyProjects';
import Statistic from '../Statistic';
import Reports from '../Reports';
import Meeting from '../Meeting';

const dashboard = () => {
  return (
    <div className='flex flex-wrap gap-5 p-5  thescreanhe'>
      <h1 className='text-4xl'>Dashboard Overview</h1>

      <div className='flex gap-5 w-full'>
        <Infoprofile />
        <MyProjects />
      </div>
      <div className='flex gap-5 w-full '>
        <Meeting />
        {/* <Statistic /> */}
        <Reports />
      </div>
      <div className='flex gap-5 w-full'>
        <Meeting />
        <Statistic />
      </div>
    </div>
  )
}

export default dashboard