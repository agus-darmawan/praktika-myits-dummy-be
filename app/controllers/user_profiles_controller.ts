import UserProfile from '#models/user_profile'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { saveFile, checkBase64, deleteFile, getFilePath, getFileName } from '#helpers/file_helpers'
import path from 'node:path'
import UserProfileValidator from '#validators/user_profile'
import messagesProvider from '#helpers/validation_messages_provider'

export default class UserProfilesController {
  
  async index({ response }: HttpContext) {
    const profiles = await UserProfile.all()
    return response.ok({
      success: true,
      message: 'Profiles retrieved successfully.',
      data: profiles,
    })
  }

  async store({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()

    const existingProfile = await UserProfile.query().where('user_id', user.id).first()
    if (existingProfile) {
      return response.badRequest({
        success: false,
        message: 'Profile already exists for the logged-in user.',
      })
    }

    const data = await vine
      .compile(UserProfileValidator.createSchema)
      .validate(request.all(), { messagesProvider })

    const validFormats = ['png', 'jpg', 'jpeg']
    if (!data.photo_profile) {
      return response.badRequest({
        success: false,
        message: 'Photo profile is required.',
      })
    }
    const fileExtension = checkBase64(data.photo_profile, validFormats)
    if (!fileExtension) {
      return response.unsupportedMediaType({
        success: false,
        message: `Invalid file format. Only ${validFormats.join(', ')} are allowed.`,
      })
    }

    const filePath = getFilePath(user.id, 'profile_photo')
    const fileName = getFileName(data.full_name, fileExtension)

    try {
      await saveFile(data.photo_profile, filePath, fileName)
      const profile = await UserProfile.create({
        userId: user.id,
        nim: data.nim,
        fullName: data.full_name,
        phoneNumber: data.phone_number,
        photoProfile: path.join(filePath, fileName),
      })
      return response.created({
        success: true,
        message: 'Profile created successfully.',
        data: profile,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to create profile.',
        error: error.message,
      })
    }
  }

  async show({ response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const profile = await UserProfile.query().where('user_id', user.id).first()

    if (!profile) {
      return response.notFound({
        success: false,
        message: 'Profile not found for the logged-in user.',
      })
    }

    return response.ok({
      success: true,
      message: 'Profile retrieved successfully.',
      data: profile,
    })
  }

  async update({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const profile = await UserProfile.query().where('user_id', user.id).first()
  
    if (!profile) {
      return response.notFound({
        success: false,
        message: 'Profile not found for the logged-in user.',
      })
    }
  
    const data = await vine
      .compile(UserProfileValidator.updateSchema)
      .validate(request.all(), { messagesProvider })
  
    const validFormats = ['png', 'jpg', 'jpeg']
    let fileName
  
    if (data.photo_profile) {
      const fileExtension = checkBase64(data.photo_profile, validFormats)
      if (!fileExtension) {
        return response.unsupportedMediaType({
          success: false,
          message: `Invalid file format. Only ${validFormats.join(', ')} are allowed.`,
        })
      }
  
      const filePath = getFilePath(user.id, 'profile_photo')
      const fullName = data.full_name || profile.fullName
      fileName = getFileName(fullName, fileExtension)
      const oldFilePath = profile.photoProfile
  
      try {
        await saveFile(data.photo_profile, filePath, fileName)
        if (oldFilePath) await deleteFile(oldFilePath)
      } catch (error) {
        return response.internalServerError({
          success: false,
          message: 'Failed to update profile photo.',
          error: error.message,
        })
      }
    }
  
    try {
      profile.merge({
        fullName: data.full_name || profile.fullName,
        nim: data.nim || profile.nim,
        phoneNumber: data.phone_number || profile.phoneNumber,
        ...(fileName && { photoProfile: path.join(getFilePath(user.id, 'profile_photo'), fileName) }),
      })
  
      await profile.save()
  
      return response.ok({
        success: true,
        message: 'Profile updated successfully.',
        data: profile,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to update profile.',
        error: error.message,
      })
    }
  }
  
  async destroy({ response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const profile = await UserProfile.query().where('user_id', user.id).first()

    if (!profile) {
      return response.notFound({
        success: false,
        message: 'Profile not found for the logged-in user.',
      })
    }

    const filePath = profile.photoProfile

    try {
      if (filePath) await deleteFile(filePath)
      await profile.delete()
      return response.ok({
        success: true,
        message: 'Profile deleted successfully.',
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to delete profile.',
        error: error.message,
      })
    }
  }
}
