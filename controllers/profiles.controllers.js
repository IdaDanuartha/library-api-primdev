import prisma from '../config/database.config.js'

export const getProfiles = async (req, res) => {
  // Mengambil semua buku dari database menggunakan Prisma Client
  const profiles = await prisma.profiles.findMany()

  res.json({
    success: true,
    message: 'Profiles retrieved successfully',
    data: profiles,
  })
}

export const getProfileById = async (req, res) => {
  // Mendapatkan ID buku yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mengambil buku dengan ID yang sesuai dari database menggunakan Prisma Client
  const profile = await prisma.profiles.findUnique({
    where: {
      id: id,
    },
  })

  // Jika buku tidak ditemukan, kirimkan pesan error
  if (!profile) {
    return res.json({
      success: false,
      message: `Profile with ID: ${id} not found`,
    })
  }

  res.json({
    success: true,
    message: 'Profile retrieved successfully',
    data: profile,
  })
}

export const createProfile = async (req, res) => {
  // Mendapatkan data buku baru dari request body
  const { userId, address, phone } = req.body

  // Menambahkan buku baru ke database menggunakan Prisma Client
  const profile = await prisma.profiles.create({
    data: {
      userId,
      address,
      phone,
    },
  })

  res.json({
    success: true,
    message: 'Profile created successfully',
    data: profile,
  })
}

export const updateProfile = async (req, res) => {
  // Mendapatkan ID buku yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mendapatkan data buku yang akan diupdate dari request body
  const { userId, address, phone } = req.body

  // Mencari buku dengan ID yang sesuai di database menggunakan Prisma Client
  const profile = await prisma.profiles.findUnique({
    where: {
      id: id,
    },
  })

  // Jika buku tidak ditemukan, kirimkan pesan error
  if (!profile) {
    return res.json({
      success: false,
      message: `Profile with ID: ${id} not found`,
    })
  }

  // Mengupdate buku dengan ID yang sesuai di database menggunakan Prisma Client
  const updatedProfile = await prisma.profiles.update({
    where: {
      id: id,
    },
    data: {
      userId,
      address,
      phone,
    },
  })

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedProfile,
  })
}

export const deleteProfile = async (req, res) => {
  // Mendapatkan ID buku yang akan diupdate dari parameter URL
  // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
  const id = parseInt(req.params.id)

  // Mencari buku dengan ID yang sesuai di database menggunakan Prisma Client
  const profile = await prisma.profiles.findUnique({
    where: {
      id: id,
    },
  })

  // Jika buku tidak ditemukan, kirimkan pesan error
  if (!profile) {
    return res.json({
      success: false,
      message: `Profile with ID: ${id} not found`,
    })
  }

  // Menghapus buku dengan ID yang sesuai di database menggunakan Prisma Client
  await prisma.profiles.delete({
    where: {
      id: id,
    },
  })

  res.json({
    success: true,
    message: 'Profile deleted successfully',
  })
}