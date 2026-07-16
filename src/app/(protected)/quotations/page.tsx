'use client';

import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  MapPin, 
  Plus, 
  Trash2, 
  FileText,
  Printer,
  Link as LinkIcon
} from 'lucide-react';
import { createQuotation } from '@/services/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function QuotationsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    location: '',
    bookingDate: '',
    eventType: 'Wedding Ceremony',
    discount: 0,
    paymentTerms: '50% Advance, 50% on Delivery',
    termsConditions: 'Standard terms apply.'
  });
  const [services, setServices] = useState([
    { id: '1', name: '', quantity: 1, price: 0 }
  ]);
  const [loading, setLoading] = useState(false);

  const subTotal = services.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gst = Math.round((subTotal - formData.discount) * 0.18);
  const grandTotal = subTotal - formData.discount + gst;

  const handleAddService = () => {
    setServices([...services, { id: Date.now().toString(), name: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const handleServiceChange = (id: string, field: string, value: string | number) => {
    setServices(services.map(s => {
      if (s.id === id) {
        return { ...s, [field]: value };
      }
      return s;
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await createQuotation({
        ...formData,
        services,
        gst,
        subTotal,
        grandTotal
      });
      toast.success('Quotation generated successfully');
      router.push('/dashboard');
    } catch (e) {
      toast.error('Failed to create quotation');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPaymentLink = () => {
    const link = `${window.location.origin}/payment`;
    navigator.clipboard.writeText(link);
    toast.success('Payment link copied to clipboard!');
  };

  const handleGeneratePDF = () => {
    const printWindow = window.open('', '', 'height=800,width=800');
    if (!printWindow) {
      toast.error('Pop-up blocked! Please allow pop-ups for this site.');
      return;
    }

    const servicesHtml = services.map(s => `
      <tr>
        <td class="package">
          <h4>${s.name || 'Service Item'}</h4>
        </td>
        <td style="text-align:center;font-weight:bold;">₹${s.price.toLocaleString()} x ${s.quantity}</td>
        <td style="text-align:center;font-weight:bold;">₹${(s.price * s.quantity).toLocaleString()}</td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <title>Quotation - Arjun Photography</title>
      <style>
      @page{size:A4;margin:10mm}
      *{box-sizing:border-box}
      body{margin:0;background:#e4e4ff;font-family:Arial,Helvetica,sans-serif;color:#333;padding:20px}
      .container{max-width:800px;margin:auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.12)}
      .header{background:linear-gradient(135deg,#5c0656,#8d2d88);color:#fff;padding:24px;display:flex;justify-content:space-between}
      .header h1{margin:0;font-size:30px}
      .header p{margin:4px 0;font-size:13px}
      .section{padding:20px}
      .grid{display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:16px}
      .card{background:#f6f3ff;border-left:5px solid #5c0656;border-radius:10px;padding:14px}
      .card h3{margin:0 0 8px;color:#5c0656}
      table{width:100%;border-collapse:collapse}
      th{background:#5c0656;color:#fff;padding:10px;text-align:left}
      td{padding:12px;border-bottom:1px solid #ddd;vertical-align:top}
      .package h4{margin:8px 0;color:#5c0656}
      .summary{width:280px;margin-left:auto;margin-top:12px}
      .summary td{padding:8px}
      .total{background:linear-gradient(135deg,#5c0656,#8d2d88);color:#fff;font-weight:bold}
      .payment h3,.terms h3{color:#5c0656;margin:16px 0 10px}
      .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
      .step{background:#f5f2ff;border:1px solid #d9c8ff;border-radius:10px;padding:10px;text-align:center}
      .step .pct{font-size:24px;font-weight:bold;color:#5c0656}
      .step p{margin:4px 0;font-size:12px}
      .terms{background:#faf8ff;border-left:5px solid #5c0656;border-radius:10px;padding:12px;margin-top:15px}
      .terms ol{margin:0;padding-left:18px;font-size:12px;line-height:1.45}
      .footer{background:#5c0656;color:#fff;padding:16px;display:flex;justify-content:space-between;font-size:13px}
      @media print{
      body{padding:0;background:#fff}
      .container{box-shadow:none;border-radius:0;max-width:100%}
      }
      </style>
      </head>
      <body>
      <div class="container">
      <div class="header">
      <div>
      <h1>ARJUN PHOTOGRAPHY</h1>
      <p>Dharam Vihar, Jagamara, Bhubaneswar, Odisha - 751030</p>
      <p>📞 +91 7788992712 | ✉️ bsamal2712@gmail.com</p>
      <p>Instagram: @arjun_photographyyy</p>
      </div>
      <div style="text-align:right">
      <p><b>Quotation No:</b> ${Date.now().toString().slice(-4)}</p>
      <p><b>Date:</b> ${formData.bookingDate || new Date().toLocaleDateString()}</p>
      </div>
      </div>

      <div class="section">
      <div class="grid">
      <div class="card">
      <h3>Quotation To</h3>
      <p><b>${formData.customerName || 'Client Name'}</b><br>Mail: ${formData.email || '__________'}<br>Address: ${formData.location || '__________'}</p>
      </div>
      <div class="card">
      <h3>Payment</h3>
      <p>Tax: ₹${gst.toLocaleString()}<br>PhonePe: <b>7788992712</b><br>Total: <b>₹${grandTotal.toLocaleString()}</b></p>
      </div>
      </div>

      <table>
      <tr><th>Description</th><th width="120">Rate</th><th width="120">Subtotal</th></tr>
      ${servicesHtml}
      </table>

      <table class="summary">
      <tr><td>Subtotal</td><td align="right">₹${subTotal.toLocaleString()}</td></tr>
      <tr><td>Discount</td><td align="right">-₹${formData.discount.toLocaleString()}</td></tr>
      <tr><td>GST (18%)</td><td align="right">₹${gst.toLocaleString()}</td></tr>
      <tr class="total"><td>Grand Total</td><td align="right">₹${grandTotal.toLocaleString()}</td></tr>
      </table>

      <div class="payment">
      <h3>Payment Schedule</h3>
      <div class="steps">
      <div class="step"><div class="pct">50%</div><p><b>Booking</b></p><p>Advance Payment</p></div>
      <div class="step"><div class="pct">30%</div><p><b>Event Day</b></p><p>During Shoot</p></div>
      <div class="step"><div class="pct">20%</div><p><b>Delivery</b></p><p>Before Delivery</p></div>
      </div>
      </div>

      <div class="terms">
      <h3>Terms & Conditions</h3>
      <ol>
      <li>50% advance is required to confirm the booking.</li>
      <li>30% payment is due during the shoot.</li>
      <li>Remaining 20% must be paid before final delivery.</li>
      <li>Booking amount is strictly <b>non-refundable</b> upon cancellation.</li>
      <li>Rescheduling is available subject to availability with <b>30% extra charges</b>.</li>
      <li>Drone coverage depends on weather and permissions.</li>
      <li>Raw files are not included unless agreed separately.</li>
      <li>Additional services beyond this quotation will be charged separately.</li>
      </ol>
      </div>
      </div>

      <div class="footer">
      <div><b>Thank you for choosing Arjun Photography!</b><br>We look forward to capturing your beautiful memories.</div>
      <div style="text-align:right">📞 +91 7788992712<br>✉ bsamal2712@gmail.com</div>
      </div>
      </div>
      <script>
        window.onload = function() { window.print(); window.onafterprint = function() { window.close(); } };
      </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Left Column: Form Details */}
      <div className="col-span-12 lg:col-span-8 space-y-8">
        {/* Client Info */}
        <section className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <User className="text-primary w-6 h-6" />
            <h3 className="text-[24px] font-medium text-primary">Client Information</h3>
          </div>
          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Full Name</label>
              <input 
                className="bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary transition-colors text-[16px]" 
                placeholder="e.g. Alexandra Vane" 
                value={formData.customerName}
                onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                type="text"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Phone</label>
                <input 
                  className="bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary transition-colors text-[16px]" 
                  placeholder="+91 90000 00000" 
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  type="tel"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Email</label>
                <input 
                  className="bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary transition-colors text-[16px]" 
                  placeholder="alex@example.com" 
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  type="email"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Project Details */}
        <section className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="text-primary w-6 h-6" />
            <h3 className="text-[24px] font-medium text-primary">Project Details</h3>
          </div>
          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Event Type</label>
              <select 
                className="bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary transition-colors text-[16px]"
                value={formData.eventType}
                onChange={e => setFormData({ ...formData, eventType: e.target.value })}
              >
                <option>Editorial Fashion</option>
                <option>Wedding Ceremony</option>
                <option>Corporate Branding</option>
                <option>Product Photography</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Event Date</label>
              <input 
                className="bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary transition-colors text-[16px]" 
                type="date"
                value={formData.bookingDate}
                onChange={e => setFormData({ ...formData, bookingDate: e.target.value })}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-0 top-3 text-on-surface-variant w-4 h-4" />
                <input 
                  className="w-full bg-transparent border-b border-outline-variant py-2 pl-6 focus:outline-none focus:border-primary transition-colors text-[16px]" 
                  placeholder="Studio A or On-site address" 
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  type="text"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Deliverables */}
        <section className="glass-card p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[24px] font-medium text-primary">Deliverables & Pricing</h3>
            <button 
              onClick={handleAddService}
              className="flex items-center gap-2 text-primary font-semibold hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-[14px]">Add Item</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {services.map((service, index) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-12 gap-4 items-end bg-surface-container-low p-4 rounded-xl border border-outline-variant/30"
              >
                <div className="col-span-12 md:col-span-5 flex flex-col">
                  <label className="text-[12px] font-semibold text-on-surface-variant mb-1">Item Description</label>
                  <input 
                    className="bg-transparent border-b border-outline-variant py-1 focus:outline-none focus:border-primary" 
                    placeholder="e.g. 8 Hours Coverage" 
                    value={service.name}
                    onChange={e => handleServiceChange(service.id, 'name', e.target.value)}
                    type="text"
                  />
                </div>
                <div className="col-span-4 md:col-span-2 flex flex-col">
                  <label className="text-[12px] font-semibold text-on-surface-variant mb-1">Qty</label>
                  <input 
                    className="bg-transparent border-b border-outline-variant py-1 focus:outline-none focus:border-primary" 
                    value={service.quantity}
                    onChange={e => handleServiceChange(service.id, 'quantity', parseInt(e.target.value) || 0)}
                    type="number"
                    min="1"
                  />
                </div>
                <div className="col-span-6 md:col-span-3 flex flex-col">
                  <label className="text-[12px] font-semibold text-on-surface-variant mb-1">Unit Price (₹)</label>
                  <input 
                    className="bg-transparent border-b border-outline-variant py-1 focus:outline-none focus:border-primary" 
                    value={service.price}
                    onChange={e => handleServiceChange(service.id, 'price', parseInt(e.target.value) || 0)}
                    type="number"
                  />
                </div>
                <div className="col-span-2 md:col-span-2 flex justify-end pb-1">
                  <button 
                    onClick={() => handleRemoveService(service.id)}
                    className="p-2 text-error hover:bg-error-container/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <div className="w-full md:w-1/2 space-y-4">
              <div className="flex justify-between items-center text-[16px]">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="font-semibold text-primary">₹{subTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-[16px]">
                <span className="text-on-surface-variant">Discount</span>
                <input 
                  className="w-24 bg-transparent border-b border-outline-variant text-right focus:outline-none focus:border-primary"
                  value={formData.discount}
                  onChange={e => setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })}
                  type="number"
                />
              </div>
              <div className="flex justify-between items-center text-[16px]">
                <span className="text-on-surface-variant">GST (18%)</span>
                <span className="text-on-surface-variant">₹{gst.toLocaleString()}</span>
              </div>
              <div className="h-px w-full bg-outline-variant/30 my-4"></div>
              <div className="flex justify-between items-center text-[24px]">
                <span className="font-medium text-primary">Grand Total</span>
                <span className="font-semibold text-primary">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Right Column: Actions & Preview */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <section className="glass-card p-6 sticky top-28">
          <h3 className="text-[18px] font-medium text-primary mb-6">Actions</h3>
          
          <button 
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-xl mb-3 shadow-lg shadow-primary/20 flex justify-center gap-2 items-center transition-all active:scale-[0.98]"
          >
            <FileText className="w-5 h-5" />
            <span>{loading ? 'Saving...' : 'Save Quotation'}</span>
          </button>
          
          <button onClick={handleGeneratePDF} className="w-full bg-primary-container/10 hover:bg-primary-container/20 text-primary font-medium py-3 rounded-xl mb-3 border border-primary/20 flex justify-center gap-2 items-center transition-all">
            <Printer className="w-5 h-5" />
            <span>Generate PDF</span>
          </button>

          <button onClick={handleCopyPaymentLink} className="w-full bg-white hover:bg-surface-variant text-primary font-medium py-3 rounded-xl border border-outline-variant/50 flex justify-center gap-2 items-center transition-all">
            <LinkIcon className="w-5 h-5" />
            <span>Copy Payment Link</span>
          </button>

        </section>
      </div>
    </div>
  );
}
