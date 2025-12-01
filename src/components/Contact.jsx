import React from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Calculator, Instagram, Palette } from 'lucide-react';

export default function Contact({
  t,
  isRTL,
  formData,
  formErrors,
  handleInputChange,
  handleBlur,
  handleSubmit,
  submissionState,
  captchaRef,
  HCAPTCHA_SITE_KEY,
  captchaToken,
  setCaptchaToken,
  captchaError,
  setCaptchaError
}) {
  return (
    <section id="contact" className="py-24 bg-[#12100E] border-t border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl mb-2 italic text-[#E7E5E4]">{t.contact.title}</h2>
          <p className="text-[#A8A29E] font-light text-sm leading-relaxed">{t.contact.desc}</p>
        </div>

        <div className={`grid gap-8 lg:grid-cols-2 items-start mt-10 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 shadow-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-[#1A1714] text-[11px] uppercase tracking-[0.25em] text-[#C5A059]">
              <Palette size={14} />
              <span className="font-semibold">{t.nav.contact}</span>
            </div>
            <p className="text-[#E7E5E4] text-base leading-relaxed font-light">{t.contact.desc}</p>
            <div className="flex flex-wrap gap-2">
              {t.contact.options.map((opt) => (
                <span
                  key={opt}
                  className="px-3 py-2 rounded-lg border border-white/10 bg-[#1A1714] text-xs text-[#C5A059] uppercase tracking-[0.15em]"
                >
                  {opt}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-[#78716C]">
              <Calculator size={14} />
              <span className="uppercase tracking-[0.2em]">{t.gallery.title}</span>
            </div>
          </div>

          <form
            className="rounded-2xl border border-white/10 bg-[#0F0D0B]/70 p-8 shadow-2xl space-y-5"
            noValidate
            onSubmit={handleSubmit}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-[#78716C]" htmlFor="contact-name">
                  {t.contact.form.name}
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  onBlur={handleBlur('name')}
                  aria-invalid={Boolean(formErrors.name)}
                  aria-describedby={formErrors.name ? 'contact-name-error' : undefined}
                  className="w-full rounded-md bg-[#181512] border border-white/10 px-4 py-3 text-sm text-[#E7E5E4] placeholder-[#44403C] focus:border-[#C5A059] focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                  placeholder={t.contact.form.name}
                />
                {formErrors.name && (
                  <p id="contact-name-error" role="alert" aria-live="polite" className="text-xs text-red-300">
                    {formErrors.name}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-[#78716C]" htmlFor="contact-email">
                  {t.contact.form.email}
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  onBlur={handleBlur('email')}
                  aria-invalid={Boolean(formErrors.email)}
                  aria-describedby={formErrors.email ? 'contact-email-error' : undefined}
                  className="w-full rounded-md bg-[#181512] border border-white/10 px-4 py-3 text-sm text-[#E7E5E4] placeholder-[#44403C] focus:border-[#C5A059] focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                  placeholder={t.contact.form.email}
                />
                {formErrors.email && (
                  <p id="contact-email-error" role="alert" aria-live="polite" className="text-xs text-red-300">
                    {formErrors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-[#78716C]" htmlFor="contact-topic">
                {t.contact.form.topic || t.contact.form.subject || t.gallery.title}
              </label>
              <select
                id="contact-topic"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange('topic')}
                onBlur={handleBlur('topic')}
                className="w-full rounded-md bg-[#181512] border border-white/10 px-4 py-3 text-sm text-[#E7E5E4] focus:border-[#C5A059] focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
              >
                {t.contact.options.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-[#78716C]" htmlFor="contact-message">
                {t.contact.form.message}
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleInputChange('message')}
                onBlur={handleBlur('message')}
                aria-invalid={Boolean(formErrors.message)}
                aria-describedby={formErrors.message ? 'contact-message-error' : undefined}
                className="w-full rounded-md bg-[#181512] border border-white/10 px-4 py-3 text-sm text-[#E7E5E4] placeholder-[#44403C] focus:border-[#C5A059] focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                placeholder={t.contact.form.message}
              ></textarea>
              {formErrors.message && (
                <p id="contact-message-error" role="alert" aria-live="polite" className="text-xs text-red-300">
                  {formErrors.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-[#78716C]">{t.contact.verification.label}</p>
                <span className="text-[10px] text-[#8A8178]">{t.contact.verification.helper}</span>
              </div>
              <div className="rounded-md border border-white/10 bg-[#181512] p-4">
                {HCAPTCHA_SITE_KEY ? (
                  <div className="flex justify-center">
                    <HCaptcha
                      ref={captchaRef}
                      sitekey={HCAPTCHA_SITE_KEY}
                      theme="dark"
                      onVerify={(token) => {
                        setCaptchaToken(token);
                        setCaptchaError('');
                      }}
                      onExpire={() => {
                        setCaptchaToken('');
                        setCaptchaError(t.contact.errors.captchaRequired);
                      }}
                      onError={() => {
                        setCaptchaToken('');
                        setCaptchaError(t.contact.submission.error);
                      }}
                    />
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-red-300" role="alert">
                    {t.contact.submission.misconfigured}
                  </p>
                )}
                {captchaError && (
                  <p className="mt-3 text-xs text-red-300" role="alert">
                    {captchaError}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4 flex-wrap">
              <button
                type="submit"
                disabled={submissionState.status === 'submitting'}
                className="px-8 py-3 bg-[#E7E5E4] text-[#12100E] font-semibold tracking-[0.2em] uppercase hover:bg-[#C5A059] hover:text-white transition-colors duration-300 text-[11px] rounded-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submissionState.status === 'submitting' ? '...' : t.contact.form.submit}
              </button>
              {submissionState.message && (
                <p role="status" aria-live="polite" className={`text-xs ${submissionState.status === 'success' ? 'text-green-300' : 'text-red-300'}`}>
                  {submissionState.message}
                </p>
              )}
            </div>
          </form>
        </div>

        <div className="mt-16 flex justify-center text-[#57534E]">
          <Instagram className="w-5 h-5 hover:text-[#C5A059] transition-colors cursor-pointer" />
        </div>
      </div>
    </section>
  );
}
