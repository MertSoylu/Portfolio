import { useLanguage } from '../../context/LanguageContext';
import { UI_COPY, pick } from '../../data/projects';

/** Screen-reader-only suffix for links that open in a new tab. */
const NewTabNote = () => {
  const { isTurkish } = useLanguage();
  return <span className="sr-only"> {pick(UI_COPY.newTab, isTurkish)}</span>;
};

export default NewTabNote;
