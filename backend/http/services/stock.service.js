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
        // const quotes = response.quoteResponse.result;
        if(response?.quoteResponse?.result) {
            return quotes.map(q => ({
            symbol: q.symbol,
            price: q.regularMarketPrice,
            change: q.regularMarketChange,
            percent: q.regularMarketChangePercent,
            marketState : q.marketState,
        }));
        }

        return [{
            symbol : response.symbol,
            price : response.regularMarketPrice,
            change : response.regularMarketChange,
            percent : response.regularMarketChangePercent,
            marketState : response.marketState,
        }]
        // console.log(response);
        // return quotes.map(q => ({
        //     symbol: q.symbol,
        //     price: q.regularMarketPrice,
        //     change: q.regularMarketChange,
        //     percent: q.regularMarketChangePercent
        // }));

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

// export async function getStockChart(symbol,range,chartType) {
//     try {
//     if (!symbol || symbol.trim() === "") {
//       throw new Error("Invalid Symbol");
//     }

//     const now = new Date();
//     const past = new Date(now);
//     let interval ;

//     switch (range) {
//       case "1D": past.setDate(now.getDate() - 1); interval ="5m"; break;
//       case "1W": past.setDate(now.getDate() - 7); interval ="15m"; break;
//       case "1M": past.setMonth(now.getMonth() - 1); interval ="1h" ;break;
//       case "3M": past.setMonth(now.getMonth() - 3);interval ="1d"; break;
//       case "6M": past.setMonth(now.getMonth() - 6); interval ="1d" ; break;
//       case "1Y": past.setFullYear(now.getFullYear() - 1); interval ="1d";break;
//       default: past.setMonth(now.getMonth() - 1); interval="1d";
//     }
//     const response = await yahooFinance.chart(symbol, {
//     //   period1: past,
//     //   period2: now,
//     period1: Math.floor(past.getTime()/1000),
//       period2: Math.floor(now.getTime()/1000),
//       interval
//     });

//     const result = response?.quotes || [];

//     console.log("CHART RAW:", result); 

//     if (!result.length) return [];

//     // return result
//     //   .filter(item =>
//     //     item &&
//     //     item.close != null &&
//     //     !isNaN(item.close) &&
//     //     item.date
//     //   )
//     //   .map(item => ({
//     //     time: new Date(item.date).toISOString().split("T")[0],
//     //     value: Number(item.close)
//     //   }));
//     let formatted ;
//     if(chartType === 'linechart' || chartType === 'histogramchart' ){
//         formatted = result
//         .filter(item =>
//             item &&
//             item.close != null &&
//             !isNaN(item.close) &&
//             item.date
//         )
//         .map(item => ({
//             time: Math.floor(new Date(item.date).getTime() / 1000), 
//             value: Number(item.close)
//         }))
//         .sort((a, b) => a.time - b.time);
//     }
//     else{
//         formatted = result
//             .filter(item =>
//                 item &&
//                 item.close != null &&
//                 !isNaN(item.close) &&
//                 item.date
//             )
//             .map(item => ({
//                 time: Math.floor(new Date(item.date).getTime() / 1000), 
//                 open: Number(item.open),
//                 high : Number(item.high),
//                 close : Number(item.close),
//                 low : Number(item.low),
//             }))
//             .sort((a, b) => a.time - b.time);
//     }

//         const unique = [];
//         const seen = new Set();

//         for (let d of formatted) {
//         if (!seen.has(d.time)) {
//             seen.add(d.time);
//             unique.push(d);
//         }
//         }

//         return unique;

//   } catch (error) {
//     console.error("Chart Error:", error);
//     return [];
//   }
// }

export async function getStockChart(symbol, range) {
  try {
    if (!symbol || symbol.trim() === "") {
      throw new Error("Invalid Symbol");
    }

    const now = new Date();
    const past = new Date(now); 
    let interval;

    switch (range) {
      case "1D":
        past.setDate(now.getDate() - 1);
        interval = "5m";
        break;

      case "1W":
        past.setDate(now.getDate() - 7);
        interval = "15m";
        break;

      case "1M":
        past.setMonth(now.getMonth() - 1);
        interval = "1h";
        break;

      case "3M":
        past.setMonth(now.getMonth() - 3);
        interval = "1d";
        break;

      case "6M":
        past.setMonth(now.getMonth() - 6);
        interval = "1d";
        break;

      case "1Y":
        past.setFullYear(now.getFullYear() - 1);
        interval = "1d";
        break;

      default:
        past.setMonth(now.getMonth() - 1);
        interval = "1h";
    }

    const response = await yahooFinance.chart(symbol, {
      period1: past,
      period2: now,
      interval
    });

    const result = response?.quotes || [];

    console.log("RESULT LENGTH:", result.length);

    if (!result.length) return [];

    const formatted = result
      .filter(item =>
        item &&
        item.open != null &&
        item.high != null &&
        item.low != null &&
        item.close != null &&
        item.date
      )
      .map(item => ({
        time: Math.floor(new Date(item.date).getTime() / 1000),
        open: Number(item.open),
        high: Number(item.high),
        low: Number(item.low),
        close: Number(item.close)
      }))
      .sort((a, b) => a.time - b.time);

    return formatted;

  } catch (error) {
    console.error("Chart Error:", error);
    return [];
  }
}

