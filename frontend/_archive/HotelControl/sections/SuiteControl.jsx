import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../../components/Toast/Toast';
import './SectionStyles.css';

const SuiteControl = ({ floors }) => {
  const toast = useToast();
  const [suites, setSuites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSuite, setEditingSuite] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    floorId: '',
    floor: '',
    name: '',
    type: 'SUITE',
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
    loadSuites();
  }, []);

  const loadSuites = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/rooms');
      if (!response.ok) {
        throw new Error('Failed to fetch suites');
      }
      const data = await response.json();
      const dataArray = Array.isArray(data) ? data : [];
      const suitesOnly = dataArray.filter(r => r.type === 'SUITE' || r.type === 'PRESIDENTIAL');
      setSuites(suitesOnly);
    } catch (error) {
      console.error('Failed to load suites:', error);
      setSuites([]);
    }
  };

  const handleAdd = () => {
    setEditingSuite(null);
    setFormData({
      roomNumber: '',
      floorId: floors[0]?.id || '',
      floor: floors[0]?.floorNumber || '',
      name: '',
      type: 'SUITE',
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

  const handleEdit = (suite) => {
    setEditingSuite(suite);
    setFormData({
      roomNumber: suite.roomNumber,
      floorId: suite.floorId || '',
      floor: suite.floor,
      name: suite.name || '',
      type: suite.type,
      capacity: suite.capacity,
      size: suite.size || '',
      basePrice: suite.basePrice,
      currentPrice: suite.currentPrice,
      status: suite.status,
      description: suite.description || '',
      images: Array.isArray(suite.images) ? suite.images.join(', ') : '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingSuite
        ? `http://localhost:5000/api/rooms/${editingSuite.id}`
        : 'http://localhost:5000/api/rooms';
      
      const method = editingSuite ? 'PUT' : 'POST';

      const imagesArray = formData.images
        ? formData.images.split(',').map(url => url.trim()).filter(url => url)
        : [];

      const suiteData = {
        roomNumber: formData.roomNumber.toString(),
        floor: parseInt(formData.floor),
        floorId: formData.floorId || null,
        name: formData.name,
        section: 'S',
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
          jacuzzi: true,
          kitchenette: true,
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
        body: JSON.stringify(suiteData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save suite');
      }

      await loadSuites();
      setShowModal(false);
      toast.success('Suite saved successfully! It will now appear on the website.');
    } catch (error) {
      console.error('Error saving suite:', error);
      toast.error(`Failed to save suite: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this suite?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete suite');

      await loadSuites();
      toast.success('Suite deleted successfully!');
    } catch (error) {
      console.error('Error deleting suite:', error);
      toast.error('Failed to delete suite. Please try again.');
    }
  };

  return (
    <div className="section-container">
      <div className="section-actions">
        <button className="btn btn-primary" onClick={handleAdd}>
          <span>➕</span>
          <span>Add New Suite</span>
        </button>
      </div>

      <div className="items-grid">
        {suites.map((suite) => (
          <motion.div
            key={suite.id}
            className="item-card suite-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {suite.images && suite.images[0] && (
              <div className="item-image">
                <img src={suite.images[0]} alt={suite.name || `Suite ${suite.roomNumber}`} />
              </div>
            )}
            <div className="item-content">
              <div className="item-header">
                <h3>{suite.name || `Suite ${suite.roomNumber}`}</h3>
                <span className={`status-badge status-${suite.status.toLowerCase()}`}>
                  {suite.status}
                </span>
              </div>
              <p className="item-floor">Floor {suite.floor} • {suite.type}</p>
              {suite.description && <p className="item-description">{suite.description}</p>}
              <div className="item-stats">
                <span>👥 {suite.capacity} guests</span>
                {suite.size && <span>📏 {suite.size}m²</span>}
                <span>💰 ${suite.currentPrice}/night</span>
              </div>
              <div className="item-actions">
                <button className="btn btn-secondary" onClick={() => handleEdit(suite)}>
                  ✏️ Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(suite.id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {suites.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">👑</span>
          <h3>No Suites Yet</h3>
          <p>Start by adding your first luxury suite</p>
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
              <h2>{editingSuite ? 'Edit Suite' : 'Add New Suite'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Suite Number *</label>
                    <input
                      type="text"
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Suite Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Presidential Suite"
                    />
                  </div>
                </div>
                <div className="form-row">
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
                  <div className="form-group">
                    <label>Type *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      required
                    >
                      <option value="SUITE">Suite</option>
                      <option value="PRESIDENTIAL">Presidential Suite</option>
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
                    placeholder="Luxury suite with panoramic views..."
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
                    {loading ? 'Saving...' : 'Save Suite'}
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

export default SuiteControl;
