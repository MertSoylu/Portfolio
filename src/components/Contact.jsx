import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { motion, useReducedMotion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiArrowRight, HiCheckCircle, HiDownload, HiMail, HiXCircle } from 'react-icons/hi';
import { FiGithub, FiLinkedin, FiMapPin } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { CV_LABEL, CV_PATH } from '../utils/constants';
import SectionHeader from './home/SectionHeader';

const EASE = [0.22, 1, 0.36, 1];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_NAME_LENGTH = 2;
const MIN_SUBJECT_LENGTH = 3;
const MIN_MESSAGE_LENGTH = 10;

const validateField = (name, value, isTurkish) => {
  const trimmed = (value ?? '').trim();
  switch (name) {
    case 'from_name':
      if (!trimmed) return isTurkish ? 'İsim zorunlu.' : 'Name is required.';
      if (trimmed.length < MIN_NAME_LENGTH)
        return isTurkish ? 'En az 2 karakter olmalı.' : 'Must be at least 2 characters.';
      return '';
    case 'from_email':
      if (!trimmed) return isTurkish ? 'E-posta zorunlu.' : 'Email is required.';
      if (!EMAIL_REGEX.test(trimmed)) return isTurkish ? 'Geçerli e-posta gir.' : 'Enter a valid email.';
      return '';
    case 'subject':
      if (!trimmed) return isTurkish ? 'Konu zorunlu.' : 'Subject is required.';
      if (trimmed.length < MIN_SUBJECT_LENGTH)
        return isTurkish ? 'En az 3 karakter olmalı.' : 'Must be at least 3 characters.';
      return '';
    case 'message':
      if (!trimmed) return isTurkish ? 'Mesaj zorunlu.' : 'Message is required.';
      if (trimmed.length < MIN_MESSAGE_LENGTH)
        return isTurkish ? 'En az 10 karakter olmalı.' : 'Must be at least 10 characters.';
      return '';
    default:
      return '';
  }
};

