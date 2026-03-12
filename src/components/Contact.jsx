import React from 'react';
import { motion } from 'framer-motion';
import TiltCard from './TiltCard';
import { HiMail, HiPhone, HiArrowRight } from 'react-icons/hi';
import { FiMapPin, FiLinkedin } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

/* ── Animated underline ── */
const AnimatedUnderline = () => (
  <motion.div
    className="h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-warm-500 to-sand-400"
    initial={{ width: 0 }}
    whileInView={{ width: 80 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
  />
);

const Contact = () => {
  const { isTurkish } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const contactInfo = [
    {
      icon: <HiMail className="w-6 h-6" />,
      label: isTurkish ? 'E-posta' : 'Email',
      value: 's6ylumert@gmail.com',
      href: 'mailto:s6ylumert@gmail.com',
    },
    {
      icon: <FiLinkedin className="w-6 h-6" />,
      label: 'LinkedIn',
      value: 'mert-soylu',
      href: 'https://www.linkedin.com/in/mert-soylu-b8b6a1341/',
    },
    {
      icon: <FiMapPin className="w-6 h-6" />,
      label: isTurkish ? 'Konum' : 'Location',
      value: 'İzmir, Turkey',
      href: null,
    },
    {
      icon: <HiPhone className="w-6 h-6" />,
      label: isTurkish ? 'Müsaitlik' : 'Available',
      value: isTurkish ? 'Yeni fırsatlara açık' : 'For opportunities',
      href: null,
    },
  ];

  return (
    <section id="contact" className="py-20 px-4 relative overflow-hidden">
      {/* Dual ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -translate-x-16 w-[32rem] h-[32rem] rounded-full bg-warm-500/10 dark:bg-warm-500/12 blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 translate-x-24 translate-y-16 w-64 h-64 rounded-full bg-sand-400/15 dark:bg-warm-400/8 blur-[60px]" />
      </div>
      {/* Diagonal light streak */}
      <div className="absolute inset-x-0 top-1/3 h-px rotate-[-6deg] bg-gradient-to-r from-transparent via-warm-500/20 to-transparent pointer-events-none" />
      <div className="max-w-4xl mx-auto relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15, margin: '-60px' }}
        >
          {/* Section header */}
          <div className="text-center mb-8">
            <div style={{ overflow: 'hidden' }}>
              <motion.h2
                className="section-title"
                initial={{ y: '100%', opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
              >
                {isTurkish ? 'İletişime Geç' : 'Get In Touch'}
              </motion.h2>
            </div>
            <AnimatedUnderline />
            <p className="section-subtitle mt-6">
              {isTurkish ? 'Bağlantı kuralım ve fikirlerini konuşalım' : "Let's connect and discuss your ideas"}
            </p>
          </div>

          {/* Availability blurb */}
          <motion.div variants={headerVariants} className="text-center mb-12 max-w-xl mx-auto">
            <p className="text-sand-600 dark:text-dark-200">
              {isTurkish
                ? 'Yeni projeler ve iş birlikleri için hazırım. Mesaj atmaktan çekinme.'
                : "I'm currently available for new projects and collaborations. Don't hesitate to reach out."}
            </p>
          </motion.div>

          {/* Contact info cards */}
          <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="group"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <TiltCard className="relative bg-white/40 dark:bg-dark-600/40 backdrop-blur-md p-6 rounded-xl border border-sand-200 dark:border-dark-400 text-center card-hover group h-full flex flex-col items-center justify-center">
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-warm-500/10 border border-warm-500/20 text-warm-600 mx-auto mb-4 flex items-center justify-center relative z-10"
                    initial={{ scale: 0, rotate: -20 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.2 + index * 0.1 }}
                    whileHover={{ scale: [1, 1.2, 1.05], transition: { duration: 0.4 } }}
                  >
                    {info.icon}
                  </motion.div>
                  <h4 className="font-semibold text-sand-900 dark:text-dark-50 mb-2 relative z-10 text-sm">{info.label}</h4>
                  {info.href ? (
                    <a
                      href={info.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-warm-600 hover:text-warm-700 dark:text-warm-400 dark:hover:text-warm-300 font-medium relative z-10 text-sm break-all"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-sand-600 dark:text-dark-200 relative z-10 text-sm">{info.value}</p>
                  )}
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div variants={headerVariants} className="text-center">
            <motion.a
              href="mailto:s6ylumert@gmail.com"
              className="inline-flex items-center gap-3 btn-primary text-base group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <HiMail className="w-5 h-5" />
              {isTurkish ? 'E-posta Gönder' : 'Send an Email'}
              <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
