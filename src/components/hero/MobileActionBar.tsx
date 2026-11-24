import { MessageCircle, Phone } from 'lucide-react';
import { config } from '../../config';
import { site } from '../../content/site';

const WA_TEXT = 'Hi Sharda Developers, I would like to know more about your projects.';

/**
 * Phones (< 768px): Call · WhatsApp · Book visit, fixed to the bottom, safe-area aware.
 * Tablets and desktop use the header buttons instead.
 */
export function MobileActionBar({ bookHref }: { bookHref: string }) {
  const cell =
    'flex min-h-[44px] flex-col items-center justify-center gap-1 text-[12px] font-bold leading-none';
  return (
    <nav
      aria-label="Quick actions"
      data-section="mobile-bar"
      className="fixed inset-x-0 bottom-0 z-40 grid h-[calc(68px+env(safe-area-inset-bottom))] grid-cols-3 border-t border-line-soft bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(20,38,80,0.06)] md:hidden"
    >
      <a href={config.phone.href} className={`${cell} text-navy-900`}>
        <Phone aria-hidden className="h-[18px] w-[18px]" strokeWidth={2} />
        {site.nav.call}
      </a>
      <a
        href={config.whatsapp.href(WA_TEXT)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${cell} border-x border-line-soft text-whatsapp`}
      >
        <MessageCircle aria-hidden className="h-[18px] w-[18px]" strokeWidth={2} />
        {site.nav.whatsapp}
      </a>
      <div className="flex items-stretch p-2.5">
        <a
          href={bookHref}
          className="flex w-full items-center justify-center rounded-full bg-navy-900 font-display text-[13px] font-extrabold text-white"
        >
          {site.home.hero.bookShort}
        </a>
      </div>
    </nav>
  );
}
