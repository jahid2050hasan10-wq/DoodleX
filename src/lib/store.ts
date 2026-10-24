import { useState, useEffect } from 'react';

export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'upay';

export type PaymentRequest = {
  id: string;
  type: 'deposit' | 'withdraw';
  user: string;
  method: PaymentMethod;
  amount: number;
  trxId: string;
  senderNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
};

export type AdminNotification = {
  id: string;
  type: 'deposit' | 'withdraw';
  message: string;
  amount: number;
  user: string;
  requestId: string;
  read: boolean;
  created_at: number;
};

type StoreState = {
  requests: PaymentRequest[];
  notifications: AdminNotification[];
};

let globalState: StoreState = {
  requests: [],
  notifications: [],
};

const listeners = new Set<(s: StoreState) => void>();

function notify() {
  listeners.forEach((l) => l(globalState));
}

export function addPaymentRequest(req: Omit<PaymentRequest, 'id' | 'status' | 'date'>) {
  const id = `req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date();
  const date = now.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  const request: PaymentRequest = {
    ...req,
    id,
    status: 'pending',
    date,
  };

  const notifId = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const notification: AdminNotification = {
    id: notifId,
    type: req.type,
    message: req.type === 'deposit'
      ? `Deposit request from ${req.user}`
      : `Withdrawal request from ${req.user}`,
    amount: req.amount,
    user: req.user,
    requestId: id,
    read: false,
    created_at: Date.now(),
  };

  globalState = {
    requests: [request, ...globalState.requests],
    notifications: [notification, ...globalState.notifications],
  };
  notify();
}

export function approveRequest(id: string) {
  globalState = {
    ...globalState,
    requests: globalState.requests.map((r) =>
      r.id === id ? { ...r, status: 'approved' as const } : r,
    ),
  };
  notify();
}

export function rejectRequest(id: string) {
  globalState = {
    ...globalState,
    requests: globalState.requests.map((r) =>
      r.id === id ? { ...r, status: 'rejected' as const } : r,
    ),
  };
  notify();
}

export function markNotificationRead(id: string) {
  globalState = {
    ...globalState,
    notifications: globalState.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    ),
  };
  notify();
}

export function markAllNotificationsRead() {
  globalState = {
    ...globalState,
    notifications: globalState.notifications.map((n) => ({ ...n, read: true })),
  };
  notify();
}

export function usePaymentStore() {
  const [state, setState] = useState<StoreState>(globalState);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  return state;
}
