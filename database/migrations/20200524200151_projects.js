exports.up = async function(knex) {
	await knex.schema.createTable("projects", (table) => {
		table.increments()
		table.text("name").notNull().unique()
        table.integer("target_funding").notNull()
        table.integer("current_funding").notNull()
	})
}

exports.down = async function(knex) {
	await knex.schema.dropTableIfExists("projects")
}