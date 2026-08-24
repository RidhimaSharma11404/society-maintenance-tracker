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
  DollarSign
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
      const params = {};
      if (user?.role === 'resident') {
        params.unitNumber = user?.unitNumber;
      }
      const res = await api.get('/billing', { params });
      setInvoices(res.data?.invoices || []);
      setSummary(res.data?.summary || {});
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
      success(`Payment of ₹${payingInvoice.totalAmount} recorded successfully.`);
      setPayingInvoice(null);
      fetchInvoices();
    } catch (err) {
      toastError(err.message || 'Payment failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-700" />
            Resident Maintenance Dues & Society Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monthly society maintenance dues, sinking funds, utility charges, and payment receipts
          </p>
        </div>

        <button
          onClick={fetchInvoices}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-xs transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-700' : ''}`} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* KPI Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Outstanding Dues
          </span>
          <div className="text-2xl font-extrabold text-rose-700 font-mono">
            ₹{summary.totalDue || 0}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            {summary.dueCount || 0} unpaid monthly invoice(s)
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Collected Receipts
          </span>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono">
            ₹{summary.totalCollected || 0}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            {summary.paidCount || 0} verified transactions
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Active Unit
          </span>
          <div className="text-xl font-extrabold text-slate-900 font-mono">
            {user?.unitNumber || 'Tower A - 402'}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            Owner: {user?.name}
          </p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Invoice & Month</th>
                <th className="px-4 py-3">Flat Unit</th>
                <th className="px-4 py-3">Breakdown</th>
                <th className="px-4 py-3 text-right">Total Amount</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin text-blue-700 mx-auto mb-2" />
                    Loading billing ledger...
                  </td>
                </tr>
              ) : invoices.length > 0 ? (
                invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 font-mono text-[11px]">
                        {inv.invoiceNumber}
                      </div>
                      <div className="text-[11px] text-slate-500 font-semibold">{inv.month}</div>
                    </td>

                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      {inv.unitNumber}
                      <div className="text-[11px] text-slate-400 font-normal">{inv.residentName}</div>
                    </td>

                    <td className="px-4 py-3.5 text-[11px] text-slate-600 space-y-0.5">
                      <div>Maint: ₹{inv.breakdown?.maintenanceCharge} · Sinking: ₹{inv.breakdown?.sinkingFund}</div>
                      <div>Water: ₹{inv.breakdown?.waterCharges} · Common Elec: ₹{inv.breakdown?.commonElectricity}</div>
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono font-extrabold text-slate-900 text-sm">
                      ₹{inv.totalAmount}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : inv.status === 'OVERDUE'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-600">
                      {new Date(inv.dueDate).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      {inv.status !== 'PAID' ? (
                        <button
                          onClick={() => setPayingInvoice(inv)}
                          className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
                        >
                          Pay Dues
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Receipt {inv.transactionRef?.slice(-6) || 'OK'}</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    No billing records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-blue-700" />
                Pay Society Maintenance Dues
              </h3>
              <button
                onClick={() => setPayingInvoice(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice:</span>
                <span className="font-mono font-bold text-slate-900">{payingInvoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Flat:</span>
                <span className="font-bold text-slate-900">{payingInvoice.unitNumber}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-800">Total Payable:</span>
                <span className="font-mono font-extrabold text-blue-700 text-base">₹{payingInvoice.totalAmount}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Payment Channel:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['UPI', 'NetBanking', 'CreditCard'].map((pm) => (
                  <button
                    key={pm}
                    type="button"
                    onClick={() => setPaymentMethod(pm)}
                    className={`py-2 rounded-lg font-bold border transition-colors ${
                      paymentMethod === pm
                        ? 'bg-blue-700 text-white border-blue-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pm}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handlePayInvoice}
                disabled={processing}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{processing ? 'Confirming with Gateway...' : `Confirm ₹${payingInvoice.totalAmount} Payment`}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
