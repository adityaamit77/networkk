import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import SeoPanel from '../../components/SeoPanel';
import LinkAssistant from '../../components/LinkAssistant';
import type { GetServerSideProps } from 'next';
import { requireAuth } from '../../lib/auth';

interface PageData {
  title: string;
  content: string;
  seo: { title: string; description: string; canonical: string };
}

export default function PageEditor() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PageData>({
    title: '',
    content: '',
    seo: { title: '', description: '', canonical: '' }
  });

  useEffect(() => {
    if (!id) return;
    fetch(`/api/pages/${id}`)
      .then((res) => res.json())
      .then((json) => {
        setData({
          title: json.title ?? '',
          content: json.blocks ? JSON.stringify(json.blocks, null, 2) : '',
          seo: {
            title: json.seo?.title ?? '',
            description: json.seo?.description ?? '',
            canonical: json.seo?.canonical ?? ''
          }
        });
        setLoading(false);
      });
  }, [id]);

  const save = async () => {
    await fetch(`/api/pages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: data.title,
        seo: data.seo,
        blocks: data.content
      })
    });
    alert('Saved');
  };

  if (loading) {
    return (
      <Layout>
        <p>Loading…</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="mb-4 text-2xl font-bold">Edit Page</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            className="w-full rounded border px-2 py-1"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Content</label>
          <textarea
            className="w-full rounded border px-2 py-1 min-h-[200px]"
            value={data.content}
            onChange={(e) => setData({ ...data, content: e.target.value })}
          />
        </div>
        <SeoPanel
          value={data.seo}
          onChange={(seo) => setData({ ...data, seo })}
        />
        <LinkAssistant content={data.content} />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={save}
            className="rounded bg-blue-600 px-3 py-1 text-white"
          >
            Save
          </button>
          <Link href="/builder" className="rounded bg-gray-200 px-3 py-1">
            Open in Builder
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = (ctx) =>
  requireAuth(ctx, async () => ({ props: {} }));