export async function buyStock(symbol, price, quantity, userId, orderType,purpose,validTill) {

    const user = await Stock.findById(userId);
    if (!user) throw new Error("User not found");

    if (!symbol || !price || !quantity) {
        throw new Error("Invalid order details");
    }
    console.log("The details of the stock are :", symbol,price,quantity,userId,orderType,purpose,validTill);
    // NSE market close (3:30 PM IST)
    // const now = new Date();
    // const validTill = new Date(
    //     now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    // );
    // validTill.setHours(15, 30, 0, 0);

    const order = {
        stock: symbol,
        price: price,
        quantity: quantity,
        orderType: orderType, // "market" or "limit"
        orderStatus: "Open",
        placedAt: Date.now(),
        validTill: validTill,
        purpose : purpose,
    };

    user.orderDetails.push(order);

    await user.save();

    return {
        message: "Order placed successfully. Waiting for execution.",
        order
    };
}

export async function sellStock(userId,symbol,price,quantity,orderType,purpose,validTill) {

    const user = await Stock.findById(userId);
    if (!user) throw new Error("User not found");

    if (!symbol || !price || !quantity) {
        throw new Error("Invalid order details");
    }

    // NSE market close (3:30 PM IST)
    const now = new Date();
    // const validTill = new Date(
    //     now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    // );
    // validTill.setHours(15, 30, 0, 0);

    const order = {
        stock: symbol,
        price: price,
        quantity: quantity,
        orderType: orderType, // "market" or "limit"
        orderStatus: "Open",
        placedAt: Date.now(),
        validTill: validTill,
        // purpose : "Sell",
        purpose : purpose,

    };

    user.orderDetails.push(order);

    await user.save();

    return {
        message: "Order placed successfully. Waiting for execution.",
        order
    };
}

// async function customBuyOrder(){

// }

// export async function buyStock(symbol,price,quantity,userId,orderType) {
//     const user = await Stock.findById(userId);

//     if(!user) throw new Error("User not Found");

//     console.log("Mera orderType aa raha hai from controller ",orderType);
//     const order ={
//         stock : symbol,
//         price : price,
//         placedAt : Date.now(),
//         orderType : orderType,
//         quantity : quantity,
//         orderStatus : "Open"
//     };
//     user.orderDetails.push(order);
//     await user.save();

//     console.log("User details are as follows:")
//     console.log("Stock is :",user.orderDetails.stock);
//     console.log("Price is :",user.orderDetails.price);
//     console.log("Order placed at: ",user.orderDetails.placedAt);
//     console.log("Order Type is :",user.orderDetails.orderType);
//     console.log("Order quantity is :",user.orderDetails.quantity);
//     console.log("Order status is :",user.orderDetails.orderStatus);

//     const curprice = await stockData(symbol);
//     console.log("Curprice is :",curprice);
//     // const Price = curprice[0].price; 
//     const marketState = curprice[0].marketState;
//     // console.log(Price);

//     console.log("User id is :",userId);
//     console.log("Symbol is :",symbol);
//     console.log("Price is :",price);
//     console.log("Quantity is :",quantity);
//     let totalamount = price*quantity ;
    
//     if(user.wallet < totalamount) throw new Error("Insufficient Balance in your wallet");

//     user.wallet -= totalamount ;

//     const existingStock = user.holding.find(
//         (item)=>item.stock === symbol
//     );
//     if(orderType == 'limit'){
//         if(marketState == 'REGULAR'){


//             // await curprice == price;
//              if(existingStock){
//                 console.log("Stock mil gaya hai ");
//                 // let curr_quantity = user.holding.quantity + quantity;
//                 // let curr_av = (user.holding.average*user.holding.quantity + price*quantity)/(quantity + user.holding.quantity);
//                 // let curr_amountinvested = user.holding.amountinvested + (price*quantity);
//                 let curr_quantity = existingStock.quantity + quantity;
//                 let curr_av = (existingStock.average*existingStock.quantity + price*quantity)/(quantity + existingStock.quantity);
//                 let curr_amountinvested = existingStock.amountinvested + (price*quantity);

//                 existingStock.quantity = curr_quantity;
//                 existingStock.average = curr_av;
//                 existingStock.amountinvested = curr_amountinvested ;

