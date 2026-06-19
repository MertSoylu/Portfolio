import { HiCode, HiShieldCheck } from 'react-icons/hi';
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

const MsscanCaseStudy = () => {
  const { isTurkish } = useLanguage();

  const facts = isTurkish
    ? [
        { label: 'Dil', value: 'Python 3.10+' },
        { label: 'Yüzey', value: 'Terminal aracı' },
        { label: 'Çıktı', value: 'Console + HTML rapor' },
      ]
    : [
        { label: 'Language', value: 'Python 3.10+' },
        { label: 'Surface', value: 'Terminal tool' },
        { label: 'Output', value: 'Console + HTML report' },
      ];

  const decisions = isTurkish
    ? [
        'Tarama modülleri ayrı tutuldu; yeni kontrol eklemek daha kolay hale geldi.',
        'Rate limiting ve timeout seçenekleri, hedef sistemi gereksiz zorlamadan test etmeye yardımcı olur.',
        'HTML rapor, terminal çıktısını paylaşılabilir ve okunabilir forma taşır.',
      ]
    : [
        'Scan modules are separated, making new checks easier to add.',
        'Rate limiting and timeout options help test without overloading targets.',
        'HTML reporting turns terminal output into a readable and shareable artifact.',
      ];

  return (
    <CaseStudyLayout
      routePath="/case-study/msscan"
      title="msscan"
      subtitle={
        isTurkish
          ? 'XSS, SQLi, CSRF, SSRF, open redirect, header ve subdomain kontrolleri için geliştirilmiş async Python CLI aracı.'
          : 'An async Python CLI tool for XSS, SQLi, CSRF, SSRF, open redirect, header, and subdomain checks.'
      }
      liveUrl="https://github.com/MertSoylu/msscan"
      githubUrl="https://github.com/MertSoylu/msscan"
      currentId="msscan"
      isTurkish={isTurkish}
      facts={facts}
    >
      <Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          <InfoCard title={isTurkish ? 'Problem' : 'Problem'}>
            {isTurkish
              ? 'Web güvenliği öğrenirken aynı kontrolleri elle tekrar etmek hem yavaş hem de hataya açık. Küçük, okunur ve yapılandırılabilir bir CLI aracı pratik öğrenmeyi hızlandırır.'
              : 'Repeating the same web-security checks manually is slow and error-prone. A small, readable, configurable CLI tool makes practice faster.'}
          </InfoCard>
          <InfoCard title={isTurkish ? 'Çözüm' : 'Solution'}>
            {isTurkish
              ? 'msscan, farklı güvenlik kontrollerini async çalışan modüller halinde toplar. Terminal çıktısı ve HTML raporla bulguları daha okunur hale getirir.'
              : 'msscan groups different security checks into async modules. Console output and HTML reports make findings easier to read.'}
          </InfoCard>
        </div>
      </Reveal>

      <Reveal className="card-prominent p-6 sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <HiShieldCheck className="h-6 w-6 text-accent" />
          <h2 className="text-h3 text-fg">{isTurkish ? 'Teknik kararlar' : 'Technical decisions'}</h2>
        </div>
        <ul className="grid gap-3">
          {decisions.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-line/10 bg-surface2 p-4 text-body-sm font-medium text-muted"
            >
              <HiCode className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              {item}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal>
        <InfoCard title={isTurkish ? 'Sonuç' : 'Result'}>
          {isTurkish
            ? 'msscan, güvenlik öğrenimini ürünleştiren bir araç: yalnızca teorik açık listesi değil, terminalden çalıştırılabilir ve rapora dökülebilir bir pratik alanı.'
            : 'msscan productizes security learning: not only a theoretical list of vulnerabilities, but a terminal workflow that can produce reports.'}
          <div className="mt-4 flex flex-wrap gap-2">
            {['Python', 'Async execution', 'Rate limiting', 'HTML reports'].map((tag) => (
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

export default MsscanCaseStudy;
