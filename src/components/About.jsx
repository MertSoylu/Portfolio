import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowNarrowRight } from 'react-icons/hi';
import { useDarkMode } from '../context/DarkModeContext';
import { useLanguage } from '../context/LanguageContext';
import { AREAS } from '../data/areas';
import { pick } from '../data/projects';
import { PERSONAL_INFO } from '../utils/constants';
import { getGitHubProfileUrl, getGitHubUsername } from '../utils/githubApi';
import SectionHeader from './home/SectionHeader';
import NewTabNote from './ui/NewTabNote';
import Reveal from './ui/Reveal';

// Chart colour per theme: the text-safe accent (deep orange on light, Claude orange on dark).
const CHART_COLOR = { dark: 'd97757', light: 'a8452a' };

// The chart image is drawn for light backgrounds (grey #eee empty days), which glare on the dark card.
// This filter keeps colour as it is and turns the "greyness" of a pixel into transparency: empty days
// become a faint tile, coloured days stay solid (the composite keeps the image's own transparency).
const DARK_CHART_FILTER = 'gh-chart-dark';

const Fact = ({ label, children }) => (
  <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-baseline gap-x-4 border-t border-line/10 py-3.5 first:border-t-0 first:pt-0 last:pb-0 sm:grid-cols-[7.5rem_minmax(0,1fr)]">
    <dt className="label">{label}</dt>
    <dd className="min-w-0 text-sm">{children}</dd>
  </div>
);

const About = () => {
  const { isTurkish } = useLanguage();
  const { isDark } = useDarkMode();
  const [chartFailed, setChartFailed] = useState(false);
  const t = (tr, en) => (isTurkish ? tr : en);
  const username = getGitHubUsername();

  // The date makes the URL change once a day so a stale chart is not served from the HTTP cache for long.
  const chartUrl = useMemo(() => {
    const day = new Date().toISOString().split('T')[0];
    return `https://ghchart.rshah.org/${isDark ? CHART_COLOR.dark : CHART_COLOR.light}/${username}?t=${day}`;
  }, [isDark, username]);

  return (
    <section id="about" aria-labelledby="about-title" className="relative py-20 md:py-28">
      <div className="container-site">
        <SectionHeader
          id="about-title"
          index="01"
          label={t('Hakkımda', 'About')}
          title={t('Fikirden çalışan ürüne.', 'From idea to working product.')}
          lead={t(
            'Öğrendiğim her yeni konuyu bekletmeden çalışan bir ürün parçasına dönüştürüyorum.',
            'I turn what I learn into a working piece of product, instead of letting it sit on a shelf.',
          )}
        />

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 space-y-5 text-base leading-relaxed lg:col-span-7">
            <Reveal as="p">
              {t(
                'Web, Android, güvenlik ve yapay zekâ tarafında yaklaşımım aynı: problemi anla, küçük ama eksiksiz bir çözüm kur, sonra arayüzü okunur ve hızlı hâle getir.',
                'Across web, Android, security, and AI, my approach stays the same: understand the problem, build a small but complete solution, then make the interface readable and fast.',
              )}
            </Reveal>
            <Reveal as="p" delay={0.06} className="text-muted">
              {t(
                "Yayında çalışan işlerim var: WalkKittie Google Play'de, TypeSprint ve topluluk siteleri canlı, NOBLE ise Rust ile yazdığım bir terminal çalışma alanı. Güvenlik ve veri bilimi tarafında öğrendiklerimi küçük, tekrarlanabilir araçlara ve deneylere dönüştürüyorum.",
                'I have work running live: WalkKittie is on Google Play, TypeSprint and the community sites are online, and NOBLE is a terminal workspace I wrote in Rust. In security and data science, I turn what I learn into small, repeatable tools and experiments.',
              )}
            </Reveal>
          </div>

          <Reveal delay={0.06} className="min-w-0 lg:col-span-5">
            <dl className="card p-6 sm:p-7">
              <Fact label={t('Rol', 'Role')}>{PERSONAL_INFO.title}</Fact>
              <Fact label={t('Eğitim', 'Education')}>{pick(PERSONAL_INFO.university, isTurkish)}</Fact>
              <Fact label={t('Konum', 'Location')}>{pick(PERSONAL_INFO.location, isTurkish)}</Fact>
              <Fact label={t('Diller', 'Languages')}>{t('Türkçe · İngilizce', 'Turkish · English')}</Fact>
              <Fact label={t('Odak', 'Focus')}>
                {t('Web, Android, güvenlik, yapay zekâ', 'Web, Android, security, AI')}
              </Fact>
            </dl>
          </Reveal>
        </div>

        <h3 className="label mb-5 mt-16 text-fg sm:mt-20">{t('Çalışma alanları', 'Focus areas')}</h3>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AREAS.map((area, index) => (
            <Reveal as="li" key={area.id} delay={index * 0.06} className="min-w-0">
              <Link
                to={area.path}
                aria-labelledby={`area-${area.id}-name`}
                aria-describedby={`area-${area.id}-short`}
                className="card-interactive group flex h-full flex-col p-5"
              >
                <span className="flex items-center justify-between">
                  <span className="micro text-muted">{area.index}</span>
                  <HiArrowNarrowRight
                    aria-hidden="true"
                    className="h-5 w-5 text-muted transition-[transform,color] duration-150 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </span>
                <h4 id={`area-${area.id}-name`} className="text-h4 mt-6">
                  {pick(area.name, isTurkish)}
                </h4>
                <p id={`area-${area.id}-short`} className="mt-2 text-sm text-muted">
                  {pick(area.short, isTurkish)}
                </p>
                <span className="mt-auto flex flex-wrap gap-1.5 pt-5" aria-hidden="true">
                  {area.stack.slice(0, 4).map((tech) => (
                    <span key={tech} className="tag">
                      {tech}
                    </span>
                  ))}
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>

        {!chartFailed && (
          <Reveal className="card mt-4 p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-h4">{t('GitHub katkıları', 'GitHub contributions')}</h3>
              <a
                href={getGitHubProfileUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="label inline-flex min-h-8 items-center transition-colors hover:text-accent"
              >
                @{username}
                <NewTabNote />
              </a>
            </div>
            {isDark && (
              <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
                <filter id={DARK_CHART_FILTER} colorInterpolationFilters="sRGB">
                  <feColorMatrix
                    type="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 2.4 -2.4 0 0.14"
                    result="keyed"
                  />
                  <feComposite in="keyed" in2="SourceGraphic" operator="in" />
                </filter>
              </svg>
            )}
            <img
              src={chartUrl}
              style={isDark ? { filter: `url(#${DARK_CHART_FILTER})` } : undefined}
              alt={t(
                `${username} kullanıcısının son bir yıldaki GitHub katkı grafiği`,
                `GitHub contribution graph for ${username} over the last year`,
              )}
              loading="lazy"
              decoding="async"
              onError={() => setChartFailed(true)}
              className="w-full"
            />
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default About;
