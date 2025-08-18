interface Doc {
  id: number;
  text: string;
  url?: string;
}

type SessionData = {
  docs: Doc[];
  timer: NodeJS.Timeout;
};

const indexes = new Map<string, SessionData>();
const TTL = 60 * 60 * 1000; // 1 hour

function createTimer(sessionId: string) {
  return setTimeout(() => {
    indexes.delete(sessionId);
  }, TTL);
}

export function addDocument(sessionId: string, text: string, url?: string) {
  const existing = indexes.get(sessionId);
  if (existing) {
    clearTimeout(existing.timer);
    existing.docs.push({ id: existing.docs.length + 1, text, url });
    existing.timer = createTimer(sessionId);
  } else {
    indexes.set(sessionId, {
      docs: [{ id: 1, text, url }],
      timer: createTimer(sessionId),
    });
  }
}

export function getDocuments(sessionId: string): Doc[] {
  return indexes.get(sessionId)?.docs ?? [];
}
