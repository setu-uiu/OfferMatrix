import { Router } from 'express'
import { authenticateToken, isAdmin } from '../middlewares/auth.js'
import { getPendingDeals, listDeals, updateDealStatus } from '../controllers/dealsController.js'

const router = Router()

router.use(authenticateToken, isAdmin)
router.get('/pending', getPendingDeals)
router.get('/', listDeals)
router.patch('/:id/status', updateDealStatus)

export default router
