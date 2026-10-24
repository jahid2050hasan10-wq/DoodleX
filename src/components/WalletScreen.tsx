import { useState, useEffect, useCallback } from 'react';
import {
  Wallet as WalletIcon,
  ArrowDownToLine,
  ArrowUpFromLine,
  Clock,
  TrendingUp,
  TrendingDown,
  Loader2,
} from 'lucide-react';
import PaymentModal from '@/components/PaymentModal';
import type { PaymentModalType, PaymentMethod } from '@/components/PaymentModal';
import { useAuth } from '@/lib/auth';
import { supabase, type Transaction, type PaymentRequestRow } from '@/lib/supabase';

const methodLabels: Record<PaymentMethod, string> = {
  bkash: 'bKash',
  nagad: 'Nagad',
  rocket: 'Rocket',
  upay: 'Upay',
};

const txConfig: Record<string, { icon: typeof TrendingUp; color: string; label: string }> = {
  deposit: { icon: ArrowDownToLine, color: '#39ff8a', label: 'Deposit' },
  withdraw: { icon: ArrowUpFromLine, color: '#ff4d5e', label: 'Withdraw' },
  prize: { icon: TrendingUp, color: '#ffe94e', label: 'Prize' },
  entry: { icon: TrendingDown, color: '#22f0e6', label: 'Entry Fee' },
};

export default function WalletScreen() {
  const { profile, refreshProfile } = useAuth();
  const [modalType, setModalType] = useState<PaymentModalType | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentReqs, setPaymentReqs] = useState<PaymentRequestRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!profile) return;
    const [txRes, prRes] = await Promise.all([
      supabase
        .from('transactions')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('payment_requests')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false }),
    ]);

    if (txRes.data) setTransactions(txRes.data as Transaction[]);
    if (prRes.data) setPaymentReqs(prRes.data as PaymentRequestRow[]);
    setLoading(false);
  }, [profile]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const balance = profile?.balance ?? 0;

  const handleSubmit = async (
    method: PaymentMethod,
    trxId: string,
    amount: number,
    senderNumber: string,
  ) => {
    if (!profile) return;
    const type = modalType === 'deposit' ? 'deposit' : 'withdraw';

    const { error } = await supabase.from('payment_requests').insert({
      user_id: profile.id,
      type,
      method,
      amount,
      trx_id: trxId,
      sender_number: senderNumber,
      status: 'pending',
    });

    if (error) {
      console.error('Payment request error:', error.message);
      return;
    }

    await fetchData();
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

  type MergedTx = {
    id: string;
    type: string;
    label: string;
    amount: number;
    date: string;
    status: string;
  };

  const mergedTxs: MergedTx[] = [
    ...transactions.map((t) => ({
      id: t.id,
      type: t.type,
      label: t.label,
      amount: t.amount,
      date: formatDate(t.created_at),
      status: t.status,
    })),
    ...paymentReqs.map((r) => ({
      id: r.id,
      type: r.type,
      label: `${methodLabels[r.method as PaymentMethod]} ${r.type === 'deposit' ? 'Deposit' : 'Withdraw'}`,
      amount: r.type === 'deposit' ? r.amount : -r.amount,
      date: formatDate(r.created_at),
      status: r.status,
    })),
  ].sort((a, b) => (a.date > b.date ? -1 : 1));

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Balance Card */}
      <div className="relative overflow-hidden rounded-2xl border border-neon-green/25 bg-gradient-to-br from-ink-700 via-ink-800 to-ink-700 p-6 shadow-neon-green">
        <div className="pointer-events-none absolute -top-20 -right-10 h-40 w-40 rounded-full bg-neon-green/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-neon-cyan/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2 text-gray-400">
            <WalletIcon className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Total Balance</span>
          </div>
          <p className="mt-3 font-display text-4xl font-bold text-white">৳ {balance}</p>

          <div className="mt-5 flex gap-3">
            <button
              onClick={() => setModalType('deposit')}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-neon-green py-3 font-display text-sm font-bold text-ink-900 transition-all hover:scale-[1.02]"
              style={{ boxShadow: '0 0 14px #39ff8a55' }}
            >
              <ArrowDownToLine className="h-4 w-4" />
              Deposit
            </button>
            <button
              onClick={() => setModalType('withdraw')}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-neon-red/40 bg-neon-red/10 py-3 font-display text-sm font-bold text-neon-red transition-all hover:bg-neon-red/20"
            >
              <ArrowUpFromLine className="h-4 w-4" />
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-gray-300">
            Transaction History
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
          </div>
        ) : mergedTxs.length === 0 ? (
          <div className="rounded-2xl border border-ink-600/60 bg-ink-700/40 p-10 text-center">
            <Clock className="mx-auto mb-3 h-8 w-8 text-gray-600" />
            <p className="text-sm text-gray-500">No transactions yet.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {mergedTxs.map((tx) => {
              const cfg = txConfig[tx.type] ?? txConfig.entry;
              const Icon = cfg.icon;
              const positive = tx.amount > 0;
              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 rounded-xl border border-ink-600/60 bg-ink-700/50 px-4 py-3 transition-colors hover:border-ink-500"
                >
                  <div
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg"
                    style={{ backgroundColor: `${cfg.color}1a` }}
                  >
                    <Icon className="h-4.5 w-4.5" style={{ color: cfg.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{tx.label}</p>
                    <p className="text-[11px] text-gray-500">{tx.date}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-display text-sm font-bold ${
                        positive ? 'text-neon-green' : 'text-neon-red'
                      }`}
                    >
                      {positive ? '+' : ''}
                      {tx.amount}
                    </p>
                    <span
                      className={`text-[10px] font-medium uppercase tracking-wider ${
                        tx.status === 'completed'
                          ? 'text-gray-500'
                          : tx.status === 'pending'
                            ? 'text-neon-yellow'
                            : tx.status === 'approved'
                              ? 'text-neon-green'
                              : 'text-neon-red'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {modalType && (
        <PaymentModal
          type={modalType}
          onClose={() => setModalType(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
