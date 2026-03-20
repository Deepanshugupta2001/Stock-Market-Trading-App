import Stock from "../../model/Stock.js";
import { addmoney, addWatchlist, loadWallet, stockData, transactions, watchlist, withdrawmoney } from "../services/stock.service.js";

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

// export async function postRemoveStock(req,res,next) {
//     const userId = req.user._id;
//     const {symbol} = req.params.symbol;
//     try {
//         const data = await removeWatchlist(userId,symbol);

//         res.status(200).json({
//             data
//         });        
//     } catch (error) {
//         res.status(500).json({
//             message: 'Error While Removing Stock from Watchlist',
//             error : error.message
//         })
//     }
// }

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