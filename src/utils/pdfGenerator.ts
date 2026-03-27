import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice } from '../data/mockData';

export const generateInvoicePDF = (invoice: Invoice) => {
  const doc = new jsPDF();

  // ─── Brand Header ──────────────────────────────────────────────
  doc.setFontSize(26);
  doc.setTextColor(16, 185, 129); // primary emerald
  doc.setFont('helvetica', 'bold');
  doc.text('CredTurn', 14, 22);

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'normal');
  doc.text('Nigeria\'s #1 Credit Trading Platform', 14, 29);
  doc.text('billing@credturn.ng', 14, 34);

  // ─── Invoice Label ─────────────────────────────────────────────
  doc.setFontSize(22);
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 145, 22);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text(`Ref:    ${invoice.reference}`, 145, 30);
  doc.text(`Date:   ${invoice.date}`, 145, 35);
  doc.text(`Due:    ${invoice.dueDate}`, 145, 40);

  // Status badge
  const statusColors: Record<string, [number, number, number]> = {
    Paid: [16, 185, 129],
    Completed: [16, 185, 129],
    'Not Due': [16, 185, 129],
    'Due': [245, 158, 11],
    Overdue: [239, 68, 68],
    Rejected: [239, 68, 68],
    Pending: [245, 158, 11],
    'Partially Paid': [59, 130, 246],
  };
  const [sr, sg, sb] = statusColors[invoice.status] ?? statusColors.default;
  doc.setFontSize(9);
  doc.setTextColor(sr, sg, sb);
  doc.setFont('helvetica', 'bold');
  doc.text(`Status: ${invoice.status.toUpperCase()}`, 145, 45);

  // ─── Divider ───────────────────────────────────────────────────
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(14, 52, 196, 52);

  // ─── Bill From / Bill To ───────────────────────────────────────
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL FROM', 14, 62);
  doc.text('BILL TO', 140, 62);

  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  // Seller = the one who created the invoice
  doc.text(invoice.seller, 14, 70);
  // Buyer = the one who owes
  doc.text(invoice.buyer, 140, 70);

  // ─── Line Items Table ──────────────────────────────────────────
  const tableRows = invoice.description
    ? [[invoice.description, '1 unit', `\u20a6${invoice.amount.toLocaleString('en-NG')}`, `\u20a6${invoice.amount.toLocaleString('en-NG')}`]]
    : [['Services Rendered', '1 unit', `\u20a6${invoice.amount.toLocaleString('en-NG')}`, `\u20a6${invoice.amount.toLocaleString('en-NG')}`]];

  autoTable(doc, {
    startY: 85,
    head: [['Item / Description', 'Qty', 'Unit Price', 'Total']],
    body: tableRows,
    theme: 'striped',
    headStyles: {
      fillColor: [16, 185, 129],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 10,
      textColor: [30, 30, 30],
    },
    alternateRowStyles: {
      fillColor: [245, 255, 250],
    },
    margin: { left: 14, right: 14 },
  });

  const tableBottom = (doc as any).lastAutoTable?.finalY ?? 110;

  // ─── Totals Block ──────────────────────────────────────────────
  const totalsX = 130;
  let ty = tableBottom + 10;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text('Subtotal:', totalsX, ty);
  doc.setTextColor(30, 30, 30);
  doc.text(`\u20a6${invoice.amount.toLocaleString('en-NG')}`, 196, ty, { align: 'right' });

  ty += 6;
  doc.setTextColor(120, 120, 120);
  doc.text('Tax (0%):', totalsX, ty);
  doc.setTextColor(30, 30, 30);
  doc.text('\u20a60.00', 196, ty, { align: 'right' });

  ty += 3;
  doc.setDrawColor(200, 200, 200);
  doc.line(totalsX, ty + 1, 196, ty + 1);
  ty += 8;

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text('TOTAL DUE:', totalsX, ty);
  doc.text(`\u20a6${invoice.amount.toLocaleString('en-NG')}`, 196, ty, { align: 'right' });

  // ─── Outstanding Balance ───────────────────────────────────────
  if (invoice.outstandingBalance !== invoice.amount) {
    ty += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(239, 68, 68);
    doc.text(`Outstanding: \u20a6${invoice.outstandingBalance.toLocaleString('en-NG')}`, totalsX, ty);
  }

  // ─── Payment Info Box ──────────────────────────────────────────
  ty += 16;
  doc.setFillColor(245, 255, 250);
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.4);
  doc.roundedRect(14, ty, 100, 22, 3, 3, 'FD');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text('PAYMENT METHODS', 18, ty + 6);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'normal');
  doc.text('Debit Card / Bank Transfer via Interswitch', 18, ty + 12);
  doc.text('Loan (via CredTurn Lending Partners)', 18, ty + 17);

  // ─── Footer ────────────────────────────────────────────────────
  const pageH = doc.internal.pageSize.height;
  doc.setDrawColor(220, 220, 220);
  doc.line(14, pageH - 22, 196, pageH - 22);
  doc.setFontSize(7.5);
  doc.setTextColor(160, 160, 160);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on ${new Date().toLocaleString('en-NG')} — CredTurn Invoice System`, 14, pageH - 14);
  doc.text('This is a computer-generated document and requires no physical signature.', 14, pageH - 9);

  // ─── Save ──────────────────────────────────────────────────────
  doc.save(`CredTurn-Invoice-${invoice.reference}.pdf`);
};
