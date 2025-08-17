import { useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import Layout from '../components/Layout';
import DataState from '../components/DataState';
import { requireAuth } from '../lib/auth';

interface MediaItem { id: number; title: string }

export default function Media() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setItems([{ id: 1, title: 'logo.png' }]);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <h1 className="mb-4 text-2xl font-bold">Media Library</h1>
      <DataState loading={loading} items={items} error={null}>
        <ul>
          {items.map((p) => (
            <li key={p.id}>{p.title}</li>
          ))}
        </ul>
      </DataState>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = (ctx) =>
  requireAuth(ctx, async () => ({ props: {} }));

