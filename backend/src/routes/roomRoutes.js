import express from 'express';
import prisma from '../config/database.js';
import { getAllRooms, getRoomById } from '../services/roomService.js';

const router = express.Router();

// GET all rooms - NO AUTH — uses roomService so visualStatus + nextAvailableDate are computed
router.get('/', async (req, res) => {
  try {
    const rooms = await getAllRooms(req.query);
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// GET room by ID
router.get('/:id', async (req, res) => {
  try {
    const room = await getRoomById(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

// Filter rooms by preferences
router.post('/filter', async (req, res) => {
  try {
    const { type, minPrice, maxPrice, capacity, status } = req.body;
    const where = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (capacity) where.capacity = { gte: capacity };
    if (minPrice || maxPrice) {
      where.currentPrice = {};
      if (minPrice) where.currentPrice.gte = minPrice;
      if (maxPrice) where.currentPrice.lte = maxPrice;
    }
    const rooms = await prisma.room.findMany({ where, include: { floorRef: true } });
    res.json(rooms);
  } catch (error) {
    console.error('Error filtering rooms:', error);
    res.status(500).json({ error: 'Failed to filter rooms' });
  }
});

// CREATE room - NO AUTH for admin panel
router.post('/', async (req, res) => {
  try {
    const { roomNumber, floorId, floor, type, capacity, size, basePrice, currentPrice, features, amenities, images, description, section } = req.body;
    
    // Generate room number if not provided
    let finalRoomNumber = roomNumber;
    if (!finalRoomNumber) {
      const count = await prisma.room.count();
      finalRoomNumber = `R${String(count + 1).padStart(3, '0')}`;
    }
    
    const newRoom = await prisma.room.create({
      data: {
        roomNumber: finalRoomNumber,
        floorId: floorId || null,
        floor: floor || 0,
        section: section || 'A',
        type: type || 'STANDARD',
        status: 'AVAILABLE',
        capacity: capacity || 2,
        size: size || null,
        basePrice: basePrice || 100,
        currentPrice: currentPrice || basePrice || 100,
        features: JSON.stringify(features || []),
        amenities: JSON.stringify(amenities || []),
        images: images ? JSON.stringify(images) : null,
        description: description || ''
      }
    });
    res.status(201).json(newRoom);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room: ' + error.message });
  }
});

// UPDATE room
router.put('/:id', async (req, res) => {
  try {
    const { roomNumber, floorId, floor, type, status, capacity, size, basePrice, currentPrice, features, amenities, images, description, section } = req.body;
    
    const updateData = {};
    if (roomNumber !== undefined) updateData.roomNumber = roomNumber;
    if (floorId !== undefined) updateData.floorId = floorId;
    if (floor !== undefined) updateData.floor = floor;
    if (section !== undefined) updateData.section = section;
    if (type !== undefined) updateData.type = type;
    if (status !== undefined) updateData.status = status;
    if (capacity !== undefined) updateData.capacity = capacity;
    if (size !== undefined) updateData.size = size;
    if (basePrice !== undefined) updateData.basePrice = basePrice;
    if (currentPrice !== undefined) updateData.currentPrice = currentPrice;
    if (features !== undefined) updateData.features = JSON.stringify(features);
    if (amenities !== undefined) updateData.amenities = JSON.stringify(amenities);
    if (images !== undefined) updateData.images = JSON.stringify(images);
    if (description !== undefined) updateData.description = description;
    
    const updatedRoom = await prisma.room.update({
      where: { id: req.params.id },
      data: updateData
    });
    res.json(updatedRoom);
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ error: 'Failed to update room' });
  }
});

// DELETE room
router.delete('/:id', async (req, res) => {
  try {
    const bookingCount = await prisma.booking.count({ where: { roomId: req.params.id } });
    if (bookingCount > 0) {
      return res.status(409).json({
        error: `Cannot delete — room has ${bookingCount} linked booking(s). Cancel all bookings first.`
      });
    }
    await prisma.room.delete({ where: { id: req.params.id } });
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    if (error.code === 'P2003' || error.code === 'P2014') {
      return res.status(409).json({ error: 'Cannot delete room — it has linked records.' });
    }
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

export default router;
