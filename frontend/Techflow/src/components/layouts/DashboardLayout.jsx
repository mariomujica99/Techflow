import React, { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import Navbar from './Navbar';
import SideMenu from './SideMenu';

const DashboardLayout = ({children, activeMenu}) => {
  const {user} = useContext(UserContext);
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
          <div className="flex-1 lg:ml-69 mx-5 py-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;