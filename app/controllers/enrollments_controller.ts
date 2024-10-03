import Enrollment from '#models/enrollment'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import EnrollmentValidator from '#validators/enrollment'
import messagesProvider from '#helpers/validation_messages_provider'

export default class EnrollmentsController {
  async index({ response }: HttpContext) {
    try {
      const enrollments = await Enrollment.all()
      return response.ok({
        success: true,
        message: 'Enrollments retrieved successfully.',
        data: enrollments,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to retrieve enrollments.',
        error: error.message,
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const enrollment = await Enrollment.find(params.id)
      if (!enrollment) {
        return response.notFound({
          success: false,
          message: 'Enrollment not found.',
        })
      }

      return response.ok({
        success: true,
        message: 'Enrollment retrieved successfully.',
        data: enrollment,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to retrieve enrollment.',
        error: error.message,
      })
    }
  }

  async store({ request, response }: HttpContext) {
    const data = await vine
      .compile(EnrollmentValidator.createSchema)
      .validate(request.all(), { messagesProvider })

    try {
      const enrollment = await Enrollment.create(data)
      return response.created({
        success: true,
        message: 'Enrollment created successfully.',
        data: enrollment,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Failed to create enrollment.',
        error: error.messages || error.message,
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    const enrollment = await Enrollment.find(params.id)
    if (!enrollment) {
      return response.notFound({
        success: false,
        message: 'Enrollment not found.',
      })
    }

    const data = await vine
      .compile(EnrollmentValidator.updateSchema)
      .validate(request.all(), { messagesProvider })

    try {
      enrollment.merge(data)
      await enrollment.save()
      return response.ok({
        success: true,
        message: 'Enrollment updated successfully.',
        data: enrollment,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Failed to update enrollment.',
        error: error.messages || error.message,
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    const enrollment = await Enrollment.find(params.id)
    if (!enrollment) {
      return response.notFound({
        success: false,
        message: 'Enrollment not found.',
      })
    }

    try {
      await enrollment.delete()
      return response.ok({
        success: true,
        message: 'Enrollment deleted successfully.',
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to delete enrollment.',
        error: error.message,
      })
    }
  }

  async getCoursesByStudent({ auth, response }: HttpContext) {
    try {
      const studentId = auth.user!.id 
      const enrollments = await Enrollment.query().where('student_id', studentId)

      return response.ok({
        success: true,
        message: 'Courses retrieved successfully.',
        data: enrollments,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to retrieve courses for the student.',
        error: error.message,
      })
    }
  }

  async checkCourseStatus({ auth, params, response }: HttpContext) {
    try {
      const studentId = auth.user!.id 
      const courseId = params.id
      
      const enrollment = await Enrollment.query().where('student_id', studentId).andWhere('course_id', courseId).first()

      if (!enrollment) {
        return response.notFound({
          success: false,
          message: 'No data found for this course enrollment.',
        })
      }

      return response.ok({
        success: true,
        message: 'Course enrollment status retrieved successfully.',
        status: enrollment.status,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to check course enrollment status.',
        error: error.message,
      })
    }
  }
}
