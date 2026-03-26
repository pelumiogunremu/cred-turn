import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Eye, Lock } from 'lucide-react';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <main className="max-w-3xl mx-auto px-6 pt-8 pb-32">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container-high transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-on-surface" />
        </button>
        <h1 className="font-headline font-extrabold text-2xl text-on-surface">Privacy Policy</h1>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/15 p-8 space-y-8">
        <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
          <ShieldCheck className="w-8 h-8 text-primary" />
          <div>
            <h2 className="font-bold text-on-surface">Last Updated</h2>
            <p className="text-sm text-on-surface-variant">March 26, 2026</p>
          </div>
        </div>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-on-surface">1. Information We Collect</h3>
          <p className="text-on-surface-variant leading-relaxed">
            We collect information you provide directly to us, such as your name, email address, business details, and payment information. We also collect information about your transactions on the platform.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-on-surface">2. How We Use Your Information</h3>
          <p className="text-on-surface-variant leading-relaxed">
            We use the information we collect to provide, maintain, and improve our services, to process transactions, and to calculate your CredTurn Score.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-on-surface">3. Sharing of Information</h3>
          <p className="text-on-surface-variant leading-relaxed">
            We may share information with third-party service providers, lending partners, and other users as necessary to facilitate transactions and provide our services.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-on-surface">4. Data Security</h3>
          <p className="text-on-surface-variant leading-relaxed">
            We take reasonable measures to protect your personal information from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-on-surface">5. Your Choices</h3>
          <p className="text-on-surface-variant leading-relaxed">
            You may update or correct your account information at any time by logging into your account settings. You may also request deletion of your account.
          </p>
        </section>
      </div>
    </main>
  );
}
