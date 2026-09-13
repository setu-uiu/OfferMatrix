import { Router } from 'express'
import { authenticateToken, isAdmin } from '../middlewares/auth.js'
import { listScrapers, triggerScraper } from '../controllers/scrapersController.js'

const router = Router()

router.use(authenticateToken, isAdmin)
router.get('/', listScrapers)
router.post('/trigger/:botName', triggerScraper)

export default router
