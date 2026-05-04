import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiDeviceMobile, HiStar, HiHeart, HiTrendingUp } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import SitePreview from '../components/SitePreview';
import FadeContent from '../components/FadeContent';
import SpecialtyPageLayout from '../components/SpecialtyPageLayout';

const AndroidPage = () => {
  const { isTurkish } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const googlePlayBadgeSrc = isTurkish
    ? 'https://play.google.com/intl/en_us/badges/static/images/badges/tr_badge_web_generic.png'
    : 'https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png';

  const playUrl = 'https://play.google.com/store/apps/details?id=com.mert.paticat';

  const features = isTurkish
    ? [
        {
          icon: <HiTrendingUp className="w-6 h-6" />,
          title: 'Adım Sayacı',
          desc: 'Günlük adımlarını otomatik olarak takip et',
        },
        {
          icon: <HiHeart className="w-6 h-6" />,
          title: 'Sanal Kedi Bakımı',
          desc: 'Adımlarını mama puanına çevir ve kedini besle',
        },
        {
          icon: <HiStar className="w-6 h-6" />,
          title: 'Oyun Odası',
          desc: 'Kedinle eğlenceli oyunlar oyna ve bağını güçlendir',
        },
        {
          icon: <HiDeviceMobile className="w-6 h-6" />,
          title: 'Su Takibi',
          desc: 'Günlük su tüketimini izle ve hedefine ulaş',
        },
      ]
    : [
        {
          icon: <HiTrendingUp className="w-6 h-6" />,
          title: 'Step Counter',
          desc: 'Automatically track your daily steps',
        },
        {
          icon: <HiHeart className="w-6 h-6" />,
          title: 'Virtual Cat Care',
          desc: 'Convert steps into food points and feed your cat',
        },
        {
          icon: <HiStar className="w-6 h-6" />,
          title: 'Game Room',
          desc: 'Play fun games with your cat and strengthen your bond',
        },
        {
          icon: <HiDeviceMobile className="w-6 h-6" />,
          title: 'Water Tracking',
          desc: 'Monitor daily water intake and reach your goals',
        },
      ];

  return (
    <SpecialtyPageLayout
      routePath="/android"
      accent="emerald"
      eyebrow={isTurkish ? 'Android Geliştirme' : 'Android Development'}
      eyebrowIcon={<HiDeviceMobile className="w-4 h-4" />}
      title={isTurkish ? 'Mobil Uygulama Projelerim' : 'Mobile App Projects'}
      subtitle={
        isTurkish
          ? 'Kotlin ve React Native kullanarak modern, kullanıcı odaklı Android uygulamaları geliştiriyorum. Temiz mimari ve sezgisel arayüz tasarımı önceliğimdir.'
          : 'I build modern, user-focused Android applications using Kotlin and React Native. Clean architecture and intuitive UI design are my priorities.'
      }
    >
      <FadeContent duration={700} blur threshold={0.1}>
        <div className="card-raised p-6 sm:p-8 overflow-hidden">
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-28 h-20 rounded-xl overflow-hidden bg-gradient-to-r from-accent-500 to-orange-500 p-0.5">
              <div className="w-full h-full rounded-[10px] overflow-hidden bg-white dark:bg-zinc-900">
                <SitePreview
                  url={playUrl}
                  type="mobile"
                  title="WalkKittie (PatiCat)"
                  gradient="from-accent-500 to-orange-500"
                  expandable={false}
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h2 className="text-h4 text-sand-900 dark:text-zinc-50 leading-tight">
                    WalkKittie (PatiCat)
                  </h2>
                  <p className="text-caption text-sand-600 dark:text-zinc-400 mt-1">play.google.com</p>
                </div>
                <motion.a
                  href={playUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex flex-shrink-0"
                  aria-label={isTurkish ? "Google Play'den indir" : 'Get it on Google Play'}
                >
                  <img
                    src={googlePlayBadgeSrc}
                    alt={isTurkish ? "Google Play'den al" : 'Get it on Google Play'}
                    width="646"
                    height="250"
                    className="h-8 w-auto"
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    referrerPolicy="no-referrer"
                    onError={(event) => {
                      event.currentTarget.src =
                        'https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png';
                    }}
                  />
                </motion.a>
              </div>

              <p className="text-body-sm text-sand-700 dark:text-zinc-300 mb-3 line-clamp-2">
                {isTurkish
                  ? 'WalkKittie, günlük yürüyüşlerinizi sanal bir evcil hayvan besleme deneyimiyle birleştirerek daha eğlenceli hale getiren bir sağlık uygulamasıdır. Attığınız her adım mama puanına dönüşür.'
                  : 'WalkKittie is a health app that makes your daily walks more enjoyable by combining them with a virtual pet experience. Every step you take is converted into food points.'}
              </p>

              <div className="flex flex-wrap gap-2 mb-3">
                {features.map((feat) => (
                  <span
                    key={feat.title}
                    className="px-2.5 py-1 text-xs font-medium rounded-full border bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                  >
                    {feat.title}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setExpanded((prev) => !prev)}
                className="flex items-center gap-1 text-xs font-semibold text-sand-600 dark:text-zinc-400 hover:text-accent-700 dark:hover:text-accent-300 transition-colors"
              >
                <motion.span
                  animate={{ rotate: expanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="inline-block"
                >
                  ▸
                </motion.span>
                {expanded ? (isTurkish ? 'Kapat' : 'Close') : isTurkish ? 'Daha fazla oku' : 'Read more'}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                key="details"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <p className="mt-4 pt-4 border-t border-sand-200/60 dark:border-zinc-800/60 text-body-sm text-sand-700 dark:text-zinc-300">
                  {isTurkish
                    ? 'Sadece yürüyüş değil, günlük su tüketimi takibi ve detaylı istatistiklerle de sağlıklı alışkanlıklar kazanmanızı destekler. Karmaşık ayarlarla uğraşmanıza gerek yoktur; tek yapmanız gereken yürümek, kedinizle ilgilenmek ve sağlıklı kalmaktır.'
                    : 'Beyond walking, it supports you in building healthy habits through daily water tracking and detailed statistics. There are no complicated settings to deal with—just walk, take care of your cat, and stay healthy.'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeContent>
    </SpecialtyPageLayout>
  );
};

export default AndroidPage;
