import { useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import Layout from '../components/Layout';
import DataState from '../components/DataState';
import { requireAuth } from '../lib/auth';

interface Industry { id: number; title: string }

export default function Industries() {
  const [items, setItems] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setItems([{ id: 1, title: 'FinTech' }]);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <h1 className="mb-4 text-2xl font-bold">Industries</h1>
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

