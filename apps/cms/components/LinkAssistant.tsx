interface Props {
  content: string;
}

const LINKS = [
  { keyword: 'Services', href: '/services' },
  { keyword: 'Insights', href: '/insights' },
  { keyword: 'Case Studies', href: '/case-studies' }
];

export default function LinkAssistant({ content }: Props) {
  const suggestions = LINKS.filter((l) => !content.includes(l.keyword));
  if (suggestions.length === 0) return null;
  return (
    <div className="rounded border p-4">
      <h2 className="mb-2 font-semibold">Link Assistant</h2>
      <ul className="list-disc pl-5 text-sm">
        {suggestions.map((s) => (
          <li key={s.href}>
            Consider linking to <a href={s.href}>{s.keyword}</a>.
          </li>
        ))}
      </ul>
    </div>
  );
}
