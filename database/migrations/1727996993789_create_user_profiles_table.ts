import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_profiles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id')
        .unsigned().references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
        
      table.string('nim', 20).notNullable().unique()
      table.string('full_name', 255).notNullable()
      table.string('phone_number', 20).notNullable()
      table.string('photo_profile', 255).nullable()
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}


