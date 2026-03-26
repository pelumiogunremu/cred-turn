import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { 
  InvoiceDetailHeader, 
  InvoiceParties, 
  InvoiceSummaryGrid, 
  InvoiceLineItemsTable, 
  InvoiceActionButtons 
} from '../components/invoice/InvoiceDetailSections';
import { generateInvoicePDF } from '../utils/pdfGenerator';

export default function InvoiceDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { invoices, showToast } = useAppContext();

  const invoice = invoices.find(inv => inv.id === id) || invoices[0];
  const isReceived = invoice.type === 'received';
  const { status, amount, name: clientName, date: dueDate, reference: invoiceNumber } = invoice;

  return (
    <main className="max-w-3xl mx-auto px-6 pt-8 pb-32">
      <InvoiceDetailHeader 
        invoiceNumber={invoiceNumber} 
        status={status} 
        isReceived={isReceived} 
        onBack={() => navigate(-1)} 
        onDownload={() => {
          generateInvoicePDF(invoice);
          showToast('Invoice downloaded successfully', 'success');
        }}
      />

      <div className="space-y-6">
        <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/15 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10"></div>
         
          <InvoiceParties isReceived={isReceived} clientName={clientName} />

          <InvoiceSummaryGrid dueDate={dueDate} amount={amount} />

          <InvoiceLineItemsTable amount={amount} />
        </div>

        <InvoiceActionButtons 
          isReceived={isReceived} 
          status={status} 
          invoiceId={invoice.id} 
          onPay={() => navigate('/payments', { state: { invoiceId: invoice.id } })} 
        />
      </div>
    </main>
  );
}
