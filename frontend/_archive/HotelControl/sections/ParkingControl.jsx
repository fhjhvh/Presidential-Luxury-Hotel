import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../../components/Toast/Toast';
import './SectionStyles.css';

const ParkingControl = ({ floors }) => {
  const toast = useToast();
  const [parkingSpots, setParkingSpots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSpot, setEditingSpot] = useState(null);
  const [formData, setFormData] = useState({
    spotNumber: '',
    floorId: '',
    floor: '',
    type: 'STANDARD',
    status: 'AVAILABLE',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const garageFloors = floors.filter(f => 
    f.name.toLowerCase().includes('garage') || 
    f.name.toLowerCase().includes('parking') ||
    f.floorNumber < 0
  );

  useEffect(() => {
    loadParkingSpots();
  }, []);

  const loadParkingSpots = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/parking');
      if (!response.ok) {
        throw new Error('Failed to fetch parking spots');
      }
      const data = await response.json();
      setParkingSpots(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load parking spots:', error);
      setParkingSpots([]);
    }
  };

  const handleAdd = () => {
    setEditingSpot(null);
    setFormData({
      spotNumber: '',
      floorId: garageFloors[0]?.id || '',
      floor: garageFloors[0]?.floorNumber || '',
      type: 'STANDARD',
      status: 'AVAILABLE',
      description: '',
    });
    setShowModal(true);
  };

  const handleEdit = (spot) => {
    setEditingSpot(spot);
    setFormData({
      spotNumber: spot.spotNumber,
      floorId: spot.floorId || '',
      floor: spot.floor,
      type: spot.type || 'STANDARD',
      status: spot.status,
      description: spot.description || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingSpot
        ? `http://localhost:5000/api/parking/${editingSpot.id}`
        : 'http://localhost:5000/api/parking';
      
      const method = editingSpot ? 'PUT' : 'POST';

      const spotData = {
        spotNumber: formData.spotNumber.toString(),
        floor: parseInt(formData.floor),
        floorId: formData.floorId || null,
        type: formData.type,
        status: formData.status,
        description: formData.description || null,
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spotData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save parking spot');
      }

      await loadParkingSpots();
      setShowModal(false);
      toast.success('Parking spot saved successfully!');
    } catch (error) {
      console.error('Error saving parking spot:', error);
      toast.error(`Failed to save parking spot: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this parking spot?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/parking/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete parking spot');

      await loadParkingSpots();
      toast.success('Parking spot deleted successfully!');
    } catch (error) {
      console.error('Error deleting parking spot:', error);
      toast.error('Failed to delete parking spot. Please try again.');
    }
  };

  return (
    <div className="section-container">
      <div className="section-actions">
        <button className="btn btn-primary" onClick={handleAdd}>
          <span>➕</span>
          <span>Add Parking Spot</span>
        </button>
      </div>

      {garageFloors.length === 0 && (
        <div className="warning-banner">
          ⚠️ No garage/parking floors found. Please create a floor for parking first.
        </div>
      )}

      <div className="items-grid">
        {parkingSpots.map((spot) => (
          <motion.div
            key={spot.id}
            className="item-card parking-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="item-content">
              <div className="item-header">
                <h3>Spot {spot.spotNumber}</h3>
                <span className={`status-badge status-${spot.status.toLowerCase()}`}>
                  {spot.status}
                </span>
              </div>
              <p className="item-floor">Floor {spot.floor} • {spot.type}</p>
              {spot.description && <p className="item-description">{spot.description}</p>}
              <div className="item-actions">
                <button className="btn btn-secondary" onClick={() => handleEdit(spot)}>
                  ✏️ Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(spot.id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {parkingSpots.length === 0 && garageFloors.length > 0 && (
        <div className="empty-state">
          <span className="empty-icon">🚗</span>
          <h3>No Parking Spots Yet</h3>
          <p>Start by adding your first parking spot</p>
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
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{editingSpot ? 'Edit Parking Spot' : 'Add Parking Spot'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Spot Number *</label>
                  <input
                    type="text"
                    value={formData.spotNumber}
                    onChange={(e) => setFormData({ ...formData, spotNumber: e.target.value })}
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
                    {garageFloors.map(floor => (
                      <option key={floor.id} value={floor.id}>
                        Floor {floor.floorNumber} - {floor.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  >
                    <option value="STANDARD">Standard</option>
                    <option value="COMPACT">Compact</option>
                    <option value="LARGE">Large Vehicle</option>
                    <option value="HANDICAPPED">Handicapped</option>
                    <option value="ELECTRIC">Electric Charging</option>
                  </select>
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
                    <option value="RESERVED">Reserved</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="2"
                    placeholder="Near elevator, corner spot, etc."
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Spot'}
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

export default ParkingControl;
