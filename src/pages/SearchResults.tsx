import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, FileText, CreditCard, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { invoices, setSelectedInvoice, setSelectedPayment, setSelectedUser } = useAppContext();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || '';
 
  const lowerQuery = query.toLowerCase();
  const invoiceResults = query ? invoices.filter(inv => 
    inv.name.toLowerCase().includes(lowerQuery) || 
    inv.reference.toLowerCase().includes(lowerQuery)
  ).map(inv => ({
    id: inv.id,
    title: `${inv.type === 'sent' ? 'Sent' : 'Received'} Invoice: ${inv.name}`,
    type: 'Invoice',
    path: '/transactions',
    state: { tab: inv.type === 'sent' ? 'created' : 'received' }
  })) : [];

  const results = query ? [
    ...invoiceResults,
    { id: `payment-${query}`, title: `Payment to ${query}`, type: 'Payment', path: '/payments' },
    { id: `contact-${query}`, title: `Contact: ${query}`, type: 'Contact', path: '/profile' },
  ] : [];

  const handleResultClick = (result: any) => {
    if (result.type === 'Invoice') {
      const invoice = invoices.find(inv => inv.id === result.id);
      if (invoice) setSelectedInvoice(invoice);
    } else if (result.type === 'Payment') {
      setSelectedPayment({ id: result.id, title: result.title });
    } else if (result.type === 'Contact') {
      setSelectedUser({ id: result.id, name: result.title.replace('Contact: ', '') });
    } else {
      navigate(result.path);
    }
  };


  const getIcon = (type: string) => {
    switch (type) {
      case 'Invoice': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'Payment': return <CreditCard className="w-5 h-5 text-emerald-500" />;
      case 'Contact': return <User className="w-5 h-5 text-purple-500" />;
      default: return <Search className="w-5 h-5 text-slate-500" />;
    }
  };


  return (
    <main className="max-w-3xl mx-auto px-6 pt-8 pb-32">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container-high transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-on-surface" />
        </button>
        <h1 className="font-headline font-extrabold text-2xl text-on-surface">Search Results</h1>
      </div>


      <div className="mb-6">
        <p className="text-on-surface-variant">Showing results for <span className="font-bold text-on-surface">"{query}"</span></p>
      </div>


      {results.length > 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/15 overflow-hidden">
          <div className="divide-y divide-outline-variant/10">
            {results.map((result) => (
              <div
                key={result.id}
                onClick={() => handleResultClick(result)}
                className="p-4 hover:bg-surface-container-low cursor-pointer transition-colors flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                  {getIcon(result.type)}
                </div>
                <div>
                  <h3 className="font-bold text-on-surface">{result.title}</h3>
                  <p className="text-sm text-on-surface-variant">{result.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-surface-container-lowest rounded-2xl border border-outline-variant/15">
          <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-on-surface-variant/50" />
          </div>
          <h3 className="font-headline font-bold text-lg text-on-surface mb-2">No results found</h3>
          <p className="text-on-surface-variant">Try adjusting your search query.</p>
        </div>
      )}
    </main>
  );
}
