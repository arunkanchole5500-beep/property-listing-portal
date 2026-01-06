import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { submitInquiry } from '../api/inquiries';

export default function Inquiry() {
  const [form, setForm] = useState({ property_id: '', name: '', phone: '', inquiry_text: '' });
  const [status, setStatus] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fromProperty = searchParams.get('property_id');
    if (fromProperty) {
      setForm((f) => ({ ...f, property_id: fromProperty }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.inquiry_text) {
      setStatus('Please fill in all required fields.');
      return;
    }
    try {
      await submitInquiry({
        property_id: form.property_id ? Number(form.property_id) : null,
        name: form.name,
        phone: form.phone,
        inquiry_text: form.inquiry_text,
      });
      setStatus('Inquiry submitted successfully. We will get back to you shortly.');
      setForm({ property_id: '', name: '', phone: '', inquiry_text: '' });
    } catch (e) {
      setStatus('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900">Send an Inquiry</h1>
      <p className="mb-4 text-sm text-slate-500">
        Share a few details and we will call you back to understand your requirement and schedule a visit.
      </p>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Property ID (optional)
          </label>
          <input
            type="number"
            name="property_id"
            value={form.property_id}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-2 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-2 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-2 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Inquiry <span className="text-red-500">*</span>
          </label>
          <textarea
            name="inquiry_text"
            value={form.inquiry_text}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-2 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            rows={4}
            required
          />
        </div>
        <button
          className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
          type="submit"
        >
          Submit Inquiry
        </button>
      </form>
      {status && <p className="mt-3 text-sm text-slate-700">{status}</p>}
    </div>
  );
}
