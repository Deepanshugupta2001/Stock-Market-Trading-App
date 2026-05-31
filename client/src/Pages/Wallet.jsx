import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router';
import useStock from '../context/stockContext';

const Wallet = () => {
    const navigate =  useNavigate();
    const {wal} = useStock();
    
  return (
    <div className="page-shell narrow-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Funds</p>
          <h1>Wallet</h1>
          <p className="page-subtitle">Manage balance and review wallet activity.</p>
        </div>
        <nav className="nav-actions">
          <button onClick={()=>navigate('/dashboard')}>Dashboard</button>
        </nav>
      </header>

      <section className="wallet-balance">
        <span>Available Balance</span>
        <strong>Rs. {wal}</strong>
      </section>

      <section className="action-grid">
        <button onClick={()=>navigate('/addmoney')}>Add Money</button>
        <button onClick={()=>navigate('/withdrawmoney')}>Withdraw</button>
        <button onClick={()=>navigate('/transactions')}>Transactions</button>
      </section>
    </div>
  )
}

export default Wallet
