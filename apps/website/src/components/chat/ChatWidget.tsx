import React, { useState, useRef } from 'react';

interface Citation {
  label: string;
  url: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
}

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const sessionId = useRef<string>(crypto.randomUUID());

  const sendMessage = async () => {
    if (!input) return;

    if (file && consent) {
      const text = await file.text();
      await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId.current,
          text,
          filename: file.name,
          url: '/',
        }),
      });
    }

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: sessionId.current, message: input }),
    });
    const data = await res.json();
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: input },
      { role: 'assistant', content: data.message, citations: data.citations || [] },
    ]);
    setInput('');
    setFile(null);
  };

  return (
    <div className="border rounded p-4 max-w-md">
      <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
        {messages.map((m, idx) => (
          <div key={idx} className={m.role === 'user' ? 'text-right' : ''}>
            <div className="inline-block bg-gray-100 p-2 rounded">
              {m.content}{' '}
              {m.citations?.map((c) => (
                <a key={c.url} href={c.url} className="text-blue-600 underline ml-1">
                  {c.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <textarea
          className="w-full border p-2"
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div>
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <label className="ml-2">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span className="ml-1">Allow document indexing this session</span>
          </label>
        </div>
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!input}
        >
          Send
        </button>
      </div>
    </div>
  );
}
