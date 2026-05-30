import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LuxuryButton from '../../components/common/LuxuryButton';
import { userAPI } from '../../services/api';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  const getDisplayName = () => {
    if (!user) return '';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.name) return user.name;
    return user.email?.split('@')[0] || 'User';
  };
  
  const [formData, setFormData] = useState({
    name: getDisplayName(),
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const profileData = {
        firstName: formData.name.split(' ')[0] || user.firstName,
        lastName: formData.name.split(' ').slice(1).join(' ') || user.lastName,
        email: formData.email,
        phone: formData.phone,
      };
      
      const updatedUser = await userAPI.updateProfile(profileData);
      
      const userWithToken = {
        ...updatedUser,
        token: user.token,
        loginTime: user.loginTime
      };
      
      localStorage.setItem('plhms_user', JSON.stringify(userWithToken));
      
      window.location.reload();
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile changes. Please try again.');
    }
  };

  const getRoleBadge = () => {
    if (!user || !user.role) {
      return { text: 'Guest', color: '#9E9E9E' };
    }
    if (user.role === 'ADMIN') {
      return { text: 'Administrator', color: '#D32F2F' };
    } else if (user.role.startsWith('STAFF_')) {
      const dept = user.role.replace('STAFF_', '');
      return { text: `Staff - ${dept}`, color: '#4A9EFF' };
    } else if (user.role === 'GUEST_NEW') {
      return { text: 'First-Time Guest (20% OFF)', color: '#FFD700' };
    } else if (user.role === 'GUEST_RETURNING') {
      return { text: 'Returning Guest (10% OFF)', color: '#4A9EFF' };
    } else {
      return { text: 'Guest', color: '#9E9E9E' };
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <div className="profile-page">
      <div className="profile-page-header">
        <LuxuryButton
          variant="secondary"
          size="small"
          onClick={() => navigate('/')}
        >
          ← {t('nav.home') || 'Home'}
        </LuxuryButton>
      </div>
      <motion.div
        className="profile-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user?.role === 'ADMIN' ? '👑' : user?.role?.startsWith('STAFF_') ? '👤' : '🎩'}
            </div>
          </div>
          <div className="profile-header-info">
            <h1 className="profile-name">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user?.name || user?.username || t('profile.defaultName')}
            </h1>
            <span className="profile-role-badge" style={{ background: roleBadge.color }}>
              {roleBadge.text}
            </span>
            {(user?.role === 'GUEST_NEW' || user?.role === 'GUEST_RETURNING') && (
              <div className="profile-discount">
                <span className="detail-label">{t('profile.fields.activeDiscount')}:</span>
                <span className="discount-value">
                  {user.role === 'GUEST_NEW' ? '20' : '10'}% OFF
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="profile-sections">
          <motion.section
            className="profile-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="section-header">
              <h2 className="section-title">{t('profile.sections.personalInfo')}</h2>
              <LuxuryButton
                variant="ghost"
                size="small"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? t('profile.cancelEdit') : t('profile.editProfile')}
              </LuxuryButton>
            </div>

            <div className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>{t('profile.fields.userId')}</label>
                  <input
                    type="text"
                    value={user?.id || 'N/A'}
                    disabled
                    className="profile-input"
                  />
                </div>
                <div className="form-group">
                  <label>{t('profile.fields.email')}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="profile-input"
                  />
                </div>
              </div>

              {(user?.role === 'GUEST_NEW' || user?.role === 'GUEST_RETURNING') && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>{t('profile.fields.fullName')}</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="profile-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>{t('profile.fields.phoneNumber')}</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="profile-input"
                      />
                    </div>
                  </div>

                  {user?.loyaltyId && (
                    <div className="form-group">
                      <label>{t('profile.fields.loyaltyId')}</label>
                      <input
                        type="text"
                        value={user.loyaltyId}
                        disabled
                        className="profile-input"
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>{t('profile.fields.specialPreferences')}</label>
                    <textarea
                      name="preferences"
                      value={formData.preferences}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="profile-textarea"
                      rows="4"
                    />
                  </div>
                </>
              )}

              {user?.role?.startsWith('STAFF_') && (
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('profile.fields.staffId')}</label>
                    <input
                      type="text"
                      value={user?.staffId || 'N/A'}
                      disabled
                      className="profile-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('profile.fields.department')}</label>
                    <input
                      type="text"
                      value={user?.role?.replace('STAFF_', '') || 'N/A'}
                      disabled
                      className="profile-input"
                    />
                  </div>
                </div>
              )}

              {user?.role === 'ADMIN' && (
                <div className="form-group">
                  <label>{t('profile.fields.username')}</label>
                  <input
                    type="text"
                    value={user?.username || 'N/A'}
                    disabled
                    className="profile-input"
                  />
                </div>
              )}

              {isEditing && (
                <div className="form-actions">
                  <LuxuryButton
                    variant="primary"
                    size="medium"
                    onClick={handleSave}
                  >
                    {t('profile.saveChanges')}
                  </LuxuryButton>
                </div>
              )}
            </div>
          </motion.section>

          <motion.section
            className="profile-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="section-title">{t('profile.sections.accountDetails')}</h2>
            <div className="account-details">
              <div className="detail-row">
                <span className="detail-label">{t('profile.fields.accountType')}:</span>
                <span className="detail-value">{roleBadge.text}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t('profile.fields.memberSince')}:</span>
                <span className="detail-value">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : user?.loginTime ? new Date(user.loginTime).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t('profile.fields.accountStatus')}:</span>
                <span className="detail-value status-active">{t('profile.status.active')}</span>
              </div>
              {user?.privileges && (
                <div className="detail-row privileges-row">
                  <span className="detail-label">{t('profile.fields.role')}:</span>
                  <div className="privileges-list">
                    {user.privileges.map((priv, idx) => (
                      <span key={idx} className="privilege-badge">
                        {priv.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.section>

          {(user?.role === 'GUEST_NEW' || user?.role === 'GUEST_RETURNING') && (
            <>
              <motion.section
                className="profile-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="section-title">{t('profile.sections.invoices')}</h2>
                <div className="invoices-list">
                  <div className="invoice-card">
                    <div className="invoice-header">
                      <div>
                        <h4 className="invoice-number">{t('profile.invoices.number')} #INV-2024-001</h4>
                        <p className="invoice-date">December 15, 2024</p>
                      </div>
                      <span className="invoice-status status-paid">{t('profile.invoices.paid')}</span>
                    </div>
                    <div className="invoice-details">
                      <div className="invoice-item">
                        <span>{t('profile.invoices.items.suiteBooking')} (3 {t('profile.invoices.items.nights')})</span>
                        <span>$1,200.00</span>
                      </div>
                      <div className="invoice-item">
                        <span>{t('profile.invoices.items.spaServices')}</span>
                        <span>$350.00</span>
                      </div>
                      <div className="invoice-item">
                        <span>{t('profile.invoices.items.restaurantCharges')}</span>
                        <span>$280.00</span>
                      </div>
                      <div className="invoice-item discount-item">
                        <span>{t('profile.invoices.discount')} ({user?.role === 'GUEST_NEW' ? '20' : '10'}%)</span>
                        <span>-${((1830 * (user?.role === 'GUEST_NEW' ? 20 : 10)) / 100).toFixed(2)}</span>
                      </div>
                      <div className="invoice-total">
                        <span>{t('profile.invoices.total')}</span>
                        <span>${(1830 - (1830 * (user?.role === 'GUEST_NEW' ? 20 : 10)) / 100).toFixed(2)}</span>
                      </div>
                    </div>
                    <button className="invoice-download">{t('profile.invoices.downloadPdf')}</button>
                  </div>

                  <div className="invoice-card">
                    <div className="invoice-header">
                      <div>
                        <h4 className="invoice-number">{t('profile.invoices.number')} #INV-2024-002</h4>
                        <p className="invoice-date">December 18, 2024</p>
                      </div>
                      <span className="invoice-status status-pending">{t('profile.invoices.pending')}</span>
                    </div>
                    <div className="invoice-details">
                      <div className="invoice-item">
                        <span>{t('profile.invoices.items.premiumSuite')} (5 {t('profile.invoices.items.nights')})</span>
                        <span>{t('profile.invoices.amount', { amount: 2500 })}</span>
                      </div>
                      <div className="invoice-item discount-item">
                        <span>{t('profile.invoices.discount')} ({user?.role === 'GUEST_NEW' ? '20' : '10'}%)</span>
                        <span>-${((2500 * (user?.role === 'GUEST_NEW' ? 20 : 10)) / 100).toFixed(2)}</span>
                      </div>
                      <div className="invoice-total">
                        <span>{t('profile.invoices.total')}</span>
                        <span>${(2500 - (2500 * (user?.role === 'GUEST_NEW' ? 20 : 10)) / 100).toFixed(2)}</span>
                      </div>
                    </div>
                    <button className="invoice-download">{t('profile.invoices.downloadPdf')}</button>
                  </div>
                </div>
              </motion.section>

              <motion.section
                className="profile-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="section-title">{t('profile.sections.offers')}</h2>
                <div className="offers-list">
                  <div className="offer-card-profile">
                    <div className="offer-badge">30% OFF</div>
                    <h4 className="offer-title">{t('profile.offers.luxurySpa.title')}</h4>
                    <p className="offer-description">{t('profile.offers.luxurySpa.description')}</p>
                    <div className="offer-validity">
                      <span className="offer-valid-label">{t('profile.offers.validUntil')}</span>
                      <span className="offer-valid-date">December 31, 2024</span>
                    </div>
                    <button className="offer-claim-btn">{t('profile.offers.claimOffer')}</button>
                  </div>

                  <div className="offer-card-profile">
                    <div className="offer-badge">25% OFF</div>
                    <h4 className="offer-title">{t('profile.offers.michelinDining.title')}</h4>
                    <p className="offer-description">{t('profile.offers.michelinDining.description')}</p>
                    <div className="offer-validity">
                      <span className="offer-valid-label">{t('profile.offers.validUntil')}</span>
                      <span className="offer-valid-date">December 25, 2024</span>
                    </div>
                    <button className="offer-claim-btn">{t('profile.offers.claimOffer')}</button>
                  </div>

                  <div className="offer-card-profile">
                    <div className="offer-badge">{user?.role === 'GUEST_NEW' ? '20' : '10'}% OFF</div>
                    <h4 className="offer-title">{user?.role === 'GUEST_NEW' ? t('profile.offers.welcomeDiscount.title') : t('profile.offers.loyaltyDiscount.title')}</h4>
                    <p className="offer-description">{user?.role === 'GUEST_NEW' ? t('profile.offers.welcomeDiscount.description') : t('profile.offers.loyaltyDiscount.description')}</p>
                    <div className="offer-validity">
                      <span className="offer-valid-label">{t('profile.offers.status')}</span>
                      <span className="offer-valid-date offer-active">{t('profile.offers.activeNow')}</span>
                    </div>
                  </div>
                </div>
              </motion.section>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
