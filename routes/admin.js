const express = require("express")
const router = express.Router()
const admin_verifyJWT = require('../admin_verifyJWT')
const User = require('../models/UserModel')
const Order = require('../models/OrderDetail')
const Admin = require('../models/admin')
const Product = require('../models/itemmodel')

const jwt = require('jsonwebtoken')
const jwtSignOptions = {
    algorithm: 'HS256',
  };

router.get('/orderlist', admin_verifyJWT,  async(req, res) => {
    try{
        const order = await Order.find().select('_id order_price createdAt date ordering_person order_status')
        res.status(200).json(order) ; 
        console.log(order)
    } catch(error){
        res.status(500).end()
    }
})

router.get('/orderlist/:date', admin_verifyJWT,  async(req, res) => {
    try{
        if(req.params.date){
            console.log(req.params.date.toString())
            const order = await Order.aggregate([
                { $match :{  "date" : {
                    $gte : new Date(req.params.date.toString()),
                    $lte: new Date(req.params.date.toString())
            }
        }}
    ])
            res.status(200).json(order) ;
        } else {
        const order = await Order.find().select('_id order_price createdAt ordering_person order_status')
        res.status(200).json(order) ;
    }      
    } catch(error){
        res.status(500).end()
    }
})

router.get('/orderdetail/:id',  admin_verifyJWT, async(req, res) => {
    try{
        const order = await Order
        .findById(req.params.id)
        .populate({
            path:"orderContent.product",
            model: Product,            
            select:'name price'           
        }).exec()

        res.status(200).json(order) ; 
    } catch(error){
        console.log(error.message)
        res.status(500).end()
    }
})

router.post('/adminRegister', async(req, res) => {
    try{    
        let admin = new Admin({
            "account"   : req.body.account,
            "firstname"   :   req.body.firstname,   
            "lastname"    :   req.body.lastname,
            "password"    :   req.body.password,
            "permissions" :   req.body.permissions
        }) 
        
        let IsAccountExist = await Admin.exists({account:req.body.account})
        if(IsAccountExist){
            res.status(404).json({message:"account is exist"})
        } else {
        await admin.save()  

        const token = jwt.sign({ admin : admin.account }, process.env["ACCESS_TOKEN_SECRET"], { expiresIn: '3000s' },jwtSignOptions)
            res.status(200).json({'access':token });
        }
    } catch(error) {
        res.status(500).end();
    }
})

router.post('/login', async(req, res) => {
    try{
        let IsAccountExist = await Admin.exists({account:req.body.account})
        if(!IsAccountExist){
            res.status(401).json({message:"account is not exist"})
        }  else {
        let admin = await Admin.findOne({"account":req.body.account}) 
        if (admin.password == req.body.password) {
            let payload = {
                id : admin._id,
                auth : 'ADMIN_LEVEL',
                account : admin.account
            }
            const token = jwt.sign(payload, process.env["ACCESS_TOKEN_SECRET"], { expiresIn: '3000s' },{ algorithm: 'RS256' })
            res.status(200).json({'adminTokenAccess':token});
        } else {
            res.status(401).json({message:'password is incorrect'})
        }
    }
    } catch(error) {
            res.status(500).end();
        }
})

router.post('/modified/:id', admin_verifyJWT, async(req, res) => {
    try{
        let id =  req.params.id  
        
        let order = await Order.findByIdAndUpdate(
            id,
            req.body,
            {new: true}                 //return new data
        )
        console.log(order)
        res.status(200).json(order);
    } catch(error) {
        res.status(500).end();
    }
})

router.post('/launch', admin_verifyJWT, async(req, res) => {
    try {
        let item = new Product(req.body)
        item.save()
    }
    catch (error) {
        console.log(error)
        res.status(500).end()
    }
})

module.exports = router