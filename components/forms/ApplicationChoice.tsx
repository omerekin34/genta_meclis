import { applicationForms } from "@/data/site";

export function ApplicationChoice() {
  return (
    <div className="grid gap-5 md:grid-cols-2 md:gap-6">
      {applicationForms.map((form, index) => {
        const brand = index === 0;
        return (
          <a
            key={form.id}
            href={form.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${form.title} — yeni sekmede açılır`}
            className={`group relative flex min-h-[20rem] flex-col justify-between overflow-hidden p-8 shadow-lg transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_28px_48px_-16px_rgba(108,17,16,0.45)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:min-h-[22rem] sm:p-10 ${
              brand
                ? "bg-brand text-white hover:bg-brand-deep"
                : "border border-brand/15 bg-paper text-brand hover:border-brand/40"
            }`}
          >
            <span
              className={`absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 motion-reduce:transition-none ${
                brand ? "bg-white/80" : "bg-brand"
              }`}
              aria-hidden="true"
            />
            <div className="flex items-start justify-between gap-4">
              <p
                className={`font-display text-[11px] font-medium tracking-[0.28em] uppercase ${
                  brand ? "text-white/55" : "text-brand/50"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </p>
              <BrandMark className={brand ? "h-11 w-12 text-white/85" : "h-11 w-12 text-brand/70"} />
            </div>
            <div className="mt-10">
              {brand ? <PersonIcon /> : <GroupIcon />}
              <h2 className="mt-6 font-display text-3xl leading-tight font-semibold sm:text-4xl">{form.title}</h2>
              <p className={`mt-4 max-w-sm text-sm leading-7 ${brand ? "text-white/78" : "text-ink/70"}`}>
                {form.text}
              </p>
            </div>
            <p className="mt-10 inline-flex items-center gap-2.5 font-display text-[12px] font-semibold tracking-[0.18em] uppercase">
              Formu aç
              <ExternalLinkIcon
                className={`size-4 transition-transform duration-700 group-hover:translate-x-1 ${
                  brand ? "text-white" : "text-brand"
                }`}
              />
            </p>
          </a>
        );
      })}
    </div>
  );
}

function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        maskImage: "url(/brand/mark.png)",
        WebkitMaskImage: "url(/brand/mark.png)",
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
      }}
    />
  );
}

function ExternalLinkIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 ${className || "size-5"}`} aria-hidden="true">
      <path
        d="M14 5h5v5M19 5l-8 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 13.5V18a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 18V7A1.5 1.5 0 0 1 6.5 5.5H11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-11 text-white/85" aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5.8 19.2c.7-3.4 3.2-5.2 6.2-5.2s5.5 1.8 6.2 5.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GroupIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-11 text-brand/80" aria-hidden="true">
      <circle cx="9" cy="8.2" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16.2" cy="9" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4.4 18.8c.6-2.8 2.6-4.3 5-4.3 2.3 0 4.2 1.4 4.9 4.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14.4 14.8c1.8-.2 3.6.9 4.3 3.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
