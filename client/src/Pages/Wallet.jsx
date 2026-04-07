import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router';
import useStock from '../context/stockContext';

const Wallet = () => {
    const navigate =  useNavigate();
    const {wal} = useStock();
    
  return (
    <div>
      Welcome to Wallet
<br/>
        <br/><br/>
        <br/>
      Wallet : Rs. {wal}
    <br/>
        <br/>
        <br/>
      Wanna Add Money To Wallet ? 
      <button onClick={()=>navigate('/addmoney')}>Add</button>
        <br/>
        <br/>
        <br/>
      Need Money ? Withdraw it .
      <button onClick={()=>navigate('/withdrawmoney')}>Withdraw</button>
      <br/>
        <br/>
        <br/>
      Want to See Transcations ? Here you go 
      <button onClick={()=>navigate('/transactions')}>Transactions</button>
    <br/>
    <br/>
      Go Back To Dashboard 
      <button onClick={()=>navigate('/dashboard')}>Dashboard</button>

    </div>
  )
}

export default Wallet