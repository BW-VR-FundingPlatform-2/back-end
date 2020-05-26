exports.seed = async (knex) => {
	await knex("projects").insert([
		{name: "Virtual Reality Celebrity Mansion", target_funding: 50000, current_funding: 20000},
		{name: "Virtual Reality Navy Seal Mission", target_funding: 65000, current_funding: 25000},
		{name: "Virtual Reality Space Flight", target_funding: 70000, current_funding: 30000},
	])
}
