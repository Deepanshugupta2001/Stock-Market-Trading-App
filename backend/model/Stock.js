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
    }]
}, { 
  timestamps: true  // Optional: createdAt/updatedAt
});

export default mongoose.models.stocks || mongoose.model('stocks', stockSchema);