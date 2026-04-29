// import React from 'react'
// import { useNavigate } from 'react-router'
// import useStock from '../context/stockContext';
// import ShowPortfolio from '../components/ShowPortfolio';
// import { useState } from 'react';
// import StockOptions from '../components/StockOptions';
// import ShowCharts from '../components/ShowCharts';

// const Portfolio = () => {

//   const navigate = useNavigate();
//   const [selectedStock , setSelectedStock] = useState(null);
//   const [showCharts,setShowCharts] = useState(false);

//   return (
//     <div>

//       <button onClick={()=>navigate('/dashboard')} >Dashboard</button>
//       Welcome to the Holdings Page

//       <ShowPortfolio onSelectStock = {(stock)=>{
//         setSelectedStock(stock);
//         setShowCharts(false);
//       }} />

//       {selectedStock && (< StockOptions 
//       symbol={selectedStock}
//       showCharts = {showCharts}
//       setShowCharts={setShowCharts}
//       />  )}


//       {
//         selectedStock && showCharts && (
//           <div style={{marginTop: "20px"}}>
//             <ShowCharts symbol={selectedStock}/>
//           </div>
//         )
//       } 
//     </div>
//   )
// }

// export default Portfolio

// import React, { useState } from 'react'
// import { useNavigate } from 'react-router'
// import useStock from '../context/stockContext';
// import ShowPortfolio from '../components/ShowPortfolio';
// import StockOptions from '../components/StockOptions';
// import ShowCharts from '../components/ShowCharts';

// const Portfolio = () => {
//   const navigate = useNavigate();
//   const [selectedStock, setSelectedStock] = useState(null);
//   const [showCharts, setShowCharts] = useState(false);

//   return (
//     <div className="portfolio-page">
//       <header className="portfolio-header">
//         <div>
//           <h1 className="portfolio-title">Welcome to your Holdings</h1>
//           <p className="portfolio-subtitle">Track your portfolio, explore stocks and view live charts.</p>
//         </div>
//         <button className="btn-dashboard" onClick={() => navigate('/dashboard')}>
//           Dashboard →
//         </button>
//       </header>

//       <section className="portfolio-card">
//         <ShowPortfolio onSelectStock={(stock) => {
//           setSelectedStock(stock);
//           setShowCharts(false);
//         }} />
//       </section>

//       {selectedStock && (
//         <section className="portfolio-card">
//           <StockOptions
//             symbol={selectedStock}
//             showCharts={showCharts}
//             setShowCharts={setShowCharts}
//           />
//         </section>
//       )}

//       {selectedStock && showCharts && (
//         <section className="portfolio-card portfolio-card--chart">
//           <ShowCharts symbol={selectedStock} />
//         </section>
//       )}
//     </div>
//   )
// }

// export default Portfolio

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
    <div style={{
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      background: "#f5f7fa",
      minHeight: "100vh"
    }}>

      <button 
        onClick={()=>navigate('/dashboard')}
        style={{
          padding: "8px 16px",
          borderRadius: "6px",
          border: "none",
          background: "#4CAF50",
          color: "#fff",
          cursor: "pointer",
          marginBottom: "15px"
        }}
      >
        ← Dashboard
      </button>

      <h2 style={{marginBottom: "20px"}}>📊 Your Holdings</h2>

      <ShowPortfolio 
        onSelectStock={(stock)=>{
          setSelectedStock(stock);
          setShowCharts(false);
        }} 
      />

      {selectedStock && (
        <StockOptions 
          symbol={selectedStock}
          showCharts={showCharts}
          setShowCharts={setShowCharts}
        />
      )}

      {selectedStock && showCharts && (
        <div style={{
          marginTop: "20px",
          padding: "15px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <ShowCharts symbol={selectedStock}/>
        </div>
      )}
    </div>
  )
}

export default Portfolio