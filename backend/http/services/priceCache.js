// import yahooFinance from "yahoo-finance2";

// let cache = {};
// let lastFetchTime = 0;
// let index = 0;
// export async function updatePrices(symbols) {
//   try {

//     for (const symbol of symbols) {

//       // delay between requests (VERY IMPORTANT)
//       await new Promise(r => setTimeout(r, 2000));

//       try {
//         const q = await yahooFinance.quote(symbol);

//         cache[q.symbol] = {
//           symbol: q.symbol,
//           price: q.regularMarketPrice,
//           change: q.regularMarketChange,
//           percent: q.regularMarketChangePercent
//         };

//       } catch (err) {
//         console.log("Skipping symbol:", symbol);
//       }

//     }

//     console.log("CACHE:", cache);

//   } catch (error) {
//     console.error("Yahoo Error:", error.message);
//   }

// try {

//     if (symbols.length === 0) return;

//     const symbol = symbols[index % symbols.length];
//     index++;

//     console.log("Fetching:", symbol);

//     const q = await yahooFinance.quote(symbol);

//     cache[q.symbol] = {
//       symbol: q.symbol,
//       price: q.regularMarketPrice,
//       change: q.regularMarketChange,
//       percent: q.regularMarketChangePercent
//     };

//     console.log("CACHE:", cache);

//   } catch (error) {
//     console.log("Skipping symbol:", symbols[index % symbols.length]);
//   }
// }


// export async function updatePrices(symbols) {

//     const now = Date.now();

//   // 🔥 Prevent too frequent calls
//   if (now - lastFetchTime < 10000) {
//     console.log("Skipping fetch (cooldown)");
//     return;
//   }

//   lastFetchTime = now;

//     try {
//         const response = await yahooFinance.quote(symbols);

//         const results = response.quoteResponse.result;

//         results.forEach(q=>{
//             cache[q.symbol]={
//                 symbol: q.symbol,
//                 price: q.regularMarketPrice,
//                 change: q.regularMarketChange,
//                 percent: q.regularMarketChangePercent
//             };
//         })
//     } catch (error) {
//         // if (error.message.includes("Too Many Requests")) {
//         //     console.log("Yahoo rate limited. Waiting before next request...");
//         //     return;
//         // }

//         console.error("Price update error:", error.message);
//     }
// }

// export function getPrices(symbols) {

//   return symbols
//     .map(symbol => cache[symbol])
//     .filter(Boolean);

// }

// import yahooFinance from "yahoo-finance2";

// let cache = {};

// export async function updatePrices(symbols){

//   const quotes = await yahooFinance.quote(symbols);

//   quotes.forEach(q => {
//     cache[q.symbol] = {
//       symbol: q.symbol,
//       price: q.regularMarketPrice,
//       change: q.regularMarketChange,
//       percent: q.regularMarketChangePercent
//     };
//   });

// }

// export function getPrices(symbols){
//   return symbols.map(s => cache[s]).filter(Boolean);
// }

import YahooFinance from "yahoo-finance2";
const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

let cache = {};
let index = 0;

// Fetch ONE symbol per call to avoid Yahoo rate limits
export async function updatePrices(symbols) {
  if (symbols.length === 0) return;

  // Deduplicate and uppercase
  const unique = [...new Set(symbols.map(s => s.toUpperCase()))];
  if (unique.length === 0) return;

  // Round-robin: fetch one symbol per interval tick
  const symbol = unique[index % unique.length];
  index++;

  try {
    console.log("Fetching price for:", symbol);
    const q = await yahooFinance.quote(symbol);

    if (q && q.symbol) {
      cache[q.symbol.toUpperCase()] = {
        symbol: q.symbol,
        price: q.regularMarketPrice,
        change: q.regularMarketChange,
        percent: q.regularMarketChangePercent
      };
      console.log("Cached:", q.symbol, q.regularMarketPrice);
    }
  } catch (err) {
    console.log("Skipping symbol:", symbol, "-", err.message || err);
  }
}

export function getPrices(symbols) {
  return symbols
    .map(symbol => cache[symbol.toUpperCase()])
    .filter(Boolean);
}