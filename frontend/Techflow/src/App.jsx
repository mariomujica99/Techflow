import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate
} from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import ManageTasks from './pages/Admin/ManageTasks';
import CreateTask from './pages/Admin/CreateTask';
import ManageUsers from './pages/Admin/ManageUsers';
import Providers from './pages/Admin/Providers';
import EditProfile from './pages/Admin/EditProfile';

import AllTasks from './pages/Admin/AllTasks';
import ComStations from './pages/Admin/ComStations';

import UserDashboard from './pages/User/UserDashboard';
import MyTasks from './pages/User/MyTasks';
import ViewTaskDetails from './pages/User/ViewTaskDetails';
import ViewUsers from './pages/User/ViewUsers';

import PrivateRoute from './routes/PrivateRoute';
import UserProvider, { UserContext } from './context/userContext';
import { Toaster } from 'react-hot-toast';
import LabWhiteboard from './pages/Admin/LabWhiteboard';

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/lab-whiteboard" element={<LabWhiteboard />} />
              <Route path="/admin/all-tasks" element={<AllTasks />} />
              <Route path="/admin/tasks" element={<MyTasks />} />
              <Route path="/admin/manage-tasks" element={<ManageTasks />} />
              <Route path="/admin/create-task" element={<CreateTask />} />              
              <Route path="/admin/task-details/:id" element={<ViewTaskDetails />} />              
              <Route path="/admin/com-stations" element={<ComStations />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/providers" element={<Providers />} />
              <Route path="/admin/edit-profile" element={<EditProfile />} />
            </Route>

            {/* User Routes */}
            <Route element={<PrivateRoute allowedRoles={["user"]} />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/lab-whiteboard" element={<LabWhiteboard />} />
              <Route path="/user/all-tasks" element={<AllTasks />} />
              <Route path="/user/tasks" element={<MyTasks />} />
              <Route path="/user/manage-tasks" element={<ManageTasks />} />
              <Route path="/user/create-task" element={<CreateTask />} />    
              <Route path="/user/task-details/:id" element={<ViewTaskDetails />} />              
              <Route path="/user/com-stations" element={<ComStations />} />
              <Route path="/user/users" element={<ViewUsers />} />
              <Route path="/user/providers" element={<Providers />} />
              <Route path="/user/edit-profile" element={<EditProfile />} />
            </Route>

            {/* Default Route */}
            <Route path="/" element={<Root />} />
          </Routes>
        </Router>
      </div>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </UserProvider>
  )
}

export default App

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if(loading) return <Outlet />

  if (!user) {
    return <Navigate to="/login" />;
  }

  return user.role === "admin" ? <Navigate to="/admin/dashboard" /> : <Navigate to="/user/dashboard" />;
};