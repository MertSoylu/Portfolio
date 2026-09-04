import { HiLocationMarker, HiMap } from 'react-icons/hi';
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

const HaritaCaseStudy = () => {
  const { isTurkish } = useLanguage();

  const facts = isTurkish
    ? [
        { label: 'Yüzey', value: 'Etkileşimli harita platformu' },
        { label: 'Yığın', value: 'Next.js 16, Supabase, d3-geo' },
        { label: 'Doğrulama', value: 'zod + Cloudflare Turnstile' },
      ]
    : [
        { label: 'Surface', value: 'Interactive map platform' },
        { label: 'Stack', value: 'Next.js 16, Supabase, d3-geo' },
        { label: 'Validation', value: 'zod + Cloudflare Turnstile' },
      ];

  const decisions = isTurkish
    ? [
        'Türkiye haritası d3-geo Mercator izdüşümüyle SVG olarak üretildi; harita kütüphanesi olmadan hafif ve hızlı bir temel kuruldu.',
        'Supabase tarafında RLS, görünümler ve tetikleyiciler kullanıldı; okuma özetleri veritabanı görünümlerinden türetiliyor.',
        'İstemci ve sunucu aynı zod şemasını paylaşıyor; form doğrulaması tek kaynakta tutuluyor.',
        'Veritabanı yapılandırması olmadan site örnek veri kipinde açılıyor; geliştirme ve demo akışı kopmuyor.',
      ]
    : [
        'The Turkey map is rendered as SVG via d3-geo Mercator projection; a lightweight base without a map library.',
        'Supabase side uses RLS, views, and triggers; reading summaries derive from database views.',
        'Client and server share the same zod schema, keeping form validation in a single source.',
        'Without database configuration, the site opens in sample-data mode; dev and demo flows never break.',
      ];

  return (
    <CaseStudyLayout
      routePath="/case-study/harita"
      title="BİZ Şehir Haritası"
      subtitle={
        isTurkish
          ? "Türkiye'nin 81 ilinden gelen sorun bildirimlerini haritada toplayan, Supabase destekli topluluk platformu."
          : 'A community platform backed by Supabase that collects and maps issue reports from all 81 provinces of Turkey.'
      }
      liveUrl="https://harita.biztoplulugu.com.tr"
      currentId="harita"
      isTurkish={isTurkish}
      facts={facts}
      previewSnapshotSrc="/previews/harita-live.webp"
    >
      <Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          <InfoCard title={isTurkish ? 'Problem' : 'Problem'}>
            {isTurkish
              ? 'Topluluğun 81 ile yayılan sorun bildirimlerinin dağınık kanallarda kaybolması, sorunun nerede yoğunlaştığının görülmesini zorlaştırıyordu; tek bir harita yüzeyine ihtiyaç vardı.'
              : 'Issue reports scattered across channels made it hard to see where problems concentrate across 81 provinces; a single map surface was needed.'}
          </InfoCard>
          <InfoCard title={isTurkish ? 'Çözüm' : 'Solution'}>
            {isTurkish
              ? 'Bildirimleri il bazında haritada toplayan bir platform kurdum: d3-geo ile SVG harita, Supabase üzerinde RLS korumalı veri katmanı, zod ile uçtan uca doğrulama ve Turnstile ile bot koruması.'
              : 'I built a platform that maps reports per province: an SVG map with d3-geo, an RLS-protected data layer on Supabase, end-to-end validation with zod, and bot protection with Turnstile.'}
          </InfoCard>
        </div>
      </Reveal>

      <Reveal className="card-prominent p-6 sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <HiMap className="h-6 w-6 text-accent" />
          <h2 className="text-h3 text-fg">{isTurkish ? 'Teknik kararlar' : 'Technical decisions'}</h2>
        </div>
        <ul className="grid gap-3">
          {decisions.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-line/10 bg-surface2 p-4 text-body-sm font-medium text-muted"
            >
              <HiLocationMarker className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              {item}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal>
        <InfoCard title={isTurkish ? 'Sonuç' : 'Result'}>
          {isTurkish
            ? 'BİZ Şehir Haritası, ana sitenin tasarım dilini paylaşan bir alt alan adı olarak yayında: harita özeti, ülke özeti ve kırılımlar veritabanı görünümlerinden türetiliyor, yazma uçları ortak şema ve bot korumasıyla çalışıyor.'
            : 'BİZ Şehir Haritası is live as a subdomain sharing the main site design language: map and country summaries derive from database views, while write endpoints run on a shared schema with bot protection.'}
          <div className="mt-4 flex flex-wrap gap-2">
            {['Next.js 16', 'Supabase', 'd3-geo', 'PostgreSQL', 'zod'].map((tag) => (
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

export default HaritaCaseStudy;
