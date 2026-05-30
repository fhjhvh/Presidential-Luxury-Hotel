import prisma from '../config/database.js';

export const getAllUsers = async (filters = {}) => {
  const where = {};

  if (filters.role) {
    where.role = filters.role;
  }

  return await prisma.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      createdAt: true,
      guestProfile: true,
      staffProfile: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getUserById = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      guestProfile: true,
      staffProfile: true,
    },
  });
};

export const updateUser = async (userId, updateData) => {
  const { password, role, ...safeData } = updateData;
  
  return await prisma.user.update({
    where: { id: userId },
    data: safeData,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deleteUser = async (userId) => {
  return await prisma.user.delete({
    where: { id: userId },
  });
};
