import { useState, useCallback, useMemo } from 'react';
import type { QueueItem, SubmissionStatus } from '../types/admin';

// Replace the empty `queue` initial state with documents fetched from the
// Appwrite "submissions" collection. See developer_docs.md → "Admin / useAdmin".
export function useAdmin() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [tab, setTab] = useState<SubmissionStatus>('pending');
  const [selectedId, setSelectedId] = useState<string>('');

  const counts = useMemo(() => ({
    pending:  queue.filter((x) => x.status === 'pending').length,
    approved: queue.filter((x) => x.status === 'approved').length,
    rejected: queue.filter((x) => x.status === 'rejected').length,
  }), [queue]);

  const list     = useMemo(() => queue.filter((x) => x.status === tab), [queue, tab]);
  const selected = useMemo(() => queue.find((x) => x.id === selectedId) ?? null, [queue, selectedId]);

  const setStatus = useCallback((id: string, status: SubmissionStatus) => {
    setQueue((q) => q.map((x) => (x.id === id ? { ...x, status } : x)));
  }, []);

  const enqueue = useCallback((item: QueueItem) => {
    setQueue((q) => [item, ...q]);
    setSelectedId(item.id);
    setTab('pending');
  }, []);

  return { queue, tab, setTab, counts, list, selected, selectedId, setSelectedId, setStatus, enqueue };
}
