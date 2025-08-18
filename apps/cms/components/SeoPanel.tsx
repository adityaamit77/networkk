import { ChangeEvent } from 'react';

interface SeoValues {
  title: string;
  description: string;
}

interface Props {
  value: SeoValues;
  onChange: (value: SeoValues) => void;
}

function pixelWidth(str: string) {
  return Math.round(str.length * 7); // rough estimate
}

export default function SeoPanel({ value, onChange }: Props) {
  const handleTitle = (e: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, title: e.target.value });
  const handleDescription = (e: ChangeEvent<HTMLTextAreaElement>) =>
    onChange({ ...value, description: e.target.value });
  return (
    <div className="space-y-2 rounded border p-4">
      <h2 className="font-semibold">SEO</h2>
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          className="w-full rounded border px-2 py-1"
          value={value.title}
          onChange={handleTitle}
        />
        <p className="text-xs text-gray-500">
          {value.title.length} characters (~{pixelWidth(value.title)}px)
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          className="w-full rounded border px-2 py-1"
          value={value.description}
          onChange={handleDescription}
        />
        <p className="text-xs text-gray-500">
          {value.description.length} characters (~{pixelWidth(value.description)}px)
        </p>
      </div>
    </div>
  );
}
