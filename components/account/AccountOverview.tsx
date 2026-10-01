'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, formatDate, formatMoney } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { Order } from '@/lib/types';
import { Card } from './AccountShell';
import OrderStatusBadge from './OrderStatusBadge';

export default function AccountOverview() {
  const { user, refreshUser } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    void refreshUser();
    api<Order[]>('/orders', { query: { per_page: 5, scope: 'mine' } })
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]));
  }, [refreshUser]);

  if (!user) return null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          ['Orders', String(user.stats?.orders ?? '—')],
          ['Total spent', user.stats ? formatMoney(user.stats.total_spent) : '—'],
          ['Account type', user.role === 'user' ? 'Customer' : user.role[0].toUpperCase() + user.role.slice(1)],
        ].map(([label, value]) => (
          <div key={label} className="bg-white rounded-lg shadow-sm p-5">
            <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <Card
        title="Recent orders"
        action={
          <Link href="/account/orders" className="text-sm text-[#00a550] hover:underline">
            View all
          </Link>
        }
      >
        <OrderList orders={orders} />
      </Card>

      <Card title="Account details" action={<Link href="/account/profile" className="text-sm text-[#00a550] hover:underline">Edit</Link>}>
        <dl className="grid grid-cols-[120px_1fr] gap-y-2 text-sm">
          <dt className="text-gray-500">Name</dt>
          <dd className="text-gray-900">{user.name}</dd>
          <dt className="text-gray-500">Email</dt>
          <dd className="text-gray-900 break-all">{user.email}</dd>
          <dt className="text-gray-500">Mobile</dt>
          <dd className="text-gray-900">{user.mobile || '—'}</dd>
          <dt className="text-gray-500">Member since</dt>
          <dd className="text-gray-900">{formatDate(user.created_at)}</dd>
        </dl>
      </Card>
    </>
  );
}

export function OrderList({ orders }: { orders: Order[] | null }) {
  if (orders === null) return <p className="text-sm text-gray-500">Loading…</p>;
  if (orders.length === 0)
    return (
      <p className="text-sm text-gray-600">
        You haven&apos;t placed any orders yet.{' '}
        <Link href="/products" className="text-[#00a550] hover:underline">
          Start shopping
        </Link>
      </p>
    );
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase text-gray-500 border-b border-gray-200">
          <tr>
            <th className="py-2 pr-4 font-semibold">Order</th>
            <th className="py-2 pr-4 font-semibold hidden sm:table-cell">Date</th>
            <th className="py-2 pr-4 font-semibold hidden md:table-cell">Items</th>
            <th className="py-2 pr-4 font-semibold">Total</th>
            <th className="py-2 pr-4 font-semibold">Status</th>
            <th className="py-2 font-semibold sr-only">View</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="py-3 pr-4 font-semibold text-gray-900 whitespace-nowrap">
                {o.order_number}
                <span className="block text-xs font-normal text-gray-500 sm:hidden">{formatDate(o.created_at)}</span>
              </td>
              <td className="py-3 pr-4 whitespace-nowrap text-gray-700 hidden sm:table-cell">{formatDate(o.created_at)}</td>
              <td className="py-3 pr-4 text-gray-700 hidden md:table-cell">{o.item_count}</td>
              <td className="py-3 pr-4 text-gray-900">{formatMoney(o.grand_total)}</td>
              <td className="py-3 pr-4">
                <OrderStatusBadge status={o.status} />
              </td>
              <td className="py-3 text-right">
                <Link href={`/orders/${o.order_number}`} className="text-[#00a550] font-medium hover:underline whitespace-nowrap">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
