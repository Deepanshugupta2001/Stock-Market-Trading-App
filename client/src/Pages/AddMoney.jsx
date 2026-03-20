import React from 'react'
import { useNavigate } from 'react-router'
import useStock from '../context/stockContext';
import { useState } from 'react';

const AddMoney = () => {
    const navigate =  useNavigate();
    const {wal} = useStock();
    const [amt,setAmt] = useState(0);
    const {addmoney} = useStock();

    const addingSubmitHandler = async(e)=>{
        e.preventDefault();
        // wal = wal+amt ;
        await addmoney(amt);
        navigate('/wallet');
    }
  return (
    <div>
      Welcome to Add Money Page 

      <form onSubmit={addingSubmitHandler}>
        <input onChange={(e)=>setAmt(Number(e.target.value))} value = {amt} type='number' placeholder='Enter Amount you want to add in your wallet'></input>
        <button type='submit'>Add Money</button>
      </form>
    </div>
  )
}

export default AddMoney