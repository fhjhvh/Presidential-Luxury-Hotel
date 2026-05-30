import prisma from '../config/database.js';

export const createParkingSpot = async (data) => {
  return await prisma.parkingSpot.create({
    data: {
      spotNumber: data.spotNumber,
      floor: data.floor,
      floorId: data.floorId || null,
      type: data.type || 'STANDARD',
      status: data.status || 'AVAILABLE',
      description: data.description || null,
    },
  });
};

export const getAllParkingSpots = async () => {
  return await prisma.parkingSpot.findMany({
    orderBy: { floor: 'asc' },
  });
};

export const getParkingSpotById = async (id) => {
  return await prisma.parkingSpot.findUnique({
    where: { id },
  });
};

export const updateParkingSpot = async (id, data) => {
  return await prisma.parkingSpot.update({
    where: { id },
    data: {
      spotNumber: data.spotNumber,
      floor: data.floor,
      floorId: data.floorId,
      type: data.type,
      status: data.status,
      description: data.description,
    },
  });
};

export const deleteParkingSpot = async (id) => {
  return await prisma.parkingSpot.delete({
    where: { id },
  });
};
