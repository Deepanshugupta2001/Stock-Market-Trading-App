import React from 'react'
import useAuth from '../context/authContext'
import { Navigate, Route, Routes, useNavigate } from 'react-router';
import Profile from './Profile';
import SearchStock from '../components/SearchStock';
import StockDetails from '../components/StockDetails';
import Watchlist from '../components/Watchlist';
import { useState } from 'react';
import useStock from '../context/stockContext';
import { useEffect } from 'react';
import ShowCharts from '../components/ShowCharts';

const Dashboard = () => {
  const {logout} = useAuth();
  const navigate = useNavigate();
  const {loadWatchlist} = useStock();
  
  const [selectedStock, setSelectedStock] = useState(null)


  return (
    <div>
        Welcome to Dashboard
        <button onClick={()=>navigate('/profile')}>Profile</button>
        <button onClick={()=>navigate('/portfolio')}>Portfolio</button>
        <button id='logout' onClick={()=> logout()}>Logout</button>
        <button onClick={()=>navigate('/wallet')}>Wallet</button>

      <SearchStock/>
      <StockDetails symbol={selectedStock} />
      {/* <StockDetails/> */}
      {/* <Watchlist onSelectStock={setSelectedStock} /> } */}

       {/* <Watchlist/> */}
      <Watchlist onSelectStock={setSelectedStock} />

      {
        selectedStock && (
          <div style={{marginTop: "20px"}}>
            <ShowCharts symbol={selectedStock}/>
          </div>
        )
      }

    </div>

  )
}

export default Dashboard 