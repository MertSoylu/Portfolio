import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiMail, HiArrowRight, HiCheckCircle, HiXCircle, HiDownload } from 'react-icons/hi';
import { FiMapPin, FiLinkedin } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { useDarkMode } from '../context/DarkModeContext';
import { CV_LABEL, CV_PATH } from '../utils/constants';
import ScrollFloat from './ScrollFloat';
import ScrollReveal from './ScrollReveal';
import FadeContent from './FadeContent';
import ElectricBorder from './ElectricBorder';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_NAME_LENGTH = 2;
const MIN_SUBJECT_LENGTH = 3;
const MIN_MESSAGE_LENGTH = 10;

const validateField = (name, value, isTurkish) => {
  const trimmed = (value ?? '').trim();
  switch (name) {
    case 'from_name':
      if (!trimmed) return isTurkish ? 'İsim zorunlu.' : 'Name is required.';
      if (trimmed.length < MIN_NAME_LENGTH) {
        return isTurkish ? 'En az 2 karakter olmalı.' : 'Must be at least 2 characters.';
      }
      return '';
    case 'from_email':
      if (!trimmed) return isTurkish ? 'E-posta zorunlu.' : 'Email is required.';
      if (!EMAIL_REGEX.test(trimmed)) {
        return isTurkish ? 'Geçerli bir e-posta gir.' : 'Enter a valid email.';
      }
      return '';
    case 'subject':
      if (!trimmed) return isTurkish ? 'Konu zorunlu.' : 'Subject is required.';
      if (trimmed.length < MIN_SUBJECT_LENGTH) {
        return isTurkish ? 'En az 3 karakter olmalı.' : 'Must be at least 3 characters.';
      }
      return '';
    case 'message':
      if (!trimmed) return isTurkish ? 'Mesaj zorunlu.' : 'Message is required.';
      if (trimmed.length < MIN_MESSAGE_LENGTH) {
        return isTurkish ? 'En az 10 karakter olmalı.' : 'Must be at least 10 characters.';
      }
      return '';
    default:
      return '';
  }
};

