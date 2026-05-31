import React, { useState } from 'react'
import useStock from '../context/stockContext';

const StockOptions = ({symbol , showCharts , setShowCharts}) => {

    const { stock ,buyStock , sellStock , quantity , setQuantity } = useStock();
    const [activeStock,setActiveStock] = useState(null);
    const [sellStockState,setSellStockState] = useState(null);
    const [orderType,setOrderType] = useState("market");
    const [customPrice,setCustomPrice] = useState(0);
    const [mode,setMode] = useState("normal");

    const selectedStock = stock.find(s => s && s.symbol && symbol && s.symbol.toUpperCase() === symbol.toUpperCase());

    const getValidTill = (mode) =>{
          const now = new Date();
          if(mode === "GTT" ) now.setDate(now.getDate() + 30);
          else now.setDate(now.getDate() + 1);
          return now ;
    }

    if (!symbol) return <div className="empty-state">Select a stock to view details</div>;
    if (!selectedStock) return <div className="empty-state">Loading stock data...</div>;

  const buyHandler = async (symbol,type="normal")=>{
    setActiveStock(symbol);
    setMode(type);
  }

  const buyFormHandler = async (e,symbol,price) =>{
    e.preventDefault();
    const buyPrice = customPrice !== 0 ? customPrice : price;
    const purpose = "Buy";
    const validTill = getValidTill(mode);
    await buyStock(symbol,buyPrice,quantity,orderType,purpose,validTill);

    setActiveStock(null);
    setQuantity(0);
    setCustomPrice(0);
    setOrderType("market");
  }

  const sellHandler = async (symbol,type="normal") =>{
    setSellStockState(symbol);
    setMode(type);
  }

  const sellFormHandler = async (e,symbol,price) =>{
    e.preventDefault();
    const sellPrice = customPrice !== 0 ? customPrice : price;
    const validTill = getValidTill(mode);
    const purpose = "Sell";
    await sellStock(symbol, sellPrice , quantity , orderType,purpose,validTill);

    setSellStockState(null);
    setQuantity(0);
    setCustomPrice(0);
    setOrderType("market");
  }

  return (
    <div className="stock-options">
      <div className="stock-options-header">
        <div>
          <h2>{selectedStock.symbol}</h2>
          <p>Rs. {selectedStock.price}</p>
        </div>
        <div>
          <span className={selectedStock.change >= 0 ? "text-profit" : "text-loss"}>
            {selectedStock.change}
          </span>
          <span className={selectedStock.percent >= 0 ? "text-profit" : "text-loss"}>
            {selectedStock.percent?.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="button-row">
        <button onClick={()=>setShowCharts(prev=> !prev)}>{showCharts ? "Hide Chart" : "Show Chart"}</button>
        <button onClick={()=>buyHandler(symbol,"normal")}>Buy</button>
        <button onClick={()=>buyHandler(symbol,"GTT")}>Buy GTT</button>
        <button onClick={()=>sellHandler(symbol,"normal")}>Sell</button>
        <button onClick={()=>sellHandler(symbol,"GTT")}>Sell GTT</button>
      </div>

      {activeStock === symbol && (
        <form className="trade-form" onSubmit={(e)=> buyFormHandler(e,symbol,selectedStock?.price)}>
          <h3>{mode == "GTT" ? "GTT Order" : "Normal Order"}</h3>
          <input
            type="number"
            value={quantity}
            onChange={(e)=>setQuantity(e.target.value)}
            placeholder='Quantity'
          />
          <div className="radio-row">
            <label>
              <input type='radio' value="market" checked={orderType === "market"} onChange={()=>setOrderType("market")}/> Market
            </label>
            <label>
              <input type='radio' value="limit" checked={orderType === "limit"} onChange={()=>setOrderType("limit")}/> Limit
            </label>
          </div>
          {orderType === "limit" && (
            <input
              type='number'
              value={customPrice}
              onChange={(e)=>setCustomPrice(e.target.value)}
              placeholder='Enter price'
            />
          )}
          <button type='submit'>Confirm Buy</button>
        </form>
      )}

      {sellStockState === symbol && (
        <form className="trade-form" onSubmit={(e)=> sellFormHandler(e,symbol,selectedStock?.price)}>
          <h3>{mode == "GTT" ? "GTT Order" : "Normal Order"}</h3>
          <input
            type="number"
            value={quantity}
            onChange={(e)=>setQuantity(e.target.value)}
            placeholder='Quantity'
          />
          <button type='submit'>Confirm Sell</button>
        </form>
      )}
    </div>
  )
}

export default StockOptions
