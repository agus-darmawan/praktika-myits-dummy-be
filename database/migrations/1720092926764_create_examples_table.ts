import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'examples'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('string', 255).notNullable()
      table.integer('number').notNullable()
      table.boolean('boolean').notNullable()
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
