import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";
import logo from "../../assets/images/logo.png";


const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  return (
    <div
      className="flex gap-5 items-center backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30 bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-nav-image.png')" }}
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
        <div className="fixed top-[64px] -ml-4 bg-white">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;