import { HiHeart, HiTrendingUp } from 'react-icons/hi';
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

const WalkKittieCaseStudy = () => {
  const { isTurkish } = useLanguage();
  const playUrl = 'https://play.google.com/store/apps/details?id=com.mert.paticat';

  const facts = isTurkish
    ? [
        { label: 'Platform', value: 'Google Play' },
        { label: 'Stack', value: 'Kotlin + Jetpack Compose' },
        { label: 'Odak', value: 'Sağlık takibini oyunlaştırma' },
      ]
    : [
        { label: 'Platform', value: 'Google Play' },
        { label: 'Stack', value: 'Kotlin + Jetpack Compose' },
        { label: 'Focus', value: 'Gamified health tracking' },
      ];

  const decisions = isTurkish
    ? [
        'Adım sayacı tek başına kuru kalacağı için animasyonlu piksel ahtapot motivasyon döngüsüne bağlandı.',
        'Su takibi, oyun ve bakım akışları ayrı ayrı değil günlük rutin içinde ele alındı.',
        'Native Android yaklaşımı, telefon deneyimini web vitrini gibi değil uygulama gibi hissettirmeyi hedefledi.',
      ]
    : [
        'Step tracking alone can feel dry, so it is connected to an animated pixel-octopus motivation loop.',
        'Water tracking, game, and care flows are treated as one daily routine instead of separate tools.',
        'The native Android approach aims to feel like an app, not a web showcase inside a phone.',
      ];

  return (
    <CaseStudyLayout
      routePath="/case-study/walkkittie"
      title="WalkKittie"
      subtitle={
        isTurkish
          ? 'Günlük yürüyüşü piksel ahtapot bakım döngüsüyle birleştiren, Google Play’de yayınlanmış Android uygulaması.'
          : 'An Android app published on Google Play that connects daily walking with pixel-octopus pet care.'
      }
      liveUrl={playUrl}
      githubUrl="https://github.com/MertSoylu/WalkKittie_App"
      currentId="walkkittie"
      isTurkish={isTurkish}
      facts={facts}
      previewSnapshotSrc="/previews/walkkittie.webp"
    >
      <Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          <InfoCard title={isTurkish ? 'Problem' : 'Problem'}>
            {isTurkish
              ? 'Sağlık uygulamaları çoğu zaman sayaç ve grafiklerden ibaret kalır. Bu yapı, günlük alışkanlık oluşturmak isteyen kullanıcı için yeterince sıcak ve motive edici olmayabilir.'
              : 'Health apps often become counters and charts. That can feel too cold for users trying to build daily habits.'}
          </InfoCard>
          <InfoCard title={isTurkish ? 'Çözüm' : 'Solution'}>
            {isTurkish
              ? 'WalkKittie, adım ve su takibini animasyonlu piksel ahtapot bakımıyla birleştirir. Kullanıcı hareket ettikçe oyun döngüsü de ilerler.'
              : 'WalkKittie combines step and water tracking with animated pixel-octopus care. As the user moves, the game loop progresses too.'}
          </InfoCard>
        </div>
      </Reveal>

      <Reveal className="card-prominent p-6 sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <HiHeart className="h-6 w-6 text-accent" />
          <h2 className="text-h3 text-fg">{isTurkish ? 'Ürün kararları' : 'Product decisions'}</h2>
        </div>
        <ul className="grid gap-3">
          {decisions.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-line/10 bg-surface2 p-4 text-body-sm font-medium text-muted"
            >
              <HiTrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              {item}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal>
        <InfoCard title={isTurkish ? 'Sonuç' : 'Result'}>
          {isTurkish
            ? 'WalkKittie, yalnızca öğrenme projesi olarak değil, mağazaya çıkarılmış bir mobil ürün olarak duruyor. Bu da Android tarafında yayın sürecini ve gerçek kullanıcı akışını deneyimlememi sağladı.'
            : 'WalkKittie is not only a learning project; it is a mobile product shipped to a store. That gave me experience with Android release flow and real user journeys.'}
          <div className="mt-4 flex flex-wrap gap-2">
            {['Kotlin', 'Jetpack Compose', 'Material 3', 'Google Play'].map((tag) => (
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

export default WalkKittieCaseStudy;
