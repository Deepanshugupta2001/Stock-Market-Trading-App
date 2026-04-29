// import React from 'react'
// import useStock from '../context/stockContext';

// const ShowPortfolio = ({onSelectStock}) => {

//   const {holding,stock} = useStock();

//   return (
//     <div>
//       {
//         holding.map((h,i)=>{
//            const priceData = stock.find(
//               s => s && s.symbol && s.symbol.toUpperCase() === h.stock.toUpperCase()
//             );

//             const change = priceData
//               ? ((priceData.price - h.average) / h.average) * 100
//               : 0;

//           return(
//             <div key= {i} onClick={()=> onSelectStock && onSelectStock(h.stock)}
//             style={{cursor: "pointer", padding: "8px", borderBottom: "1px solid #ccc", display: "flex", justifyContent: "space-between", alignItems: "center"}}
//             >
//               { h.quantity !==0 ? <><span>Stock : {h.stock} </span>
//               {/* <span>Price: {h.price} </span> */}
//               <span>Price: ₹{priceData?.price ?? "Loading..."}</span>
//               <span>Amount Invested: {h.amountinvested} </span>
//               <span>Quantity : {h.quantity} </span>
//               <span>Average : {h.average} </span>
//               {/* {h.change = ((priceData.price - h.average)/h.average)*100}<span>Change : {h.change}% </span> */}
//               <span style={{ color: change >= 0 ? "green" : "red" }}>
//                   Change: {change.toFixed(2)}%
//                 </span> </> : null }
//             </div>
//           )
//         })
//       }
//     </div>
//   )
// }

// export default ShowPortfolio

// import React from 'react'
// import useStock from '../context/stockContext';

// const ShowPortfolio = ({ onSelectStock }) => {
//   const { holding, stock } = useStock();

//   return (
//     <div className="show-portfolio">
//       <div className="show-portfolio__header">
//         <span>Stock</span>
//         <span>Price</span>
//         <span>Invested</span>
//         <span>Qty</span>
//         <span>Avg</span>
//         <span>Change</span>
//       </div>

//       {holding.map((h, i) => {
//         const priceData = stock.find(
//           s => s && s.symbol && s.symbol.toUpperCase() === h.stock.toUpperCase()
//         );
//         const change = priceData
//           ? ((priceData.price - h.average) / h.average) * 100
//           : 0;

//         return (
//           <div
//             key={i}
//             onClick={() => onSelectStock && onSelectStock(h.stock)}
//             className="holding-row"
//           >
//             {h.quantity !== 0 ? (
//               <>
//                 <span className="holding-cell holding-symbol">{h.stock}</span>
//                 <span className="holding-cell">
//                   ₹{priceData?.price ?? <span className="muted">Loading...</span>}
//                 </span>
//                 <span className="holding-cell">₹{h.amountinvested}</span>
//                 <span className="holding-cell">{h.quantity}</span>
//                 <span className="holding-cell">₹{h.average}</span>
//                 <span className={`holding-cell holding-change ${change >= 0 ? 'is-up' : 'is-down'}`}>
//                   {change >= 0 ? '▲' : '▼'} {change.toFixed(2)}%
//                 </span>
//               </>
//             ) : null}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default ShowPortfolio;

import React from 'react'
import useStock from '../context/stockContext';

const ShowPortfolio = ({onSelectStock}) => {

  const {holding,stock} = useStock();

  return (
    <div style={{
      background: "#fff",
      borderRadius: "10px",
      padding: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      {
        holding.map((h,i)=>{
           const priceData = stock.find(
              s => s && s.symbol && s.symbol.toUpperCase() === h.stock.toUpperCase()
            );

            const change = priceData
              ? ((priceData.price - h.average) / h.average) * 100
              : 0;

          return(
            <div 
              key={i} 
              onClick={()=> onSelectStock && onSelectStock(h.stock)}
              style={{
                cursor: "pointer",
                padding: "12px",
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "6px",
                transition: "0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#f0f4f8"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              { h.quantity !==0 ? (
                <>
                  <span><strong>{h.stock}</strong></span>

                  <span>₹{priceData?.price ?? "..."}</span>

                  <span>Invested: ₹{h.amountinvested}</span>

                  <span>Qty: {h.quantity}</span>

                  <span>Avg: ₹{h.average}</span>

                  <span style={{ 
                    color: change >= 0 ? "#16a34a" : "#dc2626",
                    fontWeight: "bold"
                  }}>
                    {change.toFixed(2)}%
                  </span>
                </>
              ) : null }
            </div>
          )
        })
      }
    </div>
  )
}

export default ShowPortfolio