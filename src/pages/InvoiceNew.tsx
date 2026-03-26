import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { InvoiceHeader, ClientDetailsSection, InvoiceDetailsSection, LineItemsSection, InvoiceActions } from '../components/invoice/InvoiceFormSections';
import { useAppContext } from '../context/AppContext';
import { Invoice } from '../data/mockData';

type LineItem = { id: number; description: string; amount: string };

export default function InvoiceNew() {
  const navigate = useNavigate();
  const { addInvoice } = useAppContext();
  
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<LineItem[]>([{ id: 1, description: '', amount: '' }]);

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), description: '', amount: '' }]);
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (index: number, field: 'description' | 'amount', value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const totalAmount = useMemo(() => {
    return items.reduce((total, item) => {
      const amount = parseFloat(item.amount) || 0;
      return total + amount;
    }, 0).toFixed(2);
  }, [items]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: clientName || 'New Client',
      reference: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: parseFloat(totalAmount),
      outstandingBalance: parseFloat(totalAmount),
      date: invoiceDate,
      dueDate: dueDate,
      status: 'Pending Acceptance',
      category: 'General',
      buyer: clientName,
      seller: 'Chioma', // Current user
      type: 'sent',
      description: items[0]?.description || 'Services rendered'
    };

    addInvoice(newInvoice);
    navigate('/dashboard');
  };

  return (
    <main className="max-w-3xl mx-auto px-6 pt-8 pb-32">
      <InvoiceHeader onBack={() => navigate(-1)} />

      <form onSubmit={handleSubmit} className="space-y-8">
        <ClientDetailsSection 
          clientName={clientName} 
          setClientName={setClientName}
          clientEmail={clientEmail}
          setClientEmail={setClientEmail}
        />
        <InvoiceDetailsSection 
          invoiceDate={invoiceDate}
          setInvoiceDate={setInvoiceDate}
          dueDate={dueDate}
          setDueDate={setDueDate}
        />
        <LineItemsSection 
          items={items} 
          onAddItem={handleAddItem} 
          onRemoveItem={handleRemoveItem} 
          onItemChange={handleItemChange} 
          totalAmount={totalAmount} 
        />
        <InvoiceActions onCancel={() => navigate(-1)} />
      </form>
    </main>
  );
}
