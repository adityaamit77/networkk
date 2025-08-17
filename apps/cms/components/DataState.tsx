import { ReactNode } from 'react';

interface Props {
  loading?: boolean;
  error?: string | null;
  items: unknown[];
  children: ReactNode;
}

export default function DataState({ loading, error, items, children }: Props) {
  if (loading) {
    return <p role="status">Loading…</p>;
  }
  if (error) {
    return <p role="alert">Error: {error}</p>;
  }
  if (!items || items.length === 0) {
    return <p>No items yet.</p>;
  }
  return <>{children}</>;
}

