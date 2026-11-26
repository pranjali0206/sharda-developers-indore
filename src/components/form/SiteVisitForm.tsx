import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod/mini';
import { AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { config } from '../../config';
import { site } from '../../content/site';
import { projects } from '../../content/projects';
import { track } from '../../lib/analytics';
import { submitLead, type ProjectChoice } from '../../lib/lead';
import { cx } from '../../lib/cx';

const e = site.form.errors;

/** Local date as YYYY-MM-DD (the format <input type="date"> uses). */
function todayISO() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// zod/mini: same validation, tree-shakable (keeps the first-load JS budget).
const schema = z.object({
  name: z.string().check(z.trim(), z.minLength(2, e.nameMin), z.maxLength(60, e.nameMax)),
  mobile: z.string().check(z.regex(/^[6-9]\d{9}$/, e.mobile)),
  project: z.enum(['paradise', 'greens', 'both']),
  visitDate: z.optional(z.string().check(z.refine((v) => !v || v >= todayISO(), e.date))),
  consent: z.boolean().check(z.refine((v) => v, e.consent)),
});

type FormValues = z.infer<typeof schema>;

const CHOICES: { value: ProjectChoice; label: string }[] = [
  { value: 'paradise', label: projects.paradise.name },
  { value: 'greens', label: projects.greens.name },
  { value: 'both', label: site.form.both },
];

const isChoice = (v: string | null): v is ProjectChoice =>
  v === 'paradise' || v === 'greens' || v === 'both';

export function SiteVisitForm({ defaultProject = 'both' }: { defaultProject?: ProjectChoice }) {
  const f = site.form;
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;
  const [sendError, setSendError] = useState(false);
  const [minDate, setMinDate] = useState<string | undefined>(undefined);
  const started = useRef(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      mobile: '',
      project: defaultProject,
      visitDate: '',
      consent: false,
    },
  });

  // Client-only values (avoid hydration mismatches): today's date and ?project= override.
  useEffect(() => {
    setMinDate(todayISO());
    const q = new URLSearchParams(window.location.search).get('project');
    if (isChoice(q)) setValue('project', q);
  }, [setValue]);

  const onFocus = () => {
    if (started.current) return;
    started.current = true;
    track('form_start', { form: 'site_visit' });
  };

  const onSubmit = async (v: FormValues) => {
    setSendError(false);

    // Build the WhatsApp message with every detail the visitor entered.
    const label = CHOICES.find((c) => c.value === v.project)?.label ?? v.project;
    const message = [
      'New site visit request — Sharda Developers',
      '',
      `Name: ${v.name.trim()}`,
      `Mobile: +91${v.mobile}`,
      `Interested in: ${label}`,
      `Preferred date: ${v.visitDate || 'Not specified'}`,
    ].join('\n');

    // Best-effort: also record the lead to the endpoint (e.g. a Google Sheet) if configured.
    try {
      await submitLead({
        name: v.name.trim(),
        mobile: v.mobile,
        project: v.project,
        visitDate: v.visitDate || undefined,
      });
    } catch (err) {
      console.error(err);
    }

    // Redirect this tab straight to WhatsApp (+91 91792 00110) with the details filled in.
    window.location.href = config.whatsapp.href(message);
  };

  const mobileReg = register('mobile');
  const fieldCls = (bad: boolean) =>
    cx(
      'block min-h-[52px] w-full rounded-input border bg-white px-4 text-[16px] text-navy-900 placeholder:text-ink-500 transition-colors',
      'focus:border-navy-700 focus:outline-none focus:ring-4 focus:ring-navy-700/15',
      bad ? 'border-red-error' : 'border-line',
    );
  const errText = 'mt-1.5 flex items-start gap-1.5 text-[13px] font-medium text-red-error';

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      onFocus={onFocus}
      aria-labelledby={id('title')}
      className="rounded-[24px] bg-white p-6 text-ink-600 shadow-deep sm:p-8"
    >
      <h3 id={id('title')} className="font-display text-2xl font-extrabold text-navy-900">
        {f.title}
      </h3>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor={id('name')} className="mb-1.5 block text-sm font-semibold text-navy-900">
            {f.name}
          </label>
          <input
            id={id('name')}
            type="text"
            autoComplete="name"
            placeholder={f.namePh}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? id('name-err') : undefined}
            className={fieldCls(Boolean(errors.name))}
            {...register('name')}
          />
          {errors.name && (
            <p id={id('name-err')} className={errText}>
              <AlertCircle aria-hidden className="mt-px h-4 w-4 shrink-0" strokeWidth={1.75} />
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={id('mobile')}
            className="mb-1.5 block text-sm font-semibold text-navy-900"
          >
            {f.mobile}
          </label>
          <div className="relative">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center border-r border-line pl-4 pr-3 text-[16px] font-semibold text-navy-900"
            >
              +91
            </span>
            <input
              id={id('mobile')}
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder={f.mobilePh}
              aria-invalid={Boolean(errors.mobile)}
              aria-describedby={
                cx(id('mobile-hint'), errors.mobile && id('mobile-err')) || undefined
              }
              className={cx(fieldCls(Boolean(errors.mobile)), 'pl-[70px] tracking-wide')}
              {...mobileReg}
              onChange={(ev) => {
                let digits = ev.target.value.replace(/\D/g, '');
                if (digits.length > 10 && digits.startsWith('91')) digits = digits.slice(2);
                if (digits.length > 10 && digits.startsWith('0')) digits = digits.slice(1);
                ev.target.value = digits.slice(0, 10);
                void mobileReg.onChange(ev);
              }}
            />
          </div>
          <span id={id('mobile-hint')} className="sr-only">
            Indian mobile number, 10 digits, country code +91 is added for you
          </span>
          {errors.mobile && (
            <p id={id('mobile-err')} className={errText}>
              <AlertCircle aria-hidden className="mt-px h-4 w-4 shrink-0" strokeWidth={1.75} />
              {errors.mobile.message}
            </p>
          )}
        </div>

        <fieldset>
          <legend className="mb-2 block text-sm font-semibold text-navy-900">{f.interest}</legend>
          <div className="grid grid-cols-3 gap-1 rounded-full bg-bg p-1 ring-1 ring-line">
            {CHOICES.map((c) => (
              <label
                key={c.value}
                className={cx(
                  'relative flex min-h-[44px] cursor-pointer items-center justify-center rounded-full px-2 text-center text-[13px] font-semibold leading-tight text-ink-600 transition duration-200 sm:text-sm',
                  'has-[:checked]:bg-navy-700 has-[:checked]:text-white has-[:checked]:shadow-soft',
                  'has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-navy-700/30',
                )}
              >
                <input type="radio" value={c.value} className="sr-only" {...register('project')} />
                {c.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor={id('date')} className="mb-1.5 block text-sm font-semibold text-navy-900">
            {f.date} <span className="font-normal text-ink-500">{f.optional}</span>
          </label>
          <input
            id={id('date')}
            type="date"
            min={minDate}
            aria-invalid={Boolean(errors.visitDate)}
            aria-describedby={errors.visitDate ? id('date-err') : undefined}
            className={fieldCls(Boolean(errors.visitDate))}
            {...register('visitDate')}
          />
          {errors.visitDate && (
            <p id={id('date-err')} className={errText}>
              <AlertCircle aria-hidden className="mt-px h-4 w-4 shrink-0" strokeWidth={1.75} />
              {errors.visitDate.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-start gap-3">
            <input
              id={id('consent')}
              type="checkbox"
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? id('consent-err') : undefined}
              className="mt-0.5 h-6 w-6 shrink-0 cursor-pointer rounded-md border-line accent-navy-700"
              {...register('consent')}
            />
            <label htmlFor={id('consent')} className="text-[13px] leading-relaxed text-ink-600">
              {f.consent}{' '}
              <Link
                to="/privacy-policy"
                className="font-semibold text-navy-700 underline underline-offset-2"
              >
                {f.privacy}
              </Link>
              .
            </label>
          </div>
          {errors.consent && (
            <p id={id('consent-err')} className={errText}>
              <AlertCircle aria-hidden className="mt-px h-4 w-4 shrink-0" strokeWidth={1.75} />
              {errors.consent.message}
            </p>
          )}
        </div>
      </div>

      {sendError && (
        <div role="alert" className="mt-5 rounded-input bg-gold-200/60 p-4 text-sm text-navy-900">
          {e.send}{' '}
          <a href={config.phone.href} className="font-bold underline" data-track="form-error">
            {config.phone.display}
          </a>{' '}
          or{' '}
          <a
            href={config.whatsapp.href('Hi, I would like to book a site visit.')}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline"
          >
            WhatsApp us
          </a>
          .
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="group mt-6 inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-navy-700 px-6 text-base font-semibold text-white shadow-soft transition duration-200 ease-brand hover:-translate-y-0.5 hover:bg-navy-900 hover:shadow-card disabled:pointer-events-none disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 aria-hidden className="h-5 w-5 animate-spin" strokeWidth={1.75} />
            {f.sending}
          </>
        ) : (
          <>
            {f.submit}
            <ArrowRight
              aria-hidden
              className="h-5 w-5 transition-transform group-hover:translate-x-1"
              strokeWidth={1.75}
            />
          </>
        )}
      </button>
      <p className="mt-3 text-center text-[13px] text-ink-500" aria-live="polite">
        {isSubmitting ? f.sending : f.note}
      </p>
    </form>
  );
}
