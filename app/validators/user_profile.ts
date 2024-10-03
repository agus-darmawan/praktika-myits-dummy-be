import vine from '@vinejs/vine'

export default class UserProfileValidator {
  public static createSchema = vine.object({
    full_name: vine.string().trim(),
    nim: vine.string().trim(),
    phone_number: vine.string().trim(),
    photo_profile: vine.string().nullable(),
  })

  public static updateSchema = vine.object({
    full_name: vine.string().optional(),
    nim: vine.string().optional(),
    phone_number: vine.string().optional(),
    photo_profile: vine.string().nullable(),
  })
}
