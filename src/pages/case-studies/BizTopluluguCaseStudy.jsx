import { HiCollection, HiSparkles } from 'react-icons/hi';
import { useLanguage } from '../../context/LanguageContext';
import CaseStudyLayout from '../../components/CaseStudyLayout';
import Reveal from '../../components/ui/Reveal';

const InfoCard = ({ title, children }) => (
  <div className="card p-6">
    <h2 className="mb-3 text-h3 text-fg">{title}</h2>
    <div className="text-body text-muted">{children}</div>
  </div>
);

const chip = 'rounded-full border border-line/12 bg-surface2 px-2.5 py-1 text-xs font-medium text-muted';

const BizTopluluguCaseStudy = () => {
  const { isTurkish } = useLanguage();

  const facts = isTurkish
    ? [
        { label: 'Yüzey', value: 'Kurumsal topluluk sitesi' },
        { label: 'Yığın', value: 'Next.js + MDX, Tailwind v4' },
        { label: 'İçerik', value: 'Build sırasında statik üretim' },
      ]
    : [
        { label: 'Surface', value: 'Community organization site' },
        { label: 'Stack', value: 'Next.js + MDX, Tailwind v4' },
        { label: 'Content', value: 'Statically generated at build' },
      ];

  const decisions = isTurkish
    ? [
        'WordPress arşivi MDX içerik dosyalarına taşındı; eski adresler kalıcı yönlendirmelerle korundu.',
        'Veritabanı yok: bütün sayfalar build sırasında statik üretiliyor, bakım yükü ve maliyet düşüyor.',
        'Künye kartı, arşivin temel birimi olarak tasarlandı; beş koleksiyon aynı birimi paylaşıyor.',
      ]
    : [
        'The WordPress archive moved to MDX content files; old URLs are preserved with permanent redirects.',
        'No database: every page is statically generated at build time, keeping maintenance and cost low.',
        'The künye card is designed as the base unit of the archive; five collections share it.',
      ];

  return (
    <CaseStudyLayout
      routePath="/case-study/biztoplulugu"
      title="Biz Topluluğu"
      subtitle={
        isTurkish
          ? 'Etkinlik, rapor ve duyuru arşivini MDX tabanlı içerik akışıyla taşıyan, build sırasında statik üretilen topluluk kurumsal sitesi.'
          : 'A community organization site that carries the event, report, and announcement archive through MDX content, statically generated at build time.'
      }
      liveUrl="https://biztoplulugu.com.tr"
      currentId="biztoplulugu"
      isTurkish={isTurkish}
      facts={facts}
      previewSnapshotSrc="/previews/biztoplulugu-live.webp"
    >
      <Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          <InfoCard title={isTurkish ? 'Problem' : 'Problem'}>
            {isTurkish
              ? 'Topluluğun yıllara yayılan etkinlik, rapor ve duyuru arşivi WordPress üzerindeydi; eski yapı içerik yönetimini yavaşlatıyor, sitenin hızını ve güncellenebilirliğini kısıtlıyordu.'
              : "The community's multi-year archive of events, reports, and announcements lived on WordPress; the legacy setup slowed content work and limited speed and maintainability."}
          </InfoCard>
          <InfoCard title={isTurkish ? 'Çözüm' : 'Solution'}>
            {isTurkish
              ? 'Arşivi MDX dosyalarına taşıdım; beş koleksiyon, kurumsal sayfalar ve üyelik akışı tek tasarım diliyle, build sırasında statik üretilen bir Next.js sitesinde birleşti. WordPress adresleri kalıcı yönlendirmelerle korundu.'
              : 'I moved the archive to MDX files; five collections, corporate pages, and the membership flow now sit in one Next.js site with a single design language, statically generated at build. WordPress URLs are preserved via permanent redirects.'}
          </InfoCard>
        </div>
      </Reveal>

      <Reveal className="card-prominent p-6 sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <HiSparkles className="h-6 w-6 text-accent" />
          <h2 className="text-h3 text-fg">{isTurkish ? 'Teknik kararlar' : 'Technical decisions'}</h2>
        </div>
        <ul className="grid gap-3">
          {decisions.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-line/10 bg-surface2 p-4 text-body-sm font-medium text-muted"
            >
              <HiCollection className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              {item}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal>
        <InfoCard title={isTurkish ? 'Sonuç' : 'Result'}>
          {isTurkish
            ? 'Biz Topluluğu, içerik ağırlıklı bir kurumsal sitesi için veritabanısız mimarinin ne kadar yeterli olduğunu gösteren bir iş: künye kartı sistemi sayesinde beş farklı koleksiyon tek bileşen dilinde okunuyor.'
            : 'Biz Topluluğu shows how sufficient a database-free architecture can be for a content-heavy organization site: thanks to the künye card system, five different collections read in one component language.'}
          <div className="mt-4 flex flex-wrap gap-2">
            {(isTurkish
              ? ['Next.js', 'MDX', 'Tailwind v4', 'Statik üretim']
              : ['Next.js', 'MDX', 'Tailwind v4', 'Static generation']
            ).map((tag) => (
              <span key={tag} className={chip}>
                {tag}
              </span>
            ))}
          </div>
        </InfoCard>
      </Reveal>
    </CaseStudyLayout>
  );
};

export default BizTopluluguCaseStudy;
