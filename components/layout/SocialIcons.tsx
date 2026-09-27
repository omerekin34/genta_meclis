export function InstagramIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.04 3.5A8.2 8.2 0 0 0 4.7 15.2L3.6 19.4l4.3-1.1A8.2 8.2 0 1 0 12.04 3.5Zm4.76 11.62c-.2.56-1.16 1.07-1.62 1.14-.42.06-.96.09-1.55-.1-.36-.11-.82-.26-1.41-.51-2.48-1.07-4.1-3.57-4.22-3.74-.12-.17-1.02-1.36-1.02-2.59 0-1.23.64-1.84.87-2.09.23-.25.5-.31.67-.31h.48c.15 0 .36-.06.56.43.2.5.69 1.72.75 1.84.06.13.1.27.02.44-.08.17-.12.27-.24.42-.12.14-.25.32-.36.43-.12.12-.24.24-.1.47.14.23.62 1.02 1.33 1.65.91.81 1.68 1.07 1.92 1.19.24.12.38.1.52-.06.14-.17.6-.7.76-.94.16-.23.32-.19.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.14 1.14Z"
      />
    </svg>
  );
}

export function MailIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
