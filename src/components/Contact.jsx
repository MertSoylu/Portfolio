import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import {
  HiArrowRight,
  HiCheckCircle,
  HiDocumentText,
  HiDownload,
  HiExternalLink,
  HiMail,
  HiXCircle,
} from 'react-icons/hi';
import { FiGithub, FiLinkedin, FiMapPin } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { pick } from '../data/projects';
import { CV_LABEL, CV_PATH, PERSONAL_INFO } from '../utils/constants';
import SectionHeader from './home/SectionHeader';
import NewTabNote from './ui/NewTabNote';
import Reveal from './ui/Reveal';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Per-field rules. Errors are stored as codes ('required' | 'min' | 'email') and turned into text at
// render time, so a language switch re-words messages that are already on screen.
const FIELDS = {
  from_name: { min: 2, required: { tr: 'İsim zorunlu.', en: 'Name is required.' } },
  from_email: { email: true, required: { tr: 'E-posta zorunlu.', en: 'Email is required.' } },
  subject: { min: 3, required: { tr: 'Konu zorunlu.', en: 'Subject is required.' } },
  message: { min: 10, required: { tr: 'Mesaj zorunlu.', en: 'Message is required.' } },
};
const FIELD_NAMES = Object.keys(FIELDS);

const validateField = (name, value) => {
  const rule = FIELDS[name];
  const trimmed = (value ?? '').trim();
  if (!rule) return '';
  if (!trimmed) return 'required';
  if (rule.email && !EMAIL_REGEX.test(trimmed)) return 'email';
  if (rule.min && trimmed.length < rule.min) return 'min';
  return '';
};

const errorText = (name, code, isTurkish) => {
  if (code === 'required') return pick(FIELDS[name].required, isTurkish);
  if (code === 'email') return isTurkish ? 'Geçerli e-posta gir.' : 'Enter a valid email.';
  if (code === 'min') {
    const { min } = FIELDS[name];
    return isTurkish ? `En az ${min} karakter olmalı.` : `Must be at least ${min} characters.`;
  }
  return '';
};

const inputBase =
  'block w-full min-h-11 rounded-md border bg-surface2 px-3.5 py-2.5 text-base text-fg placeholder:text-muted transition-colors sm:text-sm';

