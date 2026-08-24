import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Building,
  RefreshCw,
  Receipt,
  QrCode,
  DollarSign,
  Sparkles
} from 'lucide-react';

export const BillingLedger = () => {
  const { user, isAdmin } = useAuth();
  const { success, error: toastError } = useToast();

  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [payingInvoice, setPayingInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [processing, setProcessing] = useState(false);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/billing');
      const invoiceList = Array.isArray(res.data) ? res.data : (res.data?.invoices || res.data?.items || []);
      const summaryData = res.data?.summary || { totalBilled: 22000, totalCollected: 11000, totalPending: 11000, collectionRate: '50.0%' };
      setInvoices(invoiceList);
      setSummary(summaryData);
    } catch (err) {
      console.error('Failed to load billing invoices', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [user]);

  const handlePayInvoice = async () => {
    if (!payingInvoice) return;
    setProcessing(true);
    try {
      await api.post(`/billing/${payingInvoice._id}/pay`, { paymentMethod });
      success(`Payment of ₹${payingInvoice.totalAmount || 2750} recorded.`);
      setPayingInvoice(null);
      fetchInvoices();
    } catch (err) {
      toastError(err.message || 'Payment failed.');
    } finally {
      setProcessing(false);
    }
  };

  const defaultBills = [
    { _id: 'bill_1', unitNumber: 'Tower A - 402', billingMonth: 'August 2026', totalAmount: 2750, status: 'PAID', dueDate: '2026-08-31', transactionRef: 'TXN-98442109' },
    { _id: 'bill_2', unitNumber: 'Tower B - 101', billingMonth: 'August 2026', totalAmount: 3100, status: 'PENDING', dueDate: '2026-08-31' },
    { _id: 'bill_3', unitNumber: 'Tower A - 101', billingMonth: 'August 2026', totalAmount: 2750, status: 'PAID', dueDate: '2026-08-31', transactionRef: 'TXN-44102938' }
  ];

  const displayInvoices = invoices.length > 0 ? invoices : defaultBills;

  return (
    <div className="space-y-6 pb-16 font-sans text-slate-100">
      {/* 1. Header Card */}
      <div className="p-6 bg-[#0B1220]/90 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold font-sans text-white uppercase tracking-tight">
              Maintenance Dues Ledger & Society Invoicing
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated monthly maintenance dues, sinking fund contributions, and instant UPI receipts.
          </p>
        </div>

        <button
          onClick={fetchInvoices}
          className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
          title="Refresh Invoices"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>

      {/* 2. Three Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-[#0B1220]/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Total Billed Cycle</span>
          <div className="text-xl font-mono font-bold text-white">₹{summary.totalBilled || '22,000'}</div>
        </div>

        <div className="p-5 bg-[#0B1220]/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Total Collected</span>
          <div className="text-xl font-mono font-bold text-emerald-400">₹{summary.totalCollected || '11,000'}</div>
        </div>

        <div className="p-5 bg-[#0B1220]/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Collection Rate</span>
          <div className="text-xl font-mono font-bold text-cyan-400">{summary.collectionRate || '50.0%'}</div>
        </div>
      </div>

      {/* 3. Invoices List Feed */}
      <div className="space-y-3">
        {displayInvoices.map((inv) => (
          <div
            key={inv._id}
            className="p-5 bg-[#0B1220]/90 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md hover:border-slate-700 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-bold text-xs text-cyan-300 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                  {inv.unitNumber}
                </span>
                <h4 className="text-sm font-bold text-white">{inv.billingMonth} Maintenance Dues</h4>
              </div>
              <p className="text-xs text-slate-400">
                Due Date: <strong className="text-slate-300 font-mono">{inv.dueDate}</strong>
                {inv.transactionRef && (
                  <span> · Ref: <strong className="font-mono text-emerald-400">{inv.transactionRef}</strong></span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
              <span className="text-base font-mono font-bold text-white">
                ₹{inv.totalAmount}
              </span>

              {inv.status === 'PAID' ? (
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  PAID
                </span>
              ) : (
                <button
                  onClick={() => setPayingInvoice(inv)}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Pay Now</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 bg-slate-900 border border-cyan-500/40 rounded-3xl shadow-2xl space-y-4 text-slate-100 text-center">
            <h3 className="font-bold text-base text-white">
              Pay ₹{payingInvoice.totalAmount} Dues
            </h3>
            <p className="text-xs text-slate-400">{payingInvoice.unitNumber} · {payingInvoice.billingMonth}</p>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-2">
              <QrCode className="w-28 h-28 text-cyan-400" />
              <span className="text-[11px] font-mono text-slate-400">UPI ID: greenwood@bank</span>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setPayingInvoice(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handlePayInvoice}
                disabled={processing}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                {processing ? 'Confirming...' : 'Simulate 1-Click Pay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
