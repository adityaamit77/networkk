import { GetServerSideProps } from 'next';
import Head from 'next/head';
import path from 'path';
import { promises as fs } from 'fs';

type Transcript = {
  sessionId: string;
  messages: { role: string; content: string }[];
  timestamp: number;
};

interface Props {
  transcripts: Transcript[];
}

export default function TranscriptsPage({ transcripts }: Props) {
  return (
    <div className="p-4">
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <h1 className="text-2xl mb-4">Transcripts</h1>
      <ul className="space-y-4">
        {transcripts.map((t, idx) => (
          <li key={idx} className="border p-2">
            <p className="font-bold">Session {t.sessionId}</p>
            <ul className="ml-4 list-disc">
              {t.messages.map((m, i) => (
                <li key={i}>{m.role}: {m.content}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const file = path.join(process.cwd(), 'data', 'transcripts.json');
  let transcripts: Transcript[] = [];
  try {
    const data = await fs.readFile(file, 'utf8');
    transcripts = JSON.parse(data);
  } catch {}
  return { props: { transcripts } };
};
