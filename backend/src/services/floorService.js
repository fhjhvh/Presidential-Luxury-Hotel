import prisma from '../config/database.js';

export const createFloor = async (data) => {
  return await prisma.floor.create({
    data: {
      floorNumber: data.floorNumber,
      name: data.name,
      description: data.description,
      image: data.image,
      order: data.order || 0,
      isActive: data.isActive !== undefined ? data.isActive : true,
    },
    include: {
      rooms: true,
    },
  });
};

export const getAllFloors = async () => {
  return await prisma.floor.findMany({
    orderBy: { order: 'asc' },
    include: {
      rooms: {
        select: {
          id: true,
          roomNumber: true,
          type: true,
          status: true,
        },
      },
    },
  });
};

export const getFloorById = async (id) => {
  return await prisma.floor.findUnique({
    where: { id },
    include: {
      rooms: true,
    },
  });
};

export const updateFloor = async (id, data) => {
  return await prisma.floor.update({
    where: { id },
    data: {
      floorNumber: data.floorNumber,
      name: data.name,
      description: data.description,
      image: data.image,
      order: data.order,
      isActive: data.isActive,
    },
    include: {
      rooms: true,
    },
  });
};

export const deleteFloor = async (id) => {
  return await prisma.floor.delete({
    where: { id },
  });
};

export const updateFloorOrder = async (floors) => {
  const updatePromises = floors.map((floor, index) =>
    prisma.floor.update({
      where: { id: floor.id },
      data: { order: index },
    })
  );
  return await Promise.all(updatePromises);
};
