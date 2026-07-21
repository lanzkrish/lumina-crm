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
import { UploadButton } from '@/utils/uploadthing';
import { createPayment } from '@/app/actions';

export default function PaymentPage() {
  const [method, setMethod] = useState<'qr' | 'id' | 'bank'>('qr');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    amount: ''
  });
  const [screenshotUrl, setScreenshotUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshotUrl) {
      toast.error('Please upload a payment screenshot first');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createPayment({
        ...formData,
        amount: Number(formData.amount),
        paymentMethod: method === 'qr' ? 'UPI QR' : method === 'id' ? 'UPI ID' : 'Bank Transfer',
        screenshotUrl,
        status: 'PENDING'
      });
      setIsSuccess(true);
      toast.success('Payment submitted successfully!');
    } catch (err) {
      toast.error('Failed to submit payment details');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('pdf-agreement-container');
      if (!element) return;
      
      element.style.display = 'block';
      
      await html2pdf().from(element).set({
        margin: [15, 15],
        filename: 'Momentary_Studio_Invoice_and_Agreement.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).save();
      
      element.style.display = 'none';
      toast.success('PDF Downloaded Successfully');
    } catch (e) {
      toast.error('Failed to generate PDF');
    } finally {
      setIsDownloading(false);
    }
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
          <h2 className="text-[24px] font-semibold text-primary mb-2">Invoice Generated</h2>
          <p className="text-on-surface-variant mb-6">Your payment details have been received and an invoice has been generated.</p>
          
          <div className="bg-surface-variant/30 p-6 rounded-xl text-left space-y-3 mb-8 border border-outline-variant/30">
            <div className="flex justify-between border-b border-outline-variant/20 pb-2">
              <span className="text-[14px] text-on-surface-variant">Name</span>
              <span className="text-[14px] font-medium text-primary">{formData.customerName}</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/20 pb-2">
              <span className="text-[14px] text-on-surface-variant">Amount</span>
              <span className="text-[14px] font-medium text-primary">₹{formData.amount}</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/20 pb-2">
              <span className="text-[14px] text-on-surface-variant">Status</span>
              <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wider">PENDING VERIFICATION</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-[14px] text-on-surface-variant">Date</span>
              <span className="text-[14px] font-medium text-primary">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="w-full bg-primary text-white py-3 rounded-xl font-medium shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity disabled:opacity-70"
            >
              {isDownloading ? 'Generating PDF...' : 'Download Invoice & Agreement PDF'}
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-surface-variant text-on-surface-variant py-3 rounded-xl font-medium hover:bg-surface-variant/80 transition-colors"
            >
              Submit Another Payment
            </button>
          </div>
        </motion.div>

        {/* Hidden PDF Template */}
        <div id="pdf-agreement-container" style={{ display: 'none', width: '800px', padding: '40px', backgroundColor: 'white', color: 'black', fontFamily: 'sans-serif' }}>
          {/* Page 1: Invoice */}
          <div style={{ minHeight: '1050px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '20px' }}>PAYMENT RECEIPT</h1>
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Client Name:</strong> {formData.customerName}</p>
            <p><strong>Phone:</strong> {formData.phone}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Amount Paid:</strong> ₹{formData.amount}</p>
            <p><strong>Payment Method:</strong> {method === 'qr' ? 'UPI QR' : method === 'id' ? 'UPI ID' : 'Bank Transfer'}</p>
            
            <div style={{ marginTop: '40px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Payment Proof:</h3>
              {screenshotUrl && (
                <img src={screenshotUrl} alt="Payment Screenshot" style={{ maxWidth: '400px', border: '1px solid #ccc' }} />
              )}
            </div>
          </div>
          
          {/* Page Break for html2pdf */}
          <div className="html2pdf__page-break"></div>

          {/* Page 2: Agreement */}
          <div style={{ minHeight: '1050px', paddingTop: '20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0' }}>MOMENTARY STUDIO</h2>
              <h3 style={{ fontSize: '18px', margin: '5px 0 0 0' }}>PHOTOGRAPHY & VIDEOGRAPHY AGREEMENT</h3>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '5px' }}>1. CLIENT & EVENT DETAILS</h4>
              <p><strong>Client Name(s):</strong> {formData.customerName}</p>
              <p><strong>Event Date & Time:</strong> TBD</p>
              <p><strong>Event Location:</strong> TBD</p>
              <p><strong>Services (Photo/Video):</strong> TBD</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '5px' }}>2. PAYMENT TERMS</h4>
              <p><strong>Total Contract Fee:</strong> TBD</p>
              <p><strong>Amount Paid:</strong> ₹{formData.amount}</p>
              <p><strong>Balance Due Date:</strong> TBD</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '5px' }}>3. TERMS & CONDITIONS</h4>
              <p style={{ marginBottom: '10px', fontSize: '14px', lineHeight: '1.5' }}>
                <strong>Scope of Work:</strong> Momentary Studio agrees to provide photography and/or videography services as outlined in Section 1. Final edited deliverables will be provided to the Client within 4-6 weeks of the event date.
              </p>
              <p style={{ marginBottom: '10px', fontSize: '14px', lineHeight: '1.5' }}>
                <strong>Cancellations & Rescheduling:</strong> If the Client cancels this agreement, the retainer fee is strictly non-refundable. Rescheduling is subject to studio availability; if the studio cannot accommodate the new date, the retainer is forfeited.
              </p>
              <p style={{ marginBottom: '10px', fontSize: '14px', lineHeight: '1.5' }}>
                <strong>Copyright & Usage:</strong> Momentary Studio retains the legal copyright to all captured images and video footage. The Client is granted a personal use license to print and share the media. The Client may not apply additional filters or re-edit the final deliverables.
              </p>
              <p style={{ marginBottom: '10px', fontSize: '14px', lineHeight: '1.5' }}>
                <strong>Revisions (Video Only):</strong> The total fee includes one round of standard revisions for video deliverables. Any additional edits requested by the Client will be billed at an hourly rate.
              </p>
              <p style={{ marginBottom: '10px', fontSize: '14px', lineHeight: '1.5' }}>
                <strong>Model Release:</strong> The Client grants Momentary Studio permission to use the photographs and/or videos for marketing, professional portfolio, website, and promotional purposes.
              </p>
              <p style={{ marginBottom: '10px', fontSize: '14px', lineHeight: '1.5' }}>
                <strong>Limit of Liability:</strong> If Momentary Studio cannot perform this agreement due to an act of God, extreme weather, severe illness, or equipment failure beyond their control, liability is limited to a full refund of all monies paid. The studio is not liable for missed shots due to lack of client cooperation or scheduling delays.
              </p>
            </div>

            <div style={{ marginTop: '50px' }}>
              <p style={{ fontSize: '14px' }}>By completing the payment online, the Client electronically agrees to these terms and conditions.</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                <div style={{ borderTop: '1px solid #000', width: '200px', paddingTop: '5px' }}>
                  <p style={{ margin: '0', fontSize: '14px' }}>Client Signature: <em>{formData.customerName}</em></p>
                  <p style={{ margin: '0', fontSize: '12px' }}>Date: {new Date().toLocaleDateString()}</p>
                </div>
                <div style={{ borderTop: '1px solid #000', width: '200px', paddingTop: '5px' }}>
                  <p style={{ margin: '0', fontSize: '14px' }}>Momentary Studio</p>
                  <p style={{ margin: '0', fontSize: '12px' }}>Date: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

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
          <h1 className="text-[32px] font-bold text-primary tracking-tighter mb-2">Arjun Photography</h1>
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
                  <input value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary transition-colors text-[16px]" placeholder="Johnathan Doe" required type="text"/>
                </div>
                <div className="flex flex-col">
                  <label className="text-[12px] font-semibold text-on-surface-variant mb-1">Phone Number</label>
                  <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary transition-colors text-[16px]" placeholder="+91 98765 43210" required type="tel"/>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-[12px] font-semibold text-on-surface-variant mb-1">Email Address</label>
                <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary transition-colors text-[16px]" placeholder="hello@example.com" required type="email"/>
              </div>
            </div>

            {/* Amount Section */}
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
              <div className="flex flex-col">
                <label className="text-[14px] font-medium text-on-surface-variant mb-2">Enter amount to be paid</label>
                <input value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full bg-transparent border-b-2 border-primary/30 py-2 focus:outline-none focus:border-primary transition-colors text-[28px] font-semibold text-primary" placeholder="₹ 0" required type="number" min="1"/>
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
                      <span className="text-[16px] text-on-surface font-semibold">Babul Samal</span>
                      <span className="text-[11px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Verified Account</span>
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
              <div className="flex flex-col space-y-2 mt-4 items-start">
                <label className="text-[12px] font-semibold text-on-surface-variant uppercase mb-2">Upload Payment Screenshot</label>
                {screenshotUrl ? (
                  <div className="flex items-center gap-4 bg-green-50 p-4 rounded-xl border border-green-200 w-full">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <span className="text-[14px] font-medium text-green-800">Screenshot uploaded successfully!</span>
                  </div>
                ) : (
                  <div className="w-full p-4 border-2 border-dashed border-primary/20 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors">
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        setScreenshotUrl(res[0].url);
                        toast.success("Screenshot uploaded");
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`ERROR! ${error.message}`);
                      }}
                      appearance={{
                        button: "bg-primary text-white text-[14px] font-medium px-4 py-2 rounded-lg",
                        allowedContent: "hidden"
                      }}
                    />
                  </div>
                )}
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
                  I agree to the Terms & Conditions and understand that upon confirming, I agree to the Momentary Studio Photography & Videography Agreement, which will be generated as a PDF.
                </span>
              </label>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-white text-[16px] font-bold py-4 rounded-xl shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 mt-4"
              >
                {isSubmitting ? 'Processing...' : 'Confirm Payment'}
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
