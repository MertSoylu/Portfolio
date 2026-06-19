import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';
import { SEO_META } from '../utils/constants';

const PageMeta = ({ route }) => {
  const { isTurkish } = useLanguage();
  const meta = SEO_META[route] || SEO_META['/'];
  const lang = isTurkish ? meta.tr : meta.en;
  const locale = isTurkish ? 'tr_TR' : 'en_US';

  return (
    <Helmet>
      <html lang={isTurkish ? 'tr' : 'en'} />
      <title>{lang.title}</title>
      <meta name="description" content={lang.description} />
      <link rel="canonical" href={meta.canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={meta.canonical} />
      <meta property="og:title" content={lang.title} />
      <meta property="og:description" content={lang.description} />
      <meta property="og:image" content={meta.ogImage} />
      <meta property="og:locale" content={locale} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={lang.title} />
      <meta name="twitter:description" content={lang.description} />
      <meta name="twitter:image" content={meta.ogImage} />
    </Helmet>
  );
};

export default PageMeta;
