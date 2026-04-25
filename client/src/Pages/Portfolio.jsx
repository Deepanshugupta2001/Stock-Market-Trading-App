import React from 'react'
import { useNavigate } from 'react-router'
import useStock from '../context/stockContext';
import ShowPortfolio from '../components/ShowPortfolio';
import { useState } from 'react';
import StockOptions from '../components/StockOptions';

const Portfolio = () => {

  const navigate = useNavigate();
  const [selectedStock , setSelectedStock] = useState(null);

  return (
    <div>

      <button onClick={()=>navigate('/dashboard')} >Dashboard</button>
      Welcome to the Holdings Page
      <StockOptions symbol={selectedStock}/>

      <ShowPortfolio onSelectStock = {setSelectedStock} /> 
    </div>
  )
}

export default Portfolio