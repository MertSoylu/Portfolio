import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiArrowRight, HiCheckCircle, HiDownload, HiMail, HiXCircle } from 'react-icons/hi';
import { FiGithub, FiLinkedin, FiMapPin } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { CV_LABEL, CV_PATH } from '../utils/constants';
import ScrollFloat from './ScrollFloat';
import FadeContent from './FadeContent';

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
    'w-full rounded-lg border bg-white/75 px-4 py-3 text-sm text-ink-900 placeholder-ink-400 outline-none backdrop-blur-xl dark:bg-white/10 dark:text-white dark:placeholder-ink-400';
  const inputClass = (field) => {
    const showError = touched[field] && errors[field];
    return `${baseInput} ${
      showError
        ? 'border-accent-400 focus:border-accent-500'
        : 'border-ink-200/70 focus:border-cyan-400 dark:border-white/10 dark:focus:border-cyan-300'
    }`;
  };
  const renderError = (field) =>
    touched[field] && errors[field] ? (
      <p className="mt-1 text-xs font-semibold text-accent-600 dark:text-accent-200" role="alert">
        {errors[field]}
      </p>
    ) : null;

  return (
    <FadeContent duration={700} delay={120} threshold={0.1} blur>
      <form ref={formRef} onSubmit={handleSubmit} className="card-prominent space-y-4 p-6 sm:p-8">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] top-auto h-px w-px opacity-0"
        />
        <div>
          <p className="mb-2 text-caption text-cyan-700 dark:text-cyan-200">
            {isTurkish ? 'Direkt mesaj' : 'Direct message'}
          </p>
          <h3 className="text-h3 text-ink-900 dark:text-white">
            {isTurkish ? 'Birlikte konuşalım' : 'Let’s talk'}
          </h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="from_name" className="mb-2 block text-caption text-ink-500 dark:text-ink-300">
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
            <label htmlFor="from_email" className="mb-2 block text-caption text-ink-500 dark:text-ink-300">
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
          <label htmlFor="subject" className="mb-2 block text-caption text-ink-500 dark:text-ink-300">
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
          <label htmlFor="message" className="mb-2 block text-caption text-ink-500 dark:text-ink-300">
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
      </form>
    </FadeContent>
  );
};

const Contact = () => {
  const { isTurkish } = useLanguage();

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
    <section id="contact" className="relative px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <ScrollFloat
            containerClassName="overflow-hidden"
            textClassName="section-title"
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
          >
            {isTurkish ? 'İletişim' : 'Contact'}
          </ScrollFloat>
          <p className="mx-auto mt-4 max-w-2xl text-body-lg text-ink-600 dark:text-ink-200">
            {isTurkish
              ? 'Full-stack, Android veya AI odaklı işler için kısa bir mesaj yeterli.'
              : 'A short message is enough for full-stack, Android, or AI-focused opportunities.'}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <FadeContent duration={700} threshold={0.1} blur>
            <div className="card-raised h-full p-6 sm:p-8">
              <p className="mb-2 text-caption text-cyan-700 dark:text-cyan-200">
                {isTurkish ? 'Bağlantılar' : 'Links'}
              </p>
              <h3 className="mb-5 text-h3 text-ink-900 dark:text-white">
                {isTurkish ? 'Ulaşılabilir kanallar' : 'Available channels'}
              </h3>
              <div className="space-y-3">
                {contactInfo.map((item) => {
                  const content = (
                    <div className="flex items-center gap-4 rounded-lg border border-ink-200/70 bg-white/50 p-4 dark:border-white/10 dark:bg-white/10">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/40 bg-cyan-50 text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200">
                        {item.icon}
                      </span>
                      <div className="min-w-0">
                        <p className="text-caption text-ink-500 dark:text-ink-300">{item.label}</p>
                        <p className="break-all text-sm font-extrabold text-ink-900 dark:text-white">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );

                  return item.href ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      download={item.download}
                      className="block hover:-translate-y-1"
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={item.label}>{content}</div>
                  );
                })}
              </div>
            </div>
          </FadeContent>

          <ContactForm isTurkish={isTurkish} />
        </div>
      </div>
    </section>
  );
};

export default Contact;
