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
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-white to-cyan-50 text-ink-900 dark:from-ink-900 dark:to-ink-800 dark:text-white">
        <div className="card-prominent max-w-md p-8 text-center">
          <div className="mb-6">
            <span className="gradient-text inline-block text-7xl font-bold">!</span>
          </div>
          <h1 className="text-2xl font-bold mb-3">
            {isTurkish ? 'Bir Şey Ters Gitti' : 'Something Went Wrong'}
          </h1>
          <p className="text-ink-600 dark:text-ink-200 mb-6">
            {isTurkish
              ? 'Beklenmedik bir hata oluştu. Sayfayı yenilemeyi dene veya ana sayfaya dön.'
              : 'An unexpected error occurred. Try refreshing the page or returning home.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button type="button" onClick={this.handleReload} className="btn-primary">
              <HiRefresh className="w-5 h-5" />
              {isTurkish ? 'Sayfayı Yenile' : 'Reload Page'}
            </button>
            <button type="button" onClick={this.handleHome} className="btn-secondary">
              <HiHome className="w-5 h-5" />
              {isTurkish ? 'Ana Sayfa' : 'Go Home'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
