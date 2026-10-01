'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Order, PageMeta } from '@/lib/types';
import { Card, SECONDARY_BTN } from './AccountShell';
import { OrderList } from './AccountOverview';

export default function AccountOrders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  const [loadedPage, setLoadedPage] = useState(0);

  useEffect(() => {
    api<Order[]>('/orders', { query: { page, per_page: 10, scope: 'mine' } })
      .then((res) => {
        setOrders(res.data);
        setMeta(res.meta ?? null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Could not load orders.');
        setOrders([]);
      })
      .finally(() => setLoadedPage(page));
  }, [page]);

  return (
    <Card title="My Orders">
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <OrderList orders={loadedPage === page ? orders : null} />
      {meta && meta.total_pages > 1 && (
        <div className="mt-5 flex items-center justify-between text-sm text-gray-600">
          <span>
            Page {meta.page} of {meta.total_pages}
          </span>
          <span className="flex gap-2">
            <button type="button" className={SECONDARY_BTN} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </button>
            <button type="button" className={SECONDARY_BTN} disabled={page >= meta.total_pages} onClick={() => setPage((p) => p + 1)}>
              Next
            </button>
          </span>
        </div>
      )}
    </Card>
  );
}
