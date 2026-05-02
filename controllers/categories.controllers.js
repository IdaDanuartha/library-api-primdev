import prisma from '../config/database.config.js'

export const getCategories = async (req, res) => {
  // Mengambil semua buku dari database menggunakan Prisma Client
  const categories = await prisma.categories.findMany()

  return res.status(200).json({
    success: true,
    message: 'Categories retrieved successfully',
    data: categories,
  })
}

export const getCategoryById = async (req, res) => {
  // Mendapatkan ID buku yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mengambil buku dengan ID yang sesuai dari database menggunakan Prisma Client
  const category = await prisma.categories.findUnique({
    where: {
      id: id,
    },
  })

  // Jika buku tidak ditemukan, kirimkan pesan error
  if (!category) {
    return res.status(404).json({
      success: false,
      message: `Category with ID: ${id} not found`,
    })
  }

  return res.status(200).json({
    success: true,
    message: 'Category retrieved successfully',
    data: category,
  })
}

export const createCategory = async (req, res) => {
  // Mendapatkan data buku baru dari request body
  const { name } = req.body

  // Menambahkan buku baru ke database menggunakan Prisma Client
  const category = await prisma.categories.create({
    data: {
      name
    },
  })

  return res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category,
  })
}

export const updateCategory = async (req, res) => {
  // Mendapatkan ID buku yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mendapatkan data buku yang akan diupdate dari request body
  const { name } = req.body

  // Mencari buku dengan ID yang sesuai di database menggunakan Prisma Client
  const category = await prisma.categories.findUnique({
    where: {
      id: id,
    },
  })

  // Jika buku tidak ditemukan, kirimkan pesan error
  if (!category) {
    return res.status(404).json({
      success: false,
      message: `Category with ID: ${id} not found`,
    })
  }

  // Mengupdate buku dengan ID yang sesuai di database menggunakan Prisma Client
  const updatedCategory = await prisma.categories.update({
    where: {
      id: id,
    },
    data: {
      name
    },
  })

  return res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: updatedCategory,
  })
}

export const deleteCategory = async (req, res) => {
  // Mendapatkan ID buku yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mencari buku dengan ID yang sesuai di database menggunakan Prisma Client
  const category = await prisma.categories.findUnique({
    where: {
      id: id,
    },
  })

  // Jika buku tidak ditemukan, kirimkan pesan error
  if (!category) {
    return res.status(404).json({
      success: false,
      message: `Category with ID: ${id} not found`,
    })
  }

  // Menghapus buku dengan ID yang sesuai di database menggunakan Prisma Client
  await prisma.categories.delete({
    where: {
      id: id,
    },
  })

  return res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
  })
}