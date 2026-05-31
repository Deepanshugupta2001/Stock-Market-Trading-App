import React from 'react'
import useStock from '../context/stockContext';

const ShowPortfolio = ({onSelectStock}) => {

  const {holding,stock} = useStock();
  const activeHoldings = holding.filter(h => h.quantity !== 0);

  if (activeHoldings.length === 0) {
    return <div className="empty-state">No holdings yet.</div>
  }

  return (
    <div className="data-list">
      <div className="data-row data-row-header">
        <span>Stock</span>
        <span>Price</span>
        <span>Invested</span>
        <span>Qty</span>
        <span>Avg</span>
        <span>Change</span>
      </div>
      {activeHoldings.map((h,i)=>{
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
            className="data-row clickable-row"
          >
            <span><strong>{h.stock}</strong></span>
            <span>Rs. {priceData?.price ?? "..."}</span>
            <span>Rs. {h.amountinvested}</span>
            <span>{h.quantity}</span>
            <span>Rs. {h.average}</span>
            <span className={change >= 0 ? "text-profit" : "text-loss"}>
              {change.toFixed(2)}%
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default ShowPortfolio
