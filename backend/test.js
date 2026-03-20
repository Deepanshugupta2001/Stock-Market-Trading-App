import yahooFinance from "yahoo-finance2";

// const yahooFinance = new YahooFinance({
//   suppressNotices: ["yahooSurvey"]
// });

async function test() {
  const q = await yahooFinance.quote("TATAMOTORS.NS");
  console.log(q);
}

test();