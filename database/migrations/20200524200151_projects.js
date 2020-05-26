exports.up = async function(knex) {
	await knex.schema.createTable("projects", table => {
		table.increments()
        table.text("name")
        table.integer("target_funding")
        table.integer("current_funding")
		table.timestamps(true, true)
		table
			.integer("user_id")
			.unsigned()
			.references("id")
			.inTable("users")
			.onDelete("CASCADE")
            .onUpdate("CASCADE")
      
	})
}

exports.down = async function(knex) {
	await knex.schema.dropTableIfExists("projects")
}