import React, { useState } from 'react'
import StockDetails from '../components/StockDetails'
import useStock from '../context/stockContext';
import OrderList from '../components/OrderList';
import SearchStockOrderList from '../components/SearchStockOrderList';
import { Navigate, useNavigate } from 'react-router';
const Orders = () => {

    const [selectedStock, setSelectedStock] = useState(null);
    const navigate = useNavigate();
    
  return (

    
    <div>
        <button onClick={()=>navigate('/dashboard')}>Dashboard</button>

     <SearchStockOrderList/>

    <StockDetails symbol={selectedStock} />

    <OrderList onSelectStock={setSelectedStock}/>

    
    
    
    </div>
  )
}

export default Orders