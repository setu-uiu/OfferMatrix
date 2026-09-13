import { Router } from 'express'
import { authenticateToken, isAdmin } from '../middlewares/auth.js'
import { listComplaints, getStats, resolveComplaint, toggleSuspendUser } from '../controllers/complaintsController.js'

const router = Router()

router.use(authenticateToken, isAdmin)
router.get('/', listComplaints)
router.get('/stats', getStats)
router.patch('/:id/resolve', resolveComplaint)
router.post('/users/:userId/suspend', toggleSuspendUser)

export default router
