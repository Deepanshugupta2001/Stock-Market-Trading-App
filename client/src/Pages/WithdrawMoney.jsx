import React from 'react'
import { useNavigate } from 'react-router';
import useStock from '../context/stockContext';
import { useState } from 'react';

const WithdrawMoney = () => {
        const [amt,setAmt] = useState(0);
    const navigate = useNavigate();
    const {withdrawMoney} = useStock();

    const withdrawSubmitHandler = async(e)=>{
        e.preventDefault();
        await withdrawMoney(amt);
        navigate('/wallet');
    }
  return (
    <div className="page-shell narrow-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Wallet</p>
          <h1>Withdraw Money</h1>
          <p className="page-subtitle">Move money out of your trading wallet.</p>
        </div>
      </header>

      <form className="panel form-panel" onSubmit={withdrawSubmitHandler}>
        <input onChange={(e)=>setAmt(Number(e.target.value))} type='number' value={amt} placeholder='Enter Amount You want to Withdraw'></input>
        <button type='submit'>Withdraw Money</button>
      </form> 
      
    </div>
  )
}

export default WithdrawMoney
