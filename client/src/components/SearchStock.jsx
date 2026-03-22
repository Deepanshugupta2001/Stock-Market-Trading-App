// import React from 'react'
// import { useState } from 'react'
import React, { useState, useEffect } from 'react'
import { stockApi } from '../api/stockApi';
import useStock from '../context/stockContext';

const SearchStock = ({reload}) => {
    // const [symbol, setSymbol] = useState("");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const {addStock} = useStock();

  //   const addstock = async (e)=>{
  //       e.preventDefault();
  //       const data = await addStock(symbol);
  //       setSymbol("");
  //   }
  // return (
  //   <div>
  //     <form onSubmit={addstock}>
  //       <input onChange={(e)=>setSymbol(e.target.value)} value={symbol} placeholder='Enter Stock Name'></input>
      useEffect(() => {
        if (query.trim().length === 0) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            try {
                const data = await stockApi.searchStock(query);
                setResults(data);
            } catch (err) {
                console.error("Search failed", err);
            }
            setLoading(false);
        };

        const timeout = setTimeout(fetchResults, 400); // 400ms debounce
        return () => clearTimeout(timeout);
    }, [query]);

        // <button type='submit'>Add Stock</button>
      const handleAdd = async (symbol) => {
        try {
            await addStock(symbol);
            setQuery("");
            setResults([]);
        } catch (err) {
            console.error("Failed to add stock", err);
        }
    };

  return (
    <div style={{ position: "relative", marginBottom: "20px" }}>
      <form onSubmit={(e) => { e.preventDefault(); handleAdd(query); }}>
        <input 
          onChange={(e)=>setQuery(e.target.value)} 
          value={query} 
          placeholder='Search Stock Name (e.g. Apple or AAPL)' 
          style={{ width: "300px", padding: "8px" }}
        />
        <button type='submit' style={{ padding: "8px", marginLeft: "10px" }}>Add</button>
        {loading && <span style={{marginLeft: "10px"}}>Searching...</span>}
      </form>
      
      {results.length > 0 && (
          <div style={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "300px",
              background: "#fff",
              border: "1px solid #ccc",
              maxHeight: "200px",
              overflowY: "auto",
              zIndex: 10
          }}>
              {results.map((result, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handleAdd(result.symbol)}
                    style={{
                        padding: "8px",
                        borderBottom: "1px solid #eee",
                        cursor: "pointer",
                        color: "#000"
                    }}
                  >
                      <strong>{result.symbol}</strong> - {result.shortname} 
                      <small style={{display: "block", color: "#666"}}>{result.exchange}</small>
                  </div>
              ))}
          </div>
      )}
      {/* </form> */}
    </div>
  )
}

export default SearchStock