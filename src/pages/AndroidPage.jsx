import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';
import { HiBeaker, HiDeviceMobile, HiHeart, HiTrendingUp } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import SpecialtyPageLayout from '../components/SpecialtyPageLayout';
import Reveal from '../components/ui/Reveal';
import ProjectShowcase from '../components/project/ProjectShowcase';
import { pick, projectsByCategory } from '../data/projects';

// Sayı, görünür olunca 0'dan hedef değere sayar. Azaltılmış hareket tercihinde animasyon yok.
// Sayı olmayan değerler (ör. "Kotlin") olduğu gibi gösterilir.
const StatNumber = ({ value, suffix = '', inView }) => {
  const reduce = useReducedMotion();
  const isNumber = typeof value === 'number';
  const [display, setDisplay] = useState(reduce || !isNumber ? value : 0);

  useEffect(() => {
    if (!isNumber) return undefined;
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
  }, [inView, value, reduce, isNumber]);

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
        { value: 1, label: 'piksel pet', sub: 'adımlarınla beslenen animasyonlu pet' },
        { value: 3, label: 'bakım döngüsü', sub: 'adım, su tüketimi, pet bakımı' },
        { value: 'Kotlin', label: 'native Android', sub: 'Jetpack Compose + Material 3' },
        { value: 1, label: 'mağaza yayını', sub: 'Google Play’de canlı' },
      ]
    : [
        { value: 1, label: 'pixel pet', sub: 'an animated pet fed by your steps' },
        { value: 3, label: 'care loops', sub: 'steps, water intake, pet care' },
        { value: 'Kotlin', label: 'native Android', sub: 'Jetpack Compose + Material 3' },
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
  const t = (value) => pick(value, isTurkish);

  const projects = projectsByCategory('Android');

  const features = [
    {
      icon: <HiTrendingUp className="h-5 w-5" aria-hidden="true" />,
      title: { tr: 'Adım takibi', en: 'Step tracking' },
      desc: {
        tr: 'Günlük yürüyüşünü uygulama içinde görünür bir ilerlemeye çevirir.',
        en: 'Turns your daily walking into visible progress inside the app.',
      },
    },
    {
      icon: <HiBeaker className="h-5 w-5" aria-hidden="true" />,
      title: { tr: 'Su takibi', en: 'Water tracking' },
      desc: {
        tr: 'Su tüketimi, pet bakım döngüsünün bir parçası olarak günlük rutine girer.',
        en: 'Water intake becomes part of the pet care loop, inside the same daily routine.',
      },
    },
    {
      icon: <HiHeart className="h-5 w-5" aria-hidden="true" />,
      title: { tr: 'Piksel pet', en: 'Pixel pet' },
      desc: {
        tr: 'Verilen sprite’tan türetilen animasyonlu pet; hareket ettikçe oyun döngüsü ilerler.',
        en: 'An animated pet built from the supplied sprite; the game loop moves forward as you move.',
      },
    },
  ];

  return (
    <SpecialtyPageLayout
      routePath="/android"
      eyebrow={isTurkish ? 'Android geliştirme' : 'Android development'}
      eyebrowIcon={<HiDeviceMobile className="h-4 w-4" />}
      title={
        isTurkish
          ? 'Google Play’de yayında bir Android ürünü'
          : 'A native Android product live on Google Play'
      }
      subtitle={
        isTurkish
          ? 'Kotlin ve Jetpack Compose ile native olarak geliştirdiğim WalkKittie, adım ve su takibini piksel pet bakımıyla birleştiriyor.'
          : 'WalkKittie, built natively with Kotlin and Jetpack Compose, pairs step and water tracking with pixel-pet care.'
      }
    >
      <div className="space-y-20 sm:space-y-24">
        {projects.map((project, index) => (
          <ProjectShowcase key={project.id} project={project} index={index} />
        ))}
      </div>

      <section aria-labelledby="android-features-heading" className="mt-20 sm:mt-24">
        <Reveal className="mb-8 max-w-2xl sm:mb-10">
          <p className="eyebrow mb-3 text-accent">{isTurkish ? 'Ürün' : 'Product'}</p>
          <h2 id="android-features-heading" className="text-h2 text-fg">
            {isTurkish ? 'Üç temel akış' : 'Three core loops'}
          </h2>
          <p className="mt-3 text-body text-muted">
            {isTurkish
              ? 'Uygulama adım takibi, su tüketimi ve piksel pet bakımını tek bir günlük rutinde birleştiriyor. Amaç, sağlık takibini soğuk bir sayaç olmaktan çıkarıp motive edici bir alışkanlığa dönüştürmek.'
              : 'The app joins step tracking, water intake and pixel-pet care in one daily routine. The goal is to turn health tracking from a cold counter into a habit that feels motivating.'}
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal key={feature.title.en} delay={index * 0.06} className="h-full">
              <div className="card h-full p-6">
                <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface2 text-accent">
                  {feature.icon}
                </span>
                <h3 className="mb-2 text-h4 text-fg">{t(feature.title)}</h3>
                <p className="text-body-sm text-muted">{t(feature.desc)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-labelledby="android-stats-heading" className="mt-20 sm:mt-24">
        <Reveal className="mb-8 sm:mb-10">
          <h2 id="android-stats-heading" className="text-h2 text-fg">
            {isTurkish ? 'Bir bakışta' : 'At a glance'}
          </h2>
        </Reveal>
        <StatsStrip isTurkish={isTurkish} />
      </section>
    </SpecialtyPageLayout>
  );
};

export default AndroidPage;
