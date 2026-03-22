import YahooFinance from "yahoo-finance2";
const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

try {
  const q = await yahooFinance.quote("BTC-USD");
  console.log("Price:", q.regularMarketPrice);
  console.log("Change:", q.regularMarketChange);
  console.log("Percent:", q.regularMarketChangePercent);
} catch (err) {
  console.error("Error:", err.message);
}