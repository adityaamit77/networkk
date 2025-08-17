import { useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import Layout from '../components/Layout';
import DataState from '../components/DataState';
import { requireAuth } from '../lib/auth';

interface Setting { id: number; key: string; value: string }

export default function Settings() {
  const [items, setItems] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setItems([{ id: 1, key: 'siteName', value: 'Networkk' }]);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <h1 className="mb-4 text-2xl font-bold">Settings</h1>
      <DataState loading={loading} items={items} error={null}>
        <dl>
          {items.map((p) => (
            <div key={p.id} className="mb-2">
              <dt className="font-medium">{p.key}</dt>
              <dd>{p.value}</dd>
            </div>
          ))}
        </dl>
      </DataState>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = (ctx) =>
  requireAuth(ctx, async () => ({ props: {} }));

