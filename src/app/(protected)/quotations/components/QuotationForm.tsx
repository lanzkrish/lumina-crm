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
  Eye,
  Link as LinkIcon
} from 'lucide-react';
import { createQuotation, updateQuotation, getEventTypes, createEventType, getProjects } from '@/app/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function QuotationForm({ initialData, quotationId, projectId }: { initialData?: any, quotationId?: string, projectId?: string }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    customerName: initialData?.customerName || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    location: initialData?.location || '',
    bookingDate: initialData?.bookingDate ? new Date(initialData.bookingDate).toISOString().split('T')[0] : '',
    eventType: initialData?.eventType || 'Wedding Ceremony',
    discount: initialData?.discount || 0,
    paymentTerms: initialData?.paymentTerms || '50% Advance, 50% on Delivery',
    termsConditions: initialData?.termsConditions || 'Standard terms apply.'
  });
  const [services, setServices] = useState(
    initialData?.services 
      ? initialData.services.map((s: any) => ({ ...s, id: s._id || s.id || Math.random().toString() }))
      : [{ id: '1', name: '', description: '', quantity: 1, price: 0 }]
  );
  const [loading, setLoading] = useState(false);
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  const [isCustomEvent, setIsCustomEvent] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || initialData?.projectId || '');

  React.useEffect(() => {
    getEventTypes().then(setEventTypes);
    getProjects().then(setProjects);
  }, []);

  const subTotal = services.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  const grandTotal = subTotal - formData.discount;

  const handleAddService = () => {
    setServices([...services, { id: Date.now().toString(), name: '', description: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveService = (id: string) => {
    setServices(services.filter((s: any) => s.id !== id));
  };

  const handleServiceChange = (id: string, field: string, value: string | number) => {
    setServices(services.map((s: any) => {
      if (s.id === id) {
        return { ...s, [field]: value };
      }
      return s;
    }));
  };

  const saveToDatabase = async () => {
    try {
      let finalEventType = formData.eventType;
      if (isCustomEvent && finalEventType) {
        const newType = await createEventType(finalEventType);
        finalEventType = newType.name;
      }

      if (quotationId) {
        await updateQuotation(quotationId, { ...formData, eventType: finalEventType, services, subTotal, grandTotal, projectId: selectedProjectId || undefined });
      } else {
        await createQuotation({ ...formData, eventType: finalEventType, services, subTotal, grandTotal, projectId: selectedProjectId || undefined });
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const success = await saveToDatabase();
    if (success) {
      toast.success(quotationId ? 'Quotation updated successfully' : 'Quotation generated successfully');
      await handleGeneratePDF();
      router.push('/quotations');
    } else {
      toast.error('Failed to save quotation');
    }
    setLoading(false);
  };

  const handleCopyPaymentLink = () => {
    const link = `${window.location.origin}/payment`;
    navigator.clipboard.writeText(link);
    toast.success('Payment link copied to clipboard!');
  };

  const generateHTML = () => {
    const servicesHtml = services.map((s: any) => {
      const details = (s.description || '')
        .split(/\r\n|\n|\r/)
        .filter((line: string) => line.trim())
        .map((line: string) => `<div style="font-size:11px; color:#555; margin-top:2px;">${line.trim()}</div>`)
        .join('');
      return `
      <tr>
        <td class="package">
          <h4 style="margin:0 0 4px; font-size:16px;">${s.name || 'Service Item'}</h4>
          ${details}
        </td>
        <td style="text-align:center; padding-top:12px; font-size:14px;">₹${s.price.toLocaleString()}</td>
        <td style="text-align:right; padding-top:12px; font-size:14px;">₹${(s.price * s.quantity).toLocaleString()}</td>
      </tr>
      `;
    }).join('');

    return `
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
      .header{background:#e8e4ff;color:#5e006f;padding:24px;display:flex;justify-content:space-between}
      .header h1{margin:0;font-size:30px}
      .header p{margin:4px 0;font-size:13px;color:#333;}
      .section{padding:20px}
      .card{background:#f6f3ff;border-left:5px solid #5c0656;border-radius:10px;padding:14px; margin-bottom:16px;}
      .card h3{margin:0 0 8px;color:#5c0656}
      table{width:100%;border-collapse:collapse}
      th{background:#e8e4ff;color:#5e006f;padding:10px;text-align:left}
      th.rate{text-align:center;width:120px;}
      th.subtotal{text-align:right;width:120px;}
      td{padding:12px;border-bottom:none;vertical-align:top}
      .package h4{color:#5c0656}
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
      <p>Ph: +91 7788992712</p>
      <p>Mail: bsamal2712@gmail.com</p>
      <p>Dharam Vihar, Jagamara, Bhubaneswar, Odisha - 751030</p>
      </div>
      <div style="text-align:right">
      <p style="color:#5e006f;"><b>Quotation No:</b> ${quotationId ? quotationId.slice(-4) : Date.now().toString().slice(-4)}</p>
      <p style="color:#5e006f;"><b>Invoice Date:</b> ${new Date().toLocaleDateString()}</p>
      <p style="color:#5e006f;"><b>Booking Date:</b> ${formData.bookingDate ? new Date(formData.bookingDate).toLocaleDateString() : 'TBD'}</p>
      </div>
      </div>

      <div class="section">
      <div class="card">
      <h3>Quotation To</h3>
      <p><b>${formData.customerName || 'Client Name'}</b><br>Mail: ${formData.email || '__________'}<br>Address: ${formData.location || '__________'}</p>
      </div>

      <table>
      <tr>
        <th>Description</th>
        <th class="rate">Rate</th>
        <th class="subtotal">Subtotal</th>
      </tr>
      ${servicesHtml}
      </table>

      <table class="summary">
      <tr><td>Subtotal</td><td align="right">₹${subTotal.toLocaleString()}</td></tr>
      <tr><td>Discount</td><td align="right">₹${formData.discount || 0}</td></tr>
      <tr class="total"><td>Grand Total</td><td align="right">₹${grandTotal.toLocaleString()}</td></tr>
      </table>

      <div class="payment">
      <h3>Payment Schedule & Info</h3>
      <p style="margin-bottom:10px; font-size:14px;">UPI ID: <b>9938992712@ybl</b><br>PhonePe: <b>7788992712</b></p>
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
      <li><b>All crew members' fooding, lodging and travels will be paid separately to the total project cost paid by the client.</b></li>
      </ol>
      </div>
      </div>

      <div class="footer">
      <div><b>Thank you for choosing Arjun Photography!</b><br>We look forward to capturing your beautiful memories.</div>
      <div style="text-align:right">📞 +91 7788992712<br>✉ bsamal2712@gmail.com</div>
      </div>
      </div>
      </body>
      </html>
    `;
  };

  const handlePreview = () => {
    const html = generateHTML();
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();
    } else {
      toast.error('Pop-up blocked. Please allow pop-ups to view the quotation preview.');
    }
    saveToDatabase(); // Background save
  };

  const handleGeneratePDFButton = async () => {
    await saveToDatabase();
    await handleGeneratePDF();
  };

  const handleGeneratePDF = async () => {
    const html = generateHTML();

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const opt: any = {
        margin:       0.39, // 1cm margin
        filename:     `Quotation_${formData.customerName || 'Client'}.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      
      const element = document.createElement('div');
      element.innerHTML = html;
      
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
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
              <div className="flex items-center gap-2">
                {!isCustomEvent ? (
                  <select 
                    className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary transition-colors text-[16px]"
                    value={formData.eventType}
                    onChange={(e) => {
                      if (e.target.value === 'CUSTOM') {
                        setIsCustomEvent(true);
                        setFormData(prev => ({ ...prev, eventType: '' }));
                      } else {
                        setFormData(prev => ({ ...prev, eventType: e.target.value }));
                      }
                    }}
                  >
                    <option value="">Select event type...</option>
                    {eventTypes.map(t => (
                      <option key={t._id} value={t.name}>{t.name}</option>
                    ))}
                    {eventTypes.length === 0 && (
                      <>
                        <option value="Wedding Ceremony">Wedding Ceremony</option>
                        <option value="Corporate Branding">Corporate Branding</option>
                        <option value="Product Photography">Product Photography</option>
                        <option value="Editorial Fashion">Editorial Fashion</option>
                      </>
                    )}
                    <option value="CUSTOM">+ Add New Event Type</option>
                  </select>
                ) : (
                  <div className="w-full flex items-center gap-2 border-b border-outline-variant py-1 focus-within:border-primary">
                    <input 
                      type="text"
                      value={formData.eventType}
                      onChange={e => setFormData({ ...formData, eventType: e.target.value })}
                      className="w-full bg-transparent focus:outline-none py-1 text-[16px]"
                      placeholder="Type new event type..."
                      autoFocus
                    />
                    <button 
                      onClick={() => {
                        setIsCustomEvent(false);
                        setFormData(prev => ({ ...prev, eventType: '' }));
                      }}
                      className="text-xs text-on-surface-variant hover:text-primary"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
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
            <div className="flex flex-col md:col-span-2">
              <label className="text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Link to Project (Optional)</label>
              <select 
                className="bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary transition-colors text-[16px]"
                value={selectedProjectId}
                onChange={e => setSelectedProjectId(e.target.value)}
              >
                <option value="">No Project Linked</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.name} {p.company ? `(${p.company})` : ''}</option>
                ))}
              </select>
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
            {services.map((service: any, index: number) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-12 gap-4 items-end bg-surface-container-low p-4 rounded-xl border border-outline-variant/30"
              >
                <div className="col-span-12 md:col-span-5 flex flex-col">
                  <label className="text-[12px] font-semibold text-on-surface-variant mb-1">Service Title</label>
                  <input 
                    className="bg-transparent border-b border-outline-variant py-1 focus:outline-none focus:border-primary" 
                    placeholder="e.g. 🎥 Video Coverage" 
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
                <div className="col-span-2 flex items-center justify-end">
                  <button 
                    onClick={() => handleRemoveService(service.id)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remove Service"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="col-span-12 flex flex-col mt-2">
                  <label className="text-[12px] font-semibold text-on-surface-variant mb-1">Features (enter one per line)</label>
                  <textarea 
                    className="bg-transparent border border-outline-variant/50 rounded-lg p-2 focus:outline-none focus:border-primary text-[14px]" 
                    placeholder="Semi-cinematic video (10-20 minutes)&#10;Professionally edited film" 
                    value={service.description || ''}
                    onChange={e => handleServiceChange(service.id, 'description', e.target.value)}
                    rows={2}
                  />
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
          
          <div className="space-y-4">
            <button 
              onClick={handleSave} 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-xl hover:bg-primary/90 transition-all font-semibold text-[16px] disabled:opacity-50"
            >
              {loading ? 'Saving...' : quotationId ? 'Save Changes' : 'Save Quotation'}
            </button>
            
            <button 
              onClick={handlePreview}
              className="w-full flex items-center justify-center gap-2 bg-transparent border-2 border-primary text-primary py-4 rounded-xl hover:bg-primary/5 transition-all font-semibold text-[16px]"
            >
              <Eye className="w-5 h-5" />
              View Quotation
            </button>

            <button 
              onClick={handleGeneratePDFButton}
              className="w-full flex items-center justify-center gap-2 bg-transparent border-2 border-primary text-primary py-4 rounded-xl hover:bg-primary/5 transition-all font-semibold text-[16px]"
            >
              <Printer className="w-5 h-5" />
              Download PDF
            </button>

            <button onClick={handleCopyPaymentLink} className="w-full bg-white hover:bg-surface-variant text-primary font-medium py-3 rounded-xl border border-outline-variant/50 flex justify-center gap-2 items-center transition-all">
              <LinkIcon className="w-5 h-5" />
              <span>Copy Payment Link</span>
            </button>
          </div>

        </section>
      </div>
    </div>
  );
}
