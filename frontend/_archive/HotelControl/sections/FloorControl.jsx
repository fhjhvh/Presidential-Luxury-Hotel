import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../../components/Toast/Toast';
import './SectionStyles.css';

const FloorControl = ({ floors, onFloorsUpdate }) => {
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingFloor, setEditingFloor] = useState(null);
  const [formData, setFormData] = useState({
    floorNumber: '',
    name: '',
    description: '',
    image: '',
    order: 0,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    setEditingFloor(null);
    setFormData({
      floorNumber: '',
      name: '',
      description: '',
      image: '',
      order: floors.length,
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEdit = (floor) => {
    setEditingFloor(floor);
    setFormData({
      floorNumber: floor.floorNumber,
      name: floor.name,
      description: floor.description || '',
      image: floor.image || '',
      order: floor.order,
      isActive: floor.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingFloor
        ? `http://localhost:5000/api/floors/${editingFloor.id}`
        : 'http://localhost:5000/api/floors';
      
      const method = editingFloor ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          floorNumber: parseInt(formData.floorNumber),
          order: parseInt(formData.order),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Server error: ${response.status}`);
      }

      await onFloorsUpdate();
      setShowModal(false);
      toast.success('Floor saved successfully!');
    } catch (error) {
      console.error('Error saving floor:', error);
      toast.error(`Failed to save floor: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this floor?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/floors/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete floor');

      await onFloorsUpdate();
      toast.success('Floor deleted successfully!');
    } catch (error) {
      console.error('Error deleting floor:', error);
      toast.error('Failed to delete floor. Please try again.');
    }
  };

  return (
    <div className="section-container">
      <div className="section-actions">
        <button className="btn btn-primary" onClick={handleAdd}>
          <span>➕</span>
          <span>Add New Floor</span>
        </button>
      </div>

      <div className="items-grid">
        {floors.map((floor) => (
          <motion.div
            key={floor.id}
            className="item-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {floor.image && (
              <div className="item-image">
                <img src={floor.image} alt={floor.name} />
              </div>
            )}
            <div className="item-content">
              <div className="item-header">
                <h3>Floor {floor.floorNumber}</h3>
                <span className={`status-badge ${floor.isActive ? 'active' : 'inactive'}`}>
                  {floor.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="item-title">{floor.name}</p>
              {floor.description && <p className="item-description">{floor.description}</p>}
              <div className="item-stats">
                <span>🚪 {floor.rooms?.length || 0} Rooms</span>
              </div>
              <div className="item-actions">
                <button className="btn btn-secondary" onClick={() => handleEdit(floor)}>
                  ✏️ Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(floor.id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {floors.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">🏢</span>
          <h3>No Floors Yet</h3>
          <p>Start by adding your first floor</p>
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
              <h2>{editingFloor ? 'Edit Floor' : 'Add New Floor'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Floor Number *</label>
                  <input
                    type="number"
                    value={formData.floorNumber}
                    onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Floor Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
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
                  <label>Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <span>Active</span>
                  </label>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Floor'}
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

export default FloorControl;
