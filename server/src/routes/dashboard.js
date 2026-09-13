import { Router } from 'express'
import { authenticateToken, isAdmin } from '../middlewares/auth.js'
import { getMetrics } from '../controllers/dashboardController.js'

const router = Router()

router.use(authenticateToken, isAdmin)
router.get('/metrics', getMetrics)

export default router
