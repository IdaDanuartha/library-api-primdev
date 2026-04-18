import bcrypt from 'bcrypt'
import prisma from '../config/database.config.js'

export const getUsers = async (req, res) => {
  // Mengambil semua user dari database menggunakan Prisma Client
  const users = await prisma.users.findMany()

  res.json({
    success: true,
    message: 'users retrieved successfully',
    data: users,
  })
}

export const getUserById = async (req, res) => {
  // Mendapatkan ID user yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mengambil user dengan ID yang sesuai dari database menggunakan Prisma Client
  const user = await prisma.users.findUnique({
    where: {
      id: id,
    },
    include: {
      profiles: {
        select: {
          address: true,
          phone: true,
        }
      }
    }
  })

  // Jika user tidak ditemukan, kirimkan pesan error
  if (!user) {
    return res.json({
      success: false,
      message: `user with ID: ${id} not found`,
    })
  }

  res.json({
    success: true,
    message: 'user retrieved successfully',
    data: user,
  })
}

export const createUser = async (req, res) => {
  // Mendapatkan data user baru dari request body
  const { name, email, password } = req.body

  // Mengenkripsi password menggunakan bcrypt
  const hashedPassword = await bcrypt.hash(password, 10)

  // Menambahkan user baru ke database menggunakan Prisma Client
  const user = await prisma.users.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  res.json({
    success: true,
    message: 'user created successfully',
    data: user,
  })
}

export const updateUser = async (req, res) => {
  // Mendapatkan ID user yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mendapatkan data user yang akan diupdate dari request body
  const { name, email, password } = req.body

  // Mencari user dengan ID yang sesuai di database menggunakan Prisma Client
  const user = await prisma.users.findUnique({
    where: {
      id: id,
    },
  })

  // Jika user tidak ditemukan, kirimkan pesan error
  if (!user) {
    return res.json({
      success: false,
      message: `user with ID: ${id} not found`,
    })
  }

  // Menyiapkan data yang akan diupdate
  const dataToUpdate = { name, email }

  // Jika password baru diberikan, enkripsi terlebih dahulu
  if (password) {
    dataToUpdate.password = await bcrypt.hash(password, 10)
  }

  // Mengupdate user dengan ID yang sesuai di database menggunakan Prisma Client
  const updatedUser = await prisma.users.update({
    where: {
      id: id,
    },
    data: dataToUpdate,
  })

  res.json({
    success: true,
    message: 'user updated successfully',
    data: updatedUser,
  })
}

export const deleteUser = async (req, res) => {
  // Mendapatkan ID user yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mencari user dengan ID yang sesuai di database menggunakan Prisma Client
  const user = await prisma.users.findUnique({
    where: {
      id: id,
    },
  })

  // Jika user tidak ditemukan, kirimkan pesan error
  if (!user) {
    return res.json({
      success: false,
      message: `user with ID: ${id} not found`,
    })
  }

  // Menghapus user dengan ID yang sesuai di database menggunakan Prisma Client
  await prisma.users.delete({
    where: {
      id: id,
    },
  })

  res.json({
    success: true,
    message: 'user deleted successfully',
  })
}

export const isUserExist = async (id) => {
  // Mencari pengguna dengan ID yang sesuai di database menggunakan Prisma Client
  const user = await prisma.users.findUnique({
    where: {
      id: id,
    },
  })

  return !!user
}