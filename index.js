const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const mongo = require('mongodb')
const Product = require('./models/itemmodel')

require('dotenv').config()

const userRouter = require("./routes/user")
const adminRouter = require("./routes/admin")



const ObjectId = mongoose.Schema.Types.ObjectId

// var mongoDB = 'mongodb://127.0.0.1:27017/'
var mongodb = process.env["mongourl"]
var PORT = process.env.port || 3000
app.use(express.json())

const corsOptions = {
    "origin":"*",
    "methods": 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
  };
app.use(cors(corsOptions));

app.get('/',(req,res)=>{
    res.send('hello')
}
).listen(PORT,(console.log(`node is running in ${PORT}`)))

mongoose.connect(mongodb)
.then(console.log('connected to mongoDB'))
.catch((err)=>{console.log(err)})

app.get('/products', async(req, res)=>{
    try{
        const products = await Product.find().select('name price')
        console.log("get products") 
        res.status(200).json(products);    
    } catch(error){
        res.status(500).end()
    }
})

app.get('/productsdetail/:id', async(req, res)=>{
        try{
            const itemdetail = await Product.findById(req.params.id)
            console.log(itemdetail) 
            res.status(200).json(itemdetail)     
        } catch(error){
            console.log(error.message)
            res.status(500).end()
        }
})


app.use('/user', userRouter)
app.use('/admin', adminRouter)