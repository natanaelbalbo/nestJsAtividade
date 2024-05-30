import { Router } from 'express'
import { TaskController } from '../src/modules/tasks/controllers/task.controller'
import { authMiddleware } from '../src/shared/middlewares/auth.middleware'
import { errorMiddleware } from '../src/shared/middlewares/error.middleware'

const taskRoutes = Router()

taskRoutes.use(authMiddleware)

taskRoutes.get('/tasks', new TaskController().findAll)
taskRoutes.get('/tasks/:id', new TaskController().findById)
taskRoutes.post('/tasks', new TaskController().create)
taskRoutes.put('/tasks/:id', new TaskController().update)
taskRoutes.delete('/tasks/:id', new TaskController().delete)


// Filters and statistics routes
taskRoutes.get('/tasks/user/:id', new TaskController().findByUser)
taskRoutes.get('/tasks/category/:id', new TaskController().findByCategory)
taskRoutes.get('/tasks/status/done', new TaskController().findDoneTasks)
taskRoutes.get('/tasks/status/pending', new TaskController().findPendingTasks)
taskRoutes.get('/tasks/user/count/:id', new TaskController().countUserTasks)
taskRoutes.get('/tasks/user/latest/:id', new TaskController().findLastTask)
taskRoutes.get('/tasks/average/conclusion', new TaskController().findAverageConclusion)
taskRoutes.get('/tasks/longest/description', new TaskController().findLongestDescription)
taskRoutes.get('/tasks/user/oldest/:id', new TaskController().findOldestTask)

taskRoutes.use(errorMiddleware)

export { taskRoutes }

