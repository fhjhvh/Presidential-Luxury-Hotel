import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);

  const current = i18n.language || 'en';

  const options = useMemo(
    () => [
      { code: 'en', label: t('language.en') },
      { code: 'ar', label: t('language.ar') },
      { code: 'tr', label: t('language.tr') }
    ],
    [t]
  );

  const changeLanguage = async (lng) => {
    await i18n.changeLanguage(lng);
    setOpen(false);
  };

  return (
    <div className="language-switcher">
      <button
        className="language-switcher__button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t('language.label')}
        type="button"
      >
        <span className="language-switcher__label">{options.find((o) => o.code === current)?.label || 'EN'}</span>
        <span className={`language-switcher__chevron ${open ? 'language-switcher__chevron--open' : ''}`}>▾</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="language-switcher__menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {options.map((opt) => (
              <button
                key={opt.code}
                type="button"
                className={`language-switcher__item ${opt.code === current ? 'language-switcher__item--active' : ''}`}
                onClick={() => changeLanguage(opt.code)}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
