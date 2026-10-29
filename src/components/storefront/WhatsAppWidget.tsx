import { CONTACT } from '@/lib/contact'

export function WhatsAppWidget() {
  return <a className="guru-whatsapp" href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label={`Chat with Mr GrimeGuru on WhatsApp at ${CONTACT.phone}`}>
    <svg viewBox="0 0 32 32" width="30" height="30" fill="currentColor" aria-hidden="true"><path d="M16 .8A15 15 0 0 0 3 23.3L.9 31l7.9-2.1A15 15 0 1 0 16 .8Zm0 27.4a12.4 12.4 0 0 1-6.3-1.7l-.5-.3-4.7 1.3 1.3-4.6-.3-.5A12.4 12.4 0 1 1 16 28.2Zm6.8-9.3c-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2-.2.4-.9 1.2-1.1 1.4-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3-1.9-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.8l.6-.7.4-.6c.1-.2 0-.5-.1-.7l-1.1-2.7c-.3-.7-.6-.6-.8-.6H11c-.3 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.1s1.3 3.5 1.5 3.8c.2.2 2.6 4 6.3 5.6.9.4 1.6.6 2.1.8.9.3 1.7.3 2.4.2.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.7.2-1.8-.1-.2-.4-.3-.9-.5Z" /></svg>
    <span>Chat with us</span>
  </a>
}
