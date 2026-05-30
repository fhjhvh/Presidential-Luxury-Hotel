import prisma from '../config/database.js';

export const createFeature = async (data) => {
  return await prisma.feature.create({
    data: {
      name: data.name,
      description: data.description,
      icon: data.icon,
      image: data.image,
      category: data.category || 'room',
      order: data.order || 0,
      isActive: data.isActive !== undefined ? data.isActive : true,
    },
  });
};

export const getAllFeatures = async (query = {}) => {
  const where = {};
  
  if (query.category) {
    where.category = query.category;
  }
  
  if (query.isActive !== undefined) {
    where.isActive = query.isActive === 'true';
  }

  return await prisma.feature.findMany({
    where,
    orderBy: { order: 'asc' },
  });
};

export const getFeatureById = async (id) => {
  return await prisma.feature.findUnique({
    where: { id },
  });
};

export const updateFeature = async (id, data) => {
  return await prisma.feature.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      icon: data.icon,
      image: data.image,
      category: data.category,
      order: data.order,
      isActive: data.isActive,
    },
  });
};

export const deleteFeature = async (id) => {
  return await prisma.feature.delete({
    where: { id },
  });
};
