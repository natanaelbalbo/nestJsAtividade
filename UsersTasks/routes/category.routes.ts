import { Router } from 'express'
import { CategoryController } from '../src/modules/categories/category.controller'
import { authMiddleware } from '../src/shared/middlewares/auth.middleware'
import { errorMiddleware } from '../src/shared/middlewares/error.middleware'

const categoryRoutes = Router()

categoryRoutes.use(authMiddleware)

categoryRoutes.get('/categories', new CategoryController().findAll)
categoryRoutes.get('/categories/:id', new CategoryController().findById)
categoryRoutes.post('/categories', new CategoryController().create)
categoryRoutes.post('/categories/create-many', new CategoryController().createMany)
categoryRoutes.put('/categories/:id', new CategoryController().update)
categoryRoutes.delete('/categories/:id', new CategoryController().delete)

categoryRoutes.use(errorMiddleware)

export { categoryRoutes }

