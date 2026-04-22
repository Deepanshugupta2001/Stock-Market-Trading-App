// import mongoose from "mongoose";

// const stocksSchema = new mongoose.Schema({
//     mobno : {
//         type : String,
//         required : true,
//         unique: true,
//     },
//     password : {
//         type : String,
//         required : true,
//     },
//     name : {
//         type : String
//     }
// })

// export default mongoose.model('stocks', stocksSchema);

import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  mobno: {
    type: String,
    required: [true, "Mobile number is required"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  name: {
    type: String,
    trim: true,
    required : true
  },
  watchlist: {
      type: [String],
      default: []
  },
  wallet:{
      type: Number,
      default : 0,
      min: 0,
  },
  transactions:[{
      type:{
        type: String,
        enum : ["Deposit", "Withdrawal"],
        required : true
      },
      previousbalance:{
        type:Number,
        required: true,
        default : 0,
        min : 0,
      },
      amount:{
        type: Number,
        required : true
      },
      balance: {
        type: Number,
        required : true
      },
      date :{
        type: Date,
        default : Date.now,
        required : true,
      }
 }],
 holding:[{
    // type:{
    //   type:String,
    //   required : true,
    //   enum :["Buy","Sell"]
    // },
    // purprice:{
    //   type: Number,
    //   required : true
    // },
    average:{
      type :Number
    },
    sellprice :{
      type: Number,
      // required : true
    },
    quantity : {
      type : Number,
      required : true
    },
    amountinvested : {
      type :Number,
    },
    price : {
      type : Number,
      required : true,
    },
    change : {
      type: Number,
      // required : true
    },
    stock : {
      type: String,
      required : true,
    },

 }],
 orderlist:{
  type: [String],
  default :[]
 },
 orderDetails : [{
  stock : {
    type : String,
    required : true,
  },
  price : {
    type : Number,
    required : true,
  },
  placedAt:{
    type : Date,
    default : Date.now,
  },
  orderType : {
    type : String,
    required : true,
  },
  quantity : {
    type : Number,
    required : true,
  },
  orderStatus : {
    type : String,
    required : true,
    enum : ["Open","Completed","Expired","Cancelled"],
  },
  executedAt : {
    type : Date,
  },
  validTill : {
    type : Date,
    // required : true,
  },
  isProcessing :{
    type : Boolean,
    default : false,
  },
  triggeredAt :{
    type: Number,
    default : null,
  },
  purpose : {
    type : String,
    enum : ["Buy", "Sell"],
  }
 }],
 holdingTransactions :[{
  stock :{
    type: String ,
    required : true ,
  },
  orderType : {
    type : String,
    required : true,
    enum : ["Buy","Sell"],
    default : "Buy",
  },
  quantity : {
    type : Number,
    required : true,
  },
  price :{
    type : Number,
    required : true,
  },
  executedAt :{
    type : Date,
    required: true,
    default : Date.now,
  },
  average: {
    type: Number,
    required : true,
  },
 }],
}, { 
  timestamps: true  // Optional: createdAt/updatedAt
});

stockSchema.index({ "orderDetails.orderStatus": 1 });

export default mongoose.models.stocks || mongoose.model('stocks', stockSchema);