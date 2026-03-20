import React from 'react'
import useAuth from '../context/authContext'
import { useNavigate } from 'react-router';

const Profile = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
  return (
    <div>
      Welcome to Profile <br/>

      Name : {user.name} <br/>
      Mobile Number : {user.mobno}

      <button onClick={()=>navigate('/updateprofile')}>Update Profile</button>
      <button onClick={()=>navigate('/dashboard')}>Dashboard</button>
    </div>
  )
}

export default Profile