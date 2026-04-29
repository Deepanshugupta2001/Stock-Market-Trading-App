// import React from 'react'
// import useStock from '../context/stockContext';
// import { useState } from 'react';

// const StockOptions = ({symbol , showCharts , setShowCharts}) => {

//     const { stock ,buyStock , sellStock , quantity , setQuantity ,showChart} = useStock();
//     const [activeStock,setActiveStock] = useState(null);
//     const [sellStockState,setSellStockState] = useState(null);
//     const [orderType,setOrderType] = useState("market");
//     const [customPrice,setCustomPrice] = useState(0);
//     const [mode,setMode] = useState("normal");
    
//     const selectedStock = stock.find(s => s && s.symbol && symbol && s.symbol.toUpperCase() === symbol.toUpperCase());
    
//     const getValidTill = (mode) =>{
//           const now = new Date();

//           if(mode === "GTT" ) now.setDate(now.getDate() + 30);

//           else now.setDate(now.getDate() + 1);

//           return now ;
//     }

//     if (!symbol) {
//         return <div>Select a stock to view details</div>;
//     }

//     if (!selectedStock) {
//         return <div>Loading stock data...</div>;
//     }
//     const buyHandler = async (symbol,type="normal")=>{
//     setActiveStock(symbol); 
//     setMode(type);
//   }

//   const buyFormHandler = async (e,symbol,price) =>{
//     e.preventDefault();
//     let buyPrice;
//     console.log("Mera Frontend par price hai : ",price);
//     console.log("My custom price is: ",customPrice);
//     // setPurpose("Buy");
//     const purpose = "Buy";
//     // buyPrice = orderType === "market" ? buyPrice : customPrice;
//     if(customPrice!== 0) {
//       buyPrice = customPrice;
//       // orderType = 'limit';
//       setOrderType('limit');
//     }
//     else {
//       buyPrice = price;
//       // orderType = 'market';
//       setOrderType('market');
//     }
//     const validTill = getValidTill(mode);

//     console.log("Mera orderType is :",orderType);
//     console.log("Mera buyPrice hai abhi : ",buyPrice);
//     console.log("Mera validTill is :",validTill);
//     const data = await buyStock(symbol,buyPrice,quantity,orderType,purpose,validTill);
//     setActiveStock(null); 
//     setQuantity(0);
//     setCustomPrice(0);
//     setOrderType("market");
//   }

//   const sellHandler = async (symbol,type="normal") =>{
//     setSellStockState(symbol);
//   }

//   const sellFormHandler = async (e,symbol,price) =>{
//     e.preventDefault();
//     let sellPrice ;
//     if(customPrice!== 0 ) {
//       sellPrice = customPrice;
//       // orderType = 'limit';
//       setOrderType('limit');
//     }
//     else {
//       sellPrice = price;
//       // orderType = 'market';
//       setOrderType('market');
//     }
//     const validTill = getValidTill(mode);
//     const purpose = "Sell";
//     // setPurpose("Sell");

//     console.log("My purpose is :",purpose);
//     const data = await sellStock(symbol, sellPrice , quantity , orderType,purpose,validTill);
//     setSellStockState(null);
//     setQuantity(0);
//     setCustomPrice(0);
//     setOrderType("market");
//   }
//   return (
//     <div style={{ border: "1px solid #ccc", padding: "15px", marginTop: "20px" }}>
//       <h2>{selectedStock.symbol}</h2>

//       <p>
//         <strong>Price:</strong> ₹{selectedStock.price}
//       </p>

//       <p
//         style={{
//           color: selectedStock.change >= 0 ? "green" : "red"
//         }}
//       >
//         <strong>Change:</strong> {selectedStock.change}
//       </p>

//       <p
//         style={{
//           color: selectedStock.percent >= 0 ? "green" : "red"
//         }}
//       >
//         <strong>Percent:</strong> {selectedStock.percent?.toFixed(2)}%
//       </p>
//         <button onClick={()=>setShowCharts(prev=> !prev)}>{showCharts ? "Hide Chart" : "Show Chart"}</button>

//       <button onClick={()=>buyHandler(symbol,"normal")}>Buy</button>
//         <button onClick={()=>buyHandler(symbol,"GTT")}>Buy GTT</button>
//           {activeStock === symbol && ( 
//             <form onSubmit={(e)=> buyFormHandler(e,symbol,selectedStock?.price)}>
//               <p>{mode == "GTT" ? "GTT Order " : "Normal Order"}</p>
//               <p>Quantity :</p>
//               <input onChange={(e)=>setQuantity(e.target.value)} type="number" value={quantity} placeholder='Enter your quantity to purchase'></input>
//               <div>
//                 <label><input type='radio' value="market" checked={orderType === "market"} onChange={()=>setOrderType("market")}/>Market Price </label>
//                 <label><input type='radio' value="limit" checked={orderType === "limit"} onChange={()=>setOrderType("limit")}/>Enter Price At which you want to Purchase</label>
//               </div>

//               {orderType === "limit" && (
//                 <input type='number' value={customPrice} onChange={(e)=>setCustomPrice(e.target.value)} placeholder='Enter your price at which you want to purchase'></input>
//               )}

//               {orderType === "market" && selectedStock && (
//                 <p>Buying at market price: Rs. {selectedStock.price}</p>
//               )}

//               <button type='submit'>Buy</button>
//             </form>
//           )}


