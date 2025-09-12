import React, { useContext, useEffect, useState } from "react"
import DashboardLayout from "../../components/layouts/DashboardLayout"
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import Input from "../../components/Inputs/Input";
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/uploadImage';
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import ProfileColorSelector from "../../components/Inputs/ProfileColorSelector";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user, updateUser, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminInviteToken, setAdminInviteToken] = useState('');
  const [selectedColor, setSelectedColor] = useState('#30b5b2');
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  // Initialize form with current user data
  useEffect(() => {
    if (user) {
      setFullName(user.name || '');
      setEmail(user.email || '');
      setSelectedColor(user.profileColor || '#30b5b2');
    }
  }, [user]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    // Clear profile pic when selecting color
    setProfilePic(null);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!fullName) {
      setError('Please enter your full name.');
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      let profileImageUrl = user.profileImageUrl;

      // Handle image upload or color selection
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      } else if (selectedColor !== user.profileColor) {
        // User selected color, remove profile image
        profileImageUrl = null;
      }

      const updateData = {
        name: fullName,
        email,
        profileImageUrl,
        profileColor: profileImageUrl ? null : selectedColor,
        adminInviteToken: adminInviteToken || undefined,
      };

      if (password) {
        updateData.password = password;
      }

      const response = await axiosInstance.put(API_PATHS.AUTH.GET_PROFILE, updateData);

      updateUser(response.data);
      toast.success("Profile updated successfully");
      
      // Clear sensitive fields
      setPassword('');
      setAdminInviteToken('');
      setProfilePic(null);

    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axiosInstance.delete(API_PATHS.AUTH.GET_PROFILE);
      
      setOpenDeleteAlert(false);
      toast.success("Account deleted successfully");
      
      // Clear user data and redirect
      clearUser();
      localStorage.clear();
      navigate("/login");
      
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account. Please try again.");
    }
  };

  return (
    <DashboardLayout activeMenu="Edit Profile">
      <div className="mt-5 mb-10">
        <div className="flex items-center gap-3">
          <h2 className="text-xl md:text-xl font-medium text-gray-700">Edit Profile</h2>
        </div>

        <div className="form-card mt-4">
          <form onSubmit={handleUpdateProfile}>
            <div className="text-xs text-slate-700 mt-[5px] mb-6">
              <p>Choose to either upload your profile picture or edit your profile background color</p>
            </div>

            <div className="flex items-start justify-center gap-8 mb-6">
              {/* Upload image */}
              <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
              
              {/* Or Edit Background Color of Initials */}
              <div className="text-center">
                <ProfileColorSelector 
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                  onColorSelect={handleColorSelect}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={fullName}
                onChange={({ target }) => setFullName(target.value)}
                label="Full Name"
                placeholder="Enter your full name"
                type="text"
              />

              <Input
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                label="Email Address"
                placeholder="Enter your email"
                type="text"
              />

              <Input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="New Password (Optional)"
                placeholder="Leave blank to keep current password"
                type="password"
              />

              <Input
                value={adminInviteToken}
                onChange={({ target }) => setAdminInviteToken(target.value)}
                label="Admin Invite Token (Optional)"
                placeholder="Enter to upgrade to admin"
                type="text"
              />
            </div>

            {error && <p className="text-red-500 text-xs pb-2.5 mt-4">{error}</p>}

            <div className="flex items-center gap-3 mt-6">
              {/* Delete Account */}
              <button 
                type="button"
                className="w-full text-sm font-medium text-white bg-rose-400 shadow-lg shadow-rose-300/20 p-[10px] rounded-md hover:bg-rose-300 cursor-pointer"
                onClick={() => setOpenDeleteAlert(true)}
              >
                DELETE ACCOUNT
              </button>

              {/* Update Account */}
              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'UPDATING' : 'UPDATE PROFILE'}
              </button>
            </div>
          </form>
        </div>

        <Modal
          isOpen={openDeleteAlert}
          onClose={() => setOpenDeleteAlert(false)}
          title="Delete Account"
        >
          <DeleteAlert
            content="Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data."
            onDelete={handleDeleteAccount}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default EditProfile;