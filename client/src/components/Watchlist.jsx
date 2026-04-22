import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { stockApi } from '../api/stockApi';
import useStock from '../context/stockContext';

const Watchlist = ({ onSelectStock }) => {

  const {watchlist , stock ,removeStock , showChart, setStock,quantity , setQuantity , buyStock , sellStock} = useStock();
  // let hua = false;
  const [activeStock,setActiveStock] = useState(null);
  const [sellStockState,setSellStockState] = useState(null);
  const [orderType,setOrderType] = useState("market");
  const [customPrice,setCustomPrice] = useState(0);
  const [purpose,setPurpose] = useState("Buy");
  const [mode,setMode] = useState("normal");
  
  const removeHandler = async (symbol)=>{
    const data = await removeStock(symbol);
  }
  
  const getValidTill = (mode) =>{
          const now = new Date();

          if(mode === "GTT" ) now.setDate(now.getDate() + 30);

          else now.setDate(now.getDate() + 1);

          return now ;
  }
  // const showCharts = async (symbol)=>{
  //   const data = await showChart(symbol);
  // }
  const buyHandler = async (symbol,type="normal")=>{
    setActiveStock(symbol); 
    setMode(type);

  }

  const buyFormHandler = async (e,symbol,price) =>{
    e.preventDefault();
    let buyPrice;
    console.log("Mera Frontend par price hai : ",price);
    console.log("My custom price is: ",customPrice);
    setPurpose("Buy");
    // buyPrice = orderType === "market" ? buyPrice : customPrice;
    if(customPrice!== 0) {
      buyPrice = customPrice;
      // orderType = 'limit';
      setOrderType('limit');
    }

    else {
      buyPrice = price;
      // orderType = 'market';
      setOrderType('market');
    }
    const validTill = getValidTill(mode);

    console.log("Mera orderType is :",orderType);
    console.log("Mera buyPrice hai abhi : ",buyPrice);
    const data = await buyStock(symbol,buyPrice,quantity,orderType,purpose);
    setActiveStock(null); 
    setQuantity(0);
    setCustomPrice(0);
    setOrderType("market");
  }

  const sellHandler = async (symbol,type="normal") =>{
    setSellStockState(symbol);
  }

  const sellFormHandler = async (e,symbol,price) =>{
    e.preventDefault();
    let sellPrice ;
    if(customPrice!== 0 ) {
      sellPrice = customPrice;
      // orderType = 'limit';
      setOrderType('limit');
    }
    else {
      sellPrice = price;
      // orderType = 'market';
      setOrderType('market');
    }
    const validTill = getValidTill(mode);

    setPurpose("Sell");
    const data = await sellStock(symbol, sellPrice , quantity , orderType,purpose);
    setSellStockState(null);
    setQuantity(0);
    setCustomPrice(0);
    setOrderType("market");
  }
  return (
    // <div>

    //   <h3>Your Watchlist</h3>
    //   {Array.isArray(stock) && stock.map((symbol) => 

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

      // const priceData = stock.find(s => s.symbol === symbol);
      const priceData = stock.find(s => s && s.symbol && s.symbol.toUpperCase() === symbol.toUpperCase());

      return (
        // <div key={symbol}>
        //   {symbol} : {priceData?.price ?? "Loading..."}
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
          <button onClick={(e)=>{
            e.stopPropagation();
            onSelectStock(symbol);
          }}>Show Chart</button>

          <button onClick={()=>buyHandler(symbol,"normal")}>Buy</button>
          <button onClick={()=>buyHandler(symbol,"GTT")}>Buy GTT</button>
          {activeStock === symbol && ( 
            <form onSubmit={(e)=> buyFormHandler(e,symbol,priceData?.price)}>
              <p>{mode == "GTT" ? "GTT Order " : "Normal Order"}</p>
              <p>Quantity :</p>
              <input onChange={(e)=>setQuantity(e.target.value)} type="number" value={quantity} placeholder='Enter your quantity to purchase'></input>
              <div>
                <label><input type='radio' value="market" checked={orderType === "market"} onChange={()=>setOrderType("market")}/>Market Price </label>
                <label><input type='radio' value="limit" checked={orderType === "limit"} onChange={()=>setOrderType("limit")}/>Enter Price At which you want to Purchase</label>
              </div>

              {orderType === "limit" && (
                <input type='number' value={customPrice} onChange={(e)=>setCustomPrice(e.target.value)} placeholder='Enter your price at which you want to purchase'></input>
              )}

              {orderType === "market" && priceData && (
                <p>Buying at market price: Rs. {priceData.price}</p>
              )}

              <button type='submit'>Buy</button>
            </form>
          )}


          <button onClick={()=>sellHandler(symbol)}>Sell</button>
          <button onClick={()=>sellHandler(symbol,"GTT")}>Sell GTT</button>
          {sellStockState === symbol && ( 
            <form onSubmit={(e)=> sellFormHandler(e,symbol,priceData?.price)}>
              <p>{mode == "GTT" ? "GTT Order " : "Normal Order"}</p>
              <p>Quantity :</p>
              <input onChange={(e)=>setQuantity(e.target.value)} type="number" value={quantity} placeholder='Enter your quantity to sell'></input>
              <div>
                <label><input type='radio' value="market" checked={orderType === "market"} onChange={()=>setOrderType("market")}/>Market Price </label>
                <label><input type='radio' value="limit" checked={orderType === "limit"} onChange={()=>setOrderType("limit")}/>Enter Price At which you want to Sell</label>
              </div>

              {orderType === "limit" && (
                <input type='number' value={customPrice} onChange={(e)=>setCustomPrice(e.target.value)} placeholder='Enter your price at which you want to sell'></input>
              )}

              {orderType === "market" && priceData && (
                <p>Selling at market price: Rs. {priceData.price}</p>
              )}

              <button type='submit'>Sell</button>
            </form>
          )}
          <button onClick={()=> removeHandler(symbol)}>Remove</button>
        </div>

      );

    })}
  </div>
  )
}

export default Watchlist