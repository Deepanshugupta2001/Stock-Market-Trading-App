import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { stockApi } from '../api/stockApi';
import useStock from '../context/stockContext';

const Watchlist = ({ onSelectStock }) => {

  const {watchlist , stock } = useStock();

  return (
     <div>
    <h3>Your Watchlist</h3>

    {watchlist.map(symbol => {

      const priceData = stock.find(s => s && s.symbol && s.symbol.toUpperCase() === symbol.toUpperCase());

      return (
        <div 
          key={symbol} 
          onClick={() => onSelectStock && onSelectStock(symbol)}
          style={{cursor: "pointer", padding: "8px", borderBottom: "1px solid #ccc", display: "flex", justifyContent: "space-between", alignItems: "center"}}
        >
          <span><strong>{symbol.toUpperCase()}</strong></span>
          {priceData ? (
            <span>
              ₹{priceData.price}{" "}
              <span style={{ color: priceData.change >= 0 ? "green" : "red" }}>
                {priceData.change >= 0 ? "+" : ""}{priceData.change?.toFixed(2)}{" "}
                ({priceData.percent?.toFixed(2)}%)
              </span>
            </span>
          ) : (
            <span>Loading...</span>
          )}
        </div>
      );

    })}
  </div>
  )
}

export default Watchlist