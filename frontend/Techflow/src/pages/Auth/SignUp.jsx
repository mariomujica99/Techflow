import React, { useContext, useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/uploadImage';
import ProfileColorSelector from '../../components/Inputs/ProfileColorSelector';
import { formatPhoneNumber, isPhoneNumber } from '../../utils/phoneFormatter';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminInviteToken, setAdminInviteToken] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pagerNumber, setPagerNumber] = useState('');

  const [selectedColor, setSelectedColor] = useState('#30b5b2');

  const [error, setError] = useState(null);

  const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setProfilePic(null);
  };

  const handlePhoneChange = (value) => {
    const formatted = formatPhoneNumber(value);
    setPhoneNumber(formatted);
  };

  const handlePagerChange = (value) => {
    const formatted = formatPhoneNumber(value);
    setPagerNumber(formatted);
  };

  //Handle SignUp Form Submit
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = ''
    let profileColor = selectedColor || "#30b5b2";

    if (!fullName) {
      setError('Please enter your full name.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setError('');

    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
        profileColor = null;
      } else {
        profileImageUrl = null;
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        profileColor,
        adminInviteToken,
        phoneNumber,
        pagerNumber,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.")
      }
    }
  };

  return (
    <AuthLayout>
      <div className="w-full">
        <h2 className="text-lg font-medium text-black">Techflow</h2>
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join by entering your details below.
        </p>
        <div className="text-xs text-slate-700 mt-[5px] mb-6">
          <p>Choose to either upload your profile picture or edit your profile background color</p>
        </div>

        <form onSubmit={handleSignUp}>
          <div className="flex items-start justify-center gap-8 mb-6">
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
            
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
              label="Password"
              placeholder="Minimum of 8 characters"
              type="password"
            />

            <Input
              value={adminInviteToken}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              label="Admin Invite Token"
              placeholder="6 Digit Code"
              type="text"
            />

            <div>
              <div className="text-[13px] text-slate-800">Phone Number (Optional)</div>
              <div className="input-box">
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  placeholder="(123) 456-7890"
                  className="w-full bg-transparent outline-none"
                  value={phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  maxLength={14}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Can add or change at a later time</p>
            </div>

            <div>
              <div className="text-[13px] text-slate-800">Pager Number (Optional)</div>
              <div className="input-box">
                <input
                  type="tel"
                  name="pager"
                  autoComplete="tel-extension"
                  placeholder="(123) 456-7890"
                  className="w-full bg-transparent outline-none"
                  value={pagerNumber}
                  onChange={(e) => handlePagerChange(e.target.value)}
                  maxLength={14}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Can add or change at a later time</p>
            </div>
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">
            CREATE ACCOUNT
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp