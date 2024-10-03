import vine from '@vinejs/vine'

export default class EnrollmentValidator {
  public static createSchema = vine.object({
    studentId: vine.number(),
    courseId: vine.number(),
    status: vine.enum(['in_progress', 'completed', 'failed']),
    semester: vine.string().minLength(3).maxLength(10),
    gradeLetter: vine.string().maxLength(2).optional(),
    gradeNumber: vine.number().optional(),
  })

  public static updateSchema = vine.object({
    studentId: vine.number().optional(),
    courseId: vine.number().optional(),
    status: vine.enum(['in_progress', 'completed', 'failed']).optional(),
    semester: vine.string().minLength(3).maxLength(10).optional(),
    gradeLetter: vine.string().maxLength(2).optional(),
    gradeNumber: vine.number().optional(),
  })
}
