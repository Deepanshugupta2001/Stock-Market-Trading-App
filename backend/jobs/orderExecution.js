import {stockData} from '../http/services/stock.service.js';
import Stock from '../model/Stock.js';

function isIndianMarketOpen(){
    const now = new Date();

    const isTimeNow = new Date( 
        now.toLocaleString("en-US", { timeZone : "Asia/Kolkata"})
    );

    const hours = isTimeNow.getHours();
    const minutes = isTimeNow.getMinutes();

    const totalMinutes = hours * 60 + minutes ;

    const marketOpen = 9*60 + 15;
    const marketClose = 15*60 + 30 ; 

    return totalMinutes>= marketOpen && totalMinutes <= marketClose ; 
}

export function buyOrderExecuting() {

    async function runExecutor() {
        try {
            console.log(" Running Buy Order Executor...");

            // if (!isIndianMarketOpen()) {
            //     console.log(" Market Closed");
            //     return;
            // }

            const users = await Stock.find({
                "orderDetails.orderStatus": "Open"
            });

            const priceCache = {};

            for (let user of users) {
                let userUpdated = false;

                for (let order of user.orderDetails) {

                    if(order.purpose == "Buy"){

                    try {
                        if (order.orderStatus !== "Open") continue;

                        //  Prevent duplicate execution
                        if (order.isProcessing) continue;
                        order.isProcessing = true;

                        const now = Date.now();

                        //  Expiry check
                        if (order.validTill && now > new Date(order.validTill).getTime()) {
                            order.orderStatus = "Expired";
                            order.isProcessing = false;
                            userUpdated = true;
                            console.log(` Expired: ${order.stock}`);
                            continue;
                        }

                        //  Get stock price (cached)
                        if (!priceCache[order.stock]) {
                            const data = await stockData(order.stock);
                            priceCache[order.stock] = data?.[0]?.price;
                        }

                        const currentPrice = priceCache[order.stock];
                        if (!currentPrice) {
                            order.isProcessing = false;
                            continue;
                        }

                        console.log(
                            `${order.stock} | CMP: ${currentPrice} | Target: ${order.price}`
                        );

                        //  LIMIT ORDER LOGIC (FIXED)
                        if (order.orderType === "limit") {

                            // Buy only if price is <= target
                            if (currentPrice > order.price) {
                                order.isProcessing = false;
                                continue;
                            }

                            //  Prevent sudden spike execution (buffer zone)
                            const tolerance = 0.002; // 0.2%
                            if (currentPrice < order.price * (1 - tolerance)) {
                                order.isProcessing = false;
                                continue;
                            }

                            //  Confirmation delay (anti-spike)
                            if (!order.triggeredAt) {
                                order.triggeredAt = now;
                                order.isProcessing = false;
                                continue;
                            }

                            if (now - order.triggeredAt < 3000) {
                                order.isProcessing = false;
                                continue;
                            }
                        }

                        //  MARKET ORDER
                        if (order.orderType === "market") {
                            order.price = currentPrice;
                        }

                        const totalAmount = order.price * order.quantity;

                        //  Wallet check
                        if (user.wallet < totalAmount) {
                            console.log(` Insufficient balance for ${order.stock}`);
                            order.isProcessing = false;
                            continue;
                        }

                        //  Deduct wallet
                        user.wallet -= totalAmount;

                        // Update holdings
                        const existingStock = user.holding.find(
                            (item) => item.stock === order.stock
                        );

                        let avgPrice = order.price;

                        if (existingStock) {
                            const newQty = existingStock.quantity + order.quantity;

                            avgPrice =
                                (existingStock.average * existingStock.quantity +
                                    order.price * order.quantity) / newQty;

                            existingStock.quantity = newQty;
                            existingStock.average = avgPrice;
                            existingStock.amountinvested += totalAmount;

                        } else {
                            user.holding.push({
                                stock: order.stock,
                                quantity: order.quantity,
                                average: order.price,
                                amountinvested: totalAmount,
                                price: order.price
                            });
                        }

                        //  Transaction log
                        user.holdingTransactions.push({
                            stock: order.stock,
                            orderType: "Buy",
                            quantity: order.quantity,
                            price: order.price,
                            executedAt: new Date(),
                            average: avgPrice
                        });

                        //  Complete order
                        order.orderStatus = "Completed";
                        order.executedAt = new Date();
                        order.isProcessing = false;
                        order.triggeredAt = null;

                        userUpdated = true;

                        console.log(`Executed: ${order.stock}`);

                    } catch (err) {
                        console.error(`Order Error (${order.stock}):`, err.message);
                        order.isProcessing = false;
                    }
                }
                else{
                    try {
                        if (order.orderStatus !== "Open") continue;

                        // Prevent duplicate execution
                        if (order.isProcessing) continue;
                        order.isProcessing = true;

                        const now = Date.now();

                        //  Expiry check
                        if (order.validTill && now > new Date(order.validTill).getTime()) {
                            order.orderStatus = "Expired";
                            order.isProcessing = false;
                            order.triggeredAt = null;
                            userUpdated = true;
                            continue;
                        }

                        //  Get stock price (cached)
                        if (!priceCache[order.stock]) {
                            const data = await stockData(order.stock);
                            priceCache[order.stock] = data?.[0]?.price;
                        }

                        const currentPrice = priceCache[order.stock];
                        if (!currentPrice) {
                            order.isProcessing = false;
                            continue;
                        }

                        console.log(`${order.stock} | CMP: ${currentPrice} | Target: ${order.price}`);

                        //  LIMIT ORDER LOGIC (SELL)
                        if (order.orderType === "limit") {

                            // Sell only if price >= target
                            if (currentPrice < order.price) {
                                order.triggeredAt = null;
                                order.isProcessing = false;
                                continue;
                            }

                            const tolerance = 0.002;

                            if (currentPrice > order.price * (1 + tolerance)) {
                                order.triggeredAt = null;
                                order.isProcessing = false;
                                continue;
                            }

                            //  First trigger
                            if (!order.triggeredAt) {
                                order.triggeredAt = now;
                                order.isProcessing = false;
                                continue;
                            }

                            //  Delay
                            if (now - order.triggeredAt < 3000) {
                                order.isProcessing = false;
                                continue;
                            }
                        }

                        //  MARKET ORDER
                        if (order.orderType === "market") {
                            order.price = currentPrice;
                        }

                        //  Check holding
                        const existingStock = user.holding.find(
                            (item) => item.stock === order.stock
                        );

                        if (!existingStock) {
                            console.log(" Stock not in portfolio");
                            order.isProcessing = false;
                            continue;
                        }

                        if (order.quantity > existingStock.quantity) {
                            console.log(" Not enough quantity to sell");
                            order.isProcessing = false;
                            continue;
                        }

                        const totalAmount = order.price * order.quantity;

                        //  Add to wallet
                        user.wallet += totalAmount;

                        const newQty = existingStock.quantity - order.quantity;

                        let newAvg = existingStock.average;

                        if (newQty === 0) {
                            // remove stock completely
                            user.holding = user.holding.filter(
                                (item) => item.stock !== order.stock
                            );
                        } else {
                            newAvg =
                                (existingStock.average * existingStock.quantity -
                                    order.price * order.quantity) / newQty;

                            existingStock.quantity = newQty;
                            existingStock.average = newAvg;
                        }

                        // 🧾 Transaction log
                        user.holdingTransactions.push({
                            stock: order.stock,
                            orderType: "Sell",
                            quantity: order.quantity,
                            price: order.price,
                            executedAt: new Date(),
                            average: newAvg
                        });

                        //  Complete order
                        order.orderStatus = "Completed";
                        order.executedAt = new Date();
                        order.isProcessing = false;
                        order.triggeredAt = null;

                        userUpdated = true;

                        console.log(` Sold: ${order.stock}`);

                    } catch (err) {
                        console.error(` Sell Error (${order.stock}):`, err.message);
                        order.isProcessing = false;
                    }
                }
                }

                if (userUpdated) {
                    await user.save();
                }
            }

        } catch (error) {
            console.error(" Executor Error:", error.message);
        } finally {
            // Safe loop (no overlap)
            setTimeout(runExecutor, 5000);
        }
    }

    runExecutor();
}

