import { Router } from "express";
import { getSearchStock, getWatchlist, postAddMoney, postAddStock, postLoadWallet, postRemoveStock, postShowCharts, postStockData, postTransactions, postWithdrawMoney } from "../controllers/stock.controllers.js";
import requireAuth from "../middlewares/requireAuth.js";
const router= Router();

router.get('/quote/:symbol',requireAuth, postStockData);
router.get('/search/:query',requireAuth, getSearchStock);
router.get('/watchlist',requireAuth,getWatchlist);
router.post('/watchlist',requireAuth, postAddStock);
router.delete('/watchlist/:symbol', requireAuth ,postRemoveStock);
router.post('/addmoney',requireAuth ,postAddMoney);
router.post('/withdrawmoney',requireAuth ,postWithdrawMoney);
router.get('/transactions',requireAuth,postTransactions);
router.get('/loadwallet',requireAuth, postLoadWallet);
router.get('/chart/:symbol',requireAuth,postShowCharts);

export default router;