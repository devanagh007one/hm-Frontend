import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';

import Header from '../components/Header';
import Sidebar from '../components/tobbar';
import Dashboard from '../components/Modular/Dashboard.js';
import ProfileSettings from '../components/Modular/Profilesettings';
import ProfileSettingsHR from '../components/Modular/ProfileSettingsHR.js';
import Usersmanagement from '../components/Modular/Usersmanagement';
import SystemLogs from '../components/Modular/SystemLogs';
import Rolemanagement from '../components/Modular/Rolemanagement';
import ContentManagement from '../components/Modular/Contentmanagement';
import UsersmanagementHR from '../components/Modular/Usersmanagementhr';
import Eventsmanagement from '../components/Modular/Eventsmanagement';
import AnalyticsDashboard from '../components/Modular/AnalyticsDashboard';
import Licensing from '../components/Modular/Licencing';
import Messages from '../components/Modular/Messages';
import {setActiveComponent} from '../redux/actions/index.js';
// import Policies from './Policies';

const components = {
  Dashboard: <Dashboard />,
  Usersmanagement: <Usersmanagement />,
  SystemLogs: <SystemLogs />,
  ContentManagement: <ContentManagement />,
  Rolemanagement: <Rolemanagement />,
  Licensing: <Licensing />,
  ProfileSettings: <ProfileSettings />,
  ProfileSettingsHR: <ProfileSettingsHR />,
  UsersmanagementHR: <UsersmanagementHR />,
  Eventsmanagement: <Eventsmanagement />,
  AnalyticsDashboard: <AnalyticsDashboard />,
  messsage: <Messages />,

};

const Homepage = () => {
  const dispatch = useDispatch();
  const storedComponent = localStorage.getItem("activeComponent") || "Dashboard"; // Default to Licensing
  const activeComponent = useSelector(state => state.header.activeComponent) || storedComponent;

  useEffect(() => {
    dispatch(setActiveComponent(storedComponent)); // Update Redux state

    // Remove activeComponent after reload

  }, [dispatch, storedComponent]);

  return (
    <>
      <div className="flex">
        <Header />
      </div>
      <div className="content w-full h-screen">
        <Sidebar />
        {components[activeComponent]}
      </div>
    </>
  );
};

export default Homepage;

