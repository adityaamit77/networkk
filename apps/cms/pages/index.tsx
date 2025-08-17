import { useEffect, useState } from 'react';

type Page = { id: number; title: string };

export default function Home() {
  const [pages, setPages] = useState<Page[]>([]);
  useEffect(() => {
    fetch('/api/pages')
      .then((res) => res.json())
      .then((data) => setPages(data.items ?? []));
  }, []);
  return (
    <main style={{ padding: 16 }}>
      <h1>CMS</h1>
      <ul>
        {pages.map((p) => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
    </main>
  );
}
