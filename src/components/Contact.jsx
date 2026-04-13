import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { HiMail, HiArrowRight, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { FiMapPin, FiLinkedin } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { useDarkMode } from '../context/DarkModeContext';
import ScrollFloat from './ScrollFloat';
import ScrollReveal from './ScrollReveal';
import FadeContent from './FadeContent';
import ElectricBorder from './ElectricBorder';

const ContactForm = ({ isTurkish, isDark }) => {
  const formRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY },
      );
      setStatus('success');
      formRef.current?.reset();
    } catch {
      setStatus('error');
    }
  };

  const inputClass = `w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white/60 dark:bg-black/70 border border-sand-200 dark:border-zinc-700 text-sand-900 dark:text-zinc-100 placeholder-sand-400 dark:placeholder-zinc-500 focus:outline-none focus:border-warm-500 dark:focus:border-warm-400 transition-colors text-sm`;

  return (
    <FadeContent duration={700} delay={200} threshold={0.1} blur>
      <form ref={formRef} onSubmit={handleSubmit} className="bg-white/40 dark:bg-black/70 backdrop-blur-md rounded-xl sm:rounded-2xl border border-sand-200 dark:border-zinc-700 p-4 sm:p-8 space-y-3 sm:space-y-4">
        <h3 className="text-lg font-semibold text-sand-900 dark:text-dark-50 mb-2">
          {isTurkish ? 'Mesaj Gönder' : 'Send a Message'}
        </h3>

        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-medium text-sand-600 dark:text-zinc-400 mb-1.5">
              {isTurkish ? 'Adın' : 'Your Name'}
            </label>
            <input
              type="text"
              name="from_name"
              required
              placeholder={isTurkish ? 'Adın Soyadın' : 'John Doe'}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-sand-600 dark:text-zinc-400 mb-1.5">
              {isTurkish ? 'E-posta' : 'Email'}
            </label>
            <input
              type="email"
              name="from_email"
              required
              placeholder="email@example.com"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-sand-600 dark:text-zinc-400 mb-1.5">
            {isTurkish ? 'Konu' : 'Subject'}
          </label>
          <input
            type="text"
            name="subject"
            required
            placeholder={isTurkish ? 'Mesajının konusu' : 'What is this about?'}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-sand-600 dark:text-zinc-400 mb-1.5">
            {isTurkish ? 'Mesaj' : 'Message'}
          </label>
          <textarea
            name="message"
            required
            rows={4}
            placeholder={isTurkish ? 'Mesajını buraya yaz...' : 'Write your message here...'}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Status feedback */}
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3"
          >
            <HiCheckCircle className="w-5 h-5 flex-shrink-0" />
            {isTurkish ? 'Mesajın iletildi! En kısa sürede döneceğim.' : 'Message sent! I\'ll get back to you soon.'}
          </motion.div>
        )}
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3"
          >
            <HiXCircle className="w-5 h-5 flex-shrink-0" />
            {isTurkish ? 'Bir hata oluştu. Lütfen e-posta ile ulaş.' : 'Something went wrong. Please email me directly.'}
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={status === 'sending'}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          whileHover={status !== 'sending' ? { scale: 1.02, boxShadow: '0 8px 30px rgba(240, 125, 45, 0.35)' } : {}}
          whileTap={status !== 'sending' ? { scale: 0.98 } : {}}
        >
          {status === 'sending' ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              {isTurkish ? 'Gönderiliyor...' : 'Sending...'}
            </>
          ) : (
            <>
              <HiMail className="w-5 h-5" />
              {isTurkish ? 'Gönder' : 'Send Message'}
              <HiArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </form>
    </FadeContent>
  );
};

const Contact = () => {
  const { isTurkish } = useLanguage();
  const { isDark } = useDarkMode();

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
      icon: <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" /></span>,
      label: isTurkish ? 'Müsaitlik' : 'Available',
      value: isTurkish ? 'Yeni fırsatlara açık' : 'For opportunities',
      href: null,
    },
  ];

  const electricColor = isDark ? '#ff9a5c' : '#f07d2d';

  return (
    <section id="contact" className="py-12 px-4 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -translate-x-16 w-[20rem] h-[20rem] sm:w-[32rem] sm:h-[32rem] rounded-full bg-warm-500/10 dark:bg-warm-500/12 blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 translate-x-24 translate-y-16 w-64 h-64 rounded-full bg-sand-400/15 dark:bg-warm-400/8 blur-[60px]" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-8">
          <ScrollFloat
            containerClassName="overflow-hidden"
            textClassName="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-warm-600 via-warm-500 to-sand-500 bg-clip-text text-transparent"
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
          >
            {isTurkish ? 'İletişime Geç' : 'Get In Touch'}
          </ScrollFloat>
          <ScrollReveal
            containerClassName="mt-4"
            textClassName="text-lg text-sand-700 dark:text-zinc-300 font-normal"
            enableBlur={true}
            baseOpacity={0.75}
            baseRotation={3}
            blurStrength={1.5}
          >
            {isTurkish ? 'Bağlantı kuralım ve fikirlerini konuşalım' : "Let's connect and discuss your ideas"}
          </ScrollReveal>
        </div>

        {/* Availability blurb */}
        <div className="text-center mb-8 sm:mb-12 max-w-xl mx-auto">
          <FadeContent
            duration={800}
            ease="power3.out"
            threshold={0.2}
            blur={true}
          >
            <p className="text-sand-600 dark:text-zinc-300">
              {isTurkish
                ? 'Yeni projeler ve iş birlikleri için hazırım. Mesaj atmaktan çekinme.'
                : "I'm currently available for new projects and collaborations. Don't hesitate to reach out."}
            </p>
          </FadeContent>
        </div>

        {/* Contact form + info side by side */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-10 items-start">
          <ContactForm isTurkish={isTurkish} isDark={isDark} />

          {/* Info cards */}
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
            {contactInfo.map((info, index) => (
              <FadeContent
                key={index}
                duration={700}
                ease="power3.out"
                delay={index * 120}
                threshold={0.15}
                blur={true}
              >
                <ElectricBorder
                  color={electricColor}
                  speed={0.5}
                  chaos={0.08}
                  borderRadius={10}
                >
                  <div className="bg-white/40 dark:bg-black/70 backdrop-blur-md p-4 sm:p-6 rounded-lg sm:rounded-xl text-center h-full flex flex-col items-center justify-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-warm-500/10 border border-warm-500/20 text-warm-600 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                      {info.icon}
                    </div>
                    <h4 className="font-semibold text-sand-900 dark:text-zinc-100 mb-1.5 sm:mb-2 text-xs sm:text-sm">{info.label}</h4>
                    {info.href ? (
                      <a
                        href={info.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-warm-600 hover:text-warm-700 dark:text-warm-300 dark:hover:text-warm-200 font-medium text-xs sm:text-sm break-all"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-sand-600 dark:text-zinc-300 text-xs sm:text-sm">{info.value}</p>
                    )}
                  </div>
                </ElectricBorder>
              </FadeContent>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;
