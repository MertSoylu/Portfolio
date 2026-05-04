import React from 'react';
import { motion } from 'framer-motion';
import { HiAcademicCap, HiExternalLink } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import { useDarkMode } from '../context/DarkModeContext';
import { CERTIFICATES } from '../utils/constants';
import ScrollFloat from './ScrollFloat';
import ScrollReveal from './ScrollReveal';
import SpotlightCard from './SpotlightCard';

const Certificates = () => {
  const { isTurkish } = useLanguage();
  const { isDark } = useDarkMode();

  if (!CERTIFICATES.length) return null;

  return (
    <section id="certificates" className="py-20 md:py-28 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <ScrollFloat
            containerClassName="overflow-hidden"
            textClassName="text-3xl sm:text-4xl md:text-5xl font-bold heading-gradient"
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
          >
            {isTurkish ? 'Sertifikalar' : 'Certificates'}
          </ScrollFloat>
          <ScrollReveal
            containerClassName="mt-4"
            textClassName="text-body-lg text-sand-700 dark:text-zinc-300 font-normal"
            enableBlur
            baseOpacity={0.75}
            baseRotation={3}
            blurStrength={1.5}
          >
            {isTurkish ? 'Tamamladığım sertifika programları' : 'Completed certification programs'}
          </ScrollReveal>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {CERTIFICATES.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
            >
              <SpotlightCard
                className="card-raised p-6 sm:p-8 h-full flex flex-col"
                spotlightColor={isDark ? 'rgba(249, 115, 22, 0.18)' : 'rgba(240, 125, 45, 0.12)'}
              >
                <div className="w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-600 dark:text-accent-400 mb-4 flex items-center justify-center">
                  <HiAcademicCap className="w-6 h-6" />
                </div>
                <h4 className="text-h4 text-sand-900 dark:text-zinc-100 mb-2">
                  {isTurkish ? cert.title.tr : cert.title.en}
                </h4>
                <p className="text-body-sm text-sand-700 dark:text-zinc-300 mb-1">{cert.issuer}</p>
                <p className="text-caption text-sand-600 dark:text-zinc-400 mb-4">{cert.date}</p>

                {cert.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {cert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 bg-accent-500/10 text-accent-700 dark:text-accent-300 text-xs font-medium rounded-full border border-accent-500/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {cert.fileUrl && (
                  <a
                    href={cert.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 mt-auto"
                  >
                    {isTurkish ? 'Sertifikayı Gör' : 'View Certificate'}
                    <HiExternalLink className="w-4 h-4" />
                  </a>
                )}
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificates;
