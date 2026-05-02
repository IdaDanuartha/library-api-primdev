import express from 'express'
import {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/index.controllers.js'
import { authorizeAdmin } from '../middlewares/auth.middleware.js'
const router = express.Router()

router.get('/', getCategories)
router.get('/:id', getCategoryById)
router.post('/', authorizeAdmin, createCategory)

router.put('/:id', authorizeAdmin   , updateCategory)
router.delete('/:id', authorizeAdmin, deleteCategory)

export default router