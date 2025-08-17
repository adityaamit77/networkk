import type { GetServerSideProps } from 'next';
import Layout from '../components/Layout';
import { requireAuth } from '../lib/auth';
import dynamic from 'next/dynamic';

const VisualBuilder = dynamic(() => import('../components/builder/VisualBuilder'), { ssr: false });

export default function BuilderPage() {
  return (
    <Layout>
      <h1 className="mb-4 text-2xl font-bold">Visual Builder</h1>
      <VisualBuilder />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = (ctx) =>
  requireAuth(ctx, async () => ({ props: {} }));

