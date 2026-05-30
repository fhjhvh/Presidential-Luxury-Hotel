import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminAIAnalytics.css';

const API = 'http://localhost:5000/api';

// ── Helpers ─────────────────────────────────────────────────────
const fmt = (n) => (n ?? 0).toLocaleString();
const pct = (n) => `${n ?? 0}%`;

const PERIOD_OPTIONS = [
  { label: '7 Days',  value: 7  },
  { label: '30 Days', value: 30 },
  { label: '90 Days', value: 90 },
];

const PURPOSE_LABELS = {
  honeymoon: { label: 'Honeymoon',  icon: '💑', color: '#EC4899' },
  business:  { label: 'Business',   icon: '💼', color: '#3B82F6' },
  family:    { label: 'Family',     icon: '👨‍👩‍👧', color: '#10B981' },
  vacation:  { label: 'Vacation',   icon: '🌴', color: '#F59E0B' },
  vip:       { label: 'VIP',        icon: '👑', color: '#C8A96A' },
  unknown:   { label: 'General',    icon: '✦',  color: '#6B7280' },
};

const ROOM_TYPE_COLORS = {
  STANDARD:  '#6B7280',
  DELUXE:    '#3B82F6',
  SUITE:     '#7C3AED',
  PENTHOUSE: '#C8A96A',
};

