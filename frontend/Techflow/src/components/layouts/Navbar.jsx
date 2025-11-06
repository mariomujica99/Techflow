import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";
import logo from "../../assets/images/logo.png";
import BG_NAV_IMG from '../../assets/images/bg-nav-image.png';

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div
      className="flex gap-5 items-center py-4 px-7 fixed top-0 left-0 right-0 z-30"
      style={{ 
        backgroundImage: `url(${BG_NAV_IMG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <button
        className="block lg:hidden text-white"
        onClick={() => {
          setOpenSideMenu(!openSideMenu);
        }}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      <div className="flex items-center gap-2">
        <img
          src={logo}
          alt="Auth"
          className="rounded-full h-8 w-8 object-cover"
        />
        <h2 className="text-xl font-medium text-white">Techflow</h2>
      </div>

      {openSideMenu && (
        <div className="fixed top-[64px] left-0 w-64 z-40 lg:hidden">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;