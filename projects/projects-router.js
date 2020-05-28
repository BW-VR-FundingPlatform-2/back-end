const express = require("express")
const projects = require("./projects-model.js")
const restrict = require("../middleware/restrict")

const router = express.Router()

// Since projects in this case is a sub-resource of the user resource,s
// include it as a sub-route. If you list all of a users projects, you
// don't want to see projects from another user.
router.get("/:id/projects", restrict(), validateUserId(), (req, res) => {
	projects.findUserProjects(req.params.id)
		.then((projects) => {
			res.status(200).json(projects)
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Could not get user's projects",
			})
		})
})

// Since we're now dealing with two IDs, a user ID and a project ID,
// we have to switch up the URL parameter names.
// id === user ID and projectId === project ID
router.get("/:id/projects/:projectId", restrict(), validateUserId(), (req, res) => {
	projects.findUserProjectById(req.params.id, req.params.projectId)
		.then((project) => {
			if (project) {
				res.json(project)
			} else {
				res.status(404).json({
					message: "Project was not found",
				})
			}
		})
		.catch((error) => {
			next(error)
		})
})

router.post("/:id/projects", restrict(), validateUserId(), (req, res) => {
	if (!req.body.name || !req.body.target_funding || !req.body.current_funding) {
		// Make sure you have a return statement, otherwise the
		// function will continue running and you'll see ERR_HTTP_HEADERS_SENT
		return res.status(400).json({
			message: "The project's name, target funding, and current funding all need values",
		})
	}

	projects.addUserProject(req.params.id, req.body)
		.then((project) => {
			res.status(201).json(project)
		})
		.catch((error) => {
			next(error)
		})
})

function validateUserData() {
	return (req, res, next) => {
		if (!req.body.username || !req.body.email) {
			return res.status(400).json({
				message: "Missing user name or email",
			})
		}
		next()
	}
}

function validateUserId() {
	return (req, res, next) => {
		projects.findById(req.params.id)
			.then((user) => {
				if (user) {
					// make the user object available to later middleware functions
					req.user = user
					next()
				} else {
					res.status(404).json({
						message: "User not found",
					})
				}
			})
			.catch(next)
	}
}

module.exports = router