// ── KPI Card ─────────────────────────────────────────────────────
function KpiCard({ icon, label, value, sub, accent, trend }) {
  return (
    <div className="ai-kpi-card" style={{ '--accent': accent || '#C8A96A' }}>
      <div className="ai-kpi-icon">{icon}</div>
      <div className="ai-kpi-body">
        <span className="ai-kpi-value">{value}</span>
        <span className="ai-kpi-label">{label}</span>
        {sub && <span className="ai-kpi-sub">{sub}</span>}
      </div>
      {trend !== undefined && (
        <div className={`ai-kpi-trend ${trend >= 0 ? 'up' : 'down'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
}

// ── Bar Chart (pure CSS) ──────────────────────────────────────────
function BarChart({ data, keys, colors, labels }) {
  const maxVal = Math.max(1, ...data.flatMap(d => keys.map(k => d[k] || 0)));

  return (
    <div className="ai-bar-chart">
      <div className="ai-bar-chart-bars">
        {data.map((row, i) => (
          <div key={i} className="ai-bar-group">
            {keys.map((k, ki) => (
              <div key={k} className="ai-bar-wrap">
                <div
                  className="ai-bar"
                  style={{
                    height: `${Math.max(2, ((row[k] || 0) / maxVal) * 100)}%`,
                    background: colors[ki],
                  }}
                  title={`${labels[ki]}: ${row[k] || 0}`}
                />
              </div>
            ))}
            <span className="ai-bar-label">
              {row.date ? row.date.slice(5) : row.label}
            </span>
          </div>
        ))}
      </div>
      <div className="ai-bar-legend">
        {keys.map((k, i) => (
          <span key={k} className="ai-bar-legend-item">
            <span className="ai-bar-legend-dot" style={{ background: colors[i] }} />
            {labels[i]}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Progress Row ──────────────────────────────────────────────────
function ProgressRow({ label, icon, count, total, color }) {
  const pctVal = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="ai-progress-row">
      <div className="ai-progress-label">
        <span className="ai-progress-icon">{icon}</span>
        <span>{label}</span>
      </div>
      <div className="ai-progress-track">
        <div
          className="ai-progress-fill"
          style={{ width: `${pctVal}%`, background: color }}
        />
      </div>
      <div className="ai-progress-meta">
        <span className="ai-progress-count">{fmt(count)}</span>
        <span className="ai-progress-pct">{pct(pctVal)}</span>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
export default function AdminAIAnalytics() {
  const navigate = useNavigate();
  const [period, setPeriod]   = useState(30);
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const getToken = () => localStorage.getItem('admin_token');

  const loadStats = useCallback(async () => {
    const token = getToken();
    if (!token) { navigate('/admin/login'); return; }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/admin/concierge/stats?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { navigate('/admin/login'); return; }
      if (!res.ok) throw new Error('Failed to load analytics');
      setData(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [period, navigate]);

  useEffect(() => { loadStats(); }, [loadStats]);

  // ── Render ────────────────────────────────────────────────────
  if (!getToken()) return null;

  const s = data?.summary ?? {};
  const totalSessions = s.totalSessions ?? 0;

  return (
    <div className="ai-analytics">

      {/* ── Top Header ─────────────────────────────────────────── */}
      <div className="ai-page-header">
        <div className="ai-page-header-left">
          <button className="ai-back-btn" onClick={() => navigate('/admin/dashboard')}>
            ← Dashboard
          </button>
          <div>
            <h1>AI Concierge Analytics</h1>
            <p>Measure recommendation performance, guest behaviour & booking impact</p>
          </div>
        </div>
        <div className="ai-period-picker">
          {PERIOD_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`ai-period-btn ${period === opt.value ? 'active' : ''}`}
              onClick={() => setPeriod(opt.value)}
            >
              {opt.label}
            </button>
          ))}
          <button className="ai-refresh-btn" onClick={loadStats} title="Refresh">↻</button>
        </div>
      </div>

      {/* ── Error / Loading ─────────────────────────────────────── */}
      {error && (
        <div className="ai-error-banner">
          ⚠ {error} —{' '}
          <button onClick={loadStats}>Retry</button>
        </div>
      )}

      {loading && (
        <div className="ai-loading">
          <div className="ai-loading-spinner" />
          <span>Loading analytics…</span>
        </div>
      )}

      {!loading && data && (
        <>
          {/* ── KPI Row ─────────────────────────────────────────── */}
          <div className="ai-kpi-row">
            <KpiCard
              icon="💬"
              label="Total Conversations"
              value={fmt(s.totalSessions)}
              sub={`${fmt(s.totalMessages)} messages`}
              accent="#C8A96A"
            />
            <KpiCard
              icon="🎯"
              label="Recommendation Rate"
              value={pct(s.recommendationRate)}
              sub={`${fmt(s.recommendationsShown)} sessions`}
              accent="#3B82F6"
            />
            <KpiCard
              icon="🏨"
              label="Booking Conversion"
              value={pct(s.bookingConversionRate)}
              sub={`${fmt(s.bookingInitiated)} bookings started`}
              accent="#10B981"
            />
            <KpiCard
              icon="📊"
              label="Avg Messages / Session"
              value={s.avgMessagesPerSession ?? 0}
              sub="per conversation"
              accent="#7C3AED"
            />
          </div>

          {/* ── Daily Activity Chart ─────────────────────────────── */}
          <div className="ai-section">
            <div className="ai-section-header">
              <h2>Daily Activity</h2>
              <span className="ai-section-sub">Last {period} days</span>
            </div>
            {data.dailyActivity?.length > 0 ? (
              <BarChart
                data={data.dailyActivity}
                keys={['sessions', 'recommendations', 'bookings']}
                colors={['#0F172A', '#C8A96A', '#10B981']}
                labels={['Conversations', 'Recommendations', 'Bookings Started']}
              />
            ) : (
              <div className="ai-empty">No activity data yet for this period.</div>
            )}
          </div>

          {/* ── Two-Column: Purpose + Room Types ─────────────────── */}
          <div className="ai-two-col">

            {/* Purpose Breakdown */}
            <div className="ai-section">
              <div className="ai-section-header">
                <h2>Stay Purpose</h2>
                <span className="ai-section-sub">{fmt(totalSessions)} sessions</span>
              </div>
              {data.purposeBreakdown?.length > 0 ? (
                <div className="ai-purpose-grid">
                  {data.purposeBreakdown.map(p => {
                    const meta = PURPOSE_LABELS[p.purpose] || PURPOSE_LABELS.unknown;
                    return (
                      <div key={p.purpose} className="ai-purpose-card">
                        <div
                          className="ai-purpose-icon-wrap"
                          style={{ background: `${meta.color}18`, borderColor: `${meta.color}40` }}
                        >
                          <span>{meta.icon}</span>
                        </div>
                        <span className="ai-purpose-label">{meta.label}</span>
                        <span className="ai-purpose-count">{fmt(p.count)}</span>
                        <div className="ai-purpose-bar-wrap">
                          <div
                            className="ai-purpose-bar"
                            style={{ width: `${p.percentage}%`, background: meta.color }}
                          />
                        </div>
                        <span className="ai-purpose-pct">{pct(p.percentage)}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="ai-empty">No purpose data yet.</div>
              )}
            </div>

            {/* Room Type Breakdown */}
            <div className="ai-section">
              <div className="ai-section-header">
                <h2>Recommended Room Types</h2>
                <span className="ai-section-sub">{fmt(s.recommendationsShown)} recommendations</span>
              </div>
              {data.roomTypeBreakdown?.length > 0 ? (
                <div className="ai-room-types">
                  {data.roomTypeBreakdown.map(r => (
                    <ProgressRow
                      key={r.roomType}
                      label={r.roomType}
                      icon="🏷"
                      count={r.count}
                      total={s.recommendationsShown}
                      color={ROOM_TYPE_COLORS[r.roomType] || '#6B7280'}
                    />
                  ))}
                </div>
              ) : (
                <div className="ai-empty">No recommendation data yet.</div>
              )}
            </div>
          </div>

          {/* ── Two-Column: Preferences + Language ───────────────── */}
          <div className="ai-two-col">

            {/* Top Preferences */}
            <div className="ai-section">
              <div className="ai-section-header">
                <h2>Guest Preferences</h2>
                <span className="ai-section-sub">Most requested amenities</span>
              </div>
              {data.topPreferences?.length > 0 ? (
                <div className="ai-prefs">
                  {data.topPreferences.map(p => (
                    <ProgressRow
                      key={p.key}
                      label={p.name}
                      icon={
                        p.key === 'spa'     ? '♨' :
                        p.key === 'view'    ? '🌅' :
                        p.key === 'butler'  ? '🤵' :
                        p.key === 'quiet'   ? '🤫' :
                        p.key === 'balcony' ? '🌇' :
                        p.key === 'pool'    ? '🏊' : '👑'
                      }
                      count={p.count}
                      total={totalSessions}
                      color="#C8A96A"
                    />
                  ))}
                </div>
              ) : (
                <div className="ai-empty">No preference data yet.</div>
              )}
            </div>

            {/* Language + Conversion Funnel */}
            <div className="ai-section">
              <div className="ai-section-header">
                <h2>Conversion Funnel</h2>
                <span className="ai-section-sub">Guest journey</span>
              </div>
              <div className="ai-funnel">
                <div className="ai-funnel-step">
                  <div className="ai-funnel-bar-wrap">
                    <div className="ai-funnel-bar" style={{ width: '100%' }}>
                      <span>{fmt(totalSessions)} Conversations</span>
                    </div>
                  </div>
                  <span className="ai-funnel-pct">100%</span>
                </div>
                <div className="ai-funnel-step">
                  <div className="ai-funnel-bar-wrap">
                    <div
                      className="ai-funnel-bar ai-funnel-bar--rec"
                      style={{ width: `${s.recommendationRate || 0}%` }}
                    >
                      <span>{fmt(s.recommendationsShown)} Recommendations</span>
                    </div>
                  </div>
                  <span className="ai-funnel-pct">{pct(s.recommendationRate)}</span>
                </div>
                <div className="ai-funnel-step">
                  <div className="ai-funnel-bar-wrap">
                    <div
                      className="ai-funnel-bar ai-funnel-bar--book"
                      style={{
                        width: `${totalSessions > 0
                          ? Math.round((s.bookingInitiated / totalSessions) * 100)
                          : 0}%`,
                      }}
                    >
                      <span>{fmt(s.bookingInitiated)} Bookings Started</span>
                    </div>
                  </div>
                  <span className="ai-funnel-pct">
                    {pct(totalSessions > 0
                      ? Math.round((s.bookingInitiated / totalSessions) * 100)
                      : 0)}
                  </span>
                </div>
              </div>

              {/* Language split */}
              {data.languageBreakdown?.length > 0 && (
                <>
                  <div className="ai-section-header" style={{ marginTop: '1.5rem' }}>
                    <h2>Language Split</h2>
                  </div>
                  <div className="ai-lang-row">
                    {data.languageBreakdown.map(l => (
                      <div key={l.language} className="ai-lang-card">
                        <span className="ai-lang-flag">
                          {l.language === 'ar' ? '🇸🇦' : '🇬🇧'}
                        </span>
                        <span className="ai-lang-name">
                          {l.language === 'ar' ? 'Arabic' : 'English'}
                        </span>
                        <span className="ai-lang-count">{fmt(l.count)}</span>
                        <span className="ai-lang-pct">{pct(l.percentage)}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Top Recommended Rooms Table ───────────────────────── */}
          {data.topRecommendedRooms?.length > 0 && (
            <div className="ai-section">
              <div className="ai-section-header">
                <h2>Top Recommended Rooms</h2>
                <span className="ai-section-sub">Rooms most matched by the AI engine</span>
              </div>
              <div className="ai-table-wrap">
                <table className="ai-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Room</th>
                      <th>Type</th>
                      <th>Recommendations</th>
                      <th>Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topRecommendedRooms.map((r, i) => (
                      <tr key={i}>
                        <td className="ai-table-rank">{i + 1}</td>
                        <td>
                          <span className="ai-table-room-num">Room {r.roomNumber}</span>
                        </td>
                        <td>
                          <span
                            className="ai-badge"
                            style={{
                              background: `${ROOM_TYPE_COLORS[r.roomType] || '#6B7280'}18`,
                              color: ROOM_TYPE_COLORS[r.roomType] || '#6B7280',
                              borderColor: `${ROOM_TYPE_COLORS[r.roomType] || '#6B7280'}40`,
                            }}
                          >
                            {r.roomType}
                          </span>
                        </td>
                        <td className="ai-table-count">{fmt(r.count)}</td>
                        <td>
                          <div className="ai-table-bar-wrap">
                            <div
                              className="ai-table-bar"
                              style={{
                                width: `${s.recommendationsShown > 0
                                  ? Math.round((r.count / s.recommendationsShown) * 100)
                                  : 0}%`,
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Recent Sessions Table ─────────────────────────────── */}
          <div className="ai-section">
            <div className="ai-section-header">
              <h2>Recent Conversations</h2>
              <span className="ai-section-sub">Last 25 sessions</span>
            </div>
            {data.recentSessions?.length > 0 ? (
              <div className="ai-table-wrap">
                <table className="ai-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Lang</th>
                      <th>Msgs</th>
                      <th>Purpose</th>
                      <th>Guests</th>
                      <th>Budget</th>
                      <th>Recommended</th>
                      <th>Booking</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentSessions.map(sess => {
                      const purMeta = PURPOSE_LABELS[sess.detectedPurpose] || null;
                      return (
                        <tr key={sess.id}>
                          <td className="ai-table-time">
                            {new Date(sess.startedAt).toLocaleString([], {
                              month: 'short', day: 'numeric',
                              hour: '2-digit', minute: '2-digit',
                            })}
                          </td>
                          <td>
                            <span className="ai-table-lang">
                              {sess.language === 'ar' ? '🇸🇦 AR' : '🇬🇧 EN'}
                            </span>
                          </td>
                          <td className="ai-table-num">{sess.totalMessages}</td>
                          <td>
                            {purMeta ? (
                              <span className="ai-badge ai-badge--purpose"
                                style={{ color: purMeta.color, borderColor: `${purMeta.color}40`, background: `${purMeta.color}12` }}>
                                {purMeta.icon} {purMeta.label}
                              </span>
                            ) : (
                              <span className="ai-table-muted">—</span>
                            )}
                          </td>
                          <td className="ai-table-num">
                            {sess.detectedGuests ?? <span className="ai-table-muted">—</span>}
                          </td>
                          <td className="ai-table-num">
                            {sess.detectedBudget
                              ? `$${sess.detectedBudget}`
                              : <span className="ai-table-muted">—</span>}
                          </td>
                          <td>
                            {sess.recommendationShown && sess.recommendedRoomNum ? (
                              <span className="ai-badge ai-badge--rec">
                                Room {sess.recommendedRoomNum}
                              </span>
                            ) : (
                              <span className="ai-table-muted">—</span>
                            )}
                          </td>
                          <td>
                            {sess.bookingInitiated ? (
                              <span className="ai-badge ai-badge--booked">✓ Started</span>
                            ) : (
                              <span className="ai-table-muted">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="ai-empty">
                No sessions recorded yet. Once guests start chatting with the AI Concierge,
                their sessions will appear here.
              </div>
            )}
          </div>

          {/* ── Footer Note ───────────────────────────────────────── */}
          <div className="ai-footer-note">
            ✦ Data updates in real-time as guests interact with the AI Concierge ·
            Sessions older than {period} days are excluded from this view
          </div>
        </>
      )}
    </div>
  );
}
