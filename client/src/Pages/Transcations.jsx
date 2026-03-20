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
    <div>
      Welcome to the Transactions Page
        <ol>
        {transaction.map((d,index)=>{
            return <li key={index}>
              <p>Amount : {d.amount}</p>
              <p>Type: {d.type}</p>
              <p>Previous Balance : {d.previousbalance}</p>
              <p>Balance in Wallet :{d.balance}</p>
              <p>Date: {d.date}</p>
              </li>
        })}
        </ol>
    </div>
  )
}

export default Transcations