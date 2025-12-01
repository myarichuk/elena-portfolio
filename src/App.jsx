import React, { useEffect, useRef, useState } from 'react';
import Contact from './components/Contact';
import Gallery from './components/Gallery';
import Hero from './components/Hero';
import Lightbox from './components/Lightbox';
import Navigation from './components/Navigation';
import About from './components/About';
import { assetUrl, resolveImageSrc } from './utils/assets';
import { fetchLocale, mergeWithFallback } from './utils/i18n';

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '17e9fbc8-bee6-47c3-88a8-4121afd5a48b';
const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY || '50b2fe65-b00b-4b9e-ad62-3ba471098be2';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [scrolled, setScrolled] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lang, setLang] = useState('en');
  const [translations, setTranslations] = useState(null);
  const [translationsError, setTranslationsError] = useState(null);
  const [translationsLoading, setTranslationsLoading] = useState(true);
  const [artworks, setArtworks] = useState([]);
  const [artworksLoading, setArtworksLoading] = useState(true);
  const [artworksError, setArtworksError] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', topic: '', message: '' });
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [submissionState, setSubmissionState] = useState({ status: 'idle', message: '' });
  const closeButtonRef = useRef(null);
  const translationCache = useRef({}); // Cache per-locale dictionaries to avoid redundant fetches when toggling languages.
  const captchaRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  const t = translations || translationCache.current.en || {};
  const isRTL = lang === 'he';

  useEffect(() => {
    let isMounted = true;

    const loadTranslations = async () => {
      setTranslationsLoading(true);
      setTranslationsError(null);

      try {
        if (!translationCache.current.en) {
          translationCache.current.en = await fetchLocale('en');
        }

        const targetLocale =
          lang === 'en'
            ? translationCache.current.en
            : translationCache.current[lang] || (translationCache.current[lang] = await fetchLocale(lang));

        const mergedTranslations = mergeWithFallback(translationCache.current.en, targetLocale);

        if (isMounted) {
          setTranslations(mergedTranslations);
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setTranslationsError(error.message);
          if (translationCache.current.en) {
            setTranslations(translationCache.current.en);
          }
        }
      } finally {
        if (isMounted) {
          setTranslationsLoading(false);
        }
      }
    };

    loadTranslations();

    return () => {
      isMounted = false;
    };
  }, [lang]);

  useEffect(() => {
    if (translations?.contact?.options?.length) {
      setFormData((prev) => ({
        ...prev,
        topic: prev.topic || translations.contact.options[0],
      }));
    }
  }, [translations]);

  useEffect(() => {
    let isMounted = true;

    fetch(assetUrl('artworks.json'))
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load artworks');
        }
        return response.json();
      })
      .then((data) => {
        if (isMounted) {
          setArtworks(data); // Load once so filters and lightbox share a consistent artwork list.
        }
      })
      .catch((err) => {
        if (isMounted) {
          setArtworksError(err.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setArtworksLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const linkLatin = document.createElement('link');
    linkLatin.href =
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Lato:wght@300;400;700&display=swap';
    linkLatin.rel = 'stylesheet';
    document.head.appendChild(linkLatin);

    const linkHebrew = document.createElement('link');
    linkHebrew.href =
      'https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@300;400;500;700&family=Heebo:wght@300;400;500;700&display=swap';
    linkHebrew.rel = 'stylesheet';
    document.head.appendChild(linkHebrew);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  const filteredArtworks = artworks.filter((art) => activeFilter === 'all' || art.category === activeFilter);

  const openLightbox = (index) => {
    if (!filteredArtworks.length) return;
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e) => {
    e?.stopPropagation();
    if (!filteredArtworks.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % filteredArtworks.length);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    if (!filteredArtworks.length) return;
    setCurrentImageIndex((prev) => (prev - 1 + filteredArtworks.length) % filteredArtworks.length);
  };

  const validateForm = (data) => {
    const nextErrors = {};

    if (!data.name.trim()) {
      nextErrors.name = t.contact.errors.nameRequired;
    }

    if (!data.email.trim()) {
      nextErrors.email = t.contact.errors.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      nextErrors.email = t.contact.errors.emailInvalid;
    }

    if (!data.message.trim()) {
      nextErrors.message = t.contact.errors.messageRequired;
    }

    return nextErrors;
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    const updatedForm = { ...formData, [field]: value };
    setFormData(updatedForm);

    if (touchedFields[field]) {
      setFormErrors(validateForm(updatedForm));
    }
  };

  const handleBlur = (field) => () => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    setFormErrors(validateForm(formData));
  };

  const submissionSubject = translations?.contact?.subjectPrefix || 'New inquiry:';

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validateForm(formData); // Re-run validation at submit time to catch untouched fields.
    setTouchedFields({ name: true, email: true, topic: true, message: true });
    setFormErrors(validation);
    setSubmissionState({ status: 'idle', message: '' });
    setCaptchaError('');

    if (Object.keys(validation).length > 0) return;

    if (!WEB3FORMS_ACCESS_KEY || !HCAPTCHA_SITE_KEY) {
      setSubmissionState({
        status: 'error',
        message: t.contact.submission.misconfigured,
      });
      return;
    }

    if (!captchaToken) {
      setCaptchaError(t.contact.errors.captchaRequired);
      return;
    }

    setSubmissionState({ status: 'submitting', message: '' });

    const formPayload = new FormData();
    formPayload.set('access_key', WEB3FORMS_ACCESS_KEY);
    formPayload.set('from_name', formData.name.trim());
    formPayload.set('email', formData.email.trim());
    formPayload.set('topic', formData.topic || '');
    formPayload.set('message', formData.message.trim());
    formPayload.set('subject', `${submissionSubject} ${formData.topic || ''}`.trim());
    formPayload.set('h-captcha-response', captchaToken);

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        body: formPayload,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setSubmissionState({
          status: 'error',
          message: data.message || t.contact.submission.error,
        });

        captchaRef.current?.resetCaptcha();
        setCaptchaToken('');
        return;
      }

      setSubmissionState({
        status: 'success',
        message: t.contact.submission.success,
      });

      setFormData({
        name: '',
        email: '',
        topic: translations?.contact?.options?.[0] || '',
        message: '',
      });

      setTouchedFields({});
      setFormErrors({});
      setCaptchaToken('');
      captchaRef.current?.resetCaptcha();
    } catch (error) {
      console.error(error);
      setSubmissionState({
        status: 'error',
        message: t.contact.submission.error,
      });

      captchaRef.current?.resetCaptcha();
      setCaptchaToken('');
    }
  };

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeLightbox();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        (isRTL ? nextImage : prevImage)();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        (isRTL ? prevImage : nextImage)();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen, isRTL]);

  const toggleLang = () => {
    if (lang === 'en') setLang('ru');
    else if (lang === 'ru') setLang('he');
    else setLang('en');
  };

  if (!translations && translationsLoading) {
    return (
      <div className="min-h-screen bg-[#12100E] text-[#E7E5E4] flex items-center justify-center">
        <p className="text-sm text-[#C5A059]">Loading translations...</p>
      </div>
    );
  }

  if (!translations) {
    return (
      <div className="min-h-screen bg-[#12100E] text-[#E7E5E4] flex items-center justify-center">
        <p className="text-sm text-red-200">Unable to load translations. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <div className={`bg-[#12100E] text-[#E7E5E4] font-sans selection:bg-[#C5A059] selection:text-black min-h-screen ${isRTL ? 'font-hebrew-sans' : ''}`}>
      {translationsError && (
        <div className="bg-red-900/60 text-red-100 text-center text-sm py-3 px-4">
          Using fallback translations. {translationsError}
        </div>
      )}

      <div
        className="fixed inset-0 pointer-events-none z-[60] opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Lato', sans-serif; }
        :lang(he) .font-serif { font-family: 'Frank Ruhl Libre', serif; }
        :lang(he) .font-sans { font-family: 'Heebo', sans-serif; }
      `}</style>

      <Navigation
        t={t}
        lang={lang}
        toggleLang={toggleLang}
        scrolled={scrolled}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      <Hero t={t} isRTL={isRTL} />

      <Gallery
        t={t}
        artworksLoading={artworksLoading}
        artworksError={artworksError}
        filteredArtworks={filteredArtworks}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        openLightbox={openLightbox}
        resolveImageSrc={resolveImageSrc}
      />

      <About t={t} />

      <Contact
        t={t}
        isRTL={isRTL}
        formData={formData}
        formErrors={formErrors}
        handleInputChange={handleInputChange}
        handleBlur={handleBlur}
        handleSubmit={handleSubmit}
        submissionState={submissionState}
        captchaRef={captchaRef}
        HCAPTCHA_SITE_KEY={HCAPTCHA_SITE_KEY}
        captchaToken={captchaToken}
        setCaptchaToken={setCaptchaToken}
        captchaError={captchaError}
        setCaptchaError={setCaptchaError}
      />

      <footer className="bg-[#12100E] py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <p className="font-serif italic text-xl text-[#57534E] mb-2">{t.artist.name}</p>
          <p className="text-[#44403C] text-[10px] uppercase tracking-[0.2em]">{t.footer.copyright}</p>
        </div>
      </footer>

      <Lightbox
        lightboxOpen={lightboxOpen}
        filteredArtworks={filteredArtworks}
        currentImageIndex={currentImageIndex}
        closeLightbox={closeLightbox}
        nextImage={nextImage}
        prevImage={prevImage}
        isRTL={isRTL}
        closeButtonRef={closeButtonRef}
      />
    </div>
  );
}
