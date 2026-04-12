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

export function buyOrderExecuting(){
    console.log("We have started Executing Buy Orders ");

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
                        if (currentPrice > order.price) continue;
                    }

                    if (order.orderType === "market") {
                        order.price = currentPrice;
                    }

                    const totalAmount = order.price * order.quantity;

                    // Wallet Check
                    if (user.wallet < totalAmount) {
                        console.log(" Insufficient balance");
                        continue;
                    }

                    // Deduct Wallet
                    user.wallet -= totalAmount;

                    //  Update Holdings
                    const existingStock = user.holding.find(
                        (item) => item.stock === order.stock
                    );

                    if (existingStock) {

                        const newQty = existingStock.quantity + order.quantity;

                        const newAvg =
                            (existingStock.average * existingStock.quantity +
                                order.price * order.quantity) /
                            newQty;

                        existingStock.quantity = newQty;
                        existingStock.average = newAvg;
                        existingStock.amountinvested += totalAmount;

                        user.holdingTransactions.push({
                            stock : order.stock,
                            orderType : "Buy",
                            quantity : order.quantity,
                            price: order.price,
                            executedAt: Date.now(),
                            average : existingStock.average
                        })

                    } else {

                        user.holding.push({
                            stock: order.stock,
                            quantity: order.quantity,
                            average: order.price,
                            amountinvested: totalAmount,
                            price: order.price
                        });

                        user.holdingTransactions.push({
                            stock : order.stock,
                            orderType : "Buy",
                            quantity : order.quantity,
                            price: order.price,
                            executedAt: Date.now(),
                            average : order.price,
                        })
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
            console.error("Buy Order Executor Error:", error.message);
        }

    },3000);
}

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
                                 (existingStock.average * existingStock.quantity -
                                order.price * order.quantity) / existingStock.quantity;
                            }
                            else{
                        newAvg =
                            (existingStock.average * existingStock.quantity -
                                order.price * order.quantity) /
                            newQty;
                            }
                        existingStock.quantity = newQty;
                        existingStock.average = newAvg;
                        // existingStock.amountinvested -= totalAmount;

                        user.holdingTransactions.push({
                            stock : order.stock,
                            orderType : "Sell",
                            quantity : order.quantity,
                            price: order.price,
                            executedAt: Date.now(),
                            average : existingStock.average
                        })
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