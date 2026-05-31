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
    <div className="page-shell dashboard-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Stock Market Trading Platform</p>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Search stocks, manage your watchlist, and open charts from one screen.</p>
        </div>
        <nav className="nav-actions" aria-label="Dashboard navigation">
          <button onClick={()=>navigate('/profile')}>Profile</button>
          <button onClick={()=>navigate('/portfolio')}>Portfolio</button>
          <button onClick={()=>navigate('/wallet')}>Wallet</button>
          <button onClick={()=>navigate('/orders')}>Orders</button>
          <button className="button-danger" id='logout' onClick={()=> logout()}>Logout</button>
        </nav>
      </header>

      <section className="panel">
        <SearchStock/>
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <StockDetails symbol={selectedStock} />
        </div>
        <div className="panel panel-strong">
          <Watchlist onSelectStock={setSelectedStock} />
        </div>
      </section>

      {selectedStock && (
        <section className="panel chart-panel">
          <ShowCharts symbol={selectedStock}/>
        </section>
      )}
    </div>
  )
}

export default Dashboard 
