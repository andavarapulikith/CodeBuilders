import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../providers/authProvider';

const UserProfile = () => {
  const { authData } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  if(authData!=null)
  console.log(authData.user)

  useEffect(() => {
    if (authData && authData.user && authData.user._id) {
      // Fetch user details using user ID from authData
      axios.get(`http://localhost:5000/auth/profile/${authData.user._id}`)
        .then(response => {
          setUserData(response.data.user);
          console.log(response.data)
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [authData]);

  return (
    <div className="w-screen h-screen overflow-auto bg-gray-100 p-6">
      <div className="container mx-auto px-6 py-12">
        {userData ? (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Profile Image */}
            <div className="relative">
              <img className="w-full h-64 object-cover" src={userData.profileImage} alt="User Profile" />
              <div className="absolute bottom-0 right-0 mr-4 mb-4 bg-yellow-500 text-white rounded-full p-2">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            {/* User Information */}
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{userData.name}</h2>
              <p className="text-gray-600 mb-4">{userData.email}</p>
              {/* Statistics */}
              <div className="flex justify-between text-gray-600 mb-4">
                <div>
                  <p className="font-semibold">Problems Solved</p>
                  <p>{userData.problemsSolved}</p>
                </div>
                <div>
                  <p className="font-semibold">Total Score</p>
                  <p>{userData.totalScore}</p>
                </div>
              </div>
              {/* Edit Profile Button */}
              <div className="mt-6">
                <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
