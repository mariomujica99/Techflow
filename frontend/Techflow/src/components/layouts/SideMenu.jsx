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

  useEffect(() => {
    const img = new Image()
    img.src = '/bg-sidemenu-image.png'
  }, [])

  return (
      <div
        className="w-64 h-[calc(100dvh-64px)] bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage: "url(/bg-sidemenu-image.png)",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      >
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
      
      <div className="relative z-10 h-full flex flex-col">
        {/* Profile Section */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center pt-5.5 pb-4.5">
          <div className="relative">
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user.name}
                className="w-20 h-20 bg-slate-400 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 flex items-center justify-center rounded-full text-white font-semibold text-xl"
              style={{ backgroundColor: user?.profileColor || "#30b5b2" }}>
                {getInitials(user?.name)}
              </div>
            )}
          </div>

          {user?.role === "admin" && (
            <div className="mt-4 text-[10px] font-medium text-white bg-indigo-500 px-3 py-0.5 rounded">
              Admin
            </div>
          )}

          <h5 className="text-gray-950 font-medium leading-6 mt-3">
            {user?.name || ""}
          </h5>
        </div>

        {/* Scrollable Menu Section */}
        <div className="flex-1 overflow-y-auto overscroll-contain touch-pan-y pb-5">
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
    </div>
  );
};

export default SideMenu;