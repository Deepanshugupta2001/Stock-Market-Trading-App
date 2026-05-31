import { Server } from "socket.io";
import Stock from "../model/Stock.js";
// import { stockData } from "../http/services/stock.service.js";
import { getPrices, updatePrices } from "../http/services/priceCache.js";
import env from "../env.js";

let activeSymbols = new Set();
let userSubscriptions = new Map();

export function startsocket(httpServer){

    const io = new Server(httpServer,{
    cors: {
        origin: env.CORS_ORIGIN
    }
});

    io.on("connection", (socket) => {

    console.log("Client connected:", socket.id);

    socket.on("subscribe", (symbols) => {

      console.log("User subscribed:", symbols);

      userSubscriptions.set(socket.id, symbols);

      // rebuildActiveSymbols();

      symbols.forEach(symbol => { 
        if (symbol) activeSymbols.add(symbol);
      });

      const prices = getPrices(symbols);

  if (prices.length > 0) {
    socket.emit("prices", prices);
    console.log("Sent instant prices:", prices);
  } else {
    // console.log("No cached prices yet");
    socket.emit("prices", symbols.map(s => ({
    symbol: s,
    price: null
  })))
  }
    });

    socket.on("disconnect", () => {

      console.log("Client disconnected:", socket.id);

      userSubscriptions.delete(socket.id);

      rebuildActiveSymbols();

    });

  });

// setInterval(async () => {

//   const symbols = [...activeSymbols];

//   if (!symbols.length) return;

//   console.log("Fetching prices for:", symbols);

//   await updatePrices(symbols);

//   const priceCache = getPrices(symbols);

//   io.sockets.sockets.forEach((socket) => {

//     const watchlist = userSubscriptions.get(socket.id);

//     if (!watchlist) return;

//     const prices = watchlist
//       .map(symbol => priceCache.find(p => p.symbol === symbol))
//       .filter(Boolean);

//     socket.emit("prices", prices);

//   });

// }, 5000);
// }

setInterval(async () => {

  // const symbols = [...activeSymbols];
   // Convert Set to Array and deduplicate just in case
  const symbols = [...new Set(activeSymbols)];

  if (symbols.length === 0) return;

  await updatePrices(symbols);

  io.sockets.sockets.forEach((socket) => {

    const userSymbols = userSubscriptions.get(socket.id);

    if (!userSymbols) return;

    const prices = getPrices(userSymbols);

    if (prices.length > 0) {
      socket.emit("prices", prices);
    } else {
      socket.emit("prices", userSymbols.map(s => ({
        symbol: s,
        price: null
      })));
    }

  });

}, 3000); 
}

function rebuildActiveSymbols() {

  activeSymbols.clear();

  userSubscriptions.forEach((symbols) => {

    symbols.forEach(symbol => {
      if (symbol) activeSymbols.add(symbol);
    });

  });

}
