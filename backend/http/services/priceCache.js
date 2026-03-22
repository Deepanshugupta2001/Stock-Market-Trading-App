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