import prisma from '../config/database.config.js'
import {
  checkValidationResult
} from '../helpers/check-validations.js'

export const getBooks = async (req, res) => {
  // Mengambil semua buku dari database menggunakan Prisma Client
  const books = await prisma.books.findMany()

  return res.status(200).json({
    success: true,
    message: 'Books retrieved successfully',
    data: books,
  })
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

  // Menambahkan buku baru ke database menggunakan Prisma Client
  const book = await prisma.books.create({
    data: {
      categoryId,
      title,
      author,
      year,
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