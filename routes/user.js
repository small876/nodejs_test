const express = require("express")
const router = express.Router()
const verifyJWT = require('../verifyJWT')
const User = require('../models/UserModel')
const Order = require('../models/OrderDetail')
const jwt = require('jsonwebtoken')
const Product = require('../models/itemmodel')
const jwtSignOptions = {
    algorithm: 'HS256',
};

router.post('/purchase', verifyJWT, async (req, res) => {
    this.jwtSignOptions = jwtSignOptions
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader.split(' ')[1]
        let payload = jwt.verify(token, process.env["ACCESS_TOKEN_SECRET"], jwtSignOptions)
        let data = Object.assign(req.body, { ordering_person: payload.id })

        let post = new Order(data)
        await post.save()

        await User.findByIdAndUpdate(payload.id, { $push: { orderhistory: post._id } })     //push to orderhistory


        const orderinfo = await Order.
            findById(post._id, {
                projection: {
                    orderContent: 1,
                    order_price: 1,
                    name: 1,
                    date: 1,
                    address: 1,
                    phone: 1,
                    payment: 1
                }
            })
            .populate({
                path: "orderContent",
                model: Product,
                select: 'name price'
            }).exec()

        console.log(orderinfo)
        res.status(200).json({ "orderinfo": orderinfo })
    } catch (error) {
        console.log(error.message)
        res.status(500).end()
    }
})

router.post('/update', verifyJWT, async (req, res) => {
    this.jwtSignOptions = jwtSignOptions
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader.split(' ')[1]
        let payload = jwt.verify(token, process.env["ACCESS_TOKEN_SECRET"], jwtSignOptions)
        let id = new mongo.ObjectId(payload.id)

        let new_info = await User.findByIdAndUpdate(
            id,
            req.body,
            { new: true }                 //return new data
        )

        console.log(new_info)
        res.status(200).json({ "orderinfo": new_info })
    } catch (error) {
        console.log(error.message)
        res.status(500).end()
    }
})

router.get('/userinfo', verifyJWT, async (req, res) => {
    this.jwtSignOptions = jwtSignOptions
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader.split(' ')[1]
        let payload = jwt.verify(token, process.env["ACCESS_TOKEN_SECRET"], jwtSignOptions)
        // let id = new mongo.ObjectId(payload.id)

        const orderitemdetail = await User.findById(payload.id).select('firstname lastname birth orderhistory createdAt updatedAt')
            .populate({
                path: "orderhistory",
                model: Order,
                populate: {
                    path: "orderContent.product",
                    model: Product,
                    select: 'name'
                },
            })
            .exec()
        res.status(200).json(orderitemdetail)
    } catch (error) {
        console.log(error.message)
        res.status(500).end()
    }
}
)

router.post('/login', async (req, res) => {
    try {
        let IsAccountExist = await User.exists({ account: req.body.account })
        if (!IsAccountExist) {
            res.status(401).json({ message: 'account is not exist'})
        } else {
            let user = await User.findOne({ "account": req.body.account })
            if (user.password == req.body.password) {
                let payload = {
                    id: user._id,
                    auth: 'USER_LEVEL',
                    account: user.account
                }
                const token = jwt.sign(payload, process.env["ACCESS_TOKEN_SECRET"], { expiresIn: '3000s' }, { algorithm: 'RS256' })
                res.status(200).json({ 'authTokenAccess': token });
            } else {
                res.status(401).json({ message: 'password is incorrect' })
            }
        }
    } catch (error) {
        res.status(500).end()
    }
})

router.post('/register', async (req, res) => {
    try {
        let user = new User({
            "account": req.body.account,
            "firstname": req.body.firstname,
            "lastname": req.body.lastname,
            "birth": req.body.birth,
            "password": req.body.password
        })

        let IsAccountExist = await User.exists({ account: req.body.account })
        if (IsAccountExist) {
            res.status(401).json({ message: "account is exist" })
        } else {
            await user.save()

            const orderitemdetail = await User.findOne({ "account": req.body.account }).select('firstname lastname birth orderhistory createdAt updatedAt')


            const token = jwt.sign({ user: user.account }, process.env["ACCESS_TOKEN_SECRET"], { expiresIn: '3000s' }, jwtSignOptions)
            res.status(200).json({ 'access': token, 'orderitemdetail': orderitemdetail, 'IsAccountExist': IsAccountExist });
        }
    } catch (error) {
        res.status(500).end()
    }
})


module.exports = router