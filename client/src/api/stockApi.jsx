import axios from "./axios";

async function getQuote(symbol) {
    const token = localStorage.getItem("token");

    const response = await axios.get(`/api/stock/quote/${symbol}`,{
  headers: {
    Authorization: `Bearer ${token}`
  }});

    return response.data.data;
}

async function getWatchlist() {
    const token = localStorage.getItem("token");

    const response = await axios.get("/api/stock/watchlist",{
  headers: {
    Authorization: `Bearer ${token}`
  }});

    return response.data.data;
}

async function addWatchlist(symbol){

    const token = localStorage.getItem("token");


  const {data:{data}} = await axios.post("/api/stock/watchlist",
    {symbol},
    {
  headers: {
    Authorization: `Bearer ${token}`
  }}
);

  return data;
}

async function removeStockFromWatchlist(symbol) {
    const token = localStorage.getItem("token");
  
    const response = await axios.delete(`/api/stock/watchlist/${symbol}`,
      {
  headers: {
    Authorization: `Bearer ${token}`
  }}
    );

    return response.data.data ;
}

async function addMoney(amt) {
    const token = localStorage.getItem("token");
  
    const response = await axios.post("/api/stock/addmoney",
      {amt},
      {
  headers: {
    Authorization: `Bearer ${token}`
  }}
    );

    return response.data.data;
}

async function withdrawMoney(amt) {
    const token = localStorage.getItem("token");
  
    const response = await axios.post("/api/stock/withdrawmoney",
      {amt},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }}
    );

    return response.data.data;
}

async function transactions() {
    const token = localStorage.getItem("token");

    const response = await axios.get("/api/stock/transactions",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }}
    );

    return response.data.data;
}

async function loadWallet() {
    const token = localStorage.getItem("token");

    const response = await axios.get("/api/stock/loadwallet",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }}
    );

    return response.data.data;
}

async function addOrderList(symbol){
  const token = localStorage.getItem("token");


  const {data:{data}} = await axios.post("/api/stock/orderlist",
    {symbol},
    {
  headers: {
    Authorization: `Bearer ${token}`
  }}
);

  return data;
}

async function getOrderList(){
  const token = localStorage.getItem("token");

  const response = await axios.get("/api/stock/orderlist",
    {
  headers: {
    Authorization: `Bearer ${token}`
  }}
  );

  return response.data.data ;
}
async function searchStock(query) {
    const token = localStorage.getItem("token");
    const response = await axios.get(`/api/stock/search/${query}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
}

async function showCharts(symbol,range) {
    const token = localStorage.getItem("token");
  const response = await axios.get(`/api/stock/chart/${symbol}?range=${range}`,
    {
        headers: { Authorization: `Bearer ${token}` }
    }
  );

  return response.data.data;
  
}

async function buyStocK(symbol,price,quantity,orderType) {
  const token = localStorage.getItem("token");
  const response = await axios.post(`/api/stock/portfolio/buy`,
    {
      symbol,
      price,
      quantity,
      orderType,
    },
    {
        headers: { Authorization: `Bearer ${token}` }
    }
  );

  return response.data.data;
}

async function sellStocK(symbol,price,quantity,orderType) {
  const token = localStorage.getItem("token");
  const response = await axios.post(`/api/stock/portfolio/sell`,{
    symbol,
    price,
    quantity,
    orderType,
  },
  {
        headers: { Authorization: `Bearer ${token}` }
    }
);
  return response.data.data;
}

export const stockApi ={
    getQuote,
    getWatchlist,
    addWatchlist,
    addMoney,
    withdrawMoney,
    transactions,
    loadWallet,
    searchStock,
    removeStockFromWatchlist,
    showCharts,
    buyStocK,
    sellStocK,
    addOrderList,
    getOrderList,
}