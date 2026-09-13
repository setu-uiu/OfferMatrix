import { Router } from 'express'
import { authenticateToken, isAdmin } from '../middlewares/auth.js'
import { listSettings, updateSetting, toggleSetting } from '../controllers/offerMatrixController.js'

const router = Router()

router.use(authenticateToken, isAdmin)
router.get('/', listSettings)
router.put('/:id', updateSetting)
router.patch('/:id/toggle', toggleSetting)

export default router