// export function buyOrderExecuting() {

//     async function runExecutor() {
//         try {
//             console.log("Running Buy Order Executor...");

//             if (!isIndianMarketOpen()) {
//                 console.log(" Market Closed");
//                 return;
//             }

//             // Fetch only users with open orders
//             const users = await Stock.find({
//                 "orderDetails.orderStatus": "Open"
//             });

//             // Cache for stock prices
//             const priceCache = {};

//             for (let user of users) {
//                 let userUpdated = false;

//                 for (let order of user.orderDetails) {

//                     try {
//                         if (order.orderStatus !== "Open") continue;

//                         // Prevent duplicate execution
//                         if (order.isProcessing) continue;
//                         order.isProcessing = true;

//                         const now = new Date();

//                         // Expiry Check
//                         if (order.validTill && now > order.validTill) {
//                             order.orderStatus = "Expired";
//                             order.isProcessing = false;
//                             userUpdated = true;
//                             console.log(`⏳ Expired: ${order.stock}`);
//                             continue;
//                         }

//                         // Get price (with caching)
//                         if (!priceCache[order.stock]) {
//                             const data = await stockData(order.stock);
//                             priceCache[order.stock] = data?.[0]?.price;
//                         }

//                         const currentPrice = priceCache[order.stock];
//                         if (!currentPrice) {
//                             order.isProcessing = false;
//                             continue;
//                         }

