import { useCallback, useEffect, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { nanoid } from 'nanoid';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import GridLayout, { Layout as RGLLayout, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ReactGridLayout = WidthProvider(GridLayout);

interface BlockDefinition<T extends z.ZodTypeAny = z.ZodTypeAny> {
  type: string;
  title: string;
  schema: T;
  defaultValue: z.infer<T>;
  preview: (data: z.infer<T>) => JSX.Element;
}

const heroSchema = z
  .object({
    decorative: z.boolean().default(false),
    heading: z.string().optional(),
    subheading: z.string().optional(),
    content: z.string().optional()
  })
  .refine((data) => data.decorative || !!data.heading, {
    message: 'Required',
    path: ['heading']
  });

const ctaSchema = z.object({
  text: z.string().min(1),
  url: z.string().url()
});

const imageSchema = z.object({
  url: z.string().url(),
  alt: z.string().min(1, 'Alt text required'),
  caption: z.string().optional(),
  credit: z.string().optional(),
  license: z.string().optional()
});

const textSchema = z.object({
  text: z.string().min(1),
  asList: z.boolean().default(false)
});

const blockDefinitions: Record<string, BlockDefinition> = {
  hero: {
    type: 'hero',
    title: 'Hero',
    schema: heroSchema,
    defaultValue: { decorative: false, heading: 'Heading', subheading: '', content: '' },
    preview: (data) => (
      <section className="rounded border p-4">
        <h2 className="text-xl font-bold">{data.heading}</h2>
        {data.subheading && <p>{data.subheading}</p>}
      </section>
    )
  },
  cta: {
    type: 'cta',
    title: 'Call To Action',
    schema: ctaSchema,
    defaultValue: { text: 'Click me', url: 'https://example.com' },
    preview: (data) => (
      <a href={data.url} className="inline-block rounded bg-blue-600 px-4 py-2 text-white">
        {data.text}
      </a>
    )
  },
  image: {
    type: 'image',
    title: 'Image',
    schema: imageSchema,
    defaultValue: {
      url: '',
      alt: '',
      caption: '',
      credit: '',
      license: ''
    },
    preview: (data) => (
      <figure className="rounded border p-2">
        {data.url && (
          <img src={data.url} alt={data.alt} className="max-w-full" />
        )}
        {data.caption && <figcaption>{data.caption}</figcaption>}
        {data.credit && (
          <small className="block text-xs text-gray-500">{data.credit}</small>
        )}
      </figure>
    )
  },
  text: {
    type: 'text',
    title: 'Text',
    schema: textSchema,
    defaultValue: { text: 'Paragraph', asList: false },
    preview: (data) =>
      data.asList ? (
        <ul className="list-disc pl-4">
          {data.text.split('\n').map((t: string, i: number) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      ) : (
        <p>{data.text}</p>
      )
  }
};

type BlockInstance = {
  id: string;
  type: string;
  data: any;
};

function LibraryItem({ block }: { block: BlockDefinition }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: block.type });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="cursor-move rounded border p-2"
    >
      {block.title}
    </div>
  );
}

function RichText({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML())
  });
  return <EditorContent editor={editor} className="min-h-[100px] rounded border p-2" />;
}

function Inspector({ block, update }: { block: BlockInstance | null; update: (data: any) => void }) {
  const def = block ? blockDefinitions[block.type] : null;
  const form = useForm({
    resolver: def ? zodResolver(def.schema) : undefined,
    defaultValues: block?.data
  });
  const { reset } = form;
  useEffect(() => {
    if (block) reset(block.data);
  }, [block, reset]);
  if (!block || !def) return <p>Select a block to edit.</p>;
  const onSubmit = form.handleSubmit((values) => update(values));
  return (
    <form onSubmit={onSubmit} className="space-y-2">
      {Object.keys((def.schema as any).shape).map((key) => {
        const isRich = key === 'content';
        if (isRich) {
          return (
            <Controller
              key={key}
              name={key as any}
              control={form.control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium">{key}</label>
                  <RichText value={field.value} onChange={field.onChange} />
                </div>
              )}
            />
          );
        }
        return (
          <div key={key}>
            <label className="block text-sm font-medium">{key}</label>
            <input
              className="w-full rounded border px-2 py-1"
              {...form.register(key as any)}
            />
            {form.formState.errors[key] && (
              <p role="alert" className="text-sm text-red-600">
                {form.formState.errors[key]?.message as string}
              </p>
            )}
          </div>
        );
      })}
      <button type="submit" className="rounded bg-green-600 px-3 py-1 text-white">
        Save
      </button>
    </form>
  );
}

