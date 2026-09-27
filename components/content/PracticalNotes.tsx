import { getContent } from "@/lib/content";

export function PracticalNotes() {
  const notes = getContent().practicalNotes;
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <li
          key={note.title}
          className="group relative overflow-hidden border border-brand/12 bg-paper p-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-[0_22px_40px_-28px_rgba(108,17,16,0.7)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          <span
            className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 motion-reduce:transition-none"
            aria-hidden="true"
          />
          <p className="font-display text-[11px] tracking-[0.24em] text-brand/60 uppercase transition-colors duration-700 group-hover:text-brand">
            {note.title}
          </p>
          <p className="mt-3 leading-7 text-brand">{note.text}</p>
        </li>
      ))}
    </ul>
  );
}