//                         console.log(`${order.stock} | CMP: ${currentPrice} | Target: ${order.price}`);

//                         // Limit Order
//                         if (order.orderType === "limit" && currentPrice > order.price) {
//                             order.isProcessing = false;
//                             continue;
//                         }

//                         // Market Order
//                         if (order.orderType === "market") {
//                             order.price = currentPrice;
//                         }

//                         const totalAmount = order.price * order.quantity;

//                         // Wallet Check
//                         if (user.wallet < totalAmount) {
//                             console.log(`❌ Insufficient balance for ${order.stock}`);
//                             order.isProcessing = false;
//                             continue;
//                         }

//                         //  Deduct wallet
//                         user.wallet -= totalAmount;

//                         // Update Holdings
//                         const existingStock = user.holding.find(
//                             (item) => item.stock === order.stock
//                         );

//                         if (existingStock) {
//                             const newQty = existingStock.quantity + order.quantity;

//                             const newAvg =
//                                 (existingStock.average * existingStock.quantity +
//                                     order.price * order.quantity) / newQty;

//                             existingStock.quantity = newQty;
//                             existingStock.average = newAvg;
//                             existingStock.amountinvested += totalAmount;

//                         } else {
//                             user.holding.push({
//                                 stock: order.stock,
//                                 quantity: order.quantity,
//                                 average: order.price,
//                                 amountinvested: totalAmount,
//                                 price: order.price
//                             });
//                         }

//                         // 🧾 Transaction History
//                         user.holdingTransactions.push({
//                             stock: order.stock,
//                             orderType: "Buy",
//                             quantity: order.quantity,
//                             price: order.price,
//                             executedAt: Date.now(),
//                             average: order.price
//                         });

//                         // ✅ Complete Order
//                         order.orderStatus = "Completed";
//                         order.executedAt = Date.now();
//                         order.isProcessing = false;

//                         userUpdated = true;

//                         console.log(` Executed: ${order.stock}`);

//                     } catch (err) {
//                         console.error(`Order Error (${order.stock}):`, err.message);
//                         order.isProcessing = false;
//                     }
//                 }

//                 // 💾 Save only if updated
//                 if (userUpdated) {
//                     await user.save();
//                 }
//             }

//         } catch (error) {
//             console.error("🔥 Executor Error:", error.message);
//         } finally {
//             // No overlap execution
//             setTimeout(runExecutor, 5000);
//         }
//     }

//     runExecutor();
// }

// export function buyOrderExecuting(){
//     console.log("We have started Executing Buy Orders ");

//     setInterval(async ()=>{

//         try {
//             const now = new Date();

//             if(!isIndianMarketOpen()){
//                 console.log("The Market is Closed Right Now");
//                 return ;
//             }    

//             const users = await Stock.find();

//             for(let user of users ){
//                 let userUpdated = false ;

//                 for(let order of user.orderDetails){
//                     if(order.orderStatus !== 'Open') continue ;
                    
//                     if(order.validTill && now > order.validTill){
//                         order.orderStatus = 'Expired';
//                         console.log(`Order expired for ${order.stock}`);
//                         userUpdated = true;
//                         continue;
//                     }

//                     const data = await stockData(order.stock);
//                     if(!data || !data.length) continue ;

//                     const currentPrice = data[0].price;

//                     console.log(`${order.stock} | Current : ${currentPrice} | Target : ${order.price}`);

//                      if (order.orderType === "limit") {
//                         console.log("This is a limit order");
//                         if (currentPrice > order.price) continue;
//                     }

//                     if (order.orderType === "market") {
//                         order.price = currentPrice;
//                     }

//                     const totalAmount = order.price * order.quantity;

