import React from 'react';
import UI_IMG from '../../assets/images/logo.png';
import BG_IMG from '../../assets/images/bg-image.png';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Section */}
      <div className="w-full md:w-[60vw] px-6 md:px-12 md:py-8 pb-8 overflow-y-auto md:flex md:items-center">
        {/* Mobile / Small Screens */}
        <div
          className="md:hidden flex justify-center mb-8 bg-blue-50 bg-cover bg-no-repeat bg-bottom py-12 -mx-6 md:-mx-12"
          style={{ backgroundImage: `url(${BG_IMG})` }}
        >
          <img
            src={UI_IMG}
            className="w-32 h-32 rounded-full object-cover shadow-lg"
            alt="Logo"
          />
        </div>

        {children}
      </div>

      {/* Right Section */}
      <div
        className="hidden md:flex w-[40vw] min-h-screen items-center justify-center bg-blue-50 bg-cover bg-no-repeat bg-center overflow-hidden p-8"
        style={{ backgroundImage: `url(${BG_IMG})` }}
      >
        <img
          src={UI_IMG}
          className="w-64 h-64 lg:w-80 lg:h-80 rounded-full object-cover"
          alt="Logo"
        />
      </div>
    </div>
  );
};

export default AuthLayout;