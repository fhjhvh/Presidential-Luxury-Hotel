import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { storeAPI, bookingAPI } from '../../services/api';
import './Market.css';

const Market = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [orderForm, setOrderForm] = useState({ notes: '' });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [filter, setFilter] = useState('all');
  const [activeRoom, setActiveRoom] = useState(null);
  const [roomLoading, setRoomLoading] = useState(false);

  useEffect(() => {
    loadProducts();
    const savedCart = localStorage.getItem('hotel_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (isAuthenticated) loadActiveRoom();
  }, [isAuthenticated]);

  const loadActiveRoom = async () => {
    setRoomLoading(true);
    try {
      const data = await bookingAPI.getMyBookings();
      const bookings = data.bookings || data || [];
      const active = bookings.find(b =>
        ['CONFIRMED', 'CHECKED_IN', 'PENDING'].includes(b.status)
      );
      if (active?.room?.roomNumber) setActiveRoom(active.room.roomNumber);
    } catch {
      // no active booking — that's fine
    } finally {
      setRoomLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('hotel_cart', JSON.stringify(cart));
  }, [cart]);

  const loadProducts = async () => {
    try {
      const data = await storeAPI.getItems();
      setProducts(data.filter(p => p.isAvailable && p.quantity > 0));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const cartTotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartQty = (id) => cart.find(i => i.id === id)?.qty || 0;

  const submitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    // Require authentication for orders
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/market', message: 'Please login to place an order' } });
      return;
    }
    
    try {
      const orderData = {
        notes: orderForm.notes,
        orderType: 'MARKET',
        ...(activeRoom && { roomNumber: activeRoom }),
        items: cart.map(i => ({ itemId: i.id, quantity: i.qty }))
      };
      await storeAPI.createOrder(orderData);
      setCart([]);
      setOrderSuccess(true);
      setTimeout(() => setOrderSuccess(false), 5000);
      setShowCart(false);
      setOrderForm({ notes: '' });
    } catch (e) { 
      console.error(e);
      alert(e.message || 'Failed to place order');
    }
  };

  const categories = ['all', 'snacks', 'biscuits', 'chips', 'drinks', 'candy'];
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

  const categoryIcons = { snacks: '', biscuits: '', chips: '', drinks: '', candy: '', all: '' };

  return (
    <div className="market-page">
      <section className="market-hero">
        <div className="market-hero__overlay"></div>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1>🛒 {t('market.hero.title')}</h1>
            <p>{t('market.hero.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      <div className="market-content container">
        <div className="market-filters">
          {categories.map(cat => (
            <button key={cat} className={`filter-btn ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>
              {categoryIcons[cat]} {t(`market.categories.${cat}`) || cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="market-loading">{t('market.loading') || 'Loading products...'}</div>
        ) : filtered.length === 0 ? (
          <div className="market-empty">{t('market.empty') || 'No products available in this category.'}</div>
        ) : (
          <div className="products-grid">
            {filtered.map((product, idx) => (
              <motion.div key={product.id} className="product-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <div className="product-image" style={{ backgroundImage: product.image ? `url(${product.image})` : 'none' }}>
                  {!product.image && <span className="product-emoji">{categoryIcons[product.category] || ''}</span>}
                  <span className="product-category">{product.category}</span>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  {product.nameAr && <p className="product-name-ar" dir="rtl">{product.nameAr}</p>}
                  <p className="product-desc">{product.description}</p>
                  <div className="product-footer">
                    <span className="product-price">${product.price?.toFixed(2)}</span>
                    {cartQty(product.id) > 0 ? (
                      <div className="product-qty-ctrl">
                        <button onClick={() => updateQty(product.id, cartQty(product.id) - 1)}>−</button>
                        <span>{cartQty(product.id)}</span>
                        <button onClick={() => addToCart(product)}>+</button>
                      </div>
                    ) : (
                      <button className="add-to-cart-btn" onClick={() => addToCart(product)}>+ {t('market.product.addToCart') || 'Add'}</button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {cartCount > 0 && (
            <motion.div
              className="market-order-bar"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
            >
              <div className="order-bar-summary">
                <span className="order-bar-count">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
                <span className="order-bar-total">${cartTotal.toFixed(2)}</span>
              </div>
              <button className="order-bar-btn" onClick={() => setShowCart(true)}>
                🛒 Review & Order →
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCart && (
            <motion.div className="cart-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCart(false)}>
              <motion.div className="cart-modal" initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }} onClick={e => e.stopPropagation()}>
                <div className="cart-header">
                  <h2>🛒 {t('market.cart.title')}</h2>
                  <button className="close-btn" onClick={() => setShowCart(false)}></button>
                </div>
                {cart.length === 0 ? (
                  <div className="cart-empty">{t('market.cart.empty')}</div>
                ) : (
                  <>
                    <div className="cart-items">
                      {cart.map(item => (
                        <div key={item.id} className="cart-item">
                          <div className="cart-item-info">
                            <h4>{item.name}</h4>
                            <p>${item.price?.toFixed(2)} each</p>
                          </div>
                          <div className="cart-item-qty">
                            <button onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                            <span>{item.qty}</span>
                            <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                          </div>
                          <div className="cart-item-total">${(item.price * item.qty).toFixed(2)}</div>
                          <button className="remove-btn" onClick={() => removeFromCart(item.id)}></button>
                        </div>
                      ))}
                    </div>
                    <div className="cart-total-section">
                      <span>{t('market.cart.total')}:</span>
                      <strong>${cartTotal.toFixed(2)}</strong>
                    </div>
                    <form className="order-form" onSubmit={submitOrder}>
                      {activeRoom ? (
                        <div className="order-room-info">
                          <span className="order-room-label">{t('market.cart.roomNumber') || 'Delivering to Room'}</span>
                          <span className="order-room-value">🚪 {t('market.cart.room') || 'Room'} {activeRoom}</span>
                        </div>
                      ) : roomLoading ? (
                        <div className="order-room-info order-room-info--loading">
                          <span>{t('market.cart.detectingRoom') || 'Detecting your room...'}</span>
                        </div>
                      ) : (
                        <div className="order-room-info order-room-info--none">
                          <span>{t('market.cart.noActiveBooking') || 'No active booking found. Order will be placed without room assignment.'}</span>
                        </div>
                      )}
                      <textarea placeholder={t('market.cart.notes') || 'Special notes (optional)'} value={orderForm.notes} onChange={e => setOrderForm({...orderForm, notes: e.target.value})} />
                      <button type="submit" className="checkout-btn">{t('market.cart.placeOrder')}</button>
                    </form>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {orderSuccess && (
            <motion.div className="order-success-toast" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}>
              ✅ {t('market.cart.orderSuccess')} {t('market.cart.orderNote')}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Market;