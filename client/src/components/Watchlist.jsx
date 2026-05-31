import React, { useState } from 'react'
import useStock from '../context/stockContext';

const Watchlist = ({ onSelectStock }) => {

  const {watchlist , stock ,removeStock , quantity , setQuantity , buyStock , sellStock} = useStock();
  const [activeStock,setActiveStock] = useState(null);
  const [sellStockState,setSellStockState] = useState(null);
  const [orderType,setOrderType] = useState("market");
  const [customPrice,setCustomPrice] = useState(0);
  const [mode,setMode] = useState("normal");

  const removeHandler = async (symbol)=>{
    await removeStock(symbol);
  }

  const getValidTill = (mode) =>{
    const now = new Date();
    if(mode === "GTT" ) now.setDate(now.getDate() + 30);
    else now.setDate(now.getDate() + 1);
    return now ;
  }

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
    <div className="stock-list">
      <h3>Your Watchlist</h3>

      {watchlist.length === 0 && <div className="empty-state">Search and add stocks to build your watchlist.</div>}

      {watchlist.map(symbol => {
        const priceData = stock.find(s => s && s.symbol && s.symbol.toUpperCase() === symbol.toUpperCase());

        return (
          <div
            key={symbol}
            onClick={() => onSelectStock && onSelectStock(symbol)}
            className="stock-row"
          >
            <div className="stock-row-main">
              <span><strong>{symbol.toUpperCase()}</strong></span>
              {priceData ? (
                <span>
                  Rs. {priceData.price}{" "}
                  <span className={priceData.change >= 0 ? "text-profit" : "text-loss"}>
                    {priceData.change >= 0 ? "+" : ""}{priceData.change?.toFixed(2)} ({priceData.percent?.toFixed(2)}%)
                  </span>
                </span>
              ) : (
                <span>Loading...</span>
              )}
            </div>

            <div className="button-row">
              <button onClick={(e)=>{ e.stopPropagation(); onSelectStock(symbol); }}>Show Chart</button>
              <button onClick={(e)=>{ e.stopPropagation(); buyHandler(symbol,"normal"); }}>Buy</button>
              <button onClick={(e)=>{ e.stopPropagation(); buyHandler(symbol,"GTT"); }}>Buy GTT</button>
              <button onClick={(e)=>{ e.stopPropagation(); sellHandler(symbol,"normal"); }}>Sell</button>
              <button onClick={(e)=>{ e.stopPropagation(); sellHandler(symbol,"GTT"); }}>Sell GTT</button>
              <button className="button-ghost" onClick={(e)=>{ e.stopPropagation(); removeHandler(symbol); }}>Remove</button>
            </div>

            {activeStock === symbol && (
              <form className="trade-form" onClick={(e)=>e.stopPropagation()} onSubmit={(e)=> buyFormHandler(e,symbol,priceData?.price)}>
                <h3>{mode == "GTT" ? "GTT Order" : "Normal Order"}</h3>
                <input onChange={(e)=>setQuantity(e.target.value)} type="number" value={quantity} placeholder='Enter your quantity to purchase'></input>
                <div className="radio-row">
                  <label><input type='radio' value="market" checked={orderType === "market"} onChange={()=>setOrderType("market")}/> Market Price</label>
                  <label><input type='radio' value="limit" checked={orderType === "limit"} onChange={()=>setOrderType("limit")}/> Limit Price</label>
                </div>
                {orderType === "limit" && (
                  <input type='number' value={customPrice} onChange={(e)=>setCustomPrice(e.target.value)} placeholder='Enter purchase price'></input>
                )}
                {orderType === "market" && priceData && <p>Buying at market price: Rs. {priceData.price}</p>}
                <button type='submit'>Buy</button>
              </form>
            )}

            {sellStockState === symbol && (
              <form className="trade-form" onClick={(e)=>e.stopPropagation()} onSubmit={(e)=> sellFormHandler(e,symbol,priceData?.price)}>
                <h3>{mode == "GTT" ? "GTT Order" : "Normal Order"}</h3>
                <input onChange={(e)=>setQuantity(e.target.value)} type="number" value={quantity} placeholder='Enter your quantity to sell'></input>
                <div className="radio-row">
                  <label><input type='radio' value="market" checked={orderType === "market"} onChange={()=>setOrderType("market")}/> Market Price</label>
                  <label><input type='radio' value="limit" checked={orderType === "limit"} onChange={()=>setOrderType("limit")}/> Limit Price</label>
                </div>
                {orderType === "limit" && (
                  <input type='number' value={customPrice} onChange={(e)=>setCustomPrice(e.target.value)} placeholder='Enter sell price'></input>
                )}
                {orderType === "market" && priceData && <p>Selling at market price: Rs. {priceData.price}</p>}
                <button type='submit'>Sell</button>
              </form>
            )}
          </div>
        );
      })}
    </div>
  )
}

export default Watchlist
