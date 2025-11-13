import React, { useContext, useEffect } from 'react';
import { UserContext } from '../../context/userContext';
import Navbar from './Navbar';
import SideMenu from './SideMenu';
import { useLocation } from 'react-router-dom';

const DashboardLayout = ({children, activeMenu}) => {
  const {user} = useContext(UserContext);
  const location = useLocation();
  
  useEffect(() => {
    // Don't scroll to top if we're on create-task page coming from floor whiteboard
    const isCreateTaskWithTemplate = 
      location.pathname.includes('/create-task') && 
      location.state?.floorWhiteboardSection;
    
    if (!isCreateTaskWithTemplate) {
      window.scrollTo(0, 0);
    }
  }, [activeMenu, location.pathname, location.state]);

  return (
    <div className="">
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex pt-16">
          {/* Desktop Sidemenu - Always visible on large screens */}
          <div className="hidden lg:block fixed left-0 top-16 z-20">
            <SideMenu activeMenu={activeMenu} />
          </div>

          {/* Main Content */}
          <div className="flex-1 lg:ml-69 mx-5 py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;