const CoursesController = () => import('#controllers/courses_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export default function exampleRoute() {
  router
    .group(() => {
      router.get('/', [CoursesController, 'index'])
      router
        .group(() => {
          router.post('/', [CoursesController, 'store'])
          router.get('/:id', [CoursesController, 'show'])
          router.patch('/:id', [CoursesController, 'update'])
          router.delete('/:id', [CoursesController, 'destroy'])
        })
        .middleware(middleware.auth({ guards: ['api'] }))
    })
    .prefix('/courses')
}
