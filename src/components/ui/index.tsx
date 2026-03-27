import React from 'react';
import { ArrowLeft } from 'lucide-react';

// ==========================================
// Atom: Back Button
// ==========================================
export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ct-btn-back"
      aria-label="Go back"
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  );
}

// ==========================================
// Atom: Page Header (Back + Title + Subtitle)
// ==========================================
export function PageHeader({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
}) {
  return (
    <div className="ct-page-header">
      <BackButton onClick={onBack} />
      <div>
        <h1 className="text-2xl font-extrabold font-headline text-on-surface">{title}</h1>
        {subtitle && (
          <p className="text-sm text-on-surface-variant font-medium mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

// ==========================================
// Atom: Form Field (Label + Input + Error)
// ==========================================
export function FormField({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="ct-label">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-error font-medium ml-0.5 mt-1">{error}</p>}
    </div>
  );
}

// ==========================================
// Atom: Standard Text Input
// ==========================================
export function TextInput({
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  required,
  min,
  step,
}: {
  id?: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  min?: string;
  step?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      min={min}
      step={step}
      className="ct-input"
    />
  );
}

// ==========================================
// Atom: Status Badge
// ==========================================
const STATUS_STYLES: Record<string, string> = {
  'Paid': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Partially Paid': 'bg-blue-50 text-blue-700 border-blue-200',
  'Not Due': 'bg-teal-50 text-teal-700 border-teal-200',
  'Due': 'bg-amber-50 text-amber-700 border-amber-200',
  'Overdue': 'bg-red-50 text-red-700 border-red-200',
  'Pending': 'bg-orange-50 text-orange-700 border-orange-200',
  'Rejected': 'bg-red-50 text-red-700 border-red-200',
  'Expired': 'bg-surface-container-high text-on-surface-variant border-outline-variant/30',
  'default': 'bg-surface-container-low text-on-surface-variant border-outline-variant/20',
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES['default'];
  return (
    <span className={`ct-badge ${style}`}>
      {status}
    </span>
  );
}

// ==========================================
// Molecule: Empty State
// ==========================================
export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
}) {
  return (
    <div className="py-24 text-center ct-card">
      <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-4 text-on-surface-variant/30">
        <Icon className="w-10 h-10" />
      </div>
      <p className="text-on-surface-variant font-bold">{title}</p>
      {description && (
        <p className="text-sm text-on-surface-variant/60 mt-1 max-w-xs mx-auto">{description}</p>
      )}
    </div>
  );
}

// ==========================================
// Atom: Section Card wrapper
// ==========================================
export function SectionCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`ct-card p-6 space-y-6 ${className}`}>
      {children}
    </section>
  );
}

// ==========================================
// Atom: Section Card Title
// ==========================================
export function SectionTitle({
  icon: Icon,
  children,
}: {
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <h2 className="ct-section-title">
      {Icon && <Icon className="w-5 h-5 text-primary" />}
      {children}
    </h2>
  );
}