const ContactForm = ({ isTurkish }) => {
  const formRef = useRef(null);
  const reduce = useReducedMotion();
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value, isTurkish) }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (!touched[name]) return;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value, isTurkish) }));
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

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      toast.success(isTurkish ? 'Mesaj iletildi.' : 'Message sent.');
      formRef.current?.reset();
      setErrors({});
      setTouched({});
    } catch {
      setStatus('error');
      toast.error(isTurkish ? 'Mesaj gönderilemedi.' : 'Could not send message.');
    }
  };

  const baseInput =
    'w-full rounded-lg border bg-white/75 px-4 py-3 text-sm text-ink-900 placeholder-ink-400 outline-none backdrop-blur-xl transition-colors dark:bg-white/10 dark:text-white dark:placeholder-ink-400';
  const inputClass = (field) => {
    const showError = touched[field] && errors[field];
    return `${baseInput} ${
      showError
        ? 'border-accent-400 focus:border-accent-500'
        : 'border-ink-200/70 focus:border-violet-400 dark:border-white/10 dark:focus:border-aqua-300'
    }`;
  };
  const labelClass =
    'lab-mono mb-2 block text-[10px] uppercase tracking-[0.18em] text-ink-500 dark:text-ink-300';
  const renderError = (field) =>
    touched[field] && errors[field] ? (
      <p className="mt-1 text-xs font-semibold text-accent-600 dark:text-accent-200" role="alert">
        {errors[field]}
      </p>
    ) : null;

  return (
    <motion.form
      ref={formRef}
      onSubmit={handleSubmit}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32, clipPath: 'inset(8% 0% 8% 0%)' }}
      whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: EASE }}
      className="card-prominent relative space-y-4 overflow-hidden p-6 sm:p-8"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-gradient-to-br from-violet-500/15 to-aqua-300/15 blur-3xl"
      />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden border-0 p-0 opacity-0"
      />
      <div className="relative">
        <p className="lab-mono mb-2 text-[11px] uppercase tracking-[0.2em] text-cyan-700 dark:text-aqua-200">
          {isTurkish ? '> direkt_mesaj' : '> direct_message'}
        </p>
        <h3 className="text-h3 text-ink-900 dark:text-white">
          {isTurkish ? 'Birlikte konuşalım' : 'Let’s talk'}
        </h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="from_name" className={labelClass}>
            {isTurkish ? 'Ad' : 'Name'}
          </label>
          <input
            id="from_name"
            type="text"
            name="from_name"
            required
            placeholder={isTurkish ? 'Adın Soyadın' : 'Your name'}
            className={inputClass('from_name')}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={Boolean(touched.from_name && errors.from_name)}
          />
          {renderError('from_name')}
        </div>
        <div>
          <label htmlFor="from_email" className={labelClass}>
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
          />
          {renderError('from_email')}
        </div>
      </div>

      <div>
        <label htmlFor="subject" className={labelClass}>
          {isTurkish ? 'Konu' : 'Subject'}
        </label>
        <input
          id="subject"
          type="text"
          name="subject"
          required
          placeholder={isTurkish ? 'Ne hakkında?' : 'What is this about?'}
          className={inputClass('subject')}
          onBlur={handleBlur}
          onChange={handleChange}
          aria-invalid={Boolean(touched.subject && errors.subject)}
        />
        {renderError('subject')}
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          {isTurkish ? 'Mesaj' : 'Message'}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder={isTurkish ? 'Mesajını yaz...' : 'Write your message...'}
          className={`${inputClass('message')} resize-none`}
          onBlur={handleBlur}
          onChange={handleChange}
          aria-invalid={Boolean(touched.message && errors.message)}
        />
        {renderError('message')}
      </div>

      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-lg border border-emerald-300/50 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200"
        >
          <HiCheckCircle className="h-5 w-5" />
          {isTurkish
            ? 'Mesajın iletildi. En kısa sürede döneceğim.'
            : 'Message sent. I will get back to you soon.'}
        </motion.div>
      )}
      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-lg border border-accent-300/50 bg-accent-50 px-4 py-3 text-sm font-semibold text-accent-700 dark:border-accent-300/20 dark:bg-accent-300/10 dark:text-accent-200"
        >
          <HiXCircle className="h-5 w-5" />
          {isTurkish
            ? 'Bir hata oluştu. E-posta ile ulaşabilirsin.'
            : 'Something went wrong. You can email me directly.'}
        </motion.div>
      )}

      <motion.button
        type="submit"
        disabled={status === 'sending'}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
        whileHover={status !== 'sending' ? { scale: 1.02 } : {}}
        whileTap={status !== 'sending' ? { scale: 0.98 } : {}}
      >
        {status === 'sending' ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            {isTurkish ? 'Gönderiliyor...' : 'Sending...'}
          </>
        ) : (
          <>
            <HiMail className="h-5 w-5" />
            {isTurkish ? 'Gönder' : 'Send message'}
            <HiArrowRight className="h-4 w-4" />
          </>
        )}
      </motion.button>
    </motion.form>
  );
};

