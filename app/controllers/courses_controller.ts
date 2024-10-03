import Course from '#models/course'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import CourseValidator from '#validators/course' 
import messagesProvider from '#helpers/validation_messages_provider'

export default class CoursesController {
  async index({ response }: HttpContext) {
    try {
      const courses = await Course.all()
      return response.ok({
        success: true,
        message: 'Courses retrieved successfully.',
        data: courses,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to retrieve courses.',
        error: error.message,
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const course = await Course.find(params.id)
      if (!course) {
        return response.notFound({
          success: false,
          message: 'Course not found.',
        })
      }

      return response.ok({
        success: true,
        message: 'Course retrieved successfully.',
        data: course,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to retrieve course.',
        error: error.message,
      })
    }
  }

  async store({ request, response }: HttpContext) {
    const data = await vine
      .compile(CourseValidator.createSchema)
      .validate(request.all(), { messagesProvider })

    try {
      const course = await Course.create(data)
      return response.created({
        success: true,
        message: 'Course created successfully.',
        data: course,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Failed to create course.',
        error: error.messages || error.message,
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    const course = await Course.find(params.id)
    if (!course) {
      return response.notFound({
        success: false,
        message: 'Course not found.',
      })
    }

    const data = await vine
      .compile(CourseValidator.updateSchema)
      .validate(request.all(), { messagesProvider })

    try {
      course.merge(data)
      await course.save()
      return response.ok({
        success: true,
        message: 'Course updated successfully.',
        data: course,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Failed to update course.',
        error: error.messages || error.message,
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    const course = await Course.find(params.id)
    if (!course) {
      return response.notFound({
        success: false,
        message: 'Course not found.',
      })
    }

    try {
      await course.delete()
      return response.ok({
        success: true,
        message: 'Course deleted successfully.',
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to delete course.',
        error: error.message,
      })
    }
  }
}
