import React from 'react'
import { useContext } from "react";
import { createContext } from "react";
import { useState } from "react"
import { stockApi } from "../api/stockApi";
import {io} from 'socket.io-client';
import { useEffect } from 'react';
const stockcontext = createContext();

const socket = io("http://localhost:4444");

export const StockProvider = ({children}) =>{
    const [stock,setStock] = useState([]);
    const [watchlist,setWatchlist] = useState([]);
    const [wal,setWal] = useState(0);
    const [transaction,setTransaction] = useState([]);
    const [chartType, setChartType] = useState("linechart");
    const [quantity , setQuantity] = useState(0);
    const [price,setPrice] = useState(0);
    const [order,setOrder] = useState([]);
    
    async function loadWatchlist() {
        const data = await stockApi.getWatchlist();
        //   console.log("Watchlist from API:", data);
        // setStock(data);
        setWatchlist(data);
    }

    async function addStock(symbol) {
        const data = await stockApi.addWatchlist(symbol);
        await loadWatchlist();
        return data ;
    }

    async function removeStock(symbol){
        const data = await stockApi.removeStockFromWatchlist(symbol);
        await loadWatchlist();
        return data;
    }

    async function loadOrderList(){
        const data = await stockApi.getOrderList();
        setOrder(data);
    }

    async function addStockOrderList(symbol){
        const data = await stockApi.addOrderList(symbol);
        await loadOrderList();
        return data;
    }


    async function addmoney(amt) {
        // setWal(wal+amt);
        const data = await stockApi.addMoney(amt);
        setWal(data);
        console.log("Wallet in Context",data);
        return data;
    }

    async function withdrawMoney(amt){
            console.log("Ma if ma aa gaya hu ");
            // setWal(wal-amt);
            const data = await stockApi.withdrawMoney(amt);
            setWal(data);
            return data; 
        
    }

    async function transactions() {
        const data = await stockApi.transactions();
        setTransaction(data);
        return data;
    }

    async function loadWallet(){
        const data = await stockApi.loadWallet();
        setWal(data);
        return data;
    }

    async function showChart(symbol,range) {
        const data = await stockApi.showCharts(symbol,range);
        return data;
    }

    useEffect(()=>{
        console.log("Watchlist Loading");
        loadWatchlist();
        loadWallet();
        loadOrderList();
    },[]);

    useEffect(()=>{

        const symbols = [...new Set([...watchlist,...order])];

        if(symbols.length === 0) return ;

        console.log("Subscribing to:",symbols);

        socket.emit("subscribe", symbols);
        // socket.emit("subscribe", watchlist);

        const handlePrices = (prices) => {
            setStock(prices);
    };

    socket.on("prices", handlePrices);

    return () => socket.off("prices",handlePrices);

    },[watchlist,order]);

    async function getPrice(symbol) {
        const data = await stockApi.getQuote(symbol);
        return data ;
    }

    async function buyStock(symbol,price,quantity,orderType) {
        const data = await stockApi.buyStocK(symbol,price,quantity, orderType);
        return data ;
    }

    async function sellStock(symbol,price,quantity,orderType) {
        const data =await stockApi.sellStocK(symbol,price,quantity,orderType);
        return data;
    }
    return (
        <stockcontext.Provider value={{
            stock,
            addStock,
            loadWatchlist,
            watchlist,
            getPrice,
            wal,
            addmoney,
            withdrawMoney,
            transactions,
            transaction,
            loadWallet,
            removeStock,
            showChart,
            chartType,
            setChartType,
            buyStock,
            setStock,
            quantity,
            setQuantity,
            price,
            setPrice,
            sellStock,
            order,
            addStockOrderList,
            loadOrderList,
        }}>
            {children}
        </stockcontext.Provider>
    )
}

export default function useStock(){
    return useContext(stockcontext);
}