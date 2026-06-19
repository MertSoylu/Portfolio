import { HiCursorClick, HiLightningBolt } from 'react-icons/hi';
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

const TypeSprintCaseStudy = () => {
  const { isTurkish } = useLanguage();

  const facts = isTurkish
    ? [
        { label: 'Yüzey', value: 'Canlı WPM uygulaması' },
        { label: 'Odak', value: 'Doğruluk + ritim' },
        { label: 'Dil', value: 'Çok dilli kelime havuzu' },
      ]
    : [
        { label: 'Surface', value: 'Live WPM application' },
        { label: 'Focus', value: 'Accuracy + rhythm' },
        { label: 'Language', value: 'Multilingual word pools' },
      ];

  const decisions = isTurkish
    ? [
        'Yanlış tuşla devam etmeye izin vermeyen akış, skoru daha dürüst hale getirir.',
        'Arayüzde odak metin alanında kalır; yardımcı bilgiler çevrede daha sessiz durur.',
        'Çok dilli yapı, Türkçe dahil farklı kelime ritimlerini ölçüme dahil eder.',
      ]
    : [
        'Stopping progress on a wrong key makes the score more honest.',
        'The interface keeps focus on the text area while supporting data stays quieter.',
        'The multilingual structure includes different word rhythms, including Turkish.',
      ];

  return (
    <CaseStudyLayout
      routePath="/case-study/typesprint"
      title="TypeSprint"
      subtitle={
        isTurkish
          ? 'Yazma hızını sadece hız değil, doğruluk ve akış kontrolüyle ölçen canlı web uygulaması.'
          : 'A live web app that measures typing speed through accuracy and flow control, not only raw speed.'
      }
      liveUrl="https://typesprint.online"
      currentId="typesprint"
      isTurkish={isTurkish}
      facts={facts}
      previewSnapshotSrc="/previews/typesprint-live.png"
    >
      <Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          <InfoCard title={isTurkish ? 'Problem' : 'Problem'}>
            {isTurkish
              ? 'Birçok WPM testi hızlı görünür ama hatalı yazmayı yeterince cezalandırmaz. Kullanıcı kendini geliştirirken hız ve doğruluk ayrımını net göremez.'
              : 'Many WPM tests feel fast but do not penalize incorrect typing clearly. Users cannot always separate speed from accuracy while improving.'}
          </InfoCard>
          <InfoCard title={isTurkish ? 'Çözüm' : 'Solution'}>
            {isTurkish
              ? 'TypeSprint, yanlış girişte akışı durduran ve çok dilli kelime havuzuyla çalışan bir ölçüm deneyimi sunar. Amaç hızlı skor değil, güvenilir sonuçtur.'
              : 'TypeSprint provides a measurement experience that stops on wrong input and works with multilingual word pools. The goal is reliable results, not inflated speed.'}
          </InfoCard>
        </div>
      </Reveal>

      <Reveal className="card-prominent p-6 sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <HiCursorClick className="h-6 w-6 text-accent" />
          <h2 className="text-h3 text-fg">{isTurkish ? 'Ürün kararları' : 'Product decisions'}</h2>
        </div>
        <ul className="grid gap-3">
          {decisions.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-line/10 bg-surface2 p-4 text-body-sm font-medium text-muted"
            >
              <HiLightningBolt className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              {item}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal>
        <InfoCard title={isTurkish ? 'Sonuç' : 'Result'}>
          {isTurkish
            ? 'TypeSprint, küçük bir web aracında bile ölçüm mantığı, kullanıcı psikolojisi ve arayüz ritminin birlikte tasarlanması gerektiğini gösteriyor.'
            : 'TypeSprint shows that even a small web tool needs measurement logic, user psychology, and interface rhythm designed together.'}
          <div className="mt-4 flex flex-wrap gap-2">
            {['JavaScript', 'WPM', 'Multilingual', 'Leaderboard'].map((tag) => (
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

export default TypeSprintCaseStudy;
