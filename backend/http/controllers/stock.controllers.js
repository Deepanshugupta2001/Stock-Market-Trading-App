import Stock from "../../model/Stock.js";
import { addmoney, addStockOrderList, addWatchlist, buyStock, getHolding, geTOrderDetails, getOrderList, getStockChart, loadWallet, removeWatchlist, searchStock, sellStock, stockData, transactions, watchlist, withdrawmoney } from "../services/stock.service.js";

export async function postStockData(req,res,next) {
    try {
    //     const symbol =req.params.symbol;
    //     // const data = await stockData(req.params.symbol);
    //     const data = await stockData(symbol);
    //     res.status(200).json({
    //     data
    // });
//     const userId = req.user._id;
//   const user = await Stock.findById(userId);
//   const symbol = user.watchlist;
    const symbol = req.params.symbol;

    if (!symbol) {
      return res.status(400).json({
        message: "Symbol is required"
      });
    }

  const data = await stockData(symbol);

  res.status(200).json({
    data
});
    } catch (error) {
        res.status(500).json({
            message: 'Error While Showing Stock Data',
            error : error.message
        })
    }
}

export async function getWatchlist(req,res,next) {
    const userId = req.user._id;
    // console.log("User ID hai :",userId);
    try {
        const data = await watchlist(userId);

        res.status(200).json({
            data
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error While Showing Watchlist',
            error : error.message
        })
    }
}

export async function postAddStock(req,res,next) {
    const userId = req.user._id;
    const {symbol} = req.body;
    console.log("User ID hai :",userId);

    try {
       const data = await addWatchlist(userId,symbol);

        res.status(200).json({
                data
            }); 
    } catch (error) {
        res.status(500).json({
            message: 'Error While Adding Stock to Watchlist',
            error : error.message
         })
    }
}

export async function postRemoveStock(req,res,next) {
    const userId = req.user._id;
    const {symbol} = req.params;
    try {
        const data = await removeWatchlist(userId,symbol);

        res.status(200).json({
            data
        });        
    } catch (error) {
        res.status(500).json({
            message: 'Error While Removing Stock from Watchlist',
            error : error.message
        })
    }
}

export async function postAddMoney(req,res,next) {
    const userId = req.user._id ;
    const {amt} = req.body;
    console.log("User ID is ",userId);
    console.log("Amount is ",amt);
    try {
        console.log("Entered in Console");
        const data = await addmoney(userId,amt);
        console.log("Data is ",data);
         res.status(200).json({
                data
            }); 
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Cannot Add Money to Wallet",
            error: error.message
        })
    }
}

export async function postWithdrawMoney(req,res,next) {
    const userId = req.user._id ;
    const {amt} = req.body;
    try {
        const data = await withdrawmoney(userId,amt);
        res.status(200).json({
            data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message : "Cannot Withdraw Money",
            error : error.message
        })
    }
}

export async function postTransactions(req,res,next) {
    const userId = req.user._id;
    try {
        const data = await transactions(userId);
        res.status(200).json({
            data
        })
    } catch (error) {
        res.status(500).json({
            message : "Cannot Show Transactions",
            error: error.message
        })
    }
}

export async function postLoadWallet(req,res,next) {
    const userId= req.user._id;
    try {
        const data = await loadWallet(userId);
        res.status(200).json({
            data
        })
    } catch (error) {
        res.status(500).json({
            message :"Cannot Load Wallet",
            error : error.message
        })
    }
}

export async function getSearchStock(req, res, next) {
    try {
        const { query } = req.params;
        if (!query) {
            return res.status(400).json({ message: "Search query required" });
        }
        const data = await searchStock(query);
        res.status(200).json({ data });
    } catch (error) {
        console.error("Search API Error:", error);
        res.status(500).json({
            message: "Cannot search stock",
            error: error.message
        })
}
}

export async function postShowCharts(req,res,next) {
    try {
        const {symbol} = req.params;
        const {range} = req.query;

        const data = await getStockChart(symbol,range);
        res.status(200).json({
            data
        })
    } catch (error) {
        console.log("Cannot Get Old Stock Data",error);
        res.status(500).json({
            message: "Cannot Get Charts ",
            error :error.message
        })
    }
}

export async function postBuyStock(req,res,next) {
    console.log("Ma controller ma aa gaya hu ");
    const userId = req.user._id;
    try {
        console.log("Ma try ma gaya hu ");
        const {symbol} = req.body;
        const price = req.body.price;
        const {quantity} = req.body;
        const {orderType} = req.body;
        const {purpose} = req.body;
        const {validTill} = req.body;
        console.log("Mera orderType aa raha hai from Frontend ",orderType);

        const data = await buyStock(symbol,price,quantity,userId,orderType,purpose,validTill);
        res.status(200).json({
            data
        })
    } catch (error) {
        console.log("Cannot Purchase Stock",error);
        res.status(500).json({
            message : " Cannot purchase right now",
            error: error.message
        })
    }
}

export async function postSellStock(req,res,next) {
    const userId = req.user._id;
    try {
        const {symbol} = req.body;
        const {price} = req.body;
        const {quantity} = req.body;
        const {orderType} = req.body;
        const {purpose} = req.body;
        const {validTill} = req.body;
        console.log("Ma controller ma aa gaya hu sell ka");
        console.log("Ab mera symbol , price , quantity are :",symbol , price , quantity,orderType,purpose,validTill);
        const data = await sellStock(userId,symbol,price,quantity,orderType,purpose,validTill);
        res.status(200).json({
            data
        })
    } catch (error) {
        console.log("Cannot Sell Stock",error);
        res.status(500).json({
            message : "Cannot Sell Right Now",
            error : error.message,
        })
    }
}

export async function postOrderList(req,res,next) {
    const userId = req.user._id;

    try {
        const data = await getOrderList(userId);
        res.status(200).json({
            data
        })
    } catch (error) {
        console.log("Cannot get Orderlist");
        res.status(500).json({
            message: "Cannot Get order List Right Now",
            error : error.message
        })        
    }
}

export async function postAddStockOrderList(req,res,next) {
    const userId = req.user._id;
    const {symbol} = req.body;
    try {
        const data = await addStockOrderList(userId,symbol);
        res.status(200).json({
            data
        })
    } catch (error) {
        console.log("We are unable to add Stock to Order List");
        res.status(500).json({
            message : "We are unable to add Stock to Order List right now",
            error : error.message,
        })
    }
}

export async function postGetOrderDetails(req,res,next) {
    const userId = req.user._id;

    try{
        const data = await geTOrderDetails(userId);
        res.status(200).json({
            data
        })
    }
    catch(error){
        console.log("We currently cannot get order details");
        res.status(500).json({
            message : "We are unable to get order details",
            error : error.message,
        })
    }
}

export async function postGetHolding(req,res,next) {
    const userId = req.user._id ;

    try {
        const data = await getHolding(userId);
        res.status(200).json({
            data
        })
    } catch (error) {
        console.log("We currently cannot get holdings");
        res.status(500).json({
            message : "We are unable to get holding details",
            error: error.message,
        })     
    }
}