import { Router } from 'express'
import { TaskTypeController } from '../src/modules/tasks/controllers/task-type.controller'
import { authMiddleware } from '../src/shared/middlewares/auth.middleware'
import { errorMiddleware } from '../src/shared/middlewares/error.middleware'

const taskTypeRoutes = Router()

taskTypeRoutes.use(authMiddleware)

taskTypeRoutes.get('/task-type', new TaskTypeController().findAll)
taskTypeRoutes.get('/task-type/:id', new TaskTypeController().findById)
taskTypeRoutes.post('/task-type', new TaskTypeController().create)
taskTypeRoutes.put('/task-type/:id', new TaskTypeController().update)
taskTypeRoutes.delete('/task-type/:id', new TaskTypeController().delete)

taskTypeRoutes.use(errorMiddleware)

export { taskTypeRoutes }

