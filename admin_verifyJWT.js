const jwt = require('jsonwebtoken')

const admin_verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization']    
    if(!authHeader){
        console.log('no token')
        return res.status(401).json()
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, "secretKey",this.jwtSignOptions, (err, payload) => {
        if (err) {
            console.log(err.message)
            return res.status(401).send()
        }
         else if (payload.auth != 'ADMIN_LEVEL') {
            console.log(payload.auth)           
            return res.status(403).send()
        } 
        else {
            next()
        }
})
}

module.exports = admin_verifyJWT