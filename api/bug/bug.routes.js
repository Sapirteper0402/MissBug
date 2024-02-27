import express from 'express'
import { getBugs, getBug, removeBug, addBug, updateBug } from './bug.controller.js'
import { requireUser } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'

const router = express.Router()


router.get('/', log, getBugs)
router.get('/:bugId', log, getBug)
router.delete('/:bugId', log, requireUser, removeBug)
router.post('/', log, requireUser, addBug)
router.put('/', log, requireUser, updateBug)



export const bugRoutes = router