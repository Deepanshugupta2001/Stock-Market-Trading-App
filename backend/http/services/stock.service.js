import YahooFinance from "yahoo-finance2";
import Stock from '../../model/Stock.js';

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

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

// export async function removeWatchlist(userId,symbol) {
//     await Stock.updateOne(
//         {_id : userId},
//         {$pull: {watchlist : symbol}}
//     )

//     return true;
// }

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

export async function loadWallet(userId) {
    const user = await Stock.findById(userId);
    return user.wallet;
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