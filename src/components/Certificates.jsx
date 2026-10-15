import { HiExternalLink } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import { pick } from '../data/projects';
import { CERTIFICATES } from '../utils/constants';
import SectionHeader from './home/SectionHeader';
import NewTabNote from './ui/NewTabNote';
import Reveal from './ui/Reveal';

// Dates are stored as 'YYYY' or 'YYYY-MM' and formatted per language (UTC so the day never shifts).
const formatCertDate = (value, locale) => {
  const [year, month] = String(value).split('-').map(Number);
  if (!year) return String(value);
  const date = new Date(Date.UTC(year, (month || 1) - 1, 1));
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    ...(month ? { month: 'long' } : {}),
    timeZone: 'UTC',
  }).format(date);
};

const Certificates = () => {
  const { isTurkish } = useLanguage();
  const t = (tr, en) => (isTurkish ? tr : en);
  const locale = isTurkish ? 'tr-TR' : 'en-US';

  if (!CERTIFICATES.length) return null;

  return (
    <section id="certificates" aria-labelledby="certificates-title" className="relative py-20 md:py-28">
      <div className="container-site">
        <SectionHeader
          id="certificates-title"
          index="04"
          label={t('Sertifikalar', 'Certificates')}
          title={t('Eğitim ve sertifikalar.', 'Training and certificates.')}
          lead={t(
            'Güvenlik ve yazılım temelimi güçlendiren eğitimler.',
            'Training that strengthens my security and software fundamentals.',
          )}
        />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CERTIFICATES.map((cert, index) => (
            <Reveal as="li" key={cert.id} delay={index * 0.06} className="min-w-0">
              <article className="card flex h-full flex-col p-5 sm:p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="label min-w-0">{cert.issuer}</p>
                  <time dateTime={cert.date} className="micro shrink-0 text-muted">
                    {formatCertDate(cert.date, locale)}
                  </time>
                </div>

                <h3 className="text-h3 mt-5">{pick(cert.title, isTurkish)}</h3>

                {cert.skills?.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {cert.skills.map((skill) => (
                      <li key={skill} className="tag">
                        {skill}
                      </li>
                    ))}
                  </ul>
                )}

                {cert.fileUrl && (
                  <p className="mt-auto pt-6">
                    <a
                      href={cert.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link relative inline-flex items-center gap-1.5 text-sm font-medium after:absolute after:inset-x-0 after:-inset-y-3 after:content-['']"
                    >
                      {t("PDF'i aç", 'Open PDF')}
                      <HiExternalLink aria-hidden="true" className="h-4 w-4" />
                      <NewTabNote />
                    </a>
                  </p>
                )}
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Certificates;
