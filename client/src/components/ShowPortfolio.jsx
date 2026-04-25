import React from 'react'
import useStock from '../context/stockContext';

const ShowPortfolio = ({onSelectStock}) => {

  const {holding,stock} = useStock();

  return (
    <div>
      {
        holding.map((h,i)=>{
           const priceData = stock.find(
              s => s && s.symbol && s.symbol.toUpperCase() === h.stock.toUpperCase()
            );

            const change = priceData
              ? ((priceData.price - h.average) / h.average) * 100
              : 0;

          return(
            <div key= {i} onClick={()=> onSelectStock && onSelectStock(h.stock)}
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

export default ShowPortfolio