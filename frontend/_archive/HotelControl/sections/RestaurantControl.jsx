import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../../components/Toast/Toast';
import './SectionStyles.css';

const RestaurantControl = ({ floors }) => {
  const toast = useToast();
  const [foodItems, setFoodItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'MAIN_COURSE',
    price: '',
    image: '',
    isAvailable: true,
    preparationTime: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFoodItems();
  }, []);

  const loadFoodItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/food');
      if (!response.ok) {
        throw new Error('Failed to fetch food items');
      }
      const data = await response.json();
      setFoodItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load food items:', error);
      setFoodItems([]);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      category: 'MAIN_COURSE',
      price: '',
      image: '',
      isAvailable: true,
      preparationTime: '',
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      category: item.category,
      price: item.price,
      image: item.image || '',
      isAvailable: item.isAvailable,
      preparationTime: item.preparationTime || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingItem
        ? `http://localhost:5000/api/food/${editingItem.id}`
        : 'http://localhost:5000/api/food';
      
      const method = editingItem ? 'PUT' : 'POST';

      const itemData = {
        name: formData.name,
        description: formData.description || null,
        category: formData.category,
        price: parseFloat(formData.price),
        image: formData.image || null,
        isAvailable: formData.isAvailable,
        preparationTime: formData.preparationTime ? parseInt(formData.preparationTime) : null,
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save food item');
      }

      await loadFoodItems();
      setShowModal(false);
      toast.success('Food item saved successfully! It will now appear in the restaurant menu.');
    } catch (error) {
      console.error('Error saving food item:', error);
      toast.error(`Failed to save food item: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this food item?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/food/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete food item');

      await loadFoodItems();
      toast.success('Food item deleted successfully!');
    } catch (error) {
      console.error('Error deleting food item:', error);
      toast.error('Failed to delete food item. Please try again.');
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      APPETIZER: '🥗',
      MAIN_COURSE: '🍽️',
      DESSERT: '🍰',
      BEVERAGE: '🥤',
      BREAKFAST: '🍳',
    };
    return icons[category] || '🍴';
  };

  return (
    <div className="section-container">
      <div className="section-actions">
        <button className="btn btn-primary" onClick={handleAdd}>
          <span>➕</span>
          <span>Add Menu Item</span>
        </button>
      </div>

      <div className="items-grid">
        {foodItems.map((item) => (
          <motion.div
            key={item.id}
            className="item-card food-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {item.image && (
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>
            )}
            <div className="item-content">
              <div className="item-header">
                <h3>{item.name}</h3>
                <span className={`status-badge ${item.isAvailable ? 'active' : 'inactive'}`}>
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <p className="item-category">
                {getCategoryIcon(item.category)} {item.category.replace('_', ' ')}
              </p>
              {item.description && <p className="item-description">{item.description}</p>}
              <div className="item-stats">
                <span className="price-tag">💰 ${item.price}</span>
                {item.preparationTime && <span>⏱️ {item.preparationTime} min</span>}
              </div>
              <div className="item-actions">
                <button className="btn btn-secondary" onClick={() => handleEdit(item)}>
                  ✏️ Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {foodItems.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">🍽️</span>
          <h3>No Menu Items Yet</h3>
          <p>Start by adding your first food item</p>
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
              <h2>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Item Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Grilled Salmon"
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="APPETIZER">Appetizer</option>
                    <option value="MAIN_COURSE">Main Course</option>
                    <option value="DESSERT">Dessert</option>
                    <option value="BEVERAGE">Beverage</option>
                    <option value="BREAKFAST">Breakfast</option>
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Prep Time (minutes)</label>
                    <input
                      type="number"
                      value={formData.preparationTime}
                      onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    placeholder="Describe the dish..."
                  />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    />
                    <span>Available for Order</span>
                  </label>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Item'}
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

export default RestaurantControl;
