import React from 'react'
import { useNavigate } from 'react-router'
import useStock from '../context/stockContext';
import ShowPortfolio from '../components/ShowPortfolio';
import { useState } from 'react';
import StockOptions from '../components/StockOptions';
import ShowCharts from '../components/ShowCharts';

const Portfolio = () => {

  const navigate = useNavigate();
  const [selectedStock , setSelectedStock] = useState(null);
  const [showCharts,setShowCharts] = useState(false);

  return (
    <div>

      <button onClick={()=>navigate('/dashboard')} >Dashboard</button>
      Welcome to the Holdings Page

      <ShowPortfolio onSelectStock = {(stock)=>{
        setSelectedStock(stock);
        setShowCharts(false);
      }} />

      {selectedStock && (< StockOptions 
      symbol={selectedStock}
      showCharts = {showCharts}
      setShowCharts={setShowCharts}
      />  )}


      {
        selectedStock && showCharts && (
          <div style={{marginTop: "20px"}}>
            <ShowCharts symbol={selectedStock}/>
          </div>
        )
      } 
    </div>
  )
}

export default Portfolio