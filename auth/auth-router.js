// const express = require("express")
const router = require('express').Router()
const bcrypt = require("bcryptjs")
const Users = require("../users/users-model")
const restrict = require("../middleware/restrict")
const jwt = require("jsonwebtoken")
// const router = express.Router()

router.post("/register", async (req, res, next) => {
	try {
    const { username } = req.body
    console.log('req.body.username', req.body.username)
    console.log('req.body.password', req.body.password)
    console.log('req.body.email', req.body.email)
    const user = await Users.findBy({ username }).first()
    console.log('user', user)
		if(user){
			return res.status(409).json({
				message: "Username is already taken",
			})
		}

		if(!req.body.username || !req.body.password || !req.body.password){
			return res.status(409).json({
				message: "Must enter username, password, and email",
			})
		}
        await Users.add(req.body)
		res.status(201).json({
            message: `Register success.`
        })
	} catch(err) {
		next(err)
	}
})

router.post("/login", restrict(), async (req, res, next) => {
	const authError = {
		message: "Invalid Credentials",
	}
    console.log("inside login")
	if(!req.body.username || !req.body.password){
		return res.status(409).json({
			message: "Must enter username and password",
		})
	}

	try {
        console.log("req.body.username", req.body.username)
        const user = await Users.findBy( { username: req.body.username }).first()
        console.log("console user:", user)
		if (!user) {
			return res.status(401).json(authError)
		}

		// since bcrypt hashes generate different results due to the salting,
		// we rely on the magic internals to compare hashes rather than doing it
		// manually with "!=="
        const passwordValid = await bcrypt.compare(req.body.password, user.password)
        console.log("console passwordValid:", passwordValid)
		if (!passwordValid) {
			return res.status(401).json(authError)
		}

		// creates a new session for the user and saves it in memory.
		// it's this easy since we're using `express-session`
		// req.session.user = user

		if(!req.body.username || !req.body.password){
			return res.status(409).json({
				message: "Must enter username and password",
			})
		}

		// const tokenPayload = {
		// 	userId: user.id,
		
        //     }
        //     console.log("tokenPayload", tokenPayload)
        //     console.log("JWT_SECRET", JWT_SECRET)
        
        // const token = jwt.sign(tokenPayload, process.env.JWT_SECRET)
        // console.log("console token:", token)
		// res.json({
        //     message: `Welcome ${user.username}!`,
        //     token: token,
			
        // })
        const jwtKey = process.env.JWT_SECRET
        const jwtExpirySeconds = 3000

        const { username, password } = req.body
    // Create a new token with the username in the payload
	// and which expires 300 seconds after issue
	const token = jwt.sign({ username }, jwtKey, {
		algorithm: "HS256",
		expiresIn: jwtExpirySeconds,
	})
	console.log("token:", token)

	// set the cookie as the token string, with a similar max age as the token
	// here, the max age is in milliseconds, so we multiply by 1000
    res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 })
    res.status(200).json({
            message: `Welcome ${user.username}!`,
            token: token,
			
        })
	res.end()
	} catch(err) {
		next(err)
	}
})

router.get("/logout", restrict(), (req, res, next) => {
	// this will delete the session in the database and try to expire the cookie,
	// though it's ultimately up to the client if they delete the cookie or not.
    // but it becomes useless to them once the session is deleted server-side.
    console.log("about to destroy session")
	// req.session.destroy((err) => {
		// if (err) {
        //     console.log("error destroying")
		// 	next(err)
        // } 
        // else {
    //         console.log("no error destroying")
	// 		res.json({
	// 			message: "Logged out",
	// 		})
	// 	}
    // })
   delete req.session
   res.status(200).json({
       messagee: "Logged out",
   })
   
})

module.exports = router