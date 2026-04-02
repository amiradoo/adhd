"use client";

import { FormEvent, useMemo, useState } from "react";

import { useLocale } from "@/components/providers/locale-provider";
import { GlassCard } from "@/components/site/glass-card";
import { PremiumButton } from "@/components/site/premium-button";
import { SectionShell } from "@/components/site/section-shell";
import type { ContactFormErrors, ContactFormValues, MailtoPayload } from "@/lib/site-types";

function buildMailto(payload: MailtoPayload): string {
  const body = [
    `Naam / Name: ${payload.name}`,
    `E-mail / Email: ${payload.email}`,
    "",
    payload.message,
  ].join("\n");

  return `mailto:hello@adhdgirlsclub.com?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(body)}`;
}

export function ContactPage() {
  const { copy } = useLocale();

  const [values, setValues] = useState<ContactFormValues>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const emailPattern = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

  const validate = (): ContactFormErrors => {
    const nextErrors: ContactFormErrors = {};

    if (values.name.trim().length < 2) {
      nextErrors.name = copy.contact.form.validationName;
    }

    if (emailPattern.test(values.email.trim()) === false) {
      nextErrors.email = copy.contact.form.validationEmail;
    }

    if (values.message.trim().length < 20) {
      nextErrors.message = copy.contact.form.validationMessage;
    }

    return nextErrors;
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    const hasErrors = Object.keys(nextErrors).length > 0;
    if (hasErrors) {
      setSubmitted(false);
      return;
    }

    const mailto = buildMailto({
      ...values,
      subject: `${copy.contact.mailSubject} - ${values.name.trim()}`,
    });

    setSubmitted(true);
    window.location.href = mailto;
  };

  return (
    <SectionShell className="pt-32 md:pt-36" id="contact-form">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <GlassCard className="p-7 md:p-10">
          <p className="section-eyebrow">{copy.contact.hero.eyebrow}</p>
          <h1 className="section-title mt-2">{copy.contact.hero.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-700">{copy.contact.hero.subtitle}</p>
          <p className="mt-6 text-sm text-stone-700">{copy.contact.form.intro}</p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
            <label className="field-block">
              <span>{copy.contact.form.name}</span>
              <input
                type="text"
                value={values.name}
                onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
                className="field-input"
                autoComplete="name"
              />
              {errors.name ? <small className="field-error">{errors.name}</small> : null}
            </label>

            <label className="field-block">
              <span>{copy.contact.form.email}</span>
              <input
                type="email"
                value={values.email}
                onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
                className="field-input"
                autoComplete="email"
              />
              {errors.email ? <small className="field-error">{errors.email}</small> : null}
            </label>

            <label className="field-block">
              <span>{copy.contact.form.message}</span>
              <textarea
                value={values.message}
                onChange={(event) => setValues((prev) => ({ ...prev, message: event.target.value }))}
                className="field-input min-h-32 resize-y"
              />
              {errors.message ? <small className="field-error">{errors.message}</small> : null}
            </label>

            <button type="submit" className="premium-btn premium-btn-primary w-full justify-center">
              {copy.contact.form.submit}
            </button>

            {submitted ? <p className="field-success">{copy.contact.form.success}</p> : null}
          </form>
        </GlassCard>

        <GlassCard className="p-7 md:p-10">
          <h2 className="text-2xl font-semibold text-stone-900">{copy.contact.supportTitle}</h2>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-stone-700 md:text-base">
            {copy.contact.supportItems.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 block h-1.5 w-1.5 rounded-full bg-amber-700/70" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <PremiumButton href={copy.contact.hero.primaryCta.href} className="mt-7 inline-flex" variant="ghost">
            {copy.contact.hero.primaryCta.label}
          </PremiumButton>
        </GlassCard>
      </div>
    </SectionShell>
  );
}
