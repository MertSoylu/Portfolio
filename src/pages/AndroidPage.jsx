import React from 'react';
import { motion } from 'framer-motion';
import { HiBookOpen, HiDeviceMobile, HiExternalLink, HiHeart, HiTrendingUp } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import SitePreview from '../components/SitePreview';
import SpecialtyPageLayout from '../components/SpecialtyPageLayout';

const AndroidPage = () => {
  const { isTurkish } = useLanguage();
  const playUrl = 'https://play.google.com/store/apps/details?id=com.mert.paticat';

  const features = isTurkish
    ? [
        {
          icon: <HiTrendingUp className="h-5 w-5" />,
          title: 'Adım takibi',
          desc: 'Günlük hareketi uygulama içinde takip edilebilir hale getirir.',
        },
        {
          icon: <HiHeart className="h-5 w-5" />,
          title: 'Sanal kedi',
          desc: 'Adımları oyun motivasyonuna bağlayan bakım sistemi.',
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
          title: 'Virtual cat',
          desc: 'Connects walking behavior to a pet-care motivation loop.',
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
      accent="emerald"
      eyebrow={isTurkish ? 'Android geliştirme' : 'Android development'}
      eyebrowIcon={<HiDeviceMobile className="h-4 w-4" />}
      title={isTurkish ? 'Google Play’de yayınlanan mobil iş' : 'Published mobile work on Google Play'}
      subtitle={
        isTurkish
          ? 'WalkKittie, sağlık takibini oyunlaştıran native Android ürünüm. Odak; sade akış, motivasyon ve günlük kullanım.'
          : 'WalkKittie is my native Android product that gamifies health tracking. Focus: simple flow, motivation, and daily use.'
      }
      sideNode={
        <SitePreview
          title="WalkKittie"
          url={playUrl}
          type="mobile"
          variant="mobile"
          expandable={false}
          showActions={false}
        />
      }
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55 }}
          className="card-prominent p-6 sm:p-8"
        >
          <p className="mb-2 text-caption text-emerald-700 dark:text-emerald-200">WalkKittie</p>
          <h2 className="mb-4 text-h2 text-ink-900 dark:text-white">
            {isTurkish ? 'Yürü, puan kazan, kedine bak.' : 'Walk, earn points, care for your cat.'}
          </h2>
          <p className="mb-5 text-body text-ink-600 dark:text-ink-200">
            {isTurkish
              ? 'Uygulama adım takibi, su tüketimi, sanal evcil hayvan bakımı ve küçük oyun akışlarını tek bir günlük rutin içinde birleştiriyor. Amacı sağlık uygulamasını soğuk bir sayaç olmaktan çıkarıp daha sıcak bir motivasyon sistemine çevirmek.'
              : 'The app combines step tracking, water intake, virtual pet care, and small game flows into one daily routine. Its goal is to make health tracking feel less mechanical and more motivating.'}
          </p>
          <div className="mb-6 flex flex-wrap gap-2">
            {['Kotlin', 'Jetpack Compose', 'Material 3', 'Google Play'].map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-ink-200/70 bg-white/50 px-2.5 py-1 text-xs font-bold text-ink-600 dark:border-white/10 dark:bg-white/10 dark:text-ink-200"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={playUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <HiExternalLink className="h-4 w-4" />
              Google Play
            </a>
            <Link to="/case-study/walkkittie" className="btn-secondary">
              <HiBookOpen className="h-4 w-4" />
              Case Study
            </Link>
          </div>
        </motion.article>

        <div className="grid gap-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="card-raised p-5"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-300/50 bg-emerald-50 text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-h4 text-ink-900 dark:text-white">{feature.title}</h3>
              <p className="text-body-sm text-ink-600 dark:text-ink-200">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SpecialtyPageLayout>
  );
};

export default AndroidPage;
