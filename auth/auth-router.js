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

		res.status(201).json(await Users.add(req.body))
	} catch(err) {
		next(err)
	}
})

router.post("/login", async (req, res, next) => {
	const authError = {
		message: "Invalid Credentials",
	}

	if(!req.body.username || !req.body.password){
		return res.status(409).json({
			message: "Must enter username and password",
		})
	}

	try {
		const user = await Users.findBy({ username: req.body.username }).first()
		if (!user) {
			return res.status(401).json(authError)
		}

		// since bcrypt hashes generate different results due to the salting,
		// we rely on the magic internals to compare hashes rather than doing it
		// manually with "!=="
		const passwordValid = await bcrypt.compare(req.body.password, user.password)
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

		const tokenPayload = {
			userId: user.id,
			userRole: "admin", //this would normally come from the database
			}

		res.cookie("token", jwt.sign(tokenPayload, process.env.JWT_SECRET))
		res.json({
			message: `Welcome ${user.username}!`,
			// token: jwt.sign(tokenPayload, process.env.JWT_SECRET),
		})
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
		if (err) {
            console.log("error destroying")
			next(err)
        } 
        // else {
    //         console.log("no error destroying")
	// 		res.json({
	// 			message: "Logged out",
	// 		})
	// 	}
    // })
   delete req.session
   res.json({
       messagee: "Logged out",
   })
   
})

module.exports = router