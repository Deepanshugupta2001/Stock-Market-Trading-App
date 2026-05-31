import React from "react";
import useStock from "../context/stockContext";

const StockDetails = ({ symbol }) => {

  const { stock } = useStock();
  const selectedStock = stock.find(s => s && s.symbol && symbol && s.symbol.toUpperCase() === symbol.toUpperCase());

  if (!symbol) {
    return <div className="empty-state">Select a stock to view details</div>;
  }

  if (!selectedStock) {
    return <div className="empty-state">Loading stock data...</div>;
  }

  return (
    <div className="stock-details">
      <h2>{selectedStock.symbol}</h2>

      <p>
        <strong>Price:</strong> Rs. {selectedStock.price}
      </p>

      <p className={selectedStock.change >= 0 ? "text-profit" : "text-loss"}>
        <strong>Change:</strong> {selectedStock.change}
      </p>

      <p className={selectedStock.percent >= 0 ? "text-profit" : "text-loss"}>
        <strong>Percent:</strong> {selectedStock.percent?.toFixed(2)}%
      </p>
    </div>
  );
};

export default StockDetails;