const ChannelRow = ({ item, index, isTurkish }) => {
  const reduce = useReducedMotion();
  const body = (
    <div className="relative flex items-center gap-4 py-4">
      <span className="lab-mono w-6 shrink-0 text-[11px] text-ink-400 transition-colors group-hover:text-violet-600 dark:text-ink-400 dark:group-hover:text-aqua-200">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-300/40 bg-cyan-50 text-cyan-700 transition-transform duration-500 group-hover:-rotate-6 dark:border-aqua-300/20 dark:bg-aqua-300/10 dark:text-aqua-200">
        {item.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="lab-mono text-[10px] uppercase tracking-[0.18em] text-ink-500 dark:text-ink-300">
          {item.label}
        </p>
        <p className="break-all text-sm font-extrabold text-ink-900 dark:text-white">{item.value}</p>
      </div>
      {item.href && (
        <HiArrowRight className="h-4 w-4 shrink-0 -translate-x-1 text-ink-400 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-violet-600 group-hover:opacity-100 dark:group-hover:text-aqua-200" />
      )}
    </div>
  );

  const wrapperClass =
    'group relative block border-b border-ink-200/60 transition-colors last:border-0 hover:bg-violet-50/40 dark:border-white/10 dark:hover:bg-white/[0.04]';

  const inner = item.href ? (
    <a
      href={item.href}
      target={item.href.startsWith('http') ? '_blank' : undefined}
      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
      download={item.download}
      className={wrapperClass}
    >
      {body}
    </a>
  ) : (
    <div className={wrapperClass}>{body}</div>
  );

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: EASE }}
    >
      {inner}
    </motion.div>
  );
};

const Contact = () => {
  const { isTurkish } = useLanguage();
  const reduce = useReducedMotion();

  const contactInfo = [
    {
      icon: <HiMail className="h-5 w-5" />,
      label: isTurkish ? 'E-posta' : 'Email',
      value: 's6ylumert@gmail.com',
      href: 'mailto:s6ylumert@gmail.com',
    },
    {
      icon: <FiLinkedin className="h-5 w-5" />,
      label: 'LinkedIn',
      value: 'mert-soylu',
      href: 'https://www.linkedin.com/in/mert-soylu-b8b6a1341/',
    },
    {
      icon: <FiGithub className="h-5 w-5" />,
      label: 'GitHub',
      value: 'MertSoylu',
      href: 'https://github.com/MertSoylu',
    },
    {
      icon: <FiMapPin className="h-5 w-5" />,
      label: isTurkish ? 'Konum' : 'Location',
      value: 'İzmir, Turkey',
      href: null,
    },
    {
      icon: <HiDownload className="h-5 w-5" />,
      label: 'CV',
      value: isTurkish ? CV_LABEL.tr : CV_LABEL.en,
      href: CV_PATH,
      download: true,
    },
  ];

  return (
    <section id="contact" className="relative px-4 py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index="04"
          kicker={isTurkish ? 'İletişim' : 'Contact'}
          kickerIcon={<HiMail className="h-4 w-4" />}
          title={isTurkish ? 'İletişim' : 'Get in touch'}
          lead={
            isTurkish
              ? 'Full-stack, Android veya AI odaklı işler için kısa bir mesaj yeterli.'
              : 'A short message is enough for full-stack, Android, or AI-focused opportunities.'
          }
          aside={
            <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-300/50 bg-emerald-50/70 px-4 py-2 dark:border-emerald-300/25 dark:bg-emerald-300/10">
              <span className="relative flex h-2.5 w-2.5">
                {!reduce && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                )}
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="lab-mono text-[10px] uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-200">
                {isTurkish ? 'Remote / hibrit açık' : 'Open to remote / hybrid'}
              </span>
            </div>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32, clipPath: 'inset(8% 0% 8% 0%)' }}
            whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="card-raised h-full p-6 sm:p-8"
          >
            <p className="lab-mono mb-2 text-[11px] uppercase tracking-[0.2em] text-cyan-700 dark:text-aqua-200">
              {isTurkish ? '> kanallar' : '> channels'}
            </p>
            <h3 className="mb-4 text-h3 text-ink-900 dark:text-white">
              {isTurkish ? 'Ulaşılabilir kanallar' : 'Available channels'}
            </h3>
            <div className="-my-1">
              {contactInfo.map((item, index) => (
                <ChannelRow key={item.label} item={item} index={index} isTurkish={isTurkish} />
              ))}
            </div>
          </motion.div>

          <ContactForm isTurkish={isTurkish} />
        </div>
      </div>
    </section>
  );
};

export default Contact;
