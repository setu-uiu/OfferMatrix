import { Router } from 'express'
import { authenticateToken, isAdmin } from '../middlewares/auth.js'
import { listAffiliates, createAffiliate, updateAffiliate, deleteAffiliate, toggleAffiliate } from '../controllers/affiliatesController.js'

const router = Router()

router.use(authenticateToken, isAdmin)
router.get('/', listAffiliates)
router.post('/', createAffiliate)
router.put('/:id', updateAffiliate)
router.delete('/:id', deleteAffiliate)
router.patch('/:id/toggle', toggleAffiliate)

export default router
