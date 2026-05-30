import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './FAQs.css';

const FAQs = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = Array.from({ length: 8 }, (_, i) => ({
    question: t(`faqs.q${i + 1}.question`),
    answer: t(`faqs.q${i + 1}.answer`)
  }));

  return (
    <div className="faqs-page">
      <motion.div
        className="faqs-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1>{t('faqs.hero.title')}</h1>
        <p>{t('faqs.hero.subtitle')}</p>
      </motion.div>

      <div className="faqs-content">
        <div className="faqs-list">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="faq-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                className={`faq-question ${openIndex === index ? 'active' : ''}`}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    className="faq-answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="faqs-contact">
          <h2>{t('faqs.contact.title')}</h2>
          <p>{t('faqs.contact.subtitle')}</p>
          <div className="contact-methods">
            <div>📞 +1 (555) 123-4567</div>
            <div>✉️ reservations@plhms.luxury</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
