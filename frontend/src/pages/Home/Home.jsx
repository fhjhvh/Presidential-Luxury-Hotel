import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './Home.css';

const Reveal = ({ children, delay = 0, y = 40, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}>
    {children}
  </motion.div>
);

const SERVICES_STATIC = [
  { id: 'spa',    link: '/services/spa',    img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop' },
  { id: 'dining', link: '/restaurant',      img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop' },
  { id: 'pool',   link: '/services/pool',   img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop' },
  { id: 'gym',    link: '/services/gym',    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop' },
  { id: 'butler', link: '/services/butler', img: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&auto=format&fit=crop' },
  { id: 'driver', link: '/services/driver', img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop' },
];

const LIFESTYLES_STATIC = [
  { id: 'romantic', img: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop', link: '/rooms' },
  { id: 'family',   img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop', link: '/rooms' },
  { id: 'business', img: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop', link: '/rooms' },
  { id: 'vip',      img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop', link: '/suites' },
];

const TESTIMONIALS_STATIC = [
  { id: 't1', avatar: 'J', stars: 5 },
  { id: 't2', avatar: 'S', stars: 5 },
  { id: 't3', avatar: 'A', stars: 5 },
  { id: 't4', avatar: 'C', stars: 5 },
];

const FEATURED_ROOMS_STATIC = [
  { id: 'r1', price: 2500, badgeKey: 'mostExclusive', image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=900&auto=format&fit=crop' },
  { id: 'r2', price: 1800, badgeKey: 'mostPopular',   image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&auto=format&fit=crop' },
  { id: 'r3', price: 500,  badgeKey: null,             image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=900&auto=format&fit=crop' },
];

const HERO_STATS = [
  { num: '60',   key: 'rooms' },
  { num: '11',   key: 'floors' },
  { num: '5★',  key: 'rating' },
  { num: '24/7', key: 'concierge' },
];

const ABOUT_PILLAR_KEYS = ['heritage', 'excellence', 'discretion', 'craft'];

const Home = () => {
  const { t } = useTranslation();
  const [testIdx, setTestIdx]   = useState(0);
  const heroRef                 = useRef(null);
  const { scrollY }             = useScroll();
  const heroY                   = useTransform(scrollY, [0, 700], [0, 180]);
  const heroOpacity             = useTransform(scrollY, [0, 500], [1, 0]);

  const awards = t('home.awards', { returnObjects: true });

  useEffect(() => {
    const timer = setInterval(() => setTestIdx(i => (i + 1) % TESTIMONIALS_STATIC.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home hp">

      {/* ══ 1. HERO ══ */}
      <section className="hp-hero" ref={heroRef}>
        <motion.div className="hp-hero__media" style={{ y: heroY }}>
          <video
            className="hp-hero__video hp-hero__video--active"
            src="/videos/hero.mp4"
            poster="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&auto=format&fit=crop&q=85"
            autoPlay muted loop playsInline
          />
        </motion.div>

        <div className="hp-hero__overlay-gradient" />
        <div className="hp-hero__overlay-vignette" />
        <div className="hp-hero__overlay-bottom" />

        <motion.div className="hp-hero__content" style={{ opacity: heroOpacity }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
            <div className="hp-hero__kicker">
              <span className="hp-hero__kicker-star">★★★★★</span>
              <span>{t('home.heroNew.kicker')}</span>
            </div>
          </motion.div>

          <motion.h1 className="hp-hero__title"
            initial={{ opacity: 0, y: 70 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            dangerouslySetInnerHTML={{ __html: t('home.heroNew.title').replace(/\n/g, '<br/>') }}
          />

          <motion.p className="hp-hero__sub"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            {t('home.heroNew.subtitle')}
          </motion.p>

          <motion.div className="hp-hero__actions"
            initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}>
            <Link to="/rooms" className="hp-btn hp-btn--gold">
              {t('home.heroNew.actions.exploreRooms')}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </Link>
            <Link to="/booking" className="hp-btn hp-btn--glass">
              {t('home.heroNew.actions.bookNow')}
            </Link>
          </motion.div>
        </motion.div>

        <motion.div className="hp-hero__statsbar"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.4 }}>
          {HERO_STATS.map(s => (
            <div key={s.key} className="hp-hero__stat">
              <span className="hp-hero__stat-num">{s.num}</span>
              <span className="hp-hero__stat-label">{t(`home.heroNew.stats.${s.key}`)}</span>
            </div>
          ))}
        </motion.div>

        <motion.div className="hp-scroll"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2.4 }}>
          <span className="hp-scroll__text">{t('home.heroNew.scroll')}</span>
          <motion.div className="hp-scroll__line"
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} />
        </motion.div>
      </section>

      {/* ══ 2. AWARDS MARQUEE ══ */}
      <div className="hp-awards" aria-hidden="true">
        <div className="hp-awards__track">
          {Array.isArray(awards) && [...awards, ...awards].map((a, i) => (
            <span key={i} className="hp-awards__item">
              <span className="hp-awards__dot">✦</span>
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* ══ 3. ABOUT ══ */}
      <section className="hp-about">
        <div className="hp-container hp-about__inner">
          <Reveal className="hp-about__images">
            <div className="hp-about__img-main">
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&auto=format&fit=crop"
                alt={t('home.about.kicker')}
                loading="lazy" />
            </div>
            <div className="hp-about__img-accent">
              <img
                src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&auto=format&fit=crop"
                alt={t('home.about.kicker')}
                loading="lazy" />
              <div className="hp-about__img-badge">
                <span>{t('home.about.since')}</span>
                <strong>1924</strong>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="hp-about__text">
            <div className="hp-section-kicker">{t('home.about.kicker')}</div>
            <h2 className="hp-section-title"
              dangerouslySetInnerHTML={{ __html: t('home.about.title').replace(/\n/g, '<br/>') }}
            />
            <div className="hp-gold-rule" />
            <p className="hp-about__para">{t('home.about.para1')}</p>
            <p className="hp-about__para">{t('home.about.para2')}</p>
            <div className="hp-about__pillars">
              {ABOUT_PILLAR_KEYS.map(p => (
                <div key={p} className="hp-about__pillar">
                  <span className="hp-about__pillar-dot">✦</span>
                  {t(`home.about.pillars.${p}`)}
                </div>
              ))}
            </div>
            <Link to="/about" className="hp-btn hp-btn--outline-dark" style={{ marginTop: '2rem', display: 'inline-flex' }}>
              {t('home.about.action')}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ══ 4. FEATURED ROOMS ══ */}
      <section className="hp-rooms">
        <div className="hp-container">
          <Reveal className="hp-section-header">
            <div className="hp-section-kicker hp-section-kicker--light">{t('home.rooms.kicker')}</div>
            <h2 className="hp-section-title hp-section-title--light"
              dangerouslySetInnerHTML={{ __html: t('home.rooms.title').replace(/\n/g, '<br/>') }}
            />
            <div className="hp-gold-rule" />
          </Reveal>

          <div className="hp-rooms__grid">
            {FEATURED_ROOMS_STATIC.map((room, i) => {
              const roomData = t(`home.rooms.featured.${room.id}`, { returnObjects: true });
              return (
                <Reveal key={room.id} delay={i * 0.12}>
                  <motion.div className="hp-room-card" whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 200 }}>
                    <div className="hp-room-card__media">
                      <img src={room.image} alt={roomData.name} loading="lazy" />
                      {room.badgeKey && (
                        <div className="hp-room-card__badge">{t(`home.rooms.badges.${room.badgeKey}`)}</div>
                      )}
                      <div className="hp-room-card__overlay">
                        <Link to="/rooms"   className="hp-btn hp-btn--glass hp-btn--sm">{t('home.rooms.viewDetails')}</Link>
                        <Link to="/booking" className="hp-btn hp-btn--gold  hp-btn--sm">{t('home.rooms.bookNow')}</Link>
                      </div>
                    </div>
                    <div className="hp-room-card__body">
                      <div className="hp-room-card__type">{roomData.type}</div>
                      <h3 className="hp-room-card__name">{roomData.name}</h3>
                      <div className="hp-room-card__specs">
                        <span>📐 {roomData.size}</span>
                        <span>🏢 {roomData.floor}</span>
                      </div>
                      <div className="hp-room-card__features">
                        {(roomData.features || []).map(f => (
                          <span key={f} className="hp-room-card__feat">{f}</span>
                        ))}
                      </div>
                      <div className="hp-room-card__footer">
                        <div>
                          <span className="hp-room-card__price">${room.price.toLocaleString()}</span>
                          <span className="hp-room-card__per"> {t('home.rooms.perNight')}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.3}>
            <div className="hp-rooms__cta">
              <Link to="/rooms" className="hp-btn hp-btn--outline-light">
                {t('home.rooms.viewAll')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ 5. SERVICES ══ */}
      <section className="hp-services">
        <div className="hp-container">
          <Reveal className="hp-section-header">
            <div className="hp-section-kicker">{t('home.services.kicker')}</div>
            <h2 className="hp-section-title"
              dangerouslySetInnerHTML={{ __html: t('home.services.title').replace(/\n/g, '<br/>') }}
            />
            <div className="hp-gold-rule" />
          </Reveal>

          <div className="hp-services__grid">
            {SERVICES_STATIC.map((svc, i) => {
              const svcData = t(`home.services.items.${svc.id}`, { returnObjects: true });
              return (
                <Reveal key={svc.id} delay={i * 0.08}>
                  <Link to={svc.link} className="hp-svc-card">
                    <div className="hp-svc-card__img">
                      <img src={svc.img} alt={svcData.name} loading="lazy" />
                      <div className="hp-svc-card__img-overlay" />
                    </div>
                    <div className="hp-svc-card__body">
                      <h3 className="hp-svc-card__name">{svcData.name}</h3>
                      <p className="hp-svc-card__desc">{svcData.desc}</p>
                      <span className="hp-svc-card__link">{t('home.services.explore')}</span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ 6. LIFESTYLE ══ */}
      <section className="hp-lifestyle">
        <Reveal className="hp-lifestyle__header hp-container">
          <div className="hp-section-kicker hp-section-kicker--light">{t('home.lifestyle.kicker')}</div>
          <h2 className="hp-section-title hp-section-title--light"
            dangerouslySetInnerHTML={{ __html: t('home.lifestyle.title').replace(/\n/g, '<br/>') }}
          />
          <div className="hp-gold-rule" />
        </Reveal>

        <div className="hp-lifestyle__grid">
          {LIFESTYLES_STATIC.map((ls, i) => {
            const lsData = t(`home.lifestyle.items.${ls.id}`, { returnObjects: true });
            return (
              <motion.div
                key={ls.id}
                className="hp-ls-card"
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: i * 0.1 }}>
                <Link to={ls.link} className="hp-ls-card__inner">
                  <motion.img
                    src={ls.img} alt={lsData.title} loading="lazy"
                    className="hp-ls-card__img"
                    whileHover={{ scale: 1.07 }}
                    transition={{ duration: 0.6 }} />
                  <div className="hp-ls-card__overlay" />
                  <div className="hp-ls-card__content">
                    <h3 className="hp-ls-card__title">{lsData.title}</h3>
                    <p className="hp-ls-card__desc">{lsData.desc}</p>
                    <span className="hp-ls-card__cta">{t('home.lifestyle.explore')}</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ══ 7. TESTIMONIALS ══ */}
      <section className="hp-testimonials">
        <div className="hp-container">
          <Reveal className="hp-section-header">
            <div className="hp-section-kicker">{t('home.testimonials.kicker')}</div>
            <h2 className="hp-section-title"
              dangerouslySetInnerHTML={{ __html: t('home.testimonials.title').replace(/\n/g, '<br/>') }}
            />
            <div className="hp-gold-rule" />
          </Reveal>

          <div className="hp-test__wrap">
            <AnimatePresence mode="wait">
              <motion.div
                key={testIdx}
                className="hp-test-main"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.45 }}>
                {(() => {
                  const cur = TESTIMONIALS_STATIC[testIdx];
                  const curData = t(`home.testimonials.items.${cur.id}`, { returnObjects: true });
                  return (
                    <>
                      <div className="hp-test-main__quote">
                        <span className="hp-test-main__mark">"</span>
                        {curData.quote}
                      </div>
                      <div className="hp-test-main__author">
                        <div className="hp-test-main__avatar">{cur.avatar}</div>
                        <div>
                          <div className="hp-test-main__name">{curData.name}</div>
                          <div className="hp-test-main__role">{curData.role}</div>
                          <div className="hp-test-main__stars">{'★'.repeat(cur.stars)}</div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            </AnimatePresence>

            <div className="hp-test__thumbs">
              {TESTIMONIALS_STATIC.map((item, i) => {
                const itemData = t(`home.testimonials.items.${item.id}`, { returnObjects: true });
                return (
                  <button
                    key={i}
                    className={`hp-test__thumb ${i === testIdx ? 'hp-test__thumb--active' : ''}`}
                    onClick={() => setTestIdx(i)}>
                    <span className="hp-test__thumb-avatar">{item.avatar}</span>
                    <span className="hp-test__thumb-name">{itemData.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="hp-test__progress">
              {TESTIMONIALS_STATIC.map((_, i) => (
                <motion.div
                  key={i}
                  className={`hp-test__prog-dot ${i === testIdx ? 'active' : ''}`}
                  onClick={() => setTestIdx(i)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 8. FINAL CTA ══ */}
      <section className="hp-cta">
        <div className="hp-cta__bg">
          <img
            src="https://images.unsplash.com/photo-1549294413-26f195200c16?w=1600&auto=format&fit=crop"
            alt={t('home.ctaNew.kicker')}
            loading="lazy" />
        </div>
        <div className="hp-cta__overlay" />
        <div className="hp-cta__content">
          <Reveal>
            <div className="hp-section-kicker hp-section-kicker--light" style={{ textAlign: 'center' }}>
              {t('home.ctaNew.kicker')}
            </div>
            <h2 className="hp-cta__title"
              dangerouslySetInnerHTML={{ __html: t('home.ctaNew.title').replace(/\n/g, '<br/>') }}
            />
            <p className="hp-cta__sub">{t('home.ctaNew.sub')}</p>
            <div className="hp-cta__actions">
              <Link to="/booking" className="hp-btn hp-btn--gold hp-btn--lg">
                {t('home.ctaNew.bookNow')}
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </Link>
              <Link to="/contact" className="hp-btn hp-btn--glass hp-btn--lg">
                {t('home.ctaNew.contactUs')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
};

export default Home;
