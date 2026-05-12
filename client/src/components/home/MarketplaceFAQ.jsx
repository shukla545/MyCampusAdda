const faqs = [
  {
    question: 'What can TCET students sell on CampusNest?',
    answer: 'Students can list used books, notes, journals, lab files, question papers, calculators, roller scales, project material and other study-related items.'
  },
  {
    question: 'How does CampusNest keep marketplace listings safer?',
    answer: 'Seller listings stay hidden until admin approval, and buyer contact access is kept behind login so product details can be viewed before sharing seller details.'
  },
  {
    question: 'What is the safe payment rule?',
    answer: 'Buyers should pay only after receiving and checking the product in person. CampusNest does not recommend advance payment to sellers.'
  }
];

export default function MarketplaceFAQ() {
  return (
    <section className="bg-white pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <h2 className="text-2xl font-black text-slate-950">Marketplace FAQ</h2>
          <div className="mt-4 grid gap-3">
            {faqs.map((item) => (
              <details key={item.question} className="rounded-xl border border-slate-200 bg-white p-4">
                <summary className="cursor-pointer text-sm font-extrabold text-slate-950">{item.question}</summary>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
