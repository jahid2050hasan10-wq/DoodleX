import { useState } from 'react';
import { X, Smartphone, CheckCircle2, AlertCircle } from 'lucide-react';

export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'upay';

export type PaymentModalType = 'deposit' | 'withdraw';

type PaymentModalProps = {
  type: PaymentModalType;
  onClose: () => void;
  onSubmit: (
    method: PaymentMethod,
    trxId: string,
    amount: number,
    senderNumber: string,
  ) => void;
};

const methods: {
  id: PaymentMethod;
  label: string;
  color: string;
  number: string;
}[] = [
  { id: 'bkash', label: 'bKash', color: '#e2136e', number: '017XX-XXXXXX' },
  { id: 'nagad', label: 'Nagad', color: '#ee1c25', number: '018XX-XXXXXX' },
  { id: 'rocket', label: 'Rocket', color: '#8b298f', number: '019XX-XXXXXX' },
  { id: 'upay', label: 'Upay', color: '#e63946', number: '016XX-XXXXXX' },
];

const inputClass =
  'w-full rounded-xl border border-ink-600/60 bg-ink-700/60 px-4 py-3 text-sm font-medium text-white outline-none transition-colors placeholder:text-gray-600 focus:border-neon-cyan/50';

export default function PaymentModal({
  type,
  onClose,
  onSubmit,
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [trxId, setTrxId] = useState('');
  const [amount, setAmount] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');

  const isDeposit = type === 'deposit';

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/[\s-]/g, '');
    return /^01\d{9}$/.test(cleaned);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!selectedMethod) {
      setValidationError('Please select a payment method.');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setValidationError('Please enter a valid amount.');
      return;
    }
    if (!trxId.trim()) {
      setValidationError('Please enter the Transaction ID.');
      return;
    }
    if (!validatePhone(senderNumber)) {
      setValidationError(
        isDeposit
          ? 'Please enter a valid sender mobile number (e.g. 017XXXXXXXX).'
          : 'Please enter a valid recipient mobile number (e.g. 017XXXXXXXX).',
      );
      return;
    }

    onSubmit(
      selectedMethod,
      trxId.trim(),
      Number(amount),
      senderNumber.trim(),
    );
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  if (submitted) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/80 px-4 backdrop-blur-md"
        onClick={onClose}
      >
        <div
          className="w-full max-w-sm rounded-2xl border border-neon-green/30 bg-ink-800 p-8 text-center shadow-neon-green"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-neon-green/15">
            <CheckCircle2 className="h-9 w-9 text-neon-green" />
          </div>
          <h3 className="font-display text-lg font-bold text-white">
            {isDeposit ? 'Deposit' : 'Withdraw'} Request Submitted
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            Your request with TxID <span className="font-mono text-neon-cyan">{trxId}</span> has been
            sent to the admin for review. You will see the result in your transaction history once
            it is processed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/80 backdrop-blur-md sm:items-center sm:px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-md overflow-y-auto no-scrollbar rounded-t-3xl border-t border-ink-600/60 bg-ink-800 pb-8 sm:rounded-2xl sm:border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-600/60 bg-ink-800/95 px-5 py-4 backdrop-blur-xl">
          <h3 className="font-display text-lg font-bold text-white">
            {isDeposit ? 'Deposit' : 'Withdraw'}
          </h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 transition-colors hover:bg-ink-700 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Pull handle (mobile) */}
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-ink-600 sm:hidden" />

        <form onSubmit={handleSubmit} className="px-5 pt-5">
          {/* Payment method grid */}
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
            Select Payment Method
          </p>
          <div className="grid grid-cols-2 gap-3">
            {methods.map((m) => {
              const active = selectedMethod === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMethod(m.id)}
                  className={`flex items-center gap-2.5 rounded-xl border p-3 transition-all ${
                    active
                      ? 'bg-ink-700'
                      : 'border-ink-600/60 bg-ink-700/50 hover:border-ink-500'
                  }`}
                  style={
                    active
                      ? { borderColor: m.color, boxShadow: `0 0 12px ${m.color}44` }
                      : undefined
                  }
                >
                  <div
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
                    style={{ backgroundColor: `${m.color}22` }}
                  >
                    <Smartphone className="h-4.5 w-4.5" style={{ color: m.color }} />
                  </div>
                  <div className="text-left">
                    <p className="font-display text-sm font-bold text-white">
                      {m.label}
                    </p>
                    <p className="text-[10px] text-gray-500">{m.number}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Agent number hint */}
          {selectedMethod && (
            <div className="mt-4 rounded-xl border border-ink-600/60 bg-ink-700/50 px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
                {isDeposit
                  ? 'Send money to this number'
                  : 'You will receive money on this number'}
              </p>
              <p className="mt-0.5 font-display text-sm font-bold text-neon-cyan">
                {methods.find((m) => m.id === selectedMethod)?.number}
              </p>
            </div>
          )}

          {/* Amount input */}
          <div className="mt-5">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
              Amount (৳)
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 100"
              className={`${inputClass} font-display text-base font-semibold`}
            />
          </div>

          {/* Transaction ID input */}
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
              Transaction ID (TxID)
            </label>
            <input
              type="text"
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              placeholder="e.g. 8N7K4M2XYZ"
              className={inputClass}
            />
          </div>

          {/* Sender / Recipient mobile number */}
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
              {isDeposit
                ? 'Sender Mobile Number'
                : 'Recipient Mobile Number'}
            </label>
            <input
              type="tel"
              inputMode="tel"
              value={senderNumber}
              onChange={(e) => setSenderNumber(e.target.value)}
              placeholder={isDeposit ? '017XXXXXXXX' : '017XXXXXXXX'}
              className={inputClass}
            />
            <p className="mt-1.5 text-[11px] leading-relaxed text-gray-600">
              {isDeposit
                ? 'Enter the mobile number from which you sent the payment.'
                : 'Enter the mobile number where you want to receive the payout.'}
            </p>
          </div>

          {/* Validation error */}
          {validationError && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-neon-red/30 bg-red-950/30 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-neon-red" />
              <p className="text-xs font-medium text-neon-red">{validationError}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="mt-6 w-full rounded-xl py-3.5 font-display text-base font-bold transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: isDeposit ? '#39ff8a' : '#22f0e6',
              boxShadow: `0 0 16px ${isDeposit ? '#39ff8a' : '#22f0e6'}55`,
              color: '#07070d',
            }}
          >
            {isDeposit ? 'Confirm Deposit' : 'Confirm Withdraw'}
          </button>

          <p className="mt-3 text-center text-[11px] leading-relaxed text-gray-500">
            {isDeposit
              ? 'Make sure to send the exact amount and enter the correct TxID and sender number.'
              : 'Withdrawals are processed within 24 hours after admin approval.'}
          </p>
        </form>
      </div>
    </div>
  );
}