const ContactForm = ({ isTurkish }) => {
  const formRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const t = (tr, en) => (isTurkish ? tr : en);

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    // Editing after a send attempt dismisses the result banner.
    if (status === 'success' || status === 'error') setStatus('idle');
    if (!touched[name]) return;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateAll = () => {
    if (!formRef.current) return false;
    const data = new FormData(formRef.current);
    const nextErrors = {};
    FIELD_NAMES.forEach((field) => {
      const code = validateField(field, data.get(field));
      if (code) nextErrors[field] = code;
    });
    setErrors(nextErrors);
    setTouched(Object.fromEntries(FIELD_NAMES.map((field) => [field, true])));
    if (Object.keys(nextErrors).length > 0) {
      formRef.current.elements.namedItem(FIELD_NAMES.find((field) => nextErrors[field]))?.focus();
      return false;
    }
    return true;
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
      toast.success(t('Mesaj iletildi.', 'Message sent.'));
      formRef.current?.reset();
      setErrors({});
      setTouched({});
    } catch {
      setStatus('error');
      toast.error(t('Mesaj gönderilemedi.', 'Could not send message.'));
    }
  };

  const shown = (field) => (touched[field] && errors[field] ? errors[field] : '');
  const inputProps = (field) => {
    const code = shown(field);
    return {
      id: field,
      name: field,
      required: true,
      'aria-required': true,
      'aria-invalid': Boolean(code),
      'aria-describedby': code ? `${field}-error` : undefined,
      onBlur: handleBlur,
      onChange: handleChange,
      className: `${inputBase} ${code ? 'border-danger' : 'border-line/15 focus:border-accent'}`,
    };
  };
  const messageProps = inputProps('message');
  const labelClass = 'label mb-2 block';
  const renderError = (field) => {
    const code = shown(field);
    return code ? (
      <p id={`${field}-error`} className="mt-1.5 text-sm text-danger">
        {errorText(field, code, isTurkish)}
      </p>
    ) : null;
  };

  return (
    <Reveal delay={0.06} className="min-w-0 lg:col-span-7">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        aria-labelledby="contact-form-title"
        className="card relative space-y-4 p-5 sm:p-6 lg:p-8"
      >
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden border-0 p-0 opacity-0"
        />

        <div>
          <h3 id="contact-form-title" className="text-h3">
            {t('Mesaj gönder', 'Send a message')}
          </h3>
          <p className="mt-2 text-sm text-muted">{t('Tüm alanlar zorunlu.', 'All fields are required.')}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="from_name" className={labelClass}>
              {t('Ad', 'Name')}
            </label>
            <input
              type="text"
              autoComplete="name"
              placeholder={t('Adın Soyadın', 'Your name')}
              {...inputProps('from_name')}
            />
            {renderError('from_name')}
          </div>
          <div>
            <label htmlFor="from_email" className={labelClass}>
              {t('E-posta', 'Email')}
            </label>
            <input
              type="email"
              autoComplete="email"
              placeholder="email@example.com"
              {...inputProps('from_email')}
            />
            {renderError('from_email')}
          </div>
        </div>

        <div>
          <label htmlFor="subject" className={labelClass}>
            {t('Konu', 'Subject')}
          </label>
          <input
            type="text"
            placeholder={t('Ne hakkında?', 'What is this about?')}
            {...inputProps('subject')}
          />
          {renderError('subject')}
        </div>

        <div>
          <label htmlFor="message" className={labelClass}>
            {t('Mesaj', 'Message')}
          </label>
          <textarea
            rows={5}
            placeholder={t('Mesajını yaz...', 'Write your message...')}
            {...messageProps}
            className={`${messageProps.className} resize-y`}
          />
          {renderError('message')}
        </div>

        <div aria-live="polite">
          {status === 'success' && (
            <p className="flex items-start gap-2.5 rounded-md border border-ok/30 bg-ok/10 px-4 py-3 text-sm">
              <HiCheckCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ok" />
              {t('Mesajın iletildi. En kısa sürede döneceğim.', 'Message sent. I will get back to you soon.')}
            </p>
          )}
          {status === 'error' && (
            <p className="flex items-start gap-2.5 rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm">
              <HiXCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
              {t(
                'Bir hata oluştu. E-posta ile ulaşabilirsin.',
                'Something went wrong. You can email me directly.',
              )}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          aria-busy={status === 'sending'}
          className="btn-primary btn-lg w-full"
        >
          {status === 'sending' ? (
            <>
              <span
                aria-hidden="true"
                className="h-4 w-4 rounded-full border-2 border-signal-fg/30 border-t-signal-fg motion-safe:animate-spin"
              />
              {t('Gönderiliyor...', 'Sending...')}
            </>
          ) : (
            <>
              {t('Mesajı gönder', 'Send message')}
              <HiArrowRight aria-hidden="true" className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </Reveal>
  );
};

const displayUrl = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

const ChannelRow = ({ item }) => {
  const body = (
    <>
      <item.Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-muted" />
      <span className="min-w-0 flex-1">
        <span className="label block">{item.label}</span>
        <span className="mt-0.5 block break-all text-sm font-medium">{item.value}</span>
      </span>
      {item.EndIcon && (
        <item.EndIcon
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-muted transition-[transform,color] duration-150 group-hover:translate-x-0.5 group-hover:text-accent"
        />
      )}
    </>
  );

  const rowClass = 'flex min-h-16 items-center gap-4 border-b border-line/10 py-3.5';
  if (!item.href) return <div className={rowClass}>{body}</div>;

  const external = item.href.startsWith('http');
  return (
    <a
      href={item.href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      download={item.download}
      className={`group ${rowClass} transition-colors hover:text-accent`}
    >
      {body}
      {external && <NewTabNote />}
    </a>
  );
};

const Contact = () => {
  const { isTurkish } = useLanguage();
  const t = (tr, en) => (isTurkish ? tr : en);

  const channels = [
    {
      Icon: HiMail,
      EndIcon: HiArrowRight,
      label: t('E-posta', 'Email'),
      value: PERSONAL_INFO.email,
      href: `mailto:${PERSONAL_INFO.email}`,
    },
    {
      Icon: FiLinkedin,
      EndIcon: HiExternalLink,
      label: 'LinkedIn',
      value: displayUrl(PERSONAL_INFO.linkedin),
      href: PERSONAL_INFO.linkedin,
    },
    {
      Icon: FiGithub,
      EndIcon: HiExternalLink,
      label: 'GitHub',
      value: displayUrl(PERSONAL_INFO.github),
      href: PERSONAL_INFO.github,
    },
    {
      Icon: HiDocumentText,
      EndIcon: HiDownload,
      label: 'CV',
      value: isTurkish ? CV_LABEL.tr : CV_LABEL.en,
      href: CV_PATH,
      download: true,
    },
    {
      Icon: FiMapPin,
      label: t('Konum', 'Location'),
      value: pick(PERSONAL_INFO.location, isTurkish),
    },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative py-20 md:py-28">
      <div className="container-site">
        <SectionHeader
          id="contact-title"
          index="05"
          label={t('İletişim', 'Contact')}
          title={t('Birlikte çalışalım.', 'Let’s work together.')}
          lead={t(
            'Full-stack, Android veya AI odaklı işler için kısa bir mesaj yeterli.',
            'A short message is enough for full-stack, Android, or AI-focused opportunities.',
          )}
          aside={
            <p className="inline-flex items-center gap-2.5 rounded-full border border-ok/30 bg-ok/10 px-4 py-2 text-sm">
              <span className="status-dot" aria-hidden="true" />
              {t('Uzaktan / hibrit işlere açığım', 'Open to remote / hybrid work')}
            </p>
          }
        />

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="min-w-0 lg:col-span-5">
            <h3 className="text-h3">{t('Kanallar', 'Channels')}</h3>
            <p className="mt-3 max-w-md text-muted">
              {t(
                'Aşağıdaki kanallardan birini seç ya da formu doldur; mesajın doğrudan bana ulaşır.',
                'Pick a channel below or fill in the form; your message comes straight to me.',
              )}
            </p>
            <ul className="mt-6 border-t border-line/10">
              {channels.map((item) => (
                <li key={item.label}>
                  <ChannelRow item={item} />
                </li>
              ))}
            </ul>
          </Reveal>

          <ContactForm isTurkish={isTurkish} />
        </div>
      </div>
    </section>
  );
};

export default Contact;
