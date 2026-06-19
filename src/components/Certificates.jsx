import { HiAcademicCap, HiExternalLink } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import { CERTIFICATES } from '../utils/constants';
import SectionHeader from './home/SectionHeader';
import Reveal from './ui/Reveal';
import TiltedCard from './ui/TiltedCard';

const Certificates = () => {
  const { isTurkish } = useLanguage();

  if (!CERTIFICATES.length) return null;

  return (
    <section id="certificates" className="relative px-5 py-12 sm:py-20 md:py-24">
      <div className="container-wide">
        <SectionHeader
          kicker={isTurkish ? 'Eğitim' : 'Training'}
          kickerIcon={<HiAcademicCap className="h-4 w-4" />}
          title={isTurkish ? 'Sertifikalar' : 'Certificates'}
          lead={
            isTurkish
              ? 'Güvenlik ve yazılım temelimi güçlendiren eğitimler.'
              : 'Training that strengthens my security and software fundamentals.'
          }
        />

        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
          {CERTIFICATES.map((cert, index) => (
            <Reveal key={cert.id} delay={index * 0.07} className="h-full">
              <TiltedCard className="h-full" rotateAmplitude={4} scaleOnHover={1.01}>
                <div className="card card-hover group flex h-full flex-col p-4 sm:p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface2 text-accent">
                      <HiAcademicCap className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-line/12 bg-surface2 px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                      {cert.date}
                    </span>
                  </div>

                  <h4 className="mb-1.5 font-display text-base font-semibold leading-snug text-fg sm:text-lg">
                    {isTurkish ? cert.title.tr : cert.title.en}
                  </h4>
                  <p className="mb-3 text-xs font-medium text-muted sm:text-sm">{cert.issuer}</p>

                  {cert.skills?.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {cert.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-line/12 bg-surface2 px-2 py-0.5 text-[10px] font-medium text-muted"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {cert.fileUrl && (
                    <a
                      href={cert.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-strong"
                    >
                      {isTurkish ? 'Sertifikayı gör' : 'View certificate'}
                      <HiExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  )}
                </div>
              </TiltedCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificates;
