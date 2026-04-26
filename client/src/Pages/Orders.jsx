import React, { useState } from 'react'
import StockDetails from '../components/StockDetails'
import useStock from '../context/stockContext';
import OrderList from '../components/OrderList';
import SearchStockOrderList from '../components/SearchStockOrderList';
import { Navigate, useNavigate } from 'react-router';
import ShowCharts from '../components/ShowCharts';
const Orders = () => {

    const [selectedStock, setSelectedStock] = useState(null);
    const navigate = useNavigate();
    
  return (

    
    <div>
        <button onClick={()=>navigate('/dashboard')}>Dashboard</button>

     <SearchStockOrderList/>

    <StockDetails symbol={selectedStock} />

    <OrderList onSelectStock={setSelectedStock}/>

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

export default Orders