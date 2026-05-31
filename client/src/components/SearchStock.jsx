import React, { useState, useEffect } from 'react'
import { stockApi } from '../api/stockApi';
import useStock from '../context/stockContext';

const SearchStock = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const {addStock} = useStock();

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

        const timeout = setTimeout(fetchResults, 400);
        return () => clearTimeout(timeout);
    }, [query]);

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
    <div className="search-box">
      <form onSubmit={(e) => { e.preventDefault(); handleAdd(query); }}>
        <input
          onChange={(e)=>setQuery(e.target.value)}
          value={query}
          placeholder='Search Stock Name (e.g. Apple or AAPL)'
        />
        <button type='submit'>Add</button>
        {loading && <span className="status-text">Searching...</span>}
      </form>

      {results.length > 0 && (
          <div className="search-results">
              {results.map((result, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleAdd(result.symbol)}
                    className="search-result-item"
                  >
                      <strong>{result.symbol}</strong> - {result.shortname}
                      <small>{result.exchange}</small>
                  </div>
              ))}
          </div>
      )}
    </div>
  )
}

export default SearchStock
