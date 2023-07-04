const mongoose = require('mongoose')

const OrderSchema = mongoose.Schema(
    {  
        ordering_person:{
            type:mongoose.Types.ObjectId,
            ref:"User",
            required:[true, 'no person'],
            default: undefined
        },
        orderContent:           
                [{  _id: false,
                    product : { 
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"Product",
                    require:true ,
                    default: undefined
                }
            ,
                 order_quantity : { 
                    type: Number,
                    require:true 
                }
            ,
                 order_item_price : { 
                    type: Number,
                    require:true 
                }
            },  
            ],
       
        order_price:{
            type:Number,
            required:[true, 'order_price']
        },
        order_status:{
            type:String,
            default:'O'
        },
        receiver:{
            type:String,
            required:[true, 'receiver'] 
        },
        phone_number:{
            type:String,
            required:[true, 'phone_number'] 
        },
        payment:{
            type:String,
            default:'O'
        },
        date:{
            type:Date,
            required:[true, 'date']
        },
        address:{
            type:String,
            required:[true, 'address']
        }

    },
    {
        timestamps:true,
    } 
)

const Order = mongoose.model('Order',OrderSchema);
module.exports = Order ;