import vine from '@vinejs/vine'

export default class CourseValidator {
  public static createSchema = vine.object({
    name: vine.string().maxLength(50),
    code: vine.string().maxLength(8),
    credits: vine.number().positive(),
  })

  public static updateSchema = vine.object({
    name: vine.string().maxLength(50).optional(),
    code: vine.string().maxLength(8).optional(),
    credits: vine.number().positive().optional(),
  })
}
