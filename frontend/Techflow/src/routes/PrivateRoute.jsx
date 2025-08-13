import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

const PrivateRoute = ({allowedRoles}) => {
  return <Outlet />
}

export default PrivateRoute