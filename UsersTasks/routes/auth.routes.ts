import { Router } from 'express'
import { UserController } from '../src/modules/users/user.controller'
import { authMiddleware } from '../src/shared/middlewares/auth.middleware'
import { errorMiddleware } from '../src/shared/middlewares/error.middleware'

const authRoutes = Router()

authRoutes.get('/health-check', (req, res) => res.send('OK'))
authRoutes.post('/user', new UserController().create)
authRoutes.post('/login', new UserController().login)

authRoutes.use(authMiddleware)

authRoutes.get('/profile', new UserController().getProfile)
authRoutes.patch('/profile', new UserController().updateProfile)
authRoutes.patch('/profile/password', new UserController().updatePassword)

authRoutes.use(errorMiddleware)

export { authRoutes }

