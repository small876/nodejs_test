const mongoose = require('mongoose')

const UserSchema = mongoose.Schema(
    {  account:{
        type : String,
        required : [true, "please enter item name"],
        trim:true
    },   
        firstname:{
            type : String,
            required : [true, "please enter item name"],
            trim:true
        },   
        lastname:{
            type : String,
            required : [true, "please enter item name"],
            trim:true
        },
        birth:{
            type:Date,
            required : true,
        },
        password:{
            type :String,
            required : [true, "please enter password"] ,
            trim:true
        },
        orderhistory:{
            type:[{ type: mongoose.Schema.Types.ObjectId, ref:"Order" }]           
        }
    },
    {
        timestamps:true
    } 
)

const User = mongoose.model('User',UserSchema);
module.exports = User ;