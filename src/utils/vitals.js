import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

const THRESHOLDS = {
  CLS: { good: 0.1, needsImprovement: 0.25 },
  INP: { good: 200, needsImprovement: 500 },
  LCP: { good: 2500, needsImprovement: 4000 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 },
};

const rate = (metric) => {
  const t = THRESHOLDS[metric.name];
  if (!t) return 'unknown';
  if (metric.value <= t.good) return 'good';
  if (metric.value <= t.needsImprovement) return 'needs-improvement';
  return 'poor';
};

export const initWebVitals = (reporter) => {
  const send = (metric) => {
    const payload = {
      name: metric.name,
      value: Math.round(metric.value * 100) / 100,
      rating: rate(metric),
      id: metric.id,
      navigationType: metric.navigationType,
    };
    if (typeof reporter === 'function') {
      reporter(payload);
      return;
    }
    if (import.meta.env.DEV) {
      const tag = payload.rating === 'poor' ? 'warn' : 'log';
      // eslint-disable-next-line no-console
      console[tag](`[web-vitals] ${payload.name}: ${payload.value} (${payload.rating})`);
    }
  };

  onCLS(send);
  onINP(send);
  onLCP(send);
  onFCP(send);
  onTTFB(send);
};
