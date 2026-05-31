import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import ShowPortfolio from '../components/ShowPortfolio';
import StockOptions from '../components/StockOptions';
import ShowCharts from '../components/ShowCharts';

const Portfolio = () => {

  const navigate = useNavigate();
  const [selectedStock , setSelectedStock] = useState(null);
  const [showCharts,setShowCharts] = useState(false);

  return (
    <div className="page-shell portfolio-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Portfolio</p>
          <h1>Your Holdings</h1>
          <p className="page-subtitle">Track invested value, quantity, average price, and movement.</p>
        </div>
        <nav className="nav-actions">
          <button onClick={()=>navigate('/dashboard')}>Dashboard</button>
        </nav>
      </header>

      <section className="panel">
        <ShowPortfolio
          onSelectStock={(stock)=>{
            setSelectedStock(stock);
            setShowCharts(false);
          }}
        />
      </section>

      {selectedStock && (
        <section className="panel">
          <StockOptions
            symbol={selectedStock}
            showCharts={showCharts}
            setShowCharts={setShowCharts}
          />
        </section>
      )}

      {selectedStock && showCharts && (
        <section className="panel chart-panel">
          <ShowCharts symbol={selectedStock}/>
        </section>
      )}
    </div>
  )
}

export default Portfolio
