import { useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import Layout from '../../components/Layout';
import DataState from '../../components/DataState';
import { requireAuth } from '../../lib/auth';

interface Item { id: number; title: string }

export default function Pages() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setItems([{ id: 1, title: 'Home' }]);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <h1 className="mb-4 text-2xl font-bold">Pages</h1>
      <DataState loading={loading} items={items} error={null}>
        <ul>
          {items.map((p) => (
            <li key={p.id} className="flex gap-2">
              <Link href={`/pages/${p.id}`} className="text-blue-600 hover:underline">
                {p.title}
              </Link>
              <Link href="/builder" className="text-sm text-gray-600 hover:underline">
                Open in Builder
              </Link>
            </li>
          ))}
        </ul>
      </DataState>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = (ctx) =>
  requireAuth(ctx, async () => ({ props: {} }));

