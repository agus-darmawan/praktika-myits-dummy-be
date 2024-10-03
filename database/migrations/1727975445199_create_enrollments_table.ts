import { BaseSchema } from '@adonisjs/lucid/schema'

export default class EnrollmentsSchema extends BaseSchema {
  protected tableName = 'enrollments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('student_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('students')
        .onDelete('CASCADE')

      table.integer('course_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('courses')
        .onDelete('CASCADE')

      table.string('status', 20).notNullable()
      table.string('semester', 10).notNullable()
      table.string('grade_letter', 2)
      table.decimal('grade_number', 4, 2)
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.check(`status IN ('in_progress', 'completed', 'failed')`)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
