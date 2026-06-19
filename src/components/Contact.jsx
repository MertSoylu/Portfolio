import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { useReducedMotion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiArrowRight, HiCheckCircle, HiDownload, HiMail, HiXCircle } from 'react-icons/hi';
import { FiGithub, FiLinkedin, FiMapPin } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { CV_LABEL, CV_PATH } from '../utils/constants';
import SectionHeader from './home/SectionHeader';
import Reveal from './ui/Reveal';

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
    'w-full rounded-xl border bg-surface2 px-4 py-3 text-sm text-fg placeholder-muted outline-none transition-colors';
  const inputClass = (field) => {
    const showError = touched[field] && errors[field];
    return `${baseInput} ${showError ? 'border-red-400 focus:border-red-500' : 'border-line/12 focus:border-accent'}`;
  };
  const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-muted';
  const renderError = (field) =>
    touched[field] && errors[field] ? (
      <p className="mt-1 text-xs font-medium text-red-500" role="alert">
        {errors[field]}
      </p>
    ) : null;

  return (
    <Reveal delay={0.05}>
      <form ref={formRef} onSubmit={handleSubmit} className="card space-y-3 sm:space-y-4 p-5 sm:p-6 lg:p-8">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden border-0 p-0 opacity-0"
        />
        <div>
          <h3 className="text-h3 text-fg">{isTurkish ? 'Birlikte konuşalım' : 'Let’s talk'}</h3>
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
          <div className="flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">
            <HiCheckCircle className="h-5 w-5" />
            {isTurkish
              ? 'Mesajın iletildi. En kısa sürede döneceğim.'
              : 'Message sent. I will get back to you soon.'}
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center gap-2 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-300">
            <HiXCircle className="h-5 w-5" />
            {isTurkish
              ? 'Bir hata oluştu. E-posta ile ulaşabilirsin.'
              : 'Something went wrong. You can email me directly.'}
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'sending' ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              {isTurkish ? 'Gönderiliyor...' : 'Sending...'}
            </>
          ) : (
            <>
              <HiMail className="h-5 w-5" />
              {isTurkish ? 'Gönder' : 'Send message'}
              <HiArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </Reveal>
  );
};

const ChannelRow = ({ item }) => {
  const body = (
    <div className="flex items-center gap-4 py-4">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface2 text-accent">
        {item.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{item.label}</p>
        <p className="break-all text-sm font-semibold text-fg">{item.value}</p>
      </div>
      {item.href && (
        <HiArrowRight className="h-4 w-4 shrink-0 -translate-x-1 text-muted opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-accent group-hover:opacity-100" />
      )}
    </div>
  );

  const wrapperClass =
    'group block border-b border-line/10 transition-colors last:border-0 hover:bg-surface2';

  if (!item.href) return <div className={wrapperClass}>{body}</div>;

  return (
    <a
      href={item.href}
      target={item.href.startsWith('http') ? '_blank' : undefined}
      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
      download={item.download}
      className={wrapperClass}
    >
      {body}
    </a>
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
    <section id="contact" className="relative px-5 py-12 sm:py-20 md:py-24">
      <div className="container-wide">
        <SectionHeader
          kicker={isTurkish ? 'İletişim' : 'Contact'}
          kickerIcon={<HiMail className="h-4 w-4" />}
          title={isTurkish ? 'İletişim' : 'Get in touch'}
          lead={
            isTurkish
              ? 'Full-stack, Android veya AI odaklı işler için kısa bir mesaj yeterli.'
              : 'A short message is enough for full-stack, Android, or AI-focused opportunities.'
          }
          aside={
            <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2">
              <span className="relative flex h-2.5 w-2.5">
                {!reduce && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                )}
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
                {isTurkish ? 'Remote / hibrit açık' : 'Open to remote / hybrid'}
              </span>
            </div>
          }
        />

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal className="card h-full p-5 sm:p-6 lg:p-8">
            <h3 className="mb-4 text-h3 text-fg">
              {isTurkish ? 'Ulaşılabilir kanallar' : 'Available channels'}
            </h3>
            <div className="-my-1">
              {contactInfo.map((item) => (
                <ChannelRow key={item.label} item={item} />
              ))}
            </div>
          </Reveal>

          <ContactForm isTurkish={isTurkish} />
        </div>
      </div>
    </section>
  );
};

export default Contact;
