import React from 'react';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Sidebar from '../components/tobbar';
import Dashboard from '../components/Modular/dashboard';
import ProfileSettings from '../components/Modular/Profilesettings';
import ProfileSettingsHR from '../components/Modular/ProfileSettingsHR.js';
import Usersmanagement from '../components/Modular/Usersmanagement';
import Rolemanagement from '../components/Modular/Rolemanagement';
import ContentManagement from '../components/Modular/Contentmanagement';
import UsersmanagementHR from '../components/Modular/Usersmanagementhr';
import Eventsmanagement from '../components/Modular/Eventsmanagement';
import Licensing from '../components/Modular/Licencing';
import Messages from '../components/Modular/Messages';
// import Policies from './Policies';

const components = {
  Dashboard: <Dashboard />,
  Usersmanagement: <Usersmanagement />,
  ContentManagement: <ContentManagement />,
  Rolemanagement: <Rolemanagement />,
  Licensing: <Licensing />,
  ProfileSettings: <ProfileSettings />,
  ProfileSettingsHR: <ProfileSettingsHR />,
  UsersmanagementHR: <UsersmanagementHR />,
  Eventsmanagement: <Eventsmanagement />,
  messsage: <Messages />,

};

const Homepage = () => {
  const activeComponent = useSelector(state => state.header.activeComponent);

  return (
    <>
      <div className="flex">
        <Header />
      </div>
      <div className="content w-[80%] h-screen">
        <Sidebar />
        {components[activeComponent]}
      </div>
    </>
  );
};

export default Homepage;