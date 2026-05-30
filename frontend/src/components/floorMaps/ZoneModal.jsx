import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const ZoneModal = ({ isOpen, onClose, content }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const images = useMemo(() => {
    const list = Array.isArray(content?.images) ? content.images.filter(Boolean) : [];
    if (list.length === 0) return [];
    if (list.length === 1) return [list[0], list[0]];
    return list;
  }, [content]);

  useEffect(() => {
    if (!isOpen) setActiveIndex(0);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = original);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!content) return null;

  const resolveText = (keyOrText) => {
    if (!keyOrText) return '';
    return t(keyOrText, { defaultValue: keyOrText });
  };

  const title = resolveText(content.titleKey || content.title);
  const subtitle = resolveText(content.subtitleKey || content.subtitle);
  const description = resolveText(content.descriptionKey || content.description);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="zone-modal__overlay" onClick={onClose}>
          <motion.div
            className="zone-modal"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="zone-modal__close" onClick={onClose}>
              ×
            </button>

            <div className="zone-modal__media">
              {images.length > 0 ? (
                <div className="zone-modal__hero" style={{ backgroundImage: `url(${images[activeIndex]})` }} />
              ) : (
                <div className="zone-modal__hero zone-modal__hero--empty" />
              )}
            </div>

            <div className="zone-modal__content">
              {title && <h2>{title}</h2>}
              {subtitle && <p>{subtitle}</p>}
              {description && <p>{description}</p>}

              {Array.isArray(content.meta) && content.meta.length > 0 && (
                <div className="zone-modal__meta">
                  {content.meta.map((item, idx) => (
                    <div key={idx} className="zone-modal__meta-row">
                      <span className="zone-modal__meta-k">{resolveText(item.kKey || item.k)}</span>
                      <span className="zone-modal__meta-v">{resolveText(item.vKey || item.v)}</span>
                    </div>
                  ))}
                </div>
              )}

              {Array.isArray(content.actions) && content.actions.length > 0 && (
                <div className="zone-modal__actions">
                  {content.actions.map((action, idx) => (
                    <a
                      key={idx}
                      className="zone-modal__action"
                      href={action.type === 'route' ? action.to : '#'}
                      onClick={(e) => {
                        if (action.type === 'route') {
                          e.preventDefault();
                          navigate(action.to);
                          onClose();
                        }
                      }}
                    >
                      {resolveText(action.labelKey || action.label)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ZoneModal;
