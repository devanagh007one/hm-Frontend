import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateComponent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = () => {
      const userData = localStorage.getItem('authToken');

      if (userData) {
        const parsedUserData = userData;

        // Check if _id exists
        if (parsedUserData) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }

      // Set loading to false after checking
      setIsLoading(false);
    };

    checkAuthentication();
  }, []); // Empty dependency array means this runs once on mount

  if (isLoading) {
    return <div>Loading...</div>; // Optionally show a loading spinner or message
  }

  if (isAuthenticated) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default PrivateComponent;