import { Router } from 'express'
import { authenticateToken, isAdmin } from '../middlewares/auth.js'
import { listFraud, resolveFraud, dispatchFraud } from '../controllers/fraudController.js'

const router = Router()

router.use(authenticateToken, isAdmin)
router.get('/', listFraud)
router.patch('/:id/resolve', resolveFraud)
router.post('/:id/dispatch', dispatchFraud)

export default router