//                 // We will do order work later
//                 await user.save();
//             }
//             else{
//                 console.log("Stock nahi mila hai ");
//                 user.holding.push({
//                     quantity : quantity,
//                     stock : symbol,
//                     average : price,
//                     amountinvested : totalamount,
//                     price: price,
//             }) 
//                 // We will do order work later
//             await user.save();
            
//             console.log("Maine stock ka liye changes kar liya hai db ma ");
//             }
//         }
//         else{
//             throw new Error("Cannot execute order as the market is closed");
//         }
//     }
//     else {
//         if(marketState == 'REGULAR'){
//     if(existingStock){
//         console.log("Stock mil gaya hai ");
//         // let curr_quantity = user.holding.quantity + quantity;
//         // let curr_av = (user.holding.average*user.holding.quantity + price*quantity)/(quantity + user.holding.quantity);
//         // let curr_amountinvested = user.holding.amountinvested + (price*quantity);
//          let curr_quantity = existingStock.quantity + quantity;
//         let curr_av = (existingStock.average*existingStock.quantity + price*quantity)/(quantity + existingStock.quantity);
//         let curr_amountinvested = existingStock.amountinvested + (price*quantity);

//         existingStock.quantity = curr_quantity;
//         existingStock.average = curr_av;
//         existingStock.amountinvested = curr_amountinvested ;
        
//         const lastOrder = user.orderDetails[user.orderDetails.length -1];
//         lastOrder.orderStatus = "Completed";
//         await user.save();

//             console.log("User details are as follows :")
//     console.log("Stock is :",user.orderDetails.stock);
//     console.log("Price is :",user.orderDetails.price);
//     console.log("Order placed at: ",user.orderDetails.placedAt);
//     console.log("Order Type is :",user.orderDetails.orderType);
//     console.log("Order quantity is :",user.orderDetails.quantity);
//     console.log("Order status is :",user.orderDetails.orderStatus);
//     }
//     else{
//         console.log("Stock nahi mila hai ");
//         user.holding.push({
//             quantity : quantity,
//             stock : symbol,
//             average : price,
//             amountinvested : totalamount,
//             price: price,
//     }) 
    
//     const lastOrder = user.orderDetails[user.orderDetails.length -1];
//         lastOrder.orderStatus = "Completed";
//         await user.save();
//         console.log("User details are as follows:")
//     console.log("Stock is :",user.orderDetails.stock);
//     console.log("Price is :",user.orderDetails.price);
//     console.log("Order placed at: ",user.orderDetails.placedAt);
//     console.log("Order Type is :",user.orderDetails.orderType);
//     console.log("Order quantity is :",user.orderDetails.quantity);
//     console.log("Order status is :",user.orderDetails.orderStatus);
//     console.log("Maine stock ka liye changes kar liya hai db ma ");
//     }
// }
//     else{
//             throw new Error("Cannot execute order as the market is closed");
//     }
// }
//     await user.save();
//     return user.holding;
// }

// export async function sellStock(userId, symbol,price,quantity,orderType, purpose) {
//     const user = await Stock.findById(userId);

//     console.log("Ma service file of sell ma aa gaya hu");
//     console.log("Mera joh data hai of symbol,price and quantity are :",symbol, price ,quantity);
//     const existingStock = user.holding.find(
//         (item)=> item.stock === symbol
//     );

//     if(existingStock){
//         console.log("Ma existingStock ka if ka andar aa gaya hu ");
//         if(quantity > existingStock.quantity) throw new Error("Cannot Sell as you are selling beyond your holdings");

//         else {
//             let curr_quantity = existingStock.quantity - quantity;
//             let curr_av = (curr_quantity)*price;
//             let curr_amountinvested = curr_av * curr_quantity;

//             console.log("Current quantity , average and amount invested is :",curr_quantity,curr_av,curr_amountinvested);

//             existingStock.average = curr_av;
//             existingStock.quantity = curr_quantity;
//             existingStock.amountinvested = curr_amountinvested;
//             user.wallet+= (quantity*price);
//         }

//         await user.save();
//         return user.holding;
//     }
//     else{
//         throw new Error("Cannot Sell as You do not have this Stock In Your Holding");
//     }
// }

export async function getOrderList(userId) {
    const user = await Stock.findById(userId);

    return user.orderlist;
}

export async function addStockOrderList(userId,symbol){
    if(!symbol || symbol.trim() === ""){
        throw new Error("Invalid symbol");
    }


    await Stock.updateOne(
        {_id : userId},
        {$addToSet: {orderlist: symbol}}
    )

    return true;
}

export async function geTOrderDetails(userId){
    const user =await Stock.findById(userId);
    if(!user) throw new Error("User not found");

    return user.orderDetails;
}

export async function getHolding(userId) {
    const user = await Stock.findById(userId);

    if(!user) throw new Error("User not found");

    return user.holding;
}