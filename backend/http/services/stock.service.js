// import yahooFinance from "yahoo-finance2";
import YahooFinance from "yahoo-finance2";
import Stock from '../../model/Stock.js';

const yahooFinance = new YahooFinance({ 
    suppressNotices: ["yahooSurvey"]
});

// yahooFinance.suppressNotices(["yahooSurvey"]);

let lastFetch = 0 ;
export async function stockData(symbol , retries = 3) {
    try {
        // const validSymbols = symbols.filter(s => s && s.trim() !== "");

// console.log("Symbols :", validSymbols);
        // console.log("Symbols :",symbols);
        const now = Date.now();

        if(now-lastFetch < 2000){
            await new Promise(r=> setTimeout(r,2000));
        }

        lastFetch = Date.now();

        const response = await yahooFinance.quote(symbol);
        const quotes = response.quoteResponse.result;
        console.log(response);
        return quotes.map(q => ({
            symbol: q.symbol,
            price: q.regularMarketPrice,
            change: q.regularMarketChange,
            percent: q.regularMarketChangePercent
        }));

    } catch (error) {

        if (error.message.includes("Too Many Requests") && retries>0) {
      console.log(`Yahoo rate limit hit. Retrying in 2 seconds...(${retries} retries left)`);
      await new Promise(r => setTimeout(r, 2000));
      return stockData(symbol,retries-1);
    }
        console.error("Yahoo API error: ",error);
        
        throw new Error("Failed to fetch stock");
    }
}  

export async function watchlist(userId) {
    const user = await Stock.findById(userId);
    
    return user.watchlist;
}

export async function addWatchlist(userId,symbol) {
    if(!symbol || symbol.trim() === ""){
        throw new Error("Invalid symbol");
    }


    await Stock.updateOne(
        {_id : userId},
        {$addToSet: {watchlist: symbol}}
    )

    return true;
}

export async function removeWatchlist(userId,symbol) {
    await Stock.updateOne(
        {_id : userId},
        {$pull: {watchlist : symbol}}
    )

    return true;
}

export async function addmoney(userId,amt) {
    console.log("UserID and Amount is ", userId,amt);
    const user = await Stock.findById(userId);
    const amount = Number(amt);
    console.log("User is in service",user);
    console.log("Wallet is ",user.wallet);
        user.transactions.push({
        type: "Deposit",
        amount : amount,
        previousbalance: user.wallet,
        balance : user.wallet + amount,
        date : Date.now()
})
    user.wallet+=amount;
    await user.save();
    return user.wallet;
}

export async function withdrawmoney(userId,amt) {
    const user = await Stock.findById(userId);
    const amount = Number(amt);
    if(amount<=user.wallet){

    user.transactions.push({
        type: "Withdrawal",
        amount : amount,
        previousbalance: user.wallet,
        balance : user.wallet - amount,
        date : Date.now()
})
    user.wallet-=amount;
    await user.save();
    return user.wallet;
    }
    else {
        return false;
    }
}

export async function transactions(userId) {
    const user = await Stock.findById(userId);
    return user.transactions;
}

export async function searchStock(query) {
    try {
        const results = await yahooFinance.search(query);
        if (!results || !results.quotes) return [];
        
        return results.quotes.map(q => ({
            symbol: q.symbol,
            shortname: q.shortname || q.longname,
            exchange: q.exchange,
            typeDisp: q.typeDisp
        }));
    } catch (error) {
        console.error("Yahoo search error:", error.message || error);
        // If Yahoo rate limits us, return an empty array so it doesn't break the app
        return [];
    }
}

export async function loadWallet(userId) {
    const user = await Stock.findById(userId);
    return user.wallet;
}

export async function getStockChart(symbol,range) {
    try {
    if (!symbol || symbol.trim() === "") {
      throw new Error("Invalid Symbol");
    }

    const now = new Date();
    const past = new Date();
    let interval ;

    switch (range) {
      case "1D": past.setDate(now.getDate() - 1); interval ="5m"; break;
      case "1W": past.setDate(now.getDate() - 7); interval ="15m"; break;
      case "1M": past.setMonth(now.getMonth() - 1); interval ="1h" ;break;
      case "3M": past.setMonth(now.getMonth() - 3);interval ="1d"; break;
      case "6M": past.setMonth(now.getMonth() - 6); interval ="1d" ; break;
      case "1Y": past.setFullYear(now.getFullYear() - 1); interval ="1d";break;
      default: past.setMonth(now.getMonth() - 1);
    }
    const response = await yahooFinance.chart(symbol, {
      period1: past,
      period2: now,
      interval
    });

    const result = response?.quotes || [];

    console.log("CHART RAW:", result); // 🔥 DEBUG

    if (!result.length) return [];

    // return result
    //   .filter(item =>
    //     item &&
    //     item.close != null &&
    //     !isNaN(item.close) &&
    //     item.date
    //   )
    //   .map(item => ({
    //     time: new Date(item.date).toISOString().split("T")[0],
    //     value: Number(item.close)
    //   }));

    const formatted = result
        .filter(item =>
            item &&
            item.close != null &&
            !isNaN(item.close) &&
            item.date
        )
        .map(item => ({
            time: Math.floor(new Date(item.date).getTime() / 1000), 
            value: Number(item.close)
        }))
        .sort((a, b) => a.time - b.time);

        const unique = [];
        const seen = new Set();

        for (let d of formatted) {
        if (!seen.has(d.time)) {
            seen.add(d.time);
            unique.push(d);
        }
        }

        return unique;

  } catch (error) {
    console.error("Chart Error:", error);
    return [];
  }
}