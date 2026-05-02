import express from 'express'
import {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
} from '../controllers/index.controllers.js'
import {
    bookValidation,
    updateBookValidation
} from '../validations/books.validation.js'

import { authorizeAdmin } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.get('/', getBooks)
router.get('/:id', getBookById)
router.post('/', authorizeAdmin, bookValidation, createBook)

router.put('/:id', authorizeAdmin, updateBookValidation, updateBook)
router.delete('/:id', authorizeAdmin, deleteBook)

export default router