import { Router } from 'express'
import { authenticateToken, isAdmin } from '../middlewares/auth.js'
import { listUsers, updateUserRole, toggleBanUser } from '../controllers/usersController.js'

const router = Router()

router.use(authenticateToken, isAdmin)
router.get('/', listUsers)
router.patch('/:id/role', updateUserRole)
router.patch('/:id/ban', toggleBanUser)

export default router
