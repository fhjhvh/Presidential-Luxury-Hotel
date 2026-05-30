import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../../components/Toast/Toast';
import './SectionStyles.css';

const RoomControl = ({ floors }) => {
  const toast = useToast();
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [selectedFloorFilter, setSelectedFloorFilter] = useState('all');
  const [formData, setFormData] = useState({
    roomNumber: '',
    floorId: '',
    floor: '',
    section: 'A',
    type: 'STANDARD',
    capacity: '',
    size: '',
    basePrice: '',
    currentPrice: '',
    status: 'AVAILABLE',
    description: '',
    images: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/rooms');
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      const data = await response.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load rooms:', error);
      setRooms([]);
    }
  };

  const handleAdd = () => {
    setEditingRoom(null);
    setFormData({
      roomNumber: '',
      floorId: floors[0]?.id || '',
      floor: floors[0]?.floorNumber || '',
      section: 'A',
      type: 'STANDARD',
      capacity: '',
      size: '',
      basePrice: '',
      currentPrice: '',
      status: 'AVAILABLE',
      description: '',
      images: '',
    });
    setShowModal(true);
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      floorId: room.floorId || '',
      floor: room.floor,
      section: room.section || 'A',
      type: room.type,
      capacity: room.capacity,
      size: room.size || '',
      basePrice: room.basePrice,
      currentPrice: room.currentPrice,
      status: room.status,
      description: room.description || '',
      images: Array.isArray(room.images) ? room.images.join(', ') : '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingRoom
        ? `http://localhost:5000/api/rooms/${editingRoom.id}`
        : 'http://localhost:5000/api/rooms';
      
      const method = editingRoom ? 'PUT' : 'POST';

      const imagesArray = formData.images
        ? formData.images.split(',').map(url => url.trim()).filter(url => url)
        : [];

      const roomData = {
        roomNumber: formData.roomNumber.toString(),
        floor: parseInt(formData.floor),
        floorId: formData.floorId || null,
        section: formData.section,
        type: formData.type,
        capacity: parseInt(formData.capacity),
        size: formData.size ? parseFloat(formData.size) : null,
        basePrice: parseFloat(formData.basePrice),
        currentPrice: parseFloat(formData.currentPrice || formData.basePrice),
        status: formData.status,
        description: formData.description || null,
        images: imagesArray,
        features: {
          wifi: true,
          tv: true,
          minibar: true,
          safe: true,
          airConditioning: true,
        },
        amenities: {
          toiletries: true,
          bathrobes: true,
          slippers: true,
          hairdryer: true,
          towels: true,
        },
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save room');
      }

      await loadRooms();
      setShowModal(false);
      toast.success('Room saved successfully! It will now appear on the website.');
    } catch (error) {
      console.error('Error saving room:', error);
      toast.error(`Failed to save room: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this room?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete room');

      await loadRooms();
      toast.success('Room deleted successfully!');
    } catch (error) {
      console.error('Error deleting room:', error);
      toast.error('Failed to delete room. Please try again.');
    }
  };

  const filteredRooms = selectedFloorFilter === 'all'
    ? rooms
    : rooms.filter(r => r.floor === parseInt(selectedFloorFilter));

  return (
    <div className="section-container">
      <div className="section-toolbar">
        <div className="floor-filter">
          <label>Filter by Floor:</label>
          <select value={selectedFloorFilter} onChange={(e) => setSelectedFloorFilter(e.target.value)}>
            <option value="all">All Floors</option>
            {floors.map(floor => (
              <option key={floor.id} value={floor.floorNumber}>
                Floor {floor.floorNumber} - {floor.name}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <span>➕</span>
          <span>Add New Room</span>
        </button>
      </div>

      <div className="items-grid">
        {filteredRooms.map((room) => (
          <motion.div
            key={room.id}
            className="item-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {room.images && room.images[0] && (
              <div className="item-image">
                <img src={room.images[0]} alt={`Room ${room.roomNumber}`} />
              </div>
            )}
            <div className="item-content">
              <div className="item-header">
                <h3>Room {room.roomNumber}</h3>
                <span className={`status-badge status-${room.status.toLowerCase()}`}>
                  {room.status}
                </span>
              </div>
              <p className="item-floor">Floor {room.floor} • {room.type}</p>
              {room.description && <p className="item-description">{room.description}</p>}
              <div className="item-stats">
                <span>👥 {room.capacity} guests</span>
                {room.size && <span>📏 {room.size}m²</span>}
                <span>💰 ${room.currentPrice}/night</span>
              </div>
              <div className="item-actions">
                <button className="btn btn-secondary" onClick={() => handleEdit(room)}>
                  ✏️ Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(room.id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">🚪</span>
          <h3>No Rooms Found</h3>
          <p>{selectedFloorFilter === 'all' ? 'Start by adding your first room' : 'No rooms on this floor yet'}</p>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="modal-content large"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{editingRoom ? 'Edit Room' : 'Add New Room'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Room Number *</label>
                    <input
                      type="text"
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Floor *</label>
                    <select
                      value={formData.floorId}
                      onChange={(e) => {
                        const selectedFloor = floors.find(f => f.id === e.target.value);
                        setFormData({
                          ...formData,
                          floorId: e.target.value,
                          floor: selectedFloor?.floorNumber || ''
                        });
                      }}
                      required
                    >
                      <option value="">Select Floor</option>
                      {floors.map(floor => (
                        <option key={floor.id} value={floor.id}>
                          Floor {floor.floorNumber} - {floor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Section</label>
                    <input
                      type="text"
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      maxLength="1"
                    />
                  </div>
                  <div className="form-group">
                    <label>Type *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      required
                    >
                      <option value="STANDARD">Standard</option>
                      <option value="DELUXE">Deluxe</option>
                      <option value="SUITE">Suite</option>
                      <option value="PRESIDENTIAL">Presidential</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Capacity *</label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Size (m²)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Base Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Current Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.currentPrice}
                      onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="OCCUPIED">Occupied</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="RESERVED">Reserved</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Images (comma-separated URLs)</label>
                  <textarea
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    rows="2"
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Room'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoomControl;
