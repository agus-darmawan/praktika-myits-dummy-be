const EnrollmentsController = () => import('#controllers/enrollments_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export default function enrollmentRoute() {
  router
    .group(() => {
      router.get('/', [EnrollmentsController, 'index'])

      router
        .group(() => {
          router.post('/', [EnrollmentsController, 'store'])
          router.get('/:id', [EnrollmentsController, 'show'])

          router
            .group(() => {
              router.patch('/:id', [EnrollmentsController, 'update'])
              router.delete('/:id', [EnrollmentsController, 'destroy'])
              router.get('/student/courses', [EnrollmentsController, 'getCoursesByStudent'])
              router.get('/student/course-status/:id', [EnrollmentsController, 'checkCourseStatus'])
            })
            .use(middleware.verifiedEmail())
        })
        .middleware(middleware.auth({ guards: ['api'] }))
    })
    .prefix('/enrollments')
}
