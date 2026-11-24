import { MessageCircle } from 'lucide-react';
import { config } from '../../config';

const WA_TEXT = 'Hi Sharda Developers, I would like to know more about your projects.';

/** Floating WhatsApp button (desktop/tablet; the mobile bar replaces it on phones). */
export function WhatsAppFab() {
  return (
    <a
      href={config.whatsapp.href(WA_TEXT)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Sharda Developers on WhatsApp"
      data-track="fab"
      className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 place-items-center rounded-full bg-green-700 text-white shadow-lift transition duration-200 ease-brand hover:-translate-y-1 lg:grid"
    >
      <MessageCircle aria-hidden className="h-6 w-6" strokeWidth={1.75} />
    </a>
  );
}
