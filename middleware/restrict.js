const jwt = require("jsonwebtoken")

function restrict(/*role = "normal"*/) {
	return async (req, res, next) => {
		const authError = {
			message: "Invalid credentials",
		}

		try {
			console.log(req.headers)
			const token = req.cookies.token
			if(!token){
				return res.status(401).json(authError)
			}

			jwt.verify(token, process.env.JWT_SECRET, (err, decodedPayload) => {git 
				if (err /*|| decodedPayload.userRole !== role*/) {
					return res.status(401).json(authError)
				}

				req.token = decodedPayload
				next()
			})
			
		} catch(err) {
			next(err)
		}
	}
}

module.exports = restrict