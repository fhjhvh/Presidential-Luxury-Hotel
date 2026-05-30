import prisma from '../config/database.js';

export const createFoodItem = async (data) => {
  return await prisma.foodItem.create({
    data: {
      name: data.name,
      description: data.description,
      category: data.category,
      price: parseFloat(data.price),
      image: data.image,
      order: data.order || 0,
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
    },
  });
};

export const getAllFoodItems = async (query = {}) => {
  const where = {};
  
  if (query.category) {
    where.category = query.category;
  }
  
  if (query.isAvailable !== undefined) {
    where.isAvailable = query.isAvailable === 'true';
  }

  return await prisma.foodItem.findMany({
    where,
    orderBy: { order: 'asc' },
  });
};

export const getFoodItemById = async (id) => {
  return await prisma.foodItem.findUnique({
    where: { id },
  });
};

export const updateFoodItem = async (id, data) => {
  const updateData = {};
  
  if (data.name) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.category) updateData.category = data.category;
  if (data.price !== undefined) updateData.price = parseFloat(data.price);
  if (data.image !== undefined) updateData.image = data.image;
  if (data.order !== undefined) updateData.order = data.order;
  if (data.isAvailable !== undefined) updateData.isAvailable = data.isAvailable;

  return await prisma.foodItem.update({
    where: { id },
    data: updateData,
  });
};

export const deleteFoodItem = async (id) => {
  return await prisma.foodItem.delete({
    where: { id },
  });
};
