import React, { useState, useRef } from 'react';
import { ArrowLeft, User, Calendar, FileText, Send, Plus, Trash2, CalendarDays, Banknote } from 'lucide-react';
import { FormField, SectionCard, SectionTitle } from '../ui';

type LineItem = { id: number; description: string; amount: string };

// Shared uniform input class — no special overrides per field
const INPUT_CLS = "w-full px-4 py-3.5 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all font-medium text-on-surface placeholder:text-on-surface-variant/40 text-sm";

export function InvoiceHeader({ onBack }: { onBack: () => void }) {
  return (
    <div className="ct-page-header">
      <button type="button" onClick={onBack} className="ct-btn-back">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-on-surface font-headline">Create Invoice</h1>
        <p className="text-sm text-on-surface-variant font-medium mt-0.5">Request payment or settlement</p>
      </div>
    </div>
  );
}

export function ClientDetailsSection({ 
  clientName, setClientName, clientEmail, setClientEmail 
}: { 
  clientName: string, setClientName: (v: string) => void, 
  clientEmail: string, setClientEmail: (v: string) => void 
}) {
  return (
    <SectionCard>
      <SectionTitle icon={User}>Client Details</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Client Name / Company" id="clientName">
          <input
            id="clientName"
            type="text"
            className={INPUT_CLS}
            placeholder="e.g. Tunde Enterprise"
            required
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </FormField>
        <FormField label="Client Email" id="clientEmail">
          <input
            id="clientEmail"
            type="email"
            className={INPUT_CLS}
            placeholder="billing@tunde.com"
            required
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
          />
        </FormField>
      </div>
    </SectionCard>
  );
}

// Modern date picker with a visible calendar trigger button
function ModernDatePicker({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const displayValue = value
    ? new Date(value + 'T00:00').toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <FormField label={label} id={id}>
      <div className="relative group">
        {/* Hidden real date input covering the whole area */}
        <input
          id={id}
          type="date"
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        {/* Visible styled display */}
        <div
          className={`${INPUT_CLS} flex items-center justify-between group-hover:border-primary transition-colors`}
        >
          <span className={value ? 'text-on-surface' : 'text-on-surface-variant/40'}>
            {displayValue || 'Select date'}
          </span>
          <CalendarDays className="w-4 h-4 text-primary shrink-0" />
        </div>
      </div>
    </FormField>
  );
}

export function InvoiceDetailsSection({
  invoiceDate, setInvoiceDate, dueDate, setDueDate
}: {
  invoiceDate: string, setInvoiceDate: (v: string) => void,
  dueDate: string, setDueDate: (v: string) => void
}) {
  return (
    <SectionCard>
      <SectionTitle icon={Calendar}>Invoice Details</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ModernDatePicker id="invoiceDate" label="Invoice Date" value={invoiceDate} onChange={setInvoiceDate} />
        <ModernDatePicker id="dueDate" label="Due Date" value={dueDate} onChange={setDueDate} />
      </div>
    </SectionCard>
  );
}

export function LineItemsSection({ items, onAddItem, onRemoveItem, onItemChange, totalAmount }: { 
  items: LineItem[], 
  onAddItem: () => void, 
  onRemoveItem: (id: number) => void, 
  onItemChange: (index: number, field: 'description' | 'amount', value: string) => void,
  totalAmount: string 
}) {
  return (
    <SectionCard>
      <div className="flex items-center justify-between">
        <SectionTitle icon={FileText}>Line Items</SectionTitle>
        <button type="button" onClick={onAddItem} className="text-sm font-bold text-primary hover:text-primary/80 flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>
      
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-start gap-4 p-4 bg-surface-container-low/60 rounded-2xl border border-outline-variant/10">
            <div className="flex-grow space-y-4">
              <FormField label="Description">
                <input
                  type="text"
                  className={INPUT_CLS}
                  placeholder="Service or product description"
                  required
                  value={item.description}
                  onChange={(e) => onItemChange(index, 'description', e.target.value)}
                />
              </FormField>
              <FormField label="Amount (₦)">
                {/* FIX: ₦ symbol inside label, not overlapping the input value */}
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 font-bold text-sm pointer-events-none select-none z-10">₦</span>
                  <input
                    className={`${INPUT_CLS} pl-8`}
                    placeholder="0.00"
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.amount === '' ? '' : item.amount}
                    onChange={(e) => onItemChange(index, 'amount', e.target.value)}
                  />
                </div>
              </FormField>
            </div>
            {items.length > 1 && (
              <button type="button" onClick={() => onRemoveItem(item.id)} className="mt-8 p-2.5 text-error/60 hover:text-error hover:bg-error/10 rounded-xl transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-outline-variant/15 flex justify-end">
        <div className="w-full max-w-xs space-y-3">
          <div className="flex justify-between text-sm text-on-surface-variant font-medium">
            <span>Subtotal</span>
            <span>₦{totalAmount}</span>
          </div>
          <div className="flex justify-between text-sm text-on-surface-variant font-medium">
            <span>Tax (0%)</span>
            <span>₦0.00</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-on-surface pt-3 border-t border-outline-variant/15">
            <span>Total</span>
            <span className="text-primary">₦{totalAmount}</span>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

export function InvoiceActions({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="space-y-3 pt-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <button type="button" onClick={onCancel} className="ct-btn-secondary flex-1">
          Cancel
        </button>
        <button type="submit" className="ct-btn-primary flex-[2]">
          Send Invoice
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
