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
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight">
            Bulk &amp; Team Orders
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Inquire about custom team orders, club supplies, and bulk equipment purchases.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
            <h3 className="text-xl font-bold text-emerald-800">Inquiry Received</h3>
            <p className="text-sm text-slate-600">
              Thank you for contacting SSD Sports. Your bulk order enquiry has been submitted successfully. Our team will review your requirements and get back to you shortly.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Full Name"
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="companyName" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Company Name
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Your Club / Company / Organization"
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="mobileNumber" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Mobile Number <span className="text-red-600">*</span>
                </label>
                <input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="tel"
                  required
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Address <span className="text-red-600">*</span>
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="Full delivery/billing address"
                className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:border-red-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="productName" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Product Name <span className="text-red-600">*</span>
                </label>
                <input
                  id="productName"
                  name="productName"
                  type="text"
                  required
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="e.g. SSD English Willow Cricket Bat"
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="quantity" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Estimated Quantity <span className="text-red-600">*</span>
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
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Message / Requirement Details
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Specify any additional customization, bat weight, ball type, or gear requirements..."
                className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:border-red-600"
              ></textarea>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-red-600/20 ${
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

