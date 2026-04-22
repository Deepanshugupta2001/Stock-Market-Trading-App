import React from 'react'
import { useNavigate } from 'react-router'
import useStock from '../context/stockContext';

const Portfolio = () => {

  const navigate = useNavigate();
  const {holding,stock} = useStock();
  return (
    <div>

      <button onClick={()=>navigate('/dashboard')} >Dashboard</button>
      Welcome to the Holdings Page
      
      {
        holding.map((h,i)=>{
           const priceData = stock.find(
              s => s && s.symbol && s.symbol.toUpperCase() === h.stock.toUpperCase()
            );

            const change = priceData
              ? ((priceData.price - h.average) / h.average) * 100
              : 0;

          return(
            <div key= {i} 
            style={{cursor: "pointer", padding: "8px", borderBottom: "1px solid #ccc", display: "flex", justifyContent: "space-between", alignItems: "center"}}
            >
              { h.quantity !==0 ? <><span>Stock : {h.stock} </span>
              {/* <span>Price: {h.price} </span> */}
              <span>Price: ₹{priceData?.price ?? "Loading..."}</span>
              <span>Amount Invested: {h.amountinvested} </span>
              <span>Quantity : {h.quantity} </span>
              <span>Average : {h.average} </span>
              {/* {h.change = ((priceData.price - h.average)/h.average)*100}<span>Change : {h.change}% </span> */}
              <span style={{ color: change >= 0 ? "green" : "red" }}>
                  Change: {change.toFixed(2)}%
                </span> </> : null }
            </div>
          )
        })
      }
    </div>
  )
}

export default Portfolio