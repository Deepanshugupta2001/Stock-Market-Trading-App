import { Router } from "express";
import { getWatchlist, postAddMoney, postAddStock, postLoadWallet, postStockData, postTransactions, postWithdrawMoney } from "../controllers/stock.controllers.js";
import requireAuth from "../middlewares/requireAuth.js";
const router= Router();

router.get('/quote/:symbol',requireAuth, postStockData);
router.get('/watchlist',requireAuth,getWatchlist);
router.post('/watchlist',requireAuth, postAddStock);
// router.delete('/watchlist/:symbol', postRemoveStock);
router.post('/addmoney',requireAuth ,postAddMoney);
router.post('/withdrawmoney',requireAuth ,postWithdrawMoney);
router.get('/transactions',requireAuth,postTransactions);
router.get('/loadwallet',requireAuth, postLoadWallet);

export default router;