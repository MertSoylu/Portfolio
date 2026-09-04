import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';
import { HiBookOpen, HiDeviceMobile, HiExternalLink, HiHeart, HiTrendingUp } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import SpecialtyPageLayout from '../components/SpecialtyPageLayout';
import Reveal from '../components/ui/Reveal';
import { PhoneFrame } from '../components/ui/DevicePreview';

const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.mert.paticat';

const StatNumber = ({ value, suffix = '', inView }) => {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) {
      if (reduce) setDisplay(value);
      return undefined;
    }
    const controls = animate(0, value, {
      duration: 1.3,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, value, reduce]);

  return (
    <span className="font-display text-3xl font-semibold text-fg sm:text-4xl">
      {display}
      {suffix}
    </span>
  );
};

const StatsStrip = ({ isTurkish }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const stats = isTurkish
    ? [
        { value: 1, label: 'piksel pet', sub: 'adımlarınla gelişen evcil pet' },
        { value: 3, label: 'bakım döngüsü', sub: 'adım, su tüketimi, pet bakımı' },
        { value: 100, suffix: '%', label: 'native Kotlin', sub: 'Jetpack Compose + Material 3' },
        { value: 1, label: 'mağaza yayını', sub: 'Google Play’de canlı' },
      ]
    : [
        { value: 1, label: 'pixel pet', sub: 'a pet loop fed by your steps' },
        { value: 3, label: 'care loops', sub: 'steps, water intake, pet care' },
        { value: 100, suffix: '%', label: 'native Kotlin', sub: 'Jetpack Compose + Material 3' },
        { value: 1, label: 'store release', sub: 'live on Google Play' },
      ];

  return (
    <div ref={ref} className="card grid grid-cols-2 gap-x-4 gap-y-8 p-6 sm:p-8 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="mb-1">
            <StatNumber value={stat.value} suffix={stat.suffix} inView={inView} />
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fg">{stat.label}</p>
          <p className="mt-1 text-xs text-muted">{stat.sub}</p>
        </div>
      ))}
    </div>
  );
};

const AndroidPage = () => {
  const { isTurkish } = useLanguage();

  const features = isTurkish
    ? [
        {
          icon: <HiTrendingUp className="h-5 w-5" />,
          title: 'Adım takibi',
          desc: 'Günlük hareketi uygulama içinde takip edilebilir hale getirir.',
        },
        {
          icon: <HiHeart className="h-5 w-5" />,
          title: 'Piksel pet',
          desc: 'Verilen sprite’dan türetilen animasyonlu evcil pet.',
        },
        {
          icon: <HiDeviceMobile className="h-5 w-5" />,
          title: 'Native Android',
          desc: 'Kotlin, Jetpack Compose ve Material 3 ile yayınlandı.',
        },
      ]
    : [
        {
          icon: <HiTrendingUp className="h-5 w-5" />,
          title: 'Step tracking',
          desc: 'Turns daily movement into visible in-app progress.',
        },
        {
          icon: <HiHeart className="h-5 w-5" />,
          title: 'Pixel pet',
          desc: 'An animated pet adapted from the supplied sprite.',
        },
        {
          icon: <HiDeviceMobile className="h-5 w-5" />,
          title: 'Native Android',
          desc: 'Published with Kotlin, Jetpack Compose, and Material 3.',
        },
      ];

  return (
    <SpecialtyPageLayout
      routePath="/android"
      eyebrow={isTurkish ? 'Android geliştirme' : 'Android development'}
      eyebrowIcon={<HiDeviceMobile className="h-4 w-4" />}
      title={isTurkish ? 'Google Play’de yayınlanan mobil iş' : 'Published mobile work on Google Play'}
      subtitle={
        isTurkish
          ? 'WalkKittie, sağlık takibini oyunlaştıran native Android ürünüm. Odak; sade akış, motivasyon ve günlük kullanım.'
          : 'WalkKittie is my native Android product that gamifies health tracking. Focus: simple flow, motivation, and daily use.'
      }
    >
      <Reveal className="mb-16 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-4 sm:grid-cols-3 lg:order-2 lg:grid-cols-1">
          {features.map((feature) => (
            <div key={feature.title} className="card p-5">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface2 text-accent">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-h4 text-fg">{feature.title}</h3>
              <p className="text-body-sm text-muted">{feature.desc}</p>
            </div>
          ))}
        </div>
        <div className="lg:order-1">
          <PhoneFrame src="/previews/walkkittie.webp" alt="WalkKittie" title="WalkKittie" />
        </div>
      </Reveal>

      <div className="mb-16">
        <StatsStrip isTurkish={isTurkish} />
      </div>

      <Reveal className="card-prominent p-6 sm:p-8">
        <p className="eyebrow mb-2 text-accent">WalkKittie</p>
        <h2 className="mb-4 text-h2 text-fg">
          {isTurkish ? 'Yürü, puan kazan, pet’ine bak.' : 'Walk, earn points, care for your pet.'}
        </h2>
        <p className="mb-5 max-w-3xl text-body text-muted">
          {isTurkish
            ? 'Uygulama adım takibi, su tüketimi, animasyonlu piksel pet bakımı ve küçük oyun akışlarını tek bir günlük rutin içinde birleştiriyor. Amacı sağlık uygulamasını soğuk bir sayaç olmaktan çıkarıp daha sıcak bir motivasyon sistemine çevirmek.'
            : 'The app combines step tracking, water intake, animated pixel-pet care, and small game flows into one daily routine. Its goal is to make health tracking feel less mechanical and more motivating.'}
        </p>
        <div className="mb-6 flex flex-wrap gap-2">
          {['Kotlin', 'Jetpack Compose', 'Material 3', 'Google Play'].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-line/12 bg-surface2 px-2.5 py-1 text-xs font-medium text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={PLAY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <HiExternalLink className="h-4 w-4" />
            Google Play
          </a>
          <Link to="/case-study/walkkittie" className="btn-secondary">
            <HiBookOpen className="h-4 w-4" />
            Case Study
          </Link>
        </div>
      </Reveal>
    </SpecialtyPageLayout>
  );
};

export default AndroidPage;
