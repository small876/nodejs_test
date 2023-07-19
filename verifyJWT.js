const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization']    
    if(!authHeader){
        console.log('no token')
        return res.status(401).end()
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env["ACCESS_TOKEN_SECRET"],this.jwtSignOptions, (err, payload) => {
        if (err) {
            console.log(err.message)
            return res.status(401).json({message:'請重新登入'})
        } else if(payload.auth != 'USER_LEVEL') {
            return res.status(403).end()
        }
        else {
            next()
        }
})
}


module.exports = verifyJWT