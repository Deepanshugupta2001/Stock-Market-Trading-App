// import React, { useEffect, useState } from "react";
// import axios from "../api/axios"; 
// import useStock from "../context/stockContext";

// const StockDetails = ({ symbol }) => {

//   const [stock, setStock] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const {getPrice} = useStock();

//   useEffect(() => {
//   if (!symbol) return;

//   let cancelled = false;

//   const fetchStock = async () => {
//     try {
//       const data = await getPrice(symbol);

//       if (!cancelled) {
//         setStock(data);
//       }
//     } catch (err) {
//       setError("Failed to fetch stock");
//     }
//   };

//   fetchStock();

//   return () => {
//     cancelled = true;
//   };

// }, [symbol]);

//   if (!symbol) {
//     return <div>Select a stock to view details</div>;
//   }

//   if (loading) {
//     return <div>Loading stock data...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   if (!stock) return null;

//   return (
//     <div style={{ border: "1px solid #ccc", padding: "15px", marginTop: "20px" }}>

//       <h2>{stock.symbol}</h2>

//       <p>
//         <strong>Price:</strong> ₹{stock.price}
//       </p>

//       <p
//         style={{
//           color: stock.change >= 0 ? "green" : "red"
//         }}
//       >
//         <strong>Change:</strong> {stock.change}
//       </p>

//       <p
//         style={{
//           color: stock.percent >= 0 ? "green" : "red"
//         }}
//       >
//         <strong>Percent:</strong> {stock.percent?.toFixed(2)}%
//       </p>

//     </div>
//   );
// };

// export default StockDetails;

import React from "react";
import useStock from "../context/stockContext";

const StockDetails = ({ symbol }) => {

  const { stock } = useStock();

  const selectedStock = stock.find(s => s.symbol === symbol);

  if (!symbol) {
    return <div>Select a stock to view details</div>;
  }

  if (!selectedStock) {
    return <div>Loading stock data...</div>;
  }

  return (
    <div style={{ border: "1px solid #ccc", padding: "15px", marginTop: "20px" }}>

      <h2>{selectedStock.symbol}</h2>

      <p>
        <strong>Price:</strong> ₹{selectedStock.price}
      </p>

      <p
        style={{
          color: selectedStock.change >= 0 ? "green" : "red"
        }}
      >
        <strong>Change:</strong> {selectedStock.change}
      </p>

      <p
        style={{
          color: selectedStock.percent >= 0 ? "green" : "red"
        }}
      >
        <strong>Percent:</strong> {selectedStock.percent?.toFixed(2)}%
      </p>

    </div>
  );
};

export default StockDetails;