import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Invoice } from '../data/mockData';

export const generateInvoicePDF = (invoice: Invoice) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(24);
  doc.setTextColor(16, 185, 129); // Primary color (emerald-500)
  doc.text('CredTurn', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('123 Business Rd, Suite 100', 14, 30);
  doc.text('billing@credturn.com', 14, 35);

  // Invoice Title
  doc.setFontSize(20);
  doc.setTextColor(0);
  doc.text('INVOICE', 140, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Invoice ID: ${invoice.reference}`, 140, 30);
  doc.text(`Date: ${invoice.date}`, 140, 35);
  doc.text(`Status: ${invoice.status}`, 140, 40);

  // Parties
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text('Bill To:', 14, 55);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(invoice.type === 'received' ? invoice.buyer : invoice.seller, 14, 62);

  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text('From:', 140, 55);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(invoice.type === 'received' ? invoice.seller : invoice.buyer, 140, 62);

  // Table
  const tableData = [
    [invoice.name || 'Services Rendered', '1', `$${invoice.amount.toLocaleString()}`, `$${invoice.amount.toLocaleString()}`]
  ];

  (doc as any).autoTable({
    startY: 80,
    head: [['Description', 'Qty', 'Rate', 'Amount']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [16, 185, 129] },
    margin: { top: 80 },
  });

  // Total
  const finalY = (doc as any).lastAutoTable.finalY || 80;
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text('Total Amount Due:', 140, finalY + 15);
  doc.setFontSize(16);
  doc.setTextColor(16, 185, 129);
  doc.text(`$${invoice.amount.toLocaleString()}`, 140, finalY + 25);

  // Payment Info
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('Payment Mode: Debit / Loan', 14, finalY + 15);

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, pageHeight - 15);
  doc.text('Powered by CredTurn', 14, pageHeight - 10);

  // Save
  doc.save(`Invoice-${invoice.reference}.pdf`);
};
