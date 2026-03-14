import express from 'express'
import prisma from './database.js'

const app = express()
const port = 3000
app.use(express.json())

app.get('/books', async (req, res) => {
  // Mengambil semua buku dari database menggunakan Prisma Client
  const books = await prisma.books.findMany()
  
  res.json({
    "success": true,
    "message": "Books retrieved successfully",
    "data": books
  })
})

app.get('/books/:id', async (req, res) => {
  // Mendapatkan ID buku yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mengambil buku dengan ID yang sesuai dari database menggunakan Prisma Client
  const book = await prisma.books.findUnique({
    where: {
      id: id
    }
  })

  // Jika buku tidak ditemukan, kirimkan pesan error
  if (!book) {
    return res.json({
      "success": false,
      "message": `Book with ID: ${id} not found`
    })
  }

  res.json({
    "success": true,
    "message": "Book retrieved successfully",
    "data": book
  })
})

app.post('/books', async (req, res) => {
  // Mendapatkan data buku baru dari request body
  const { title, author, year } = req.body

  // Menambahkan buku baru ke database menggunakan Prisma Client
  const book = await prisma.books.create({
    data: {
      title,
      author,
      year
    }
  })

  res.json({
    "success": true,
    "message": "Book created successfully",
    "data": book
  })
})

app.put('/books/:id', async (req, res) => {
  // Mendapatkan ID buku yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mendapatkan data buku yang akan diupdate dari request body
  const { title, author, year } = req.body

  // Mencari buku dengan ID yang sesuai di database menggunakan Prisma Client
  const book = await prisma.books.findUnique({
    where: {
      id: id
    }
  })

  // Jika buku tidak ditemukan, kirimkan pesan error
  if (!book) {
    return res.json({
      "success": false,
      "message": `Book with ID: ${id} not found`
    })
  }

  // Mengupdate buku dengan ID yang sesuai di database menggunakan Prisma Client
  await prisma.books.update({
    where: {
      id: id
    },
    data: {
      title,
      author,
      year
    }
  })

  res.json({
    "success": true,
    "message": "Book updated successfully",
    "data": book
  })
})

app.delete('/books/:id', async (req, res) => {
  // Mendapatkan ID buku yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mencari buku dengan ID yang sesuai di database menggunakan Prisma Client
  const book = await prisma.books.findUnique({
    where: {
      id: id
    }
  })

  // Jika buku tidak ditemukan, kirimkan pesan error
  if (!book) {
    return res.json({
      "success": false,
      "message": `Book with ID: ${id} not found`
    })
  }

  // Menghapus buku dengan ID yang sesuai di database menggunakan Prisma Client
  await prisma.books.delete({
    where: {
      id: id
    }
  })
  
  res.json({
    "success": true,
    "message": "Book deleted successfully"
  })
})

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`)
})
