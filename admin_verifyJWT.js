const jwt = require('jsonwebtoken')

const admin_verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization']    
    if(!authHeader){
        console.log('no token')
        return res.status(401).end()
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env["ACCESS_TOKEN_SECRET"],this.jwtSignOptions, (err, payload) => {
        if (err) {
            console.log(err.message)
            return res.status(401).end()
        }
         else if (payload.auth != 'ADMIN_LEVEL') {
            console.log(payload.auth)           
            return res.status(403).end()
        } 
        else {
            next()
        }
})
}

module.exports = admin_verifyJWT