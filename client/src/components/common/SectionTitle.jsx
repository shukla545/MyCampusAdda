export default function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && <p className="text-sm font-bold uppercase tracking-wide text-brand">{eyebrow}</p>}
      <h2 className="mt-2 text-3xl font-extrabold text-slate-950 sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-base text-slate-500">{subtitle}</p>}
    </div>
  );
}
