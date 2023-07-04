const mongoose = require('mongoose')

const AdminSchema = mongoose.Schema(
    {  account:{
        type : String,
        required : [true, "please enter account"],
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
        password:{
            type :String,
            required : [true, "please enter password"] ,
            trim:true
        },
        permissions:{
            type : Number,
            default : 1,
            min: 1,
            max: 5
        }
        
    },
    {
        timestamps:true
    } 
)

const Admin = mongoose.model('Admin',AdminSchema);
module.exports = Admin ;