import { HiLocationMarker, HiSparkles } from 'react-icons/hi';
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

const MnemosyneCaseStudy = () => {
  const { isTurkish } = useLanguage();

  const facts = isTurkish
    ? [
        { label: 'Yüzey', value: 'Canlı web uygulaması' },
        { label: 'Odak', value: 'Konum + zaman katmanları' },
        { label: 'Rol', value: 'Ürün arayüzü ve uygulama akışı' },
      ]
    : [
        { label: 'Surface', value: 'Live web application' },
        { label: 'Focus', value: 'Location + time layers' },
        { label: 'Role', value: 'Product UI and app flow' },
      ];

  const decisions = isTurkish
    ? [
        'Harita, projenin dekoru değil ana navigasyon yüzeyi olarak ele alındı.',
        'Anılar tekil kartlardan çok, mekanın zaman içindeki değişimini gösterecek şekilde kurgulandı.',
        'PWA yaklaşımı, uygulamayı klasik web sayfasından daha kalıcı bir deneyime yaklaştırdı.',
      ]
    : [
        'The map is treated as the main navigation surface, not decoration.',
        'Memories are framed around how places change over time, not only as isolated cards.',
        'The PWA approach makes the experience feel more persistent than a static website.',
      ];

  return (
    <CaseStudyLayout
      routePath="/case-study/mnemosyne"
      title="Mnemosyne"
      subtitle={
        isTurkish
          ? 'Konumlara bırakılan anılar fikrini harita, keşif ve zaman katmanlarıyla çalışan bir web deneyimine dönüştüren proje.'
          : 'A project that turns location-based memories into a web experience built around maps, discovery, and time layers.'
      }
      liveUrl="https://m-nemosyne.live"
      currentId="mnemosyne"
      isTurkish={isTurkish}
      facts={facts}
      previewSnapshotSrc="/previews/mnemosyne-live.png"
    >
      <Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          <InfoCard title={isTurkish ? 'Problem' : 'Problem'}>
            {isTurkish
              ? 'Anılar sosyal akışlarda hızlı kayboluyor. Bir yerin geçmişte nasıl göründüğünü, orada kimlerin ne bıraktığını ve mekanın zamanla nasıl değiştiğini tek bağlamda görmek zor.'
              : 'Memories disappear quickly in social feeds. It is hard to see how a place looked before, what people left there, and how that location changed over time in one context.'}
          </InfoCard>
          <InfoCard title={isTurkish ? 'Çözüm' : 'Solution'}>
            {isTurkish
              ? 'Deneyimi konum etrafında kurdum: kullanıcılar harita üzerinden keşfe başlar, anıları yer bağlamında okur ve zaman katmanlarıyla mekanın dönüşümünü takip eder.'
              : 'I built the experience around location: users start from the map, read memories in place context, and follow transformation through time layers.'}
          </InfoCard>
        </div>
      </Reveal>

      <Reveal className="card-prominent p-6 sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <HiLocationMarker className="h-6 w-6 text-accent" />
          <h2 className="text-h3 text-fg">{isTurkish ? 'Tasarım kararları' : 'Design decisions'}</h2>
        </div>
        <ul className="grid gap-3">
          {decisions.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-line/10 bg-surface2 p-4 text-body-sm font-medium text-muted"
            >
              <HiSparkles className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              {item}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal>
        <InfoCard title={isTurkish ? 'Sonuç' : 'Result'}>
          {isTurkish
            ? 'Mnemosyne, web tarafındaki ürün düşüncemi iyi gösteren bir iş: görsel fikir, navigasyon modeli ve kullanıcı motivasyonu aynı ürün dili içinde birleşiyor.'
            : 'Mnemosyne is a good example of my product thinking on the web: visual concept, navigation model, and user motivation sit inside one cohesive product language.'}
          <div className="mt-4 flex flex-wrap gap-2">
            {['React', 'PWA', 'Map-first UI', 'Time layers'].map((tag) => (
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

export default MnemosyneCaseStudy;
