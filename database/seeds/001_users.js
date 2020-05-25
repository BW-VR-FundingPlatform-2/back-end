exports.seed = async (knex) => {
	await knex("users").insert([
		{ username: "JaneDoe", email: "jane@doe.com", password: "asdf123"}, 
		{ username: "JohnDoe", email: "john@doe.com", password: "asdf123"},
		{ username: "JackDoe", email: "jack@doe.com", password: "asdf123"},
	])
}
