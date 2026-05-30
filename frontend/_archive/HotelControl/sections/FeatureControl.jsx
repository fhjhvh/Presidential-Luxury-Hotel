import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../../components/Toast/Toast';
import './SectionStyles.css';

const FeatureControl = () => {
  const toast = useToast();
  const [features, setFeatures] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'AMENITY',
    icon: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/features');
      if (!response.ok) {
        throw new Error('Failed to fetch features');
      }
      const data = await response.json();
      setFeatures(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load features:', error);
      setFeatures([]);
    }
  };

  const handleAdd = () => {
    setEditingFeature(null);
    setFormData({
      name: '',
      description: '',
      category: 'AMENITY',
      icon: '',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEdit = (feature) => {
    setEditingFeature(feature);
    setFormData({
      name: feature.name,
      description: feature.description || '',
      category: feature.category,
      icon: feature.icon || '',
      isActive: feature.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingFeature
        ? `http://localhost:5000/api/features/${editingFeature.id}`
        : 'http://localhost:5000/api/features';
      
      const method = editingFeature ? 'PUT' : 'POST';

      const featureData = {
        name: formData.name,
        description: formData.description || null,
        category: formData.category,
        icon: formData.icon || null,
        isActive: formData.isActive,
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(featureData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save feature');
      }

      await loadFeatures();
      setShowModal(false);
      toast.success('Feature saved successfully! It will now appear throughout the website.');
    } catch (error) {
      console.error('Error saving feature:', error);
      toast.error(`Failed to save feature: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this feature?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/features/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete feature');

      await loadFeatures();
      toast.success('Feature deleted successfully!');
    } catch (error) {
      console.error('Error deleting feature:', error);
      toast.error('Failed to delete feature. Please try again.');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      AMENITY: '#4caf50',
      SERVICE: '#2196f3',
      FACILITY: '#ff9800',
      ENTERTAINMENT: '#9c27b0',
    };
    return colors[category] || '#9e9e9e';
  };

  return (
    <div className="section-container">
      <div className="section-actions">
        <button className="btn btn-primary" onClick={handleAdd}>
          <span>➕</span>
          <span>Add Feature</span>
        </button>
      </div>

      <div className="items-grid">
        {features.map((feature) => (
          <motion.div
            key={feature.id}
            className="item-card feature-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="item-content">
              <div className="item-header">
                <h3>
                  {feature.icon && <span className="feature-icon">{feature.icon}</span>}
                  {feature.name}
                </h3>
                <span className={`status-badge ${feature.isActive ? 'active' : 'inactive'}`}>
                  {feature.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="item-category" style={{ color: getCategoryColor(feature.category) }}>
                {feature.category}
              </p>
              {feature.description && <p className="item-description">{feature.description}</p>}
              <div className="item-actions">
                <button className="btn btn-secondary" onClick={() => handleEdit(feature)}>
                  ✏️ Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(feature.id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {features.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">⭐</span>
          <h3>No Features Yet</h3>
          <p>Start by adding your first feature</p>
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
              <h2>{editingFeature ? 'Edit Feature' : 'Add Feature'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Feature Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Free WiFi, Swimming Pool"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      <option value="AMENITY">Amenity</option>
                      <option value="SERVICE">Service</option>
                      <option value="FACILITY">Facility</option>
                      <option value="ENTERTAINMENT">Entertainment</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Icon (emoji)</label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="📶"
                      maxLength="2"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    placeholder="Describe this feature..."
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
                    {loading ? 'Saving...' : 'Save Feature'}
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

export default FeatureControl;
