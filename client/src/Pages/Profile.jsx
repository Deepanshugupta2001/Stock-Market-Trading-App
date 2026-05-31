import React from 'react'
import useAuth from '../context/authContext'
import { useNavigate } from 'react-router';

const Profile = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
  return (
    <div className="page-shell narrow-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Account</p>
          <h1>Profile</h1>
          <p className="page-subtitle">Your registered trading account details.</p>
        </div>
        <nav className="nav-actions">
          <button onClick={()=>navigate('/updateprofile')}>Update Profile</button>
          <button onClick={()=>navigate('/dashboard')}>Dashboard</button>
        </nav>
      </header>

      <section className="panel profile-card">
        <div className="stat-card">
          <span>Name</span>
          <strong>{user.name}</strong>
        </div>
        <div className="stat-card">
          <span>Mobile Number</span>
          <strong>{user.mobno}</strong>
        </div>
      </section>
    </div>
  )
}

export default Profile
