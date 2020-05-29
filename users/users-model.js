const bcrypt = require("bcryptjs")
const db = require("../database/config")

async function add(user) {
	// hash the password with a time complexity of 8
	user.password = await bcrypt.hash(user.password, 8)

	const id = await db("users").insert(user)
	return findById({id})
}

function find() {
	return db("users").select("id", "username")
}

// function find(query = {}) {
// 	const { page = 1, limit = 100, sortBy = "id", sortDir = "asc" } = query
// 	const offset = limit * (page - 1)

// 	return db("users")
// 		.orderBy(sortBy, sortDir)
// 		.limit(limit)
// 		.offset(offset)
// 		.select()
// }

function findBy(filter) {
	console.log("filter:", filter)
	return db("users")
		.select("id", "username", "password", "email")
		.where(filter)
}

function findById(id) {
	return db("users")
		.select("id", "username")
		.where({ id })
		.first()
}

function remove(id) {
	return db("users")
		.where({ id })
		.del()
}

async function update(id, changes) {
	await db("users")
		.where({ id })
		.update(changes)

	return findById(id)
}

function findUserProjects(userId) {
	return db("projects as p")
		.join("users as u", "p.user_id", "u.id")
		.where({ user_id: userId })
		.select(["p.id", "p.text", "u.name as user"])
}

function findUserProjectById(userId, id) {
	return db("projects")
		.where({ id, user_id: userId })
		.first()
}

async function addUserProject(userId, project) {
	const data = { user_id: userId, ...project }
	const [id] = await db("projects").insert(data)

	return findUserProjectById(userId, id)
}

module.exports = {
	add,
	find,
	findBy,
	findById,
	remove,
	update,
	findUserProjects,
	findUserProjectById,
	addUserProject
}