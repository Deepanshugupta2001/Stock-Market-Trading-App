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
      required : true
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
}, { 
  timestamps: true  // Optional: createdAt/updatedAt
});

export default mongoose.models.stocks || mongoose.model('stocks', stockSchema);