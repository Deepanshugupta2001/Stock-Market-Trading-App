import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { stockApi } from '../api/stockApi';
import useStock from '../context/stockContext';

const Watchlist = ({ onSelectStock }) => {

  const {watchlist , stock } = useStock();

  return (
    // <div>

    //   <h3>Your Watchlist</h3>

    //   {Array.isArray(stock) && stock.map((symbol) => (

    //     <div
    //       key={symbol}
    //       onClick={() => onSelectStock(symbol)}
    //       style={{cursor:"pointer"}}
    //     >
    //       {symbol}
    //     </div>

    //   ))}

    // </div>
//     <div>
//     <h3>Your Watchlist</h3>

//     {watchlist.map(symbol => {

//       const priceData = stock.find(s => s.symbol === symbol);

//       return (
//         <div key={symbol}>
//           {symbol} : {priceData ? `₹${priceData.price}` : "Loading..."}
//         </div>
//       );

//     })}

//   </div>
     <div>
    <h3>Your Watchlist</h3>

    {watchlist.map(symbol => {

      const priceData = stock.find(s => s.symbol === symbol);

      return (
        <div key={symbol}>
          {symbol} : {priceData?.price ?? "Loading..."}
        </div>
      );

    })}
  </div>
  )
}

export default Watchlist