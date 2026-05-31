import React, { useState } from 'react'
import StockDetails from '../components/StockDetails'
import OrderList from '../components/OrderList';
import SearchStockOrderList from '../components/SearchStockOrderList';
import { useNavigate } from 'react-router';
import ShowCharts from '../components/ShowCharts';
const Orders = () => {

    const [selectedStock, setSelectedStock] = useState(null);
    const navigate = useNavigate();
    
  return (

    
    <div className="page-shell orders-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Orders</p>
          <h1>Order Book</h1>
          <p className="page-subtitle">Place orders, inspect status, and open price charts.</p>
        </div>
        <nav className="nav-actions">
          <button onClick={()=>navigate('/dashboard')}>Dashboard</button>
        </nav>
      </header>

     <section className="panel">
       <SearchStockOrderList/>
     </section>

    <section className="dashboard-grid">
      <div className="panel">
        <StockDetails symbol={selectedStock} />
      </div>

      <div className="panel panel-strong">
        <OrderList onSelectStock={setSelectedStock}/>
      </div>
    </section>

    {
        selectedStock && (
          <section className="panel chart-panel">
            <ShowCharts symbol={selectedStock}/>
          </section>
        )
      }

    </div>
  )
}

export default Orders
