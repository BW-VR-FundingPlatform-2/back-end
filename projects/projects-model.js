const db = require("../database/config")

// function find(query = {}) {
// 	const { page = 1, limit = 100, sortBy = "id", sortDir = "asc" } = query
// 	const offset = limit * (page - 1)

// 	return db("users")
// 		.orderBy(sortBy, sortDir)
// 		.limit(limit)
// 		.offset(offset)
// 		.select()
// }

function find() {
	return db("projects").select("name", "target_funding", "current_funding")
}

function findById(id) {
	return db("users")
		.where({ id })
		.first()
}

async function add(hub) {
	const [id] = await db("users").insert(hub)
	return findById(id)
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
		.select(["p.id", "p.name", "p.target_funding", "p.current_funding", "u.username as user"])
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
	find,
	findById,
	add,
	remove,
	update,
	findUserProjects,
	findUserProjectById,
	addUserProject,
}
