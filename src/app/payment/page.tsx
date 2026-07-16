'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  QrCode, 
  AtSign, 
  Landmark, 
  Copy,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentPage() {
  const [method, setMethod] = useState<'qr' | 'id' | 'bank'>('qr');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success('Payment details submitted successfully!');
    }, 2000);
  };

  if (isSuccess) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center p-6 bg-[#fff7f9]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-12 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-[24px] font-semibold text-primary mb-2">Booking Confirmed!</h2>
          <p className="text-on-surface-variant mb-8">We have received your payment details. A confirmation email has been sent to you.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="w-full bg-primary text-white py-3 rounded-xl font-medium shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
          >
            Return to Home
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff7f9] flex flex-col items-center justify-center p-6 md:p-12">
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[600px]"
      >
        {/* Header Section */}
        <div className="text-center mb-10 mt-6">
          <h1 className="text-[32px] font-bold text-primary tracking-tighter mb-2">Ajay Films</h1>
          <p className="text-on-surface-variant font-medium text-[15px]">Secure Payment Gateway</p>
        </div>

        {/* The Main Glass Card */}
        <div className="glass-card rounded-2xl p-8 md:p-12 shadow-xl shadow-primary/5">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Customer Details Section */}
            <div className="space-y-6">
              <h2 className="text-[12px] font-bold text-primary uppercase tracking-widest border-b border-outline-variant/30 pb-2">Client Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-[12px] font-semibold text-on-surface-variant mb-1">Full Name</label>
                  <input className="bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary transition-colors text-[16px]" placeholder="Johnathan Doe" required type="text"/>
                </div>
                <div className="flex flex-col">
                  <label className="text-[12px] font-semibold text-on-surface-variant mb-1">Phone Number</label>
                  <input className="bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary transition-colors text-[16px]" placeholder="+91 98765 43210" required type="tel"/>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-[12px] font-semibold text-on-surface-variant mb-1">Email Address</label>
                <input className="bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary transition-colors text-[16px]" placeholder="hello@example.com" required type="email"/>
              </div>
            </div>

            {/* Amount Section */}
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
              <div className="flex flex-col">
                <label className="text-[14px] font-medium text-on-surface-variant mb-2">Enter amount to be paid</label>
                <input className="w-full bg-transparent border-b-2 border-primary/30 py-2 focus:outline-none focus:border-primary transition-colors text-[28px] font-semibold text-primary" placeholder="₹ 0" required type="number" min="1"/>
              </div>
            </div>
            {/* Payment Methods */}
            <div className="space-y-4">
              <h2 className="text-[12px] font-bold text-primary uppercase tracking-widest border-b border-outline-variant/30 pb-2">Select Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* UPI QR */}
                <button 
                  type="button"
                  onClick={() => setMethod('qr')}
                  className={`flex flex-col items-center justify-center p-4 border rounded-xl space-y-2 transition-all ${method === 'qr' ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-outline-variant/50 hover:bg-surface-variant/50'}`}
                >
                  <QrCode className="text-primary w-6 h-6" />
                  <span className="text-[12px] font-semibold text-on-surface">UPI QR</span>
                </button>
                {/* UPI ID */}
                <button 
                  type="button"
                  onClick={() => setMethod('id')}
                  className={`flex flex-col items-center justify-center p-4 border rounded-xl space-y-2 transition-all ${method === 'id' ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-outline-variant/50 hover:bg-surface-variant/50'}`}
                >
                  <AtSign className="text-primary w-6 h-6" />
                  <span className="text-[12px] font-semibold text-on-surface">UPI ID</span>
                </button>
                {/* Bank Transfer */}
                <button 
                  type="button"
                  onClick={() => setMethod('bank')}
                  className={`flex flex-col items-center justify-center p-4 border rounded-xl space-y-2 transition-all ${method === 'bank' ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-outline-variant/50 hover:bg-surface-variant/50'}`}
                >
                  <Landmark className="text-primary w-6 h-6" />
                  <span className="text-[12px] font-semibold text-on-surface">Bank Transfer</span>
                </button>
              </div>

              {/* Dynamic Payment Context */}
              <div className="mt-6 py-6 flex flex-col items-center bg-white/40 rounded-xl border border-white/60 min-h-[250px] justify-center">
                {method === 'qr' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                    <div className="w-48 h-48 bg-white p-2 rounded-lg shadow-inner mb-4 flex items-center justify-center border border-outline-variant/20 overflow-hidden">
                      <img src="https://tr2q7weus9.ufs.sh/f/hShRC6YS0vczpfnwFYsg5QThwSZY2ybePavjuxtz03Vdk6Hm" alt="QR Code" className="w-full h-full object-contain" />
                    </div>
                    <p className="text-[12px] font-medium text-on-surface-variant text-center px-6">Scan this QR code using any UPI app like GPay, PhonePe, or Paytm</p>
                  </motion.div>
                )}
                
                {method === 'id' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full px-8">
                    <label className="text-[12px] font-semibold text-on-surface-variant mb-1 block">PhonePe/GooglePay Number</label>
                    <div className="flex items-center gap-2 mb-4">
                      <input className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary transition-colors text-[24px] font-semibold text-primary" readOnly value="9938992712" type="text"/>
                      <button type="button" onClick={() => { navigator.clipboard.writeText('9938992712'); toast.success('Number copied!'); }} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="mt-2 text-[12px] text-on-surface-variant/60 italic text-center flex items-center justify-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Please transfer the amount to this number
                    </p>
                  </motion.div>
                )}

                {method === 'bank' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full px-8 space-y-3">
                    <div className="w-full flex items-center justify-between border-b border-outline-variant/30 pb-4">
                      <span className="text-[16px] text-on-surface font-semibold">Ajay Films Private Ltd</span>
                      <span className="bg-green-100 text-green-700 text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Verified Merchant</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-outline-variant/20 py-2 group cursor-pointer hover:bg-surface-variant/20 transition-colors px-1 -mx-1 rounded" onClick={() => { navigator.clipboard.writeText('SBI'); toast.success('Bank name copied!'); }}>
                      <span className="text-[12px] font-medium text-on-surface-variant">Bank Name</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[16px] text-on-surface font-semibold">SBI</span>
                        <Copy className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-b border-outline-variant/20 py-2 group cursor-pointer hover:bg-surface-variant/20 transition-colors px-1 -mx-1 rounded" onClick={() => { navigator.clipboard.writeText('39149567096'); toast.success('Account number copied!'); }}>
                      <span className="text-[12px] font-medium text-on-surface-variant">Account Number</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[16px] text-on-surface font-semibold">39149567096</span>
                        <Copy className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-b border-outline-variant/20 py-2 group cursor-pointer hover:bg-surface-variant/20 transition-colors px-1 -mx-1 rounded" onClick={() => { navigator.clipboard.writeText('SBIN0000068'); toast.success('IFSC copied!'); }}>
                      <span className="text-[12px] font-medium text-on-surface-variant">IFSC Code</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[16px] text-on-surface font-semibold">SBIN0000068</span>
                        <Copy className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="space-y-6 pt-4">
              <div className="flex flex-col space-y-2 mt-4">
                <label className="text-[12px] font-semibold text-on-surface-variant uppercase">Upload Payment Screenshot</label>
                <input type="file" accept="image/*" className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer" required />
              </div>

              <div className="bg-surface-variant/30 p-4 rounded-xl border border-outline-variant/30 mt-4 space-y-2">
                <h4 className="text-[12px] font-bold text-primary uppercase">Terms & Conditions</h4>
                <ul className="text-[12px] text-on-surface-variant space-y-1 list-disc pl-4">
                  <li>Booking amount is <strong>strictly non-refundable</strong>.</li>
                  <li>30% additional payment will be made to reschedule or change the date of the shoot.</li>
                  <li><strong>Payment Terms:</strong> 50% booking amount, then 30% during shoot, then 20% during delivery.</li>
                </ul>
              </div>

              <label className="flex items-start gap-3 cursor-pointer group mt-4">
                <div className="relative mt-1">
                  <input className="peer h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/20 cursor-pointer accent-primary" required type="checkbox"/>
                </div>
                <span className="text-[12px] font-medium text-on-surface-variant select-none">
                  I agree to the Terms & Conditions mentioned above.
                </span>
              </label>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-white text-[16px] font-bold py-4 rounded-xl shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 mt-4"
              >
                {isSubmitting ? 'Processing...' : 'Confirm Booking'}
              </button>
              
              <p className="text-center text-[12px] font-medium text-on-surface-variant/60 flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                Payments are 100% secure and encrypted
              </p>
            </div>
          </form>
        </div>
      </motion.main>
    </div>
  );
}
