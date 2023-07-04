const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization']    
    if(!authHeader){
        console.log('no token')
        return res.status(401).send()
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, "secretKey",this.jwtSignOptions, (err, payload) => {
        if (err) {
            console.log(err.message)
            return res.status(401).send()
        } else if(payload.auth != 'USER_LEVEL') {
            return res.status(403).send()
        }
        else {
            next()
        }
})
}


module.exports = verifyJWT