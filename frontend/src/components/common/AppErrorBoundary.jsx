import React from 'react';
import { useLocation } from 'react-router-dom';
import i18n from '../../i18n';

// Trilingual fallback copy (class component — no hooks, read the i18n instance directly)
const TEXT = {
  en: { title: 'Something went wrong', msg: 'We hit an unexpected issue while loading this page. Please try again.', retry: 'Try Again', home: 'Return Home' },
  ar: { title: 'حدث خطأ ما', msg: 'واجهنا مشكلة غير متوقعة أثناء تحميل هذه الصفحة. يُرجى المحاولة مرة أخرى.', retry: 'حاول مجدداً', home: 'العودة إلى الرئيسية' },
  tr: { title: 'Bir şeyler ters gitti', msg: 'Bu sayfa yüklenirken beklenmeyen bir sorun oluştu. Lütfen tekrar deneyin.', retry: 'Tekrar Dene', home: 'Ana Sayfaya Dön' },
};

class ErrorBoundaryInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, resetKey: props.resetKey };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // Auto-recover when the route changes (so navigating away clears the error).
  static getDerivedStateFromProps(props, state) {
    if (props.resetKey !== state.resetKey) {
      return { hasError: false, resetKey: props.resetKey };
    }
    return null;
  }

  componentDidCatch(error, info) {
    console.error('[AppErrorBoundary] Caught render error:', error, info?.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const lang = (i18n.language || 'en').split('-')[0];
    const tx = TEXT[lang] || TEXT.en;
    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    return (
      <div dir={dir} style={styles.wrap}>
        <div style={styles.card}>
          <div style={styles.crown}>👑</div>
          <h1 style={styles.title}>{tx.title}</h1>
          <p style={styles.msg}>{tx.msg}</p>
          <div style={styles.actions}>
            <button style={{ ...styles.btn, ...styles.primary }} onClick={() => this.setState({ hasError: false })}>
              {tx.retry}
            </button>
            <a style={{ ...styles.btn, ...styles.secondary }} href="/">{tx.home}</a>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  wrap: { minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)' },
  card: { textAlign: 'center', maxWidth: 480, padding: '2.5rem', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,164,76,0.25)' },
  crown: { fontSize: '3rem', marginBottom: '1rem' },
  title: { color: '#c9a44c', fontSize: '1.6rem', margin: '0 0 0.75rem' },
  msg: { color: 'rgba(255,255,255,0.78)', lineHeight: 1.6, margin: '0 0 1.75rem' },
  actions: { display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' },
  btn: { padding: '0.75rem 1.5rem', borderRadius: 8, fontSize: '1rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', minHeight: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  primary: { background: 'linear-gradient(135deg, #c9a44c, #8b6914)', color: '#fff', border: 'none' },
  secondary: { background: 'transparent', color: '#c9a44c', border: '1px solid rgba(201,164,76,0.5)' },
};

// Functional wrapper supplies the current path so the boundary resets on navigation.
const AppErrorBoundary = ({ children }) => {
  const location = useLocation();
  return <ErrorBoundaryInner resetKey={location.pathname}>{children}</ErrorBoundaryInner>;
};

export default AppErrorBoundary;
