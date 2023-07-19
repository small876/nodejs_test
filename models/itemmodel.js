const mongoose = require('mongoose')

const productsSchema = mongoose.Schema(
    {
        name:{
            type : String,
            required : [true, "please enter item name"],
            trim:true
        },
        price:{
            type : Number,
            required:true
        },
        quantity:{
            type : Number,
            required:true,
            default:0
        },
        intro:{
            type:String,
            required:true,
            trim:true
        }
    },
    {
        timestamps:true
    } 
)

const Product = mongoose.model('Product',productsSchema);
module.exports = Product;