import prisma from '../config/database.config.js'
import {
  checkValidationResult
} from '../helpers/check-validations.js'
import { getFileUrl, uploadFile, deleteFile } from './cloudinary.controller.js'
import logger from '../config/logger.config.js'

export const getBooks = async (req, res) => {
  // Mengambil semua buku dari database menggunakan Prisma Client
  try {
    logger.debug('getBooks: Started')
    const books = await prisma.books.findMany()

    logger.info({ count: books.length }, 'Retrieved books from database')

    books.forEach((book) => {
      if (!book.cloudinaryId) {
        book.coverUrl = null
      } else {
        book.coverUrl = getFileUrl(book.cloudinaryId)
      }
    })

    logger.debug('Generated cover URLs for all books')

    return res.status(200).json({
      success: true,
      message: 'Books retrieved successfully',
      data: books,
    })
  } catch (error) {
    logger.error({ error: error.message }, 'Failed to retrieve books')
    // ↑ Log error untuk debugging di production
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving books',
      error: error.message,
    })
  }
}

export const getBookById = async (req, res) => {
  // Mendapatkan ID buku yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mengambil buku dengan ID yang sesuai dari database menggunakan Prisma Client
  const book = await prisma.books.findUnique({
    where: {
      id: id,
    },
  })

  // Jika buku tidak ditemukan, kirimkan pesan error
  if (!book) {
    return res.status(404).json({
      success: false,
      message: `Book with ID: ${id} not found`,
    })
  }

  // Tambahkan ini
  if (book.cloudinaryId) {
    book.coverUrl = getFileUrl(book.cloudinaryId)
  } else {
    book.coverUrl = null
  }

  return res.json({
    success: true,
    message: 'Book retrieved successfully',
    data: book,
  })
}

export const createBook = async (req, res, next) => {
  checkValidationResult(req, res, next)

  // Mendapatkan data buku baru dari request body
  const { categoryId, title, author, year } = req.body

  const categoryExists = await prisma.categories.findUnique({
    where: {
      id: categoryId,
    },
  })

  if (!categoryExists) {
    return res.json({
      success: false,
      message: `Category with ID: ${categoryId} not found`,
    })
  }

  const cover = req.file
  let cloudinaryId = null

  if (cover) {
    const result = await uploadFile(cover)

    cloudinaryId = result.public_id
}

  // Menambahkan buku baru ke database menggunakan Prisma Client
  const book = await prisma.books.create({
    data: {
      categoryId,
      title,
      author,
      year,
      cloudinaryId,
    },
  })

  return res.status(201).json({
    success: true,
    message: 'Book created successfully',
    data: book,
  })
}

export const updateBook = async (req, res, next) => {
  checkValidationResult(req, res, next)

  // Mendapatkan ID buku yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mendapatkan data buku yang akan diupdate dari request body
  const { categoryId, title, author, year } = req.body

  // Mencari buku dengan ID yang sesuai di database menggunakan Prisma Client
  const book = await prisma.books.findUnique({
    where: {
      id: id,
    },
  })

  // Jika buku tidak ditemukan, kirimkan pesan error
  if (!book) {
    return res.status(404).json({
      success: false,
      message: `Book with ID: ${id} not found`,
    })
  }

  const cover = req.file
  let cloudinaryId = book.cloudinaryId

  // Jika ada file cover yang diunggah, unggah ke Cloudinary dan dapatkan public_id-nya
  if (cover) {
    // Jika buku sudah memiliki cover sebelumnya,
    // hapus file cover lama dari Cloudinary menggunakan public_id yang disimpan di database
    if (book.cloudinaryId) {
      const deleted = await deleteFile(book.cloudinaryId)
    }

    const result = await uploadFile(cover)
    cloudinaryId = result.public_id
  }

  // Mengupdate buku dengan ID yang sesuai di database menggunakan Prisma Client
  const updatedBook = await prisma.books.update({
    where: {
      id: id,
    },
    data: {
      categoryId,
      title,
      author,
      year,
      cloudinaryId
    },
  })

  return res.status(200).json({
    success: true,
    message: 'Book updated successfully',
    data: updatedBook,
  })
}

export const deleteBook = async (req, res) => {
  // Mendapatkan ID buku yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mencari buku dengan ID yang sesuai di database menggunakan Prisma Client
  const book = await prisma.books.findUnique({
    where: {
      id: id,
    },
  })

  // Jika buku tidak ditemukan, kirimkan pesan error
  if (!book) {
    return res.status(404).json({
      success: false,
      message: `Book with ID: ${id} not found`,
    })
  }

  if (book.cloudinaryId) {
    const deleted = await deleteFile(book.cloudinaryId)
  }

  // Menghapus buku dengan ID yang sesuai di database menggunakan Prisma Client
  await prisma.books.delete({
    where: {
      id: id,
    },
  })

  return res.status(200).json({
    success: true,
    message: 'Book deleted successfully',
  })
}

export const isBookExist = async (id) => {
  // Mencari buku dengan ID yang sesuai di database menggunakan Prisma Client
  const book = await prisma.books.findUnique({
    where: {
      id: id,
    },
  })

  return !!book
}