export default function VisualBuilder() {
  const [blocks, setBlocks] = useState<BlockInstance[]>([]);
  const [layout, setLayout] = useState<RGLLayout[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));
  const { setNodeRef: setCanvasRef } = useDroppable({ id: 'canvas' });

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over?.id === 'canvas') {
        const def = blockDefinitions[active.id as string];
        if (def) {
          const id = nanoid();
          setBlocks((prev) => [...prev, { id, type: def.type, data: def.defaultValue }]);
          setLayout((prev) => [...prev, { i: id, x: 0, y: Infinity, w: 12, h: 2 }]);
        }
      }
    },
    []
  );

  const handleLayoutChange = (next: RGLLayout[]) => {
    setLayout(next);
    setBlocks((prev) => next.map((l) => prev.find((b) => b.id === l.i)!).filter(Boolean));
  };

  const selectedBlock = blocks.find((b) => b.id === selectedId) || null;

  const updateSelected = (data: any) => {
    if (!selectedBlock) return;
    setBlocks((prev) => prev.map((b) => (b.id === selectedBlock.id ? { ...b, data } : b)));
  };

  const saveSnippet = () => {
    localStorage.setItem('snippet', JSON.stringify(blocks));
    alert('Snippet saved');
  };

  const loadSnippet = () => {
    const raw = localStorage.getItem('snippet');
    if (raw) {
      const parsed: BlockInstance[] = JSON.parse(raw);
      setBlocks(parsed);
      setLayout(parsed.map((b, idx) => ({ i: b.id, x: 0, y: idx * 2, w: 12, h: 2 })));
    }
  };

  const exportJSON = () => {
    const json = JSON.stringify(blocks, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const blocksToMDX = (items: BlockInstance[]) =>
    items
      .map((b) => {
        switch (b.type) {
          case 'image':
            return `![${b.data.alt}](${b.data.url})`;
          case 'text':
            return b.data.asList
              ? b.data.text
                  .split('\n')
                  .map((t: string) => `- ${t}`)
                  .join('\n')
              : b.data.text;
          case 'cta':
            return `[${b.data.text}](${b.data.url})`;
          case 'hero':
            return `## ${b.data.heading}\n${b.data.content ?? ''}`;
          default:
            return '';
        }
      })
      .join('\n\n');

  const exportMDX = () => {
    const mdx = blocksToMDX(blocks);
    const blob = new Blob([mdx], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.mdx';
    a.click();
    URL.revokeObjectURL(url);
  };

  const validateSEO = (items: BlockInstance[]) => {
    const errors: string[] = [];
    items.forEach((b, idx) => {
      if (b.type === 'image' && !b.data.alt) {
        errors.push(`Image block #${idx + 1} requires alt text`);
      }
      if (b.type === 'hero' && !b.data.decorative && !b.data.heading) {
        errors.push(`Hero block #${idx + 1} requires a heading`);
      }
    });
    return errors;
  };

  const preview = () => {
    const errors = validateSEO(blocks);
    if (errors.length) {
      alert(`SEO issues:\n${errors.join('\n')}`);
      return;
    }
    const data = encodeURIComponent(JSON.stringify(blocks));
    window.open(`/__preview/${data}`, '_blank');
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-4">
        <aside className="w-48 space-y-2" aria-label="Block library">
          {Object.values(blockDefinitions).map((b) => (
            <LibraryItem key={b.type} block={b} />
          ))}
          <button
            type="button"
            onClick={saveSnippet}
            className="mt-4 w-full rounded bg-gray-200 px-2 py-1"
          >
            Save Snippet
          </button>
          <button
            type="button"
            onClick={loadSnippet}
            className="mt-2 w-full rounded bg-gray-200 px-2 py-1"
          >
            Load Snippet
          </button>
          <button
            type="button"
            onClick={exportJSON}
            className="mt-2 w-full rounded bg-gray-200 px-2 py-1"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={exportMDX}
            className="mt-2 w-full rounded bg-gray-200 px-2 py-1"
          >
            Export MDX
          </button>
        </aside>
        <div className="flex-1" aria-label="Canvas" ref={setCanvasRef}>
          <ReactGridLayout
            layout={layout}
            cols={12}
            rowHeight={40}
            width={800}
            onLayoutChange={handleLayoutChange}
          >
            {blocks.map((block) => (
              <div key={block.id} onClick={() => setSelectedId(block.id)} className={selectedId === block.id ? 'ring-2 ring-blue-500' : ''}>
                {blockDefinitions[block.type].preview(block.data)}
              </div>
            ))}
          </ReactGridLayout>
          {blocks.length === 0 && <p className="p-4 text-gray-500">Drag blocks here</p>}
        </div>
        <aside className="w-64" aria-label="Inspector">
          <Inspector block={selectedBlock} update={updateSelected} />
          <button
            type="button"
            onClick={preview}
            className="mt-4 w-full rounded bg-blue-600 px-2 py-1 text-white"
          >
            Preview
          </button>
        </aside>
      </div>
    </DndContext>
  );
}

