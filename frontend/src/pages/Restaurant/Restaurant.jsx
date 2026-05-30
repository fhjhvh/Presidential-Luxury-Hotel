import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import RevealOnScroll from '../../components/animations/RevealOnScroll';
import StoryNarrative from '../../components/common/StoryNarrative';
import BackButton from '../../components/common/BackButton';
import { useAuth } from '../../context/AuthContext';
import { storeAPI, bookingAPI } from '../../services/api';
import './Restaurant.css';

const starters = [
  { id: 's1', name: 'Foie Gras Terrine', desc: 'Hudson Valley foie gras, brioche, seasonal preserves', price: 42, img: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=500' },
  { id: 's2', name: 'Oysters Rockefeller', desc: 'Half dozen fresh oysters, herbed breadcrumbs, champagne butter', price: 38, img: 'https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=500' },
  { id: 's3', name: 'Tuna Tartare', desc: 'Yellowfin tuna, avocado, quail egg, caviar', price: 36, img: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=500' },
  { id: 's4', name: 'Burrata Caprese', desc: 'Imported burrata, heirloom tomatoes, aged balsamic', price: 28, img: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=500' },
  { id: 's5', name: 'Lobster Bisque', desc: 'Maine lobster, cognac cream, truffle oil', price: 32, img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500' },
  { id: 's6', name: 'Escargot de Bourgogne', desc: 'Burgundy snails, garlic-parsley butter, sourdough', price: 29, img: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=500' },
  { id: 's7', name: 'Beef Carpaccio', desc: 'Wagyu beef, arugula, parmesan, truffle aioli', price: 34, img: 'https://images.unsplash.com/photo-1587137471380-2436cb6ff892?w=500' },
  { id: 's8', name: 'Seared Scallops', desc: 'Hokkaido scallops, cauliflower purée, microgreens', price: 40, img: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=500' }
];

const mains = [
  { id: 'm1', name: 'Wagyu Ribeye', desc: 'A5 Japanese Wagyu, 12oz, seasonal vegetables, red wine reduction', price: 165, img: 'https://images.unsplash.com/photo-1558030006-450675393462?w=500' },
  { id: 'm2', name: 'Butter-Poached Lobster', desc: 'Whole Maine lobster, lemon beurre blanc, asparagus', price: 95, img: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=500' },
  { id: 'm3', name: "Duck à l'Orange", desc: 'Roasted duck breast, orange gastrique, root vegetables', price: 68, img: 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=500' },
  { id: 'm4', name: 'Chilean Sea Bass', desc: 'Pan-seared, miso glaze, shiitake mushrooms, bok choy', price: 72, img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500' },
  { id: 'm5', name: 'Filet Mignon', desc: '10oz prime beef tenderloin, béarnaise, truffle fries', price: 82, img: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500' },
  { id: 'm6', name: 'Rack of Lamb', desc: 'New Zealand lamb, herb crust, rosemary jus, ratatouille', price: 76, img: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=500' },
  { id: 'm7', name: 'Osso Buco', desc: 'Braised veal shank, saffron risotto, gremolata', price: 64, img: 'https://images.unsplash.com/photo-1595777216528-071e0127ccbf?w=500' },
  { id: 'm8', name: 'Branzino', desc: 'Whole Mediterranean sea bass, lemon, olive oil, herbs', price: 58, img: 'https://images.unsplash.com/photo-1580959375944-1bfa5fb98789?w=500' },
  { id: 'm9', name: 'Beef Wellington', desc: 'Pâté de foie gras, mushroom duxelles, puff pastry', price: 88, img: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=500' },
  { id: 'm10', name: 'Truffle Risotto', desc: 'Carnaroli rice, black truffle, parmesan, white wine', price: 52, img: 'https://images.unsplash.com/photo-1476124369491-20aaaff48fcc?w=500' }
];

const desserts = [
  { id: 'd1', name: 'Chocolate Soufflé', desc: 'Dark chocolate, vanilla bean ice cream, raspberry coulis', price: 24, img: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500' },
  { id: 'd2', name: 'Crème Brûlée', desc: 'Classic vanilla custard, caramelized sugar, shortbread', price: 18, img: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=500' },
  { id: 'd3', name: 'Tarte Tatin', desc: 'Caramelized apple tart, calvados ice cream', price: 20, img: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=500' },
  { id: 'd4', name: 'Tiramisu', desc: 'Mascarpone, espresso-soaked ladyfingers, cocoa', price: 19, img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500' },
  { id: 'd5', name: 'Opera Cake', desc: 'Almond sponge, coffee buttercream, chocolate ganache', price: 22, img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500' },
  { id: 'd6', name: 'Panna Cotta', desc: 'Vanilla bean panna cotta, berry compote, mint', price: 17, img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500' }
];

const beverages = [
  { id: 'b1', name: 'Signature Martini', desc: 'Grey Goose, dry vermouth, olive', price: 28, type: 'Cocktail' },
  { id: 'b2', name: 'Old Fashioned', desc: 'Buffalo Trace bourbon, sugar, bitters', price: 26, type: 'Cocktail' },
  { id: 'b3', name: 'French 75', desc: 'Gin, champagne, lemon, sugar', price: 30, type: 'Cocktail' },
  { id: 'b4', name: 'Château Margaux 2015', desc: 'Bordeaux Premier Cru', price: 850, type: 'Wine' },
  { id: 'b5', name: 'Dom Pérignon 2012', desc: 'Vintage champagne', price: 450, type: 'Champagne' },
  { id: 'b6', name: 'Espresso', desc: 'Double shot Italian espresso', price: 8, type: 'Hot Drink' },
  { id: 'b7', name: 'Cappuccino', desc: 'Espresso, steamed milk, foam', price: 10, type: 'Hot Drink' }
];

const tableFloor = (n) => {
  if (n <= 4) return 'Ground Floor · Main Hall';
  if (n <= 8) return '1st Floor · Terrace';
  if (n <= 12) return '2nd Floor · Garden View';
  return 'Private Dining Room';
};

const Restaurant = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [deliveryType, setDeliveryType] = useState(null); // 'room' | 'table'
  const [notes, setNotes] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [placing, setPlacing] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);
  const [assignedTable] = useState(() => Math.floor(Math.random() * 12) + 1);

  useEffect(() => {
    if (isAuthenticated) loadActiveRoom();
  }, [isAuthenticated]);

  const loadActiveRoom = async () => {
    try {
      const data = await bookingAPI.getMyBookings();
      const bookings = data.bookings || data || [];
      const active = bookings.find(b =>
        ['CONFIRMED', 'CHECKED_IN', 'PENDING'].includes(b.status)
      );
      if (active?.room?.roomNumber) setActiveRoom(active.room.roomNumber);
    } catch {
      // no active booking
    }
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return setCart(prev => prev.filter(i => i.id !== id));
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartQty = (id) => cart.find(i => i.id === id)?.qty || 0;

  const placeOrder = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/restaurant', message: 'Please login to place an order' } });
      return;
    }
    if (!deliveryType) {
      setOrderError('Please choose where you would like to dine.');
      return;
    }
    if (deliveryType === 'room' && !activeRoom) {
      setOrderError('No active room booking found. Please book a room first or choose to dine in the restaurant.');
      return;
    }
    setPlacing(true);
    setOrderError('');
    try {
      const itemSummary = cart
        .map(i => `${i.name} ×${i.qty} ($${(i.price * i.qty).toFixed(2)})`)
        .join(', ');
      const deliveryNote = deliveryType === 'room'
        ? `Room delivery — Room ${activeRoom} (Est. 30–45 min)`
        : `Dine in restaurant — Table ${assignedTable}, ${tableFloor(assignedTable)}`;
      const fullNotes = [deliveryNote, notes, itemSummary].filter(Boolean).join(' | ');

      const orderData = {
        orderType: 'RESTAURANT',
        deliveryType,
        notes: fullNotes,
        totalAmount: cartTotal,
        ...(deliveryType === 'room' && activeRoom && { roomNumber: activeRoom }),
        items: cart.map(i => ({ name: i.name, price: i.price, quantity: i.qty }))
      };
      await storeAPI.createOrder(orderData);
      setCart([]);
      setDeliveryType(null);
      setNotes('');
      setOrderSuccess(true);
      setTimeout(() => setOrderSuccess(false), 6000);
    } catch (e) {
      setOrderError(e.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const MenuCard = ({ item }) => {
    const qty = cartQty(item.id);
    return (
      <RevealOnScroll>
        <motion.div className="menu-card" whileHover={{ y: -8, scale: 1.03 }}>
          <div className="menu-card__image" style={{ backgroundImage: `url(${item.img})` }}>
            <div className="menu-card__overlay"></div>
            {qty > 0 && <div className="menu-card__badge">{qty}</div>}
          </div>
          <div className="menu-card__content">
            <h3>{item.name}</h3>
            <p>{item.desc}</p>
            <div className="menu-card__footer">
              <span className="menu-price">${item.price}</span>
              {qty === 0 ? (
                <button className="menu-order-btn" onClick={() => addToCart(item)}>Add to Table</button>
              ) : (
                <div className="menu-qty-ctrl">
                  <button onClick={() => updateQty(item.id, qty - 1)}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => updateQty(item.id, qty + 1)}>+</button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </RevealOnScroll>
    );
  };

  return (
    <div className="restaurant-page">
      <BackButton />
      <section className="restaurant-hero">
        <div className="restaurant-hero__overlay"></div>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1>Le Palais Restaurant</h1>
            <p className="restaurant-subtitle">Michelin-Starred Culinary Excellence</p>
          </motion.div>
        </div>
      </section>

      <section className="section container">
        <StoryNarrative text="Where every dish is a masterpiece, and every meal becomes a memory." />

        <RevealOnScroll>
          <div className="chef-intro">
            <motion.div className="chef-intro__content" whileHover={{ scale: 1.02 }}>
              <div className="chef-intro__image">
                <div className="chef-icon">👨‍🍳</div>
              </div>
              <div className="chef-intro__text">
                <h2>Executive Chef Jean-Louis Moreau</h2>
                <p className="chef-title">Three Michelin Stars | MOF 2018</p>
                <p className="chef-bio">
                  With over 30 years of culinary mastery across Paris, Monaco, and New York,
                  Chef Moreau brings French haute cuisine to unprecedented heights. His philosophy:
                  "Tradition refined by innovation, presented with absolute respect for the ingredient."
                </p>
              </div>
            </motion.div>
          </div>
        </RevealOnScroll>

        {/* Starters */}
        <div className="menu-section">
          <RevealOnScroll>
            <h2 className="menu-category-title">Les Entrées</h2>
            <p className="menu-category-subtitle">Starters to awaken the palate</p>
          </RevealOnScroll>
          <div className="menu-grid">
            {starters.map(item => <MenuCard key={item.id} item={item} />)}
          </div>
        </div>

        {/* Mains */}
        <div className="menu-section">
          <RevealOnScroll>
            <h2 className="menu-category-title">Les Plats Principaux</h2>
            <p className="menu-category-subtitle">Main courses of distinction</p>
          </RevealOnScroll>
          <div className="menu-grid">
            {mains.map(item => <MenuCard key={item.id} item={item} />)}
          </div>
        </div>

        {/* Desserts */}
        <div className="menu-section">
          <RevealOnScroll>
            <h2 className="menu-category-title">Les Desserts</h2>
            <p className="menu-category-subtitle">Sweet finales</p>
          </RevealOnScroll>
          <div className="menu-grid">
            {desserts.map(item => <MenuCard key={item.id} item={item} />)}
          </div>
        </div>

        {/* Beverages */}
        <div className="menu-section beverages-section">
          <RevealOnScroll>
            <h2 className="menu-category-title">Carte des Boissons</h2>
            <p className="menu-category-subtitle">Curated wines, cocktails &amp; beverages</p>
          </RevealOnScroll>
          <div className="beverages-grid">
            {beverages.map(item => (
              <RevealOnScroll key={item.id}>
                <motion.div className="beverage-card" whileHover={{ x: 10 }}>
                  <div className="beverage-type">{item.type}</div>
                  <h4>{item.name}</h4>
                  <p>{item.desc}</p>
                  <div className="beverage-footer">
                    <span className="beverage-price">${item.price}</span>
                    {cartQty(item.id) === 0 ? (
                      <button className="beverage-order-btn" onClick={() => addToCart(item)}>Add to Table</button>
                    ) : (
                      <div className="menu-qty-ctrl menu-qty-ctrl--sm">
                        <button onClick={() => updateQty(item.id, cartQty(item.id) - 1)}>−</button>
                        <span>{cartQty(item.id)}</span>
                        <button onClick={() => updateQty(item.id, cartQty(item.id) + 1)}>+</button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Review Panel (edit quantities) */}
      <AnimatePresence>
        {showCart && (
          <motion.div className="cart-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCart(false)}>
            <motion.div className="cart-modal" initial={{ x: 340 }} animate={{ x: 0 }} exit={{ x: 340 }} onClick={e => e.stopPropagation()}>
              <div className="cart-header">
                <h2>🍽️ Your Table</h2>
                <button className="close-btn" onClick={() => setShowCart(false)}>✕</button>
              </div>
              {cart.length === 0 ? (
                <div className="cart-empty">Your table is empty. Browse the menu and add dishes.</div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item.id} className="cart-item">
                        <div className="cart-item-info">
                          <h4>{item.name}</h4>
                          <p>${item.price} each</p>
                        </div>
                        <div className="cart-item-qty">
                          <button onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                          <span>{item.qty}</span>
                          <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                        </div>
                        <div className="cart-item-total">${(item.price * item.qty).toFixed(2)}</div>
                        <button className="remove-btn" onClick={() => updateQty(item.id, 0)}>✕</button>
                      </div>
                    ))}
                  </div>
                  <div className="cart-total-section">
                    <span>Total:</span>
                    <strong>${cartTotal.toFixed(2)}</strong>
                  </div>
                  <button className="checkout-btn" onClick={() => setShowCart(false)}>✓ Done — Choose Delivery Below</button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* In-Page Sticky Order Panel */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            className="restaurant-order-panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
          >
            <div className="order-panel-header">
              <div className="order-panel-count">
                <button className="order-panel-edit-btn" onClick={() => setShowCart(true)}>
                  ✏️ {cartCount} dish{cartCount !== 1 ? 'es' : ''} in your order
                </button>
              </div>
              <div className="order-panel-total">${cartTotal.toFixed(2)}</div>
            </div>

            <p className="order-panel-title">How would you like to enjoy your meal?</p>

            <div className="order-panel-choices">
              <button
                className={`delivery-option ${deliveryType === 'room' ? 'active' : ''}`}
                onClick={() => { setDeliveryType('room'); setOrderError(''); }}
              >
                <span className="delivery-option__icon">🚪</span>
                <div className="delivery-option__info">
                  <strong>Eat in Room</strong>
                  {activeRoom
                    ? <span>Room {activeRoom} · Est. 30–45 min</span>
                    : <span className="delivery-warn">No active booking</span>
                  }
                </div>
                {deliveryType === 'room' && <span className="delivery-check">✓</span>}
              </button>

              <button
                className={`delivery-option ${deliveryType === 'table' ? 'active' : ''}`}
                onClick={() => { setDeliveryType('table'); setOrderError(''); }}
              >
                <span className="delivery-option__icon">🍽️</span>
                <div className="delivery-option__info">
                  <strong>Dine in Restaurant</strong>
                  <span>Table {assignedTable} · {tableFloor(assignedTable)}</span>
                </div>
                {deliveryType === 'table' && <span className="delivery-check">✓</span>}
              </button>
            </div>

            {deliveryType && (
              <motion.div
                className="order-panel-confirm"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <textarea
                  className="order-panel-notes"
                  placeholder="Special requests, allergies, preferences... (optional)"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                />
                {orderError && <p className="checkout-error">{orderError}</p>}
                <button
                  className="order-panel-submit"
                  onClick={placeOrder}
                  disabled={placing}
                >
                  {placing ? 'Placing Order...' : `Place Order · $${cartTotal.toFixed(2)} →`}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {orderSuccess && (
          <motion.div className="order-success-toast" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}>
            ✅ Order placed successfully! Your meal will be prepared shortly.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Restaurant;
