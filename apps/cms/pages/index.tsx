"use client";

import { useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import Layout from '../components/Layout';
import DataState from '../components/DataState';
import { requireAuth } from '../lib/auth';

interface Stat { id: number; label: string; value: string; }

export default function Dashboard() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate fetch
      setStats([
        { id: 1, label: 'Pages', value: '12' },
        { id: 2, label: 'Insights', value: '5' }
      ]);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      <DataState loading={loading} error={error} items={stats}>
        <ul className="grid gap-4 md:grid-cols-2">
          {stats.map((s) => (
            <li key={s.id} className="rounded border p-4">
              <span className="block text-sm text-gray-500">{s.label}</span>
              <span className="text-xl font-semibold">{s.value}</span>
            </li>
          ))}
        </ul>
      </DataState>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = (ctx) =>
  requireAuth(ctx, async () => ({ props: {} }));

