import prisma from '../config/database.js';

export const createRoom = async (roomData) => {
  return await prisma.room.create({ data: roomData });
};

export const getAllRooms = async (filters = {}) => {
  const where = {};
  if (filters.status) where.status = filters.status;
  if (filters.floor) where.floor = parseInt(filters.floor);
  if (filters.type) where.type = filters.type;
  if (filters.section) where.section = filters.section;
  if (filters.minPrice) where.currentPrice = { ...where.currentPrice, gte: parseFloat(filters.minPrice) };
  if (filters.maxPrice) where.currentPrice = { ...where.currentPrice, lte: parseFloat(filters.maxPrice) };

  const rooms = await prisma.room.findMany({
    where,
    orderBy: [{ floor: 'asc' }, { roomNumber: 'asc' }],
    include: {
      bookings: {
        where: {
          status: { in: ['CONFIRMED', 'CHECKED_IN', 'PENDING'] },
          checkOutDate: { gte: new Date() },
        },
        orderBy: { checkInDate: 'asc' },
        take: 1,
        select: { checkInDate: true, checkOutDate: true, status: true },
      },
    },
  });

  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return rooms.map(({ bookings, ...room }) => {
    const activeBooking = bookings?.[0] ?? null;
    let visualStatus = 'available';
    let nextAvailableDate = null;

    if (room.status === 'MAINTENANCE') {
      visualStatus = 'maintenance';
    } else if (room.status === 'OCCUPIED' || activeBooking) {
      const checkOut = activeBooking?.checkOutDate ?? null;
      nextAvailableDate = checkOut;
      if (checkOut && new Date(checkOut) <= in24h) {
        visualStatus = 'near-available'; // becomes free within 24h → purple
      } else {
        visualStatus = 'booked'; // fully occupied → red
      }
    }

    return { ...room, visualStatus, nextAvailableDate };
  });
};

export const getRoomById = async (roomId) => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      bookings: {
        where: { status: { in: ['CONFIRMED', 'CHECKED_IN'] } },
        orderBy: { checkInDate: 'desc' },
      },
    },
  });
  if (!room) return null;

  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const activeBooking = room.bookings.find(b => new Date(b.checkOutDate) >= now) ?? null;
  let visualStatus = 'available';
  let nextAvailableDate = null;

  if (room.status === 'MAINTENANCE') {
    visualStatus = 'maintenance';
  } else if (room.status === 'OCCUPIED' || activeBooking) {
    nextAvailableDate = activeBooking?.checkOutDate ?? null;
    visualStatus = nextAvailableDate && new Date(nextAvailableDate) <= in24h ? 'near-available' : 'booked';
  }

  return { ...room, visualStatus, nextAvailableDate };
};

export const updateRoom = async (roomId, updateData) => {
  return await prisma.room.update({ where: { id: roomId }, data: updateData });
};

export const deleteRoom = async (roomId) => {
  return await prisma.room.delete({ where: { id: roomId } });
};

export const filterRoomsByPreferences = async (preferences) => {
  const { numberOfGuests, stayType, preferencesList = [], budget } = preferences;
  const where = { status: 'AVAILABLE' };

  if (numberOfGuests) where.capacity = { gte: parseInt(numberOfGuests) };
  if (budget) where.currentPrice = { lte: parseFloat(budget) };

  if (stayType === 'luxury') {
    where.type = { in: ['JUNIOR_SUITE', 'EXECUTIVE_SUITE', 'FAMILY_SUITE', 'PRESIDENTIAL_SUITE', 'ROYAL_SUITE'] };
  } else if (stayType === 'family') {
    where.type = { in: ['FAMILY', 'FAMILY_SUITE'] };
    where.capacity = { gte: 4 };
  } else if (stayType === 'couple' || stayType === 'honeymoon') {
    where.type = { in: ['COUPLE', 'DELUXE', 'JUNIOR_SUITE'] };
  } else if (preferencesList.includes('budget')) {
    where.type = { in: ['SINGLE', 'STANDARD'] };
  }

  const rooms = await prisma.room.findMany({
    where,
    orderBy: [{ type: 'desc' }, { currentPrice: 'asc' }],
  });

  return rooms.map(r => {
    let score = 0;
    const f = typeof r.features === 'string' ? (() => { try { return JSON.parse(r.features); } catch { return {}; } })() : (r.features || {});
    if (preferencesList.includes('view') && f.view) score += 10;
    if (preferencesList.includes('spa') && (f.jacuzzi || f.sauna)) score += 8;
    if (preferencesList.includes('pool') && f.pool_access) score += 7;
    if (preferencesList.includes('butler') && f.butler_service) score += 9;
    return { ...r, matchScore: score };
  }).sort((a, b) => b.matchScore - a.matchScore);
};
