import express from 'express';
import prisma from '../config/database.js';

const router = express.Router();

// GET all floors - NO AUTH for now
router.get('/', async (req, res) => {
  try {
    const floors = await prisma.floor.findMany({
      orderBy: { order: 'asc' },
      include: { rooms: true }
    });
    res.json(floors);
  } catch (error) {
    console.error('Error fetching floors:', error);
    res.status(500).json({ error: 'Failed to fetch floors' });
  }
});

// GET floor by ID
router.get('/:id', async (req, res) => {
  try {
    const floor = await prisma.floor.findUnique({
      where: { id: req.params.id },
      include: { rooms: true }
    });
    if (!floor) {
      return res.status(404).json({ error: 'Floor not found' });
    }
    res.json(floor);
  } catch (error) {
    console.error('Error fetching floor:', error);
    res.status(500).json({ error: 'Failed to fetch floor' });
  }
});

// CREATE floor - NO AUTH for now (admin panel)
router.post('/', async (req, res) => {
  try {
    const { name, description, floorNumber, image } = req.body;
    
    // Get max floor number if not provided
    let finalFloorNumber = floorNumber;
    if (!finalFloorNumber) {
      const maxFloor = await prisma.floor.findFirst({
        orderBy: { floorNumber: 'desc' }
      });
      finalFloorNumber = maxFloor ? maxFloor.floorNumber + 1 : 0;
    }
    
    // Get max order
    const maxOrder = await prisma.floor.findFirst({
      orderBy: { order: 'desc' }
    });
    const newOrder = maxOrder ? maxOrder.order + 1 : 0;
    
    const newFloor = await prisma.floor.create({
      data: {
        name: name || `Floor ${finalFloorNumber}`,
        description: description || '',
        floorNumber: finalFloorNumber,
        image: image || null,
        order: newOrder,
        isActive: true
      }
    });
    res.status(201).json(newFloor);
  } catch (error) {
    console.error('Error creating floor:', error);
    res.status(500).json({ error: 'Failed to create floor: ' + error.message });
  }
});

// UPDATE floor
router.put('/:id', async (req, res) => {
  try {
    const { name, description, image, isActive } = req.body;
    const updatedFloor = await prisma.floor.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        image,
        isActive
      }
    });
    res.json(updatedFloor);
  } catch (error) {
    console.error('Error updating floor:', error);
    res.status(500).json({ error: 'Failed to update floor' });
  }
});

// DELETE floor
router.delete('/:id', async (req, res) => {
  try {
    await prisma.floor.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Floor deleted successfully' });
  } catch (error) {
    console.error('Error deleting floor:', error);
    res.status(500).json({ error: 'Failed to delete floor' });
  }
});

export default router;
