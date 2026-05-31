import React, { useEffect } from 'react'
import useStock from '../context/stockContext'

const Transcations = () => {
    const {transactions} = useStock();
    const {transaction} = useStock();

    async function loadTransaction() {
        const data = await transactions();
        return data;
    }

    useEffect(()=>{
    loadTransaction();
    },[]);

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Wallet history</p>
          <h1>Transactions</h1>
          <p className="page-subtitle">Review deposits, withdrawals, and balance changes.</p>
        </div>
      </header>
        <ol className="transaction-list">
        {transaction.map((d,index)=>{
            return <li key={index}>
              <p>Amount : {d.amount}</p>
              <p>Type: {d.type}</p>
              <p>Previous Balance : {d.previousbalance}</p>
              <p>Balance in Wallet : {d.balance}</p>
              <p>Date: {d.date}</p>
              </li>
        })}
        </ol>
    </div>
  )
}

export default Transcations
