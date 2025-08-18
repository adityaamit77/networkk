import { promises as fs } from 'fs';
import path from 'path';

type Message = { role: string; content: string };
const filePath = path.join(process.cwd(), 'data', 'transcripts.json');

async function readAll() {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data) as any[];
  } catch {
    return [];
  }
}

export async function logTranscript(sessionId: string, messages: Message[]) {
  const all = await readAll();
  all.push({ sessionId, messages, timestamp: Date.now() });
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(all, null, 2));
}

export async function getAnalytics() {
  const all = await readAll();
  const totalSessions = all.length;
  const totalMessages = all.reduce((acc, t) => acc + t.messages.length, 0);
  return { totalSessions, totalMessages };
}

export function notifyTeam(sessionId: string) {
  console.log(`Escalation requested for session ${sessionId}`);
}
