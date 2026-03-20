import React from 'react'
import { useState } from 'react'
import { stockApi } from '../api/stockApi';
import useStock from '../context/stockContext';

const SearchStock = ({reload}) => {
    const [symbol, setSymbol] = useState("");
    const {addStock} = useStock();

    const addstock = async (e)=>{
        e.preventDefault();
        const data = await addStock(symbol);
        setSymbol("");
    }
  return (
    <div>
      <form onSubmit={addstock}>
        <input onChange={(e)=>setSymbol(e.target.value)} value={symbol} placeholder='Enter Stock Name'></input>

        <button type='submit'>Add Stock</button>
      </form>
    </div>
  )
}

export default SearchStock