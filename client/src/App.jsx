import React from 'react'
import AuthContext, { AuthProvider } from './context/authContext'
import Signup from './Pages/Signup'
import useAuth from './context/authContext'
import Dashboard from './Pages/Dashboard'
import Login from './Pages/Login'
import { Navigate, Route, Routes } from "react-router";
import Profile from './Pages/Profile'
import UpdateProfile from './Pages/UpdateProfile'
import Wallet from './Pages/Wallet'
import AddMoney from './Pages/AddMoney'
import WithdrawMoney from './Pages/WithdrawMoney'
import Transcations from './Pages/Transcations'

const App = () => {
  const {isLoggedIn} = useAuth();
  return (
      <Routes>
        <Route path='/signup' element={
          !isLoggedIn ? <Signup/> : <Navigate to="/dashboard" />
        } />
        <Route
        path="/dashboard" element = {
          isLoggedIn ? <Dashboard/> : <Navigate to="/login" />
        }
        />
        <Route
        path="/login" element = {
          !isLoggedIn ? <Login/> : <Navigate to="/dashboard" />
        }
        />
        <Route path="*" element={<Navigate to="/signup"/>} />
        <Route path='/profile' element={<Profile/>} />
        <Route path='/updateprofile' element={<UpdateProfile/>} />
        <Route path='/wallet' element={<Wallet/>} />
        <Route path='/addmoney' element={<AddMoney/>} />
        <Route path='/withdrawmoney' element={<WithdrawMoney/>} />
        <Route path='/transactions' element={<Transcations/>} />
      </Routes>
  )
}

export default App 