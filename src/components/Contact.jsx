import React from 'react';
import { motion } from 'framer-motion';
import { HiMail, HiPhone } from 'react-icons/hi';
import { FiMapPin } from 'react-icons/fi';
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
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  /* Scale-grow entrance (scale: 0.8 → 1 + fade) */
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const contactInfo = [
    {
      icon: <HiMail className="w-6 h-6" />,
      label: isTurkish ? 'E-posta' : 'Email',
      value: 's6ylumert@gmail.com',
      href: 'mailto:s6ylumert@gmail.com',
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
    <section id="contact" className="py-20 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Section header */}
          <motion.div variants={headerVariants} className="text-center mb-16">
            <h2 className="section-title">{isTurkish ? 'İletişime Geç' : 'Get In Touch'}</h2>
            <AnimatedUnderline />
            <p className="section-subtitle mt-6">
              {isTurkish ? 'Bağlantı kuralım ve fikirlerini konuşalım' : "Let's connect and discuss your ideas"}
            </p>
          </motion.div>

          {/* Contact info cards — scale grow effect */}
          <motion.div className="grid md:grid-cols-3 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="bg-white/40 dark:bg-dark-600/40 backdrop-blur-md p-6 rounded-xl border border-sand-200 dark:border-dark-400 text-center card-hover"
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="text-warm-600 mx-auto mb-4 flex justify-center"
                  initial={{ scale: 0, rotate: -20 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 15,
                    delay: 0.3 + index * 0.1,
                  }}
                >
                  {info.icon}
                </motion.div>
                <h4 className="font-semibold text-sand-900 dark:text-dark-50 mb-2">{info.label}</h4>
                {info.href ? (
                  <a
                    href={info.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-warm-600 hover:text-warm-700 dark:text-warm-400 dark:hover:text-warm-300 font-medium"
                  >
                    {info.value}
                  </a>
                ) : (
                  <p className="text-sand-600 dark:text-dark-200">{info.value}</p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
