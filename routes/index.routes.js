import express from 'express'
import booksRoute from './books.routes.js'
import usersRoute from './users.routes.js'
import profilesRoute from './profiles.routes.js'
import categoriesRoute from './categories.routes.js'
import borrowingsRoute from './borrowings.routes.js'
import authRoute from './auth.routes.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.get('/', (req, res) => {
  return res.send('Welcome to the API Library')
})

router.use('/auth', authRoute)
router.use('/books', authenticateToken, booksRoute)
router.use('/users', authenticateToken, usersRoute)
router.use('/profiles', authenticateToken, profilesRoute)
router.use('/categories', authenticateToken, categoriesRoute)
router.use('/borrowings', authenticateToken, borrowingsRoute)

export default router