type Props = {
  title: string;
  text: string;
  deadlineLabel: string;
};

export function ApplicationClosed({ title, text, deadlineLabel }: Props) {
  return (
    <div className="border border-brand/15 bg-paper p-8 text-center sm:p-10">
      <h2 className="font-display text-3xl font-semibold text-brand sm:text-4xl">{title}</h2>
      <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-ink/70">{text}</p>
      <p className="mt-8 font-display text-[11px] font-medium tracking-[0.28em] uppercase text-brand/50">
        Son tarih: {deadlineLabel}
      </p>
    </div>
  );
}
