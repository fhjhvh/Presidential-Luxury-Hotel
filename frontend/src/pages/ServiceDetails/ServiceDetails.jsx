import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import BackButton from '../../components/common/BackButton';
import LuxuryButton from '../../components/common/LuxuryButton';
import ActionConfirmationCard from '../../components/common/ActionConfirmationCard';
import './ServiceDetails.css';

const services = {
  spa: { nameKey: 'serviceDetails.items.spa.name', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200', descKey: 'serviceDetails.items.spa.desc', hoursKey: 'serviceDetails.items.spa.hours' },
  restaurant: { nameKey: 'serviceDetails.items.restaurant.name', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200', descKey: 'serviceDetails.items.restaurant.desc', hoursKey: 'serviceDetails.items.restaurant.hours' },
  gym: { nameKey: 'serviceDetails.items.gym.name', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200', descKey: 'serviceDetails.items.gym.desc', hoursKey: 'serviceDetails.items.gym.hours' },
  pool: { nameKey: 'serviceDetails.items.pool.name', image: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=1200', descKey: 'serviceDetails.items.pool.desc', hoursKey: 'serviceDetails.items.pool.hours' }
};

const ServiceDetails = () => {
  const { t } = useTranslation();
  const { serviceId } = useParams();
  const [show, setShow] = useState(false);
  const s = services[serviceId] || services.spa;

  return (
    <div className="service-details">
      <BackButton />
      <section className="service-hero" style={{ backgroundImage: `url(${s.image})` }}>
        <div className="overlay"></div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>{t(s.nameKey)}</motion.h1>
      </section>
      <section className="container section">
        <p>{t(s.descKey)}</p>
        <p>{t('serviceDetails.hours', { hours: t(s.hoursKey) })}</p>
        <LuxuryButton variant="primary" onClick={() => setShow(true)}>{t('serviceDetails.actions.bookNow')}</LuxuryButton>
      </section>
      <ActionConfirmationCard
        isOpen={show}
        onClose={() => setShow(false)}
        title={t('serviceDetails.confirmation.title')}
        message={t('serviceDetails.confirmation.message')}
      />
    </div>
  );
};

export default ServiceDetails;