//           <button onClick={()=>sellHandler(symbol,"normal")}>Sell</button>
//           <button onClick={()=>sellHandler(symbol,"GTT")}>Sell GTT</button>
//           {sellStockState === symbol && ( 
//             <form onSubmit={(e)=> sellFormHandler(e,symbol,selectedStock?.price)}>
//               <p>{mode == "GTT" ? "GTT Order " : "Normal Order"}</p>
//               <p>Quantity :</p>
//               <input onChange={(e)=>setQuantity(e.target.value)} type="number" value={quantity} placeholder='Enter your quantity to sell'></input>
//               <div>
//                 <label><input type='radio' value="market" checked={orderType === "market"} onChange={()=>setOrderType("market")}/>Market Price </label>
//                 <label><input type='radio' value="limit" checked={orderType === "limit"} onChange={()=>setOrderType("limit")}/>Enter Price At which you want to Sell</label>
//               </div>

//               {orderType === "limit" && (
//                 <input type='number' value={customPrice} onChange={(e)=>setCustomPrice(e.target.value)} placeholder='Enter your price at which you want to sell'></input>
//               )}

//               {orderType === "market" && selectedStock && (
//                 <p>Selling at market price: Rs. {selectedStock.price}</p>
//               )}

//               <button type='submit'>Sell</button>
//             </form>
//           )}
//     </div>
//   )
// }

// export default StockOptions

import React from 'react'
import useStock from '../context/stockContext';
import { useState } from 'react';

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

    if (!symbol) {
        return <div>Select a stock to view details</div>;
    }

    if (!selectedStock) {
        return <div>Loading stock data...</div>;
    }

  const buyHandler = async (symbol,type="normal")=>{
    setActiveStock(symbol); 
    setMode(type);
  }

  const buyFormHandler = async (e,symbol,price) =>{
    e.preventDefault();
    let buyPrice;
    const purpose = "Buy";

    if(customPrice!== 0) {
      buyPrice = customPrice;
      setOrderType('limit');
    }
    else {
      buyPrice = price;
      setOrderType('market');
    }

    const validTill = getValidTill(mode);
    await buyStock(symbol,buyPrice,quantity,orderType,purpose,validTill);

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
      setOrderType('limit');
    }
    else {
      sellPrice = price;
      setOrderType('market');
    }

    const validTill = getValidTill(mode);
    const purpose = "Sell";

    await sellStock(symbol, sellPrice , quantity , orderType,purpose,validTill);

    setSellStockState(null);
    setQuantity(0);
    setCustomPrice(0);
    setOrderType("market");
  }

  return (
    <div style={{
      borderRadius: "12px",
      padding: "20px",
      marginTop: "20px",
      background: "#ffffff",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{marginBottom: "10px"}}>{selectedStock.symbol}</h2>

      <p><strong>Price:</strong> ₹{selectedStock.price}</p>

      <p style={{ color: selectedStock.change >= 0 ? "green" : "red" }}>
        <strong>Change:</strong> {selectedStock.change}
      </p>

      <p style={{ color: selectedStock.percent >= 0 ? "green" : "red" }}>
        <strong>Percent:</strong> {selectedStock.percent?.toFixed(2)}%
      </p>

      <div style={{marginBottom: "15px"}}>
        <button 
          onClick={()=>setShowCharts(prev=> !prev)}
          style={{marginRight: "10px", padding: "6px 12px"}}
        >
          {showCharts ? "Hide Chart" : "Show Chart"}
        </button>

        <button onClick={()=>buyHandler(symbol,"normal")} style={{marginRight: "5px"}}>Buy</button>
        <button onClick={()=>buyHandler(symbol,"GTT")} style={{marginRight: "5px"}}>Buy GTT</button>
        <button onClick={()=>sellHandler(symbol,"normal")} style={{marginRight: "5px"}}>Sell</button>
        <button onClick={()=>sellHandler(symbol,"GTT")}>Sell GTT</button>
      </div>

      {/* Buy Form */}
      {activeStock === symbol && ( 
        <form onSubmit={(e)=> buyFormHandler(e,symbol,selectedStock?.price)} style={{marginTop: "10px"}}>
          <p><strong>{mode == "GTT" ? "GTT Order" : "Normal Order"}</strong></p>

          <input 
            type="number"
            value={quantity}
            onChange={(e)=>setQuantity(e.target.value)}
            placeholder='Quantity'
            style={{padding: "8px", marginBottom: "10px", width: "100%"}}
          />

          <div>
            <label>
              <input type='radio' value="market" checked={orderType === "market"} onChange={()=>setOrderType("market")}/> Market
            </label>

            <label style={{marginLeft: "10px"}}>
              <input type='radio' value="limit" checked={orderType === "limit"} onChange={()=>setOrderType("limit")}/> Limit
            </label>
          </div>

          {orderType === "limit" && (
            <input 
              type='number'
              value={customPrice}
              onChange={(e)=>setCustomPrice(e.target.value)}
              placeholder='Enter price'
              style={{marginTop: "10px", padding: "8px", width: "100%"}}
            />
          )}

          <button type='submit' style={{marginTop: "10px"}}>Confirm Buy</button>
        </form>
      )}

      {/* Sell Form */}
      {sellStockState === symbol && ( 
        <form onSubmit={(e)=> sellFormHandler(e,symbol,selectedStock?.price)} style={{marginTop: "10px"}}>
          <p><strong>{mode == "GTT" ? "GTT Order" : "Normal Order"}</strong></p>

          <input 
            type="number"
            value={quantity}
            onChange={(e)=>setQuantity(e.target.value)}
            placeholder='Quantity'
            style={{padding: "8px", marginBottom: "10px", width: "100%"}}
          />

          <button type='submit'>Confirm Sell</button>
        </form>
      )}
    </div>
  )
}

export default StockOptions