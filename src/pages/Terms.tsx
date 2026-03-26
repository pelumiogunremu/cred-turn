import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, ShieldCheck, Scale } from 'lucide-react';

export default function Terms() {
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
        <h1 className="font-headline font-extrabold text-2xl text-on-surface">Terms of Service</h1>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/15 p-8 space-y-8">
        <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
          <Scale className="w-8 h-8 text-primary" />
          <div>
            <h2 className="font-bold text-on-surface">Last Updated</h2>
            <p className="text-sm text-on-surface-variant">March 26, 2026</p>
          </div>
        </div>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-on-surface">1. Acceptance of Terms</h3>
          <p className="text-on-surface-variant leading-relaxed">
            By accessing or using the CredTurn platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-on-surface">2. Description of Service</h3>
          <p className="text-on-surface-variant leading-relaxed">
            CredTurn provides a platform for managing business-to-business credit, invoicing, and payments. We facilitate trust through our CredTurn Score system and various repayment options.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-on-surface">3. User Responsibilities</h3>
          <p className="text-on-surface-variant leading-relaxed">
            Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account. You agree to provide accurate and complete information.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-on-surface">4. CredTurn Score</h3>
          <p className="text-on-surface-variant leading-relaxed">
            The CredTurn Score is a proprietary metric used to assess creditworthiness on our platform. While we strive for accuracy, we do not guarantee that the score reflects your actual credit standing with third-party institutions.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-on-surface">5. Limitation of Liability</h3>
          <p className="text-on-surface-variant leading-relaxed">
            CredTurn shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
          </p>
        </section>
      </div>
    </main>
  );
}
