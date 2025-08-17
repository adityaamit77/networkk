import { useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import Layout from '../components/Layout';
import DataState from '../components/DataState';
import { requireAuth } from '../lib/auth';

interface Case { id: number; title: string }

export default function CaseStudies() {
  const [items, setItems] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setItems([{ id: 1, title: 'Scaling Startups' }]);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <h1 className="mb-4 text-2xl font-bold">Case Studies</h1>
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

