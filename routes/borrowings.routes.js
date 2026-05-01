import express from 'express'
import {
    getAllBorrowings,
    getBorrowingById,
    createBorrowing,
    returnBook,
    deleteBorrowing
} from '../controllers/index.controllers.js'
const router = express.Router()

router.get('/', getAllBorrowings)
router.get('/:id', getBorrowingById)
router.post('/', createBorrowing)

router.put('/return/:id', returnBook)
router.delete('/:id', deleteBorrowing)

export default router