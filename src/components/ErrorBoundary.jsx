import React from 'react';
import { HiHome, HiRefresh } from 'react-icons/hi';

const readLanguage = () => {
  try {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('language') : null;
    if (saved === 'tr' || saved === 'en') return saved;
    if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('tr')) {
      return 'tr';
    }
  } catch {
    /* ignore */
  }
  return 'en';
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (typeof console !== 'undefined') {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  handleHome = () => {
    if (typeof window !== 'undefined') {
      window.location.assign('/');
    }
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const isTurkish = readLanguage() === 'tr';

    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-4 text-fg">
        <div className="card w-full max-w-md p-8 text-center">
          <p className="label mb-5 text-danger">{isTurkish ? 'Hata' : 'Error'}</p>
          <h1 className="text-h2 mb-3">{isTurkish ? 'Bir Şey Ters Gitti' : 'Something Went Wrong'}</h1>
          <p className="mb-6 text-muted">
            {isTurkish
              ? 'Beklenmedik bir hata oluştu. Sayfayı yenilemeyi dene veya ana sayfaya dön.'
              : 'An unexpected error occurred. Try refreshing the page or returning home.'}
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={this.handleReload} className="btn btn-primary">
              <HiRefresh className="h-5 w-5" aria-hidden="true" />
              {isTurkish ? 'Sayfayı Yenile' : 'Reload Page'}
            </button>
            <button type="button" onClick={this.handleHome} className="btn btn-secondary">
              <HiHome className="h-5 w-5" aria-hidden="true" />
              {isTurkish ? 'Ana Sayfa' : 'Go Home'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
