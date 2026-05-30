import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ZoneModal from './ZoneModal';
import { floorMapConfigs } from './floorMapsConfig';
import './floorMaps.css';

const InteractiveFloorMap = ({ floorKey }) => {
  const { t } = useTranslation();
  const [activeZoneId, setActiveZoneId] = useState(null);
  const [activeAdHocContent, setActiveAdHocContent] = useState(null);

  const config = floorMapConfigs[floorKey];

  const activeZone = useMemo(() => {
    if (!config) return null;
    return config.zones.find((z) => z.id === activeZoneId) || null;
  }, [config, activeZoneId]);

  const modalContent =
    activeAdHocContent || (activeZone?.interaction?.type === 'modal' ? activeZone.interaction.content : null);

  if (!config) return null;

  const resolveText = (keyOrText, fallbackKey) => {
    if (!keyOrText) return fallbackKey ? t(fallbackKey) : '';
    return t(keyOrText, { defaultValue: keyOrText });
  };

  const resolveZoneLabel = (zone) => resolveText(zone?.labelKey || zone?.label, 'floorMaps.common.details');
  const resolveZoneHint = (zone) => (zone?.hintKey || zone?.hint ? resolveText(zone?.hintKey || zone?.hint) : '');

  const buildRouteAsModalContent = (zone) => {
    const to = zone?.interaction?.to;
    return {
      titleKey: zone?.labelKey || null,
      title: zone?.label || null,
      subtitleKey: zone?.hintKey || null,
      subtitle: zone?.hint || null,
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600'],
      descriptionKey: 'floorMaps.common.routeModal.description',
      meta: [{ kKey: 'floorMaps.common.routeModal.destination', v: to || '—' }],
      actions: to ? [{ labelKey: 'floorMaps.common.proceed', type: 'route', to }] : []
    };
  };

  const onZoneClick = (zone) => {
    const interaction = zone?.interaction;
    if (!interaction) return;

    if (interaction.type === 'modal') {
      setActiveAdHocContent(null);
      setActiveZoneId(zone.id);
      return;
    }

    if (interaction.type === 'route') {
      setActiveZoneId(null);
      setActiveAdHocContent(buildRouteAsModalContent(zone));
      return;
    }
  };

  return (
    <div className="ifm">
      <div className="ifm__header">
        <div className="ifm__badge">{t('floorMaps.common.floorLabel', { floor: config.floorLabel })}</div>
        <div className="ifm__title">{resolveText(config.nameKey || config.name)}</div>
        <div className="ifm__hint">{t('floorMaps.common.instructions')}</div>
      </div>

      <svg
        className="ifm__svg"
        viewBox={config.viewBox}
        role="img"
        aria-label={t('floorMaps.common.ariaLabel', { floor: config.floorLabel })}
      >
        <defs>
          <linearGradient id={`ifm-border-${floorKey}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="var(--royal-gold)" stopOpacity="0.85" />
            <stop offset="1" stopColor="var(--gold-accent)" stopOpacity="0.75" />
          </linearGradient>
          <filter id={`ifm-glow-${floorKey}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 0.78  0 0 0 0 0.64  0 0 0 0 0.30  0 0 0 0.45 0"
              result="gold"
            />
            <feMerge>
              <feMergeNode in="gold" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>


        {config.zones.map((zone) => {
          const isRestricted = !!zone.restricted;
          const Shape = zone.shape?.type;
          const cx = Shape === 'rect' ? zone.shape.x + zone.shape.w / 2 : null;
          const cy = Shape === 'rect' ? zone.shape.y + zone.shape.h / 2 : null;
          const labelFontSize =
            Shape === 'rect'
              ? Math.max(12, Math.min(18, Math.floor(zone.shape.w / 10)))
              : 16;
          const subLabelFontSize = Math.max(11, Math.min(14, labelFontSize - 3));

          const common = {
            key: zone.id,
            className: `ifm__zone ${isRestricted ? 'ifm__zone--restricted' : ''}`,
            onClick: () => onZoneClick(zone),
            onKeyDown: (e) => {
              if (e.key === 'Enter' || e.key === ' ') onZoneClick(zone);
            },
            tabIndex: 0,
            role: 'button',
            'aria-label': resolveZoneLabel(zone)
          };

          if (Shape === 'rect') {
            return (
              <motion.g
                key={zone.id}
                className="ifm__zone-group"
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 450, damping: 26 }}
              >
                <rect
                  {...common}
                  x={zone.shape.x}
                  y={zone.shape.y}
                  width={zone.shape.w}
                  height={zone.shape.h}
                  rx={zone.shape.r || 18}
                />
                <text
                  className="ifm__label"
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: `${labelFontSize}px` }}
                >
                  {resolveZoneHint(zone) ? (
                    <>
                      <tspan x={cx} dy={-6}>
                        {resolveZoneLabel(zone)}
                      </tspan>
                      <tspan
                        x={cx}
                        dy={18}
                        className="ifm__sublabel"
                        style={{ fontSize: `${subLabelFontSize}px` }}
                      >
                        {resolveZoneHint(zone)}
                      </tspan>
                    </>
                  ) : (
                    resolveZoneLabel(zone)
                  )}
                </text>
                {isRestricted && (
                  <text
                    className="ifm__restricted"
                    x={zone.shape.x + 18}
                    y={zone.shape.y + zone.shape.h - 18}
                  >
                    {t('floorMaps.common.restricted')}
                  </text>
                )}
              </motion.g>
            );
          }

          return null;
        })}
      </svg>

      <div className="ifm__legend">
        <div className="ifm__legend-item">
          <span className="ifm__legend-swatch" />
          <span className="ifm__legend-text">{t('floorMaps.common.legend.interactive')}</span>
        </div>
        <div className="ifm__legend-item">
          <span className="ifm__legend-swatch ifm__legend-swatch--restricted" />
          <span className="ifm__legend-text">{t('floorMaps.common.legend.restricted')}</span>
        </div>
      </div>

      <ZoneModal
        isOpen={!!modalContent}
        onClose={() => {
          setActiveZoneId(null);
          setActiveAdHocContent(null);
        }}
        content={modalContent}
      />
    </div>
  );
};

export default InteractiveFloorMap;
