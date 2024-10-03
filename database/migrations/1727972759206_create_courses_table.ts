import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CoursesSchema extends BaseSchema {
  protected tableName = 'courses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 50).notNullable()
      table.string('code', 8).notNullable().unique()
      table.integer('credits').notNullable()
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
