import express from 'express'
import { getUsers, getUser, removeUser, addUser, updateUser } from './user.controller.js'
import { requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'


const router = express.Router()


router.get('/', log, getUsers)
router.get('/:userId', log, getUser)
router.delete('/:userId', log, requireAdmin, removeUser)
router.post('/', log, requireAdmin, addUser)
router.put('/', log, requireAdmin, updateUser)
// router.put('/:userId', updateUser)


export const userRoutes = router