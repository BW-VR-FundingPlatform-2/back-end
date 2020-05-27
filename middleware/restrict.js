const jwt = require("jsonwebtoken")

function restrict(role = "admin") {
	return async (req, res, next) => {
		const authError = {
			message: "Invalid credentials",
		}

		try {
			console.log(req.headers)
            const token = req.cookies.token
            console.log("token", token)
			if(!token){
                console.log("no token")
				return res.status(401).json(authError)
			}

			jwt.verify(token, process.env.JWT_SECRET, (err, decodedPayload) => {
				if (err || decodedPayload.userRole !== role) {
                    console.log("req.token", req.token)
					return res.status(401).json(authError)
				}
                req.token = decodedPayload
                console.log("req.token", req.token)
				
				next()
			})
			
		} catch(err) {
            
			next(err)
		}
	}
}
module.exports = restrict