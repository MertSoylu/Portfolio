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
      <div className="min-h-screen flex items-center justify-center px-4 bg-sand-50 dark:bg-zinc-950 text-sand-900 dark:text-zinc-100">
        <div className="max-w-md text-center">
          <div className="mb-6">
            <span className="inline-block text-7xl font-bold bg-gradient-to-r from-warm-600 via-warm-500 to-sand-500 bg-clip-text text-transparent">
              !
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-3">
            {isTurkish ? 'Bir Şey Ters Gitti' : 'Something Went Wrong'}
          </h1>
          <p className="text-sand-600 dark:text-zinc-300 mb-6">
            {isTurkish
              ? 'Beklenmedik bir hata oluştu. Sayfayı yenilemeyi dene veya ana sayfaya dön.'
              : 'An unexpected error occurred. Try refreshing the page or returning home.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-warm-600 hover:bg-warm-700 text-white font-medium transition-colors"
            >
              <HiRefresh className="w-5 h-5" />
              {isTurkish ? 'Sayfayı Yenile' : 'Reload Page'}
            </button>
            <button
              type="button"
              onClick={this.handleHome}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-sand-300 dark:border-zinc-700 hover:bg-sand-100 dark:hover:bg-zinc-900 font-medium transition-colors"
            >
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
