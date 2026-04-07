import React, { useState } from 'react'
import StockDetails from '../components/StockDetails'
import useStock from '../context/stockContext';
import OrderList from '../components/OrderList';
import SearchStockOrderList from '../components/SearchStockOrderList';

const Orders = () => {

    const [selectedStock, setSelectedStock] = useState(null);
    
  return (
    <div>
     <SearchStockOrderList/>

    <StockDetails symbol={selectedStock} />

    <OrderList onSelectStock={setSelectedStock}/>

    
    
    </div>
  )
}

export default Orders