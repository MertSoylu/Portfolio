import React from 'react';
import { motion } from 'framer-motion';
import { HiAcademicCap, HiExternalLink } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import { CERTIFICATES } from '../utils/constants';
import ScrollFloat from './ScrollFloat';

const Certificates = () => {
  const { isTurkish } = useLanguage();

  if (!CERTIFICATES.length) return null;

  return (
    <section id="certificates" className="relative px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center md:mb-16">
          <ScrollFloat
            containerClassName="overflow-hidden"
            textClassName="section-title"
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
          >
            {isTurkish ? 'Sertifikalar' : 'Certificates'}
          </ScrollFloat>
          <p className="mx-auto mt-4 max-w-2xl text-body-lg text-ink-600 dark:text-ink-200">
            {isTurkish
              ? 'Öğrenme sürecimi destekleyen, güvenlik ve yazılım temelini güçlendiren eğitimler.'
              : 'Training that supports my learning path and strengthens security and software fundamentals.'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {CERTIFICATES.map((cert, index) => (
            <motion.article
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-raised flex h-full flex-col p-6"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-cyan-300/50 bg-cyan-50 text-cyan-700 dark:border-cyan-300/25 dark:bg-cyan-300/10 dark:text-cyan-200">
                  <HiAcademicCap className="h-6 w-6" />
                </div>
                <span className="rounded-lg border border-ink-200/70 bg-white/50 px-3 py-1 text-xs font-extrabold text-ink-500 dark:border-white/10 dark:bg-white/10 dark:text-ink-300">
                  {cert.date}
                </span>
              </div>

              <h4 className="mb-2 text-h4 text-ink-900 dark:text-white">
                {isTurkish ? cert.title.tr : cert.title.en}
              </h4>
              <p className="mb-4 text-body-sm font-semibold text-ink-600 dark:text-ink-200">{cert.issuer}</p>

              {cert.skills?.length > 0 && (
                <div className="mb-5 flex flex-wrap gap-2">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-accent-300/40 bg-accent-50 px-2.5 py-1 text-xs font-bold text-accent-700 dark:border-accent-300/20 dark:bg-accent-300/10 dark:text-accent-200"
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
                  className="mt-auto inline-flex items-center gap-1.5 text-sm font-extrabold text-cyan-700 hover:text-accent-600 dark:text-cyan-200 dark:hover:text-accent-200"
                >
                  {isTurkish ? 'Sertifikayı gör' : 'View certificate'}
                  <HiExternalLink className="h-4 w-4" />
                </a>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificates;
