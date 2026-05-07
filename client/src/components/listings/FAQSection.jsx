export default function FAQSection({ faqs = [] }) {
  if (!faqs.length) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-extrabold text-slate-950">FAQs</h2>
      {faqs.map((faq, index) => (
        <details key={`${faq.question}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-5">
          <summary className="cursor-pointer font-bold text-slate-900">{faq.question}</summary>
          <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
        </details>
      ))}
    </section>
  );
}
