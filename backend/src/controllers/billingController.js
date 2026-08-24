const Billing = require('../models/Billing');

exports.getAllInvoices = async (req, res, next) => {
  try {
    const { unitNumber, status } = req.query;
    const filter = {};
    if (unitNumber) filter.unitNumber = unitNumber;
    if (status && status !== 'ALL') filter.status = status;

    const invoices = await Billing.find(filter).sort({ dueDate: -1 }).lean();

    const summary = {
      totalDue: invoices.filter((i) => i.status !== 'PAID').reduce((acc, i) => acc + i.totalAmount, 0),
      totalCollected: invoices.filter((i) => i.status === 'PAID').reduce((acc, i) => acc + i.totalAmount, 0),
      paidCount: invoices.filter((i) => i.status === 'PAID').length,
      dueCount: invoices.filter((i) => i.status !== 'PAID').length
    };

    res.json({ success: true, invoices, summary });
  } catch (err) {
    next(err);
  }
};

exports.payInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentMethod = 'UPI' } = req.body;

    const invoice = await Billing.findById(id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }

    invoice.status = 'PAID';
    invoice.paidDate = new Date();
    invoice.paymentMethod = paymentMethod;
    invoice.transactionRef = 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    await invoice.save();
    res.json({ success: true, invoice, message: 'Maintenance payment recorded successfully.' });
  } catch (err) {
    next(err);
  }
};
