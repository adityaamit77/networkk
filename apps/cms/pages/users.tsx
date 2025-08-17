import { useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import Layout from '../components/Layout';
import DataState from '../components/DataState';
import { requireAuth } from '../lib/auth';

interface User { id: number; email: string; role: string }

export default function Users() {
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setItems([{ id: 1, email: 'editor@example.com', role: 'editor' }]);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <h1 className="mb-4 text-2xl font-bold">Users & Roles</h1>
      <DataState loading={loading} items={items} error={null}>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1 text-left">Email</th>
              <th className="border px-2 py-1 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u.id}>
                <td className="border px-2 py-1">{u.email}</td>
                <td className="border px-2 py-1">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataState>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = (ctx) =>
  requireAuth(ctx, async () => ({ props: {} }));

