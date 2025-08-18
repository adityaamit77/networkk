import { ChangeEvent, useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import Layout from '../components/Layout';
import DataState from '../components/DataState';
import { requireAuth } from '../lib/auth';

interface MediaItem {
  id: number;
  title: string;
  url: string;
}

export default function Media() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [filename, setFilename] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState('');
  const [caption, setCaption] = useState('');
  const [credit, setCredit] = useState('');
  const [license, setLicense] = useState('');
  const [focal, setFocal] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setItems([{ id: 1, title: 'logo.png', url: '/logo.png' }]);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (title) {
      const ext = file ? file.name.split('.').pop() : 'png';
      const slug = title.toLowerCase().replace(/\s+/g, '-');
      setFilename(`${slug}.${ext}`);
    }
  }, [title, file]);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const convert = (src: File, type: string) =>
    new Promise<string>((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = () => {
        img.src = reader.result as string;
      };
      reader.readAsDataURL(src);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL(type));
        } else {
          resolve('');
        }
      };
    });

  const upload = async () => {
    if (!file || !alt) {
      alert('File and alt text are required');
      return;
    }
    await Promise.all([convert(file, 'image/webp'), convert(file, 'image/avif')]);
    setItems((prev) => [
      ...prev,
      { id: prev.length + 1, title: filename || file.name, url: URL.createObjectURL(file) }
    ]);
    setTitle('');
    setFilename('');
    setFile(null);
    setAlt('');
    setCaption('');
    setCredit('');
    setLicense('');
  };

  return (
    <Layout>
      <h1 className="mb-4 text-2xl font-bold">Media Library</h1>
      <div className="mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            upload();
          }}
          className="space-y-2"
        >
          <input
            className="block w-full rounded border px-2 py-1"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="block w-full rounded border px-2 py-1"
            placeholder="Filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
          />
          <input type="file" accept="image/*" onChange={handleFile} />
          <input
            className="block w-full rounded border px-2 py-1"
            placeholder="Alt text"
            required
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
          />
          <input
            className="block w-full rounded border px-2 py-1"
            placeholder="Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <input
            className="block w-full rounded border px-2 py-1"
            placeholder="Credit"
            value={credit}
            onChange={(e) => setCredit(e.target.value)}
          />
          <input
            className="block w-full rounded border px-2 py-1"
            placeholder="License"
            value={license}
            onChange={(e) => setLicense(e.target.value)}
          />
          <div>
            <label className="mr-2 text-sm">Focal X%</label>
            <input
              type="number"
              min={0}
              max={100}
              value={focal.x}
              onChange={(e) => setFocal({ ...focal, x: Number(e.target.value) })}
              className="w-20 rounded border px-2 py-1"
            />
            <label className="mx-2 text-sm">Y%</label>
            <input
              type="number"
              min={0}
              max={100}
              value={focal.y}
              onChange={(e) => setFocal({ ...focal, y: Number(e.target.value) })}
              className="w-20 rounded border px-2 py-1"
            />
          </div>
          <button type="submit" className="rounded bg-blue-600 px-3 py-1 text-white">
            Upload
          </button>
        </form>
      </div>
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