const ContactForm = ({ isTurkish, isDark }) => {
  const formRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value, isTurkish);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (touched[name]) {
      const error = validateField(name, value, isTurkish);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const validateAll = () => {
    if (!formRef.current) return false;
    const data = new FormData(formRef.current);
    const nextErrors = {};
    ['from_name', 'from_email', 'subject', 'message'].forEach((field) => {
      const error = validateField(field, data.get(field), isTurkish);
      if (error) nextErrors[field] = error;
    });
    setErrors(nextErrors);
    setTouched({ from_name: true, from_email: true, subject: true, message: true });
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const honeypot = formRef.current?.elements?.namedItem('website')?.value;
    if (honeypot) {
      setStatus('success');
      formRef.current?.reset();
      setErrors({});
      setTouched({});
      return;
    }
    if (!validateAll()) return;
    setStatus('sending');
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY },
      );
      setStatus('success');
      toast.success(isTurkish ? 'Mesaj iletildi!' : 'Message sent!');
      formRef.current?.reset();
      setErrors({});
      setTouched({});
    } catch {
      setStatus('error');
      toast.error(isTurkish ? 'Mesaj gönderilemedi.' : 'Could not send message.');
    }
  };

  const baseInput = `w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white/60 dark:bg-black/70 border text-sand-900 dark:text-zinc-100 placeholder-sand-400 dark:placeholder-zinc-500 focus:outline-none transition-colors text-sm`;
  const inputClass = (field) => {
    const showError = touched[field] && errors[field];
    return `${baseInput} ${
      showError
        ? 'border-red-400 dark:border-red-500/70 focus:border-red-500'
        : 'border-sand-200 dark:border-zinc-700 focus:border-warm-500 dark:focus:border-warm-400'
    }`;
  };
  const renderError = (field) =>
    touched[field] && errors[field] ? (
      <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
        {errors[field]}
      </p>
    ) : null;

  return (
    <FadeContent duration={700} delay={200} threshold={0.1} blur>
      <form ref={formRef} onSubmit={handleSubmit} className="card-raised p-6 sm:p-8 space-y-4">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] top-auto w-px h-px opacity-0 pointer-events-none"
        />
        <h3 className="text-h4 text-sand-900 dark:text-zinc-50 mb-4">
          {isTurkish ? 'Mesaj Gönder' : 'Send a Message'}
        </h3>

        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label htmlFor="from_name" className="block text-caption text-sand-700 dark:text-zinc-400 mb-2">
              {isTurkish ? 'Adın' : 'Your Name'}
            </label>
            <input
              id="from_name"
              type="text"
              name="from_name"
              required
              placeholder={isTurkish ? 'Adın Soyadın' : 'John Doe'}
              className={inputClass('from_name')}
              onBlur={handleBlur}
              onChange={handleChange}
              aria-invalid={Boolean(touched.from_name && errors.from_name)}
              aria-describedby={touched.from_name && errors.from_name ? 'from_name-error' : undefined}
            />
            {renderError('from_name')}
          </div>
          <div>
            <label htmlFor="from_email" className="block text-caption text-sand-700 dark:text-zinc-400 mb-2">
              {isTurkish ? 'E-posta' : 'Email'}
            </label>
            <input
              id="from_email"
              type="email"
              name="from_email"
              required
              placeholder="email@example.com"
              className={inputClass('from_email')}
              onBlur={handleBlur}
              onChange={handleChange}
              aria-invalid={Boolean(touched.from_email && errors.from_email)}
              aria-describedby={touched.from_email && errors.from_email ? 'from_email-error' : undefined}
            />
            {renderError('from_email')}
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-caption text-sand-700 dark:text-zinc-400 mb-2">
            {isTurkish ? 'Konu' : 'Subject'}
          </label>
          <input
            id="subject"
            type="text"
            name="subject"
            required
            placeholder={isTurkish ? 'Mesajının konusu' : 'What is this about?'}
            className={inputClass('subject')}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={Boolean(touched.subject && errors.subject)}
          />
          {renderError('subject')}
        </div>

        <div>
          <label htmlFor="message" className="block text-caption text-sand-700 dark:text-zinc-400 mb-2">
            {isTurkish ? 'Mesaj' : 'Message'}
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            placeholder={isTurkish ? 'Mesajını buraya yaz...' : 'Write your message here...'}
            className={`${inputClass('message')} resize-none`}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={Boolean(touched.message && errors.message)}
          />
          {renderError('message')}
        </div>

        {/* Status feedback */}
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3"
          >
            <HiCheckCircle className="w-5 h-5 flex-shrink-0" />
            {isTurkish
              ? 'Mesajın iletildi! En kısa sürede döneceğim.'
              : "Message sent! I'll get back to you soon."}
          </motion.div>
        )}
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3"
          >
            <HiXCircle className="w-5 h-5 flex-shrink-0" />
            {isTurkish
              ? 'Bir hata oluştu. Lütfen e-posta ile ulaş.'
              : 'Something went wrong. Please email me directly.'}
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={status === 'sending'}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          whileHover={
            status !== 'sending' ? { scale: 1.02, boxShadow: '0 8px 30px rgba(240, 125, 45, 0.35)' } : {}
          }
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
      icon: (
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
        </span>
      ),
      label: isTurkish ? 'Müsaitlik' : 'Available',
      value: isTurkish ? 'Yeni fırsatlara açık' : 'For opportunities',
      href: null,
    },
    {
      icon: <HiDownload className="w-6 h-6" />,
      label: 'CV',
      value: isTurkish ? CV_LABEL.tr : CV_LABEL.en,
      href: CV_PATH,
      download: true,
    },
  ];

  const electricColor = isDark ? '#ff9a5c' : '#f07d2d';

  return (
    <section id="contact" className="py-20 md:py-28 px-4 relative overflow-hidden">
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
            textClassName="text-3xl sm:text-4xl md:text-5xl font-bold heading-gradient"
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
            textClassName="text-body-lg text-sand-700 dark:text-zinc-300 font-normal"
            enableBlur={true}
            baseOpacity={0.75}
            baseRotation={3}
            blurStrength={1.5}
          >
            {isTurkish ? 'Bağlantı kuralım ve fikirlerini konuşalım' : "Let's connect and discuss your ideas"}
          </ScrollReveal>
        </div>

        {/* Availability blurb */}
        <div className="text-center mb-12 max-w-xl mx-auto">
          <FadeContent duration={800} ease="power3.out" threshold={0.2} blur={true}>
            <p className="text-body text-sand-700 dark:text-zinc-300">
              {isTurkish
                ? 'Full-Stack Developer ve AI Developer pozisyonlarına açığım. Remote, hibrit veya ofis tabanlı çalışmaya hazırım.'
                : 'Open to Full-Stack Developer and AI Developer roles. Available for remote, hybrid, or on-site work.'}
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
                <ElectricBorder color={electricColor} speed={0.5} chaos={0.08} borderRadius={16}>
                  <div className="bg-white/40 dark:bg-zinc-900/60 backdrop-blur-md p-6 rounded-2xl text-center h-full flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-600 dark:text-accent-400 mx-auto mb-4 flex items-center justify-center">
                      {info.icon}
                    </div>
                    <h4 className="text-caption text-sand-700 dark:text-zinc-400 mb-2">{info.label}</h4>
                    {info.href ? (
                      <a
                        href={info.href}
                        {...(info.download
                          ? { download: true }
                          : { target: '_blank', rel: 'noopener noreferrer' })}
                        className="text-accent-600 hover:text-accent-700 dark:text-accent-300 dark:hover:text-accent-200 font-semibold text-sm break-all"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-body-sm text-sand-700 dark:text-zinc-300">{info.value}</p>
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
