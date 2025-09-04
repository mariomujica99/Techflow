import React, { useContext, useEffect, useState } from "react";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../../utils/getInitials";

const SideMenu = ({activeMenu}) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);

  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }

    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  useEffect(() => {
    if(user){
      setSideMenuData(user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA)
    }
    return () => {};
  }, [user]);
return <div className="w-64 h-[calc(100vh-50px)] sticky top-[64px] z-20 overflow-y-auto py-2 bg-cover bg-center relative" style={{ backgroundImage: "url('/bg-sidemenu-image.png')" }}>
  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
    <div className="relative z-10">
      <div className="flex flex-col items-center justify-center mb-5 pt-5">
        <div className="relative">
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.name}
              className="w-20 h-20 bg-slate-400 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-primary text-white font-semibold text-xl">
              {getInitials(user?.name)}
            </div>
          )}
        </div>

        {user?.role === "admin" && (
          <div className="mt-4 text-[10px] font-medium text-white bg-indigo-500 px-3 py-0.5 rounded mt-1">
            Admin
          </div>
        )}

        <h5 className="text-gray-950 font-medium leading-6 mt-3">
          {user?.name || ""}
        </h5>
      </div>

      {sideMenuData.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-3 text-[15px] ${
            activeMenu == item.label
              ? "text-primary bg-gray-50 border-r-3"
              : "text-gray-900 hover:bg-teal-50"
          } py-2 px-5 mb-1.5 rounded cursor-pointer`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-lg" />
          {item.label}
        </button>
      ))}
    </div>
  </div> 
};

export default SideMenu;