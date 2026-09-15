import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function BulkOrderPage() {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    mobileNumber: '',
    email: '',
    address: '',
    productName: '',
    quantity: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSubmitting(true);

    try {
      const response = await fetch('/api/bulk-enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      let data = {};
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (parseErr) {
          console.warn('Failed to parse JSON response:', parseErr);
        }
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Unable to submit your enquiry. Please try again.'
        );
      }

      setSubmitted(true);

      setFormData({
        name: '',
        companyName: '',
        mobileNumber: '',
        email: '',
        address: '',
        productName: '',
        quantity: '',
        message: '',
      });

    } catch (err) {
      console.error('Bulk enquiry submission error:', err);

      setError(
        err.message ||
        'Unable to submit your enquiry. Please try again.'
      );

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
        <div className="border-b border-white/10 pb-6">
          <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#FF2E4D]">
            CORPORATE &amp; CLUB INQUIRIES
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-white uppercase tracking-wider mt-1">
            Bulk &amp; Team Orders
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Inquire about custom team orders, club supplies, and bulk equipment purchases.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-950/80 border border-emerald-800 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <h3 className="font-heading text-2xl font-black text-white uppercase tracking-wider">Inquiry Received</h3>
            <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              Thank you for contacting SSD Sports. Your bulk order enquiry has been submitted successfully. Our team will review your requirements and get back to you shortly.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl backdrop-blur-md"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Full Name <span className="text-[#FF2E4D]">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Full Name"
                  className="w-full bg-slate-950 border border-white/15 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF2E4D] focus:ring-1 focus:ring-[#FF2E4D] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="companyName" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Company / Organization Name
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Your Club / Company / Organization"
                  className="w-full bg-slate-950 border border-white/15 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF2E4D] focus:ring-1 focus:ring-[#FF2E4D] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="mobileNumber" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Mobile Number <span className="text-[#FF2E4D]">*</span>
                </label>
                <input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="tel"
                  required
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full bg-slate-950 border border-white/15 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF2E4D] focus:ring-1 focus:ring-[#FF2E4D] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Email Address <span className="text-[#FF2E4D]">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="w-full bg-slate-950 border border-white/15 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF2E4D] focus:ring-1 focus:ring-[#FF2E4D] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Address <span className="text-[#FF2E4D]">*</span>
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="Full delivery/billing address"
                className="w-full bg-slate-950 border border-white/15 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF2E4D] focus:ring-1 focus:ring-[#FF2E4D] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="productName" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Product Name <span className="text-[#FF2E4D]">*</span>
                </label>
                <input
                  id="productName"
                  name="productName"
                  type="text"
                  required
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="e.g. SSD English Willow Cricket Bat"
                  className="w-full bg-slate-950 border border-white/15 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF2E4D] focus:ring-1 focus:ring-[#FF2E4D] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="quantity" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Estimated Quantity <span className="text-[#FF2E4D]">*</span>
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="e.g. 20"
                  className="w-full bg-slate-950 border border-white/15 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF2E4D] focus:ring-1 focus:ring-[#FF2E4D] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Message / Requirement Details
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Specify any additional customization, bat weight, ball type, or gear requirements..."
                className="w-full bg-slate-950 border border-white/15 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF2E4D] focus:ring-1 focus:ring-[#FF2E4D] transition-all"
              ></textarea>
            </div>

            {error && (
              <div className="bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-xl p-4">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-4 bg-gradient-to-r from-red-600 to-[#FF2E4D] hover:from-red-500 hover:to-[#FF4763] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(255,46,77,0.35)] cursor-pointer ${
                submitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Submitting...' : 'Submit Bulk Order Inquiry'}
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}