//                     // Wallet Check
//                     if (user.wallet < totalAmount) {
//                         console.log(" Insufficient balance");
//                         continue;
//                     }

//                     // Deduct Wallet
//                     user.wallet -= totalAmount;

//                     //  Update Holdings
//                     const existingStock = user.holding.find(
//                         (item) => item.stock === order.stock
//                     );

//                     if (existingStock) {
//                         console.log("This is an existing stock");

//                         const newQty = existingStock.quantity + order.quantity;

//                         const newAvg =
//                             (existingStock.average * existingStock.quantity +
//                                 order.price * order.quantity) /
//                             newQty;

//                         existingStock.quantity = newQty;
//                         existingStock.average = newAvg;
//                         existingStock.amountinvested += totalAmount;

//                         user.holdingTransactions.push({
//                             stock : order.stock,
//                             orderType : "Buy",
//                             quantity : order.quantity,
//                             price: order.price,
//                             executedAt: Date.now(),
//                             average : existingStock.average
//                         })

//                     } else {

//                         console.log("This is a new stock");
//                         user.holding.push({
//                             stock: order.stock,
//                             quantity: order.quantity,
//                             average: order.price,
//                             amountinvested: totalAmount,
//                             price: order.price
//                         });

//                         user.holdingTransactions.push({
//                             stock : order.stock,
//                             orderType : "Buy",
//                             quantity : order.quantity,
//                             price: order.price,
//                             executedAt: Date.now(),
//                             average : order.price,
//                         })
//                     }

//                     //  Mark Completed
//                     order.orderStatus = "Completed";
//                     order.executedAt = Date.now();

//                     userUpdated = true;

//                     console.log(`Order Executed: ${order.stock}`);
//                 }

//                 //Save only if something changed
//                 if (userUpdated) {
//                     await user.save();
//                 }
//             }
//         } catch (error) {
//             console.error("Buy Order Executor Error:", error.message);
//         }

//     },3000);
// }

export function sellOrderExecuting(){
    console.log("We have started Executing Sell Orders ");

    setInterval(async ()=>{

        try {
            const now = new Date();

            if(!isIndianMarketOpen()){
                console.log("The Market is Closed Right Now");
                return ;
            }    

            const users = await Stock.find();

            for(let user of users ){
                let userUpdated = false ;

                for(let order of user.orderDetails){
                    if(order.orderStatus !== 'Open') continue ;
                    
                    if(order.validTill && now > order.validTill){
                        order.orderStatus = 'Expired';
                        console.log(`Order expired for ${order.stock}`);
                        userUpdated = true;
                        continue;
                    }

                    const data = await stockData(order.stock);
                    if(!data || !data.length) continue ;

                    const currentPrice = data[0].price;

                    console.log(`${order.stock} | Current : ${currentPrice} | Target : ${order.price}`);

                     if (order.orderType === "limit") {
                        if (currentPrice < order.price) continue;
                    }

                    if (order.orderType === "market") {
                        order.price = currentPrice;
                    }

                    const totalAmount = order.price * order.quantity;

                    // Deduct Wallet
                    user.wallet += totalAmount;

                    //  Update Holdings
                    const existingStock = user.holding.find(
                        (item) => item.stock === order.stock
                    );

                    if (existingStock) {

                        const newQty = existingStock.quantity - order.quantity;

                        if(newQty >existingStock.quantity){
                            console.log("We cannot execute the order as entered quantity is more than that in the holding");
                        }
                        else {
                            let newAvg;
                            if(newQty == 0){
                                 existingStock.average = 0;
                            }
                            else{
                        existingStock.quantity = newQty;
                        // existingStock.average = newAvg;
                        existingStock.amountinvested  = existingStock.average * existingStock.quantity;

                        user.holdingTransactions.push({
                            stock : order.stock,
                            orderType : "Sell",
                            quantity : order.quantity,
                            price: order.price,
                            executedAt: Date.now(),
                            average : existingStock.average
                        })
                    }
                }
                    } else {

                        console.log("Ordered stock does not exist in your portfolio");
                    }

                    //  Mark Completed
                    order.orderStatus = "Completed";
                    order.executedAt = Date.now();

                    userUpdated = true;

                    console.log(`Order Executed: ${order.stock}`);
                }

                //Save only if something changed
                if (userUpdated) {
                    await user.save();
                }
            }
        } catch (error) {
            console.error("Sell Order Executor Error:", error.message);
        }

    },3000);
}