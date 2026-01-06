import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="grid gap-8 md:grid-cols-[3fr,2fr] md:items-center">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
            Local Realty &amp; Construction Partner
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Buy, sell, rent &amp; build — all from one simple portal.
          </h1>
          <p className="max-w-xl text-sm text-slate-600">
            Manage property listings, track customer inquiries, and showcase your construction work in one
            professional, easy-to-use platform built for growing real estate businesses.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
              to="/properties"
            >
              Browse Properties
            </Link>
            <Link
              className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-500 hover:text-brand-600"
              to="/services"
            >
              View Portfolio
            </Link>
            <Link
              className="text-xs font-medium text-slate-500 hover:text-brand-600"
              to="/inquiry"
            >
              Talk to us about a requirement →
            </Link>
          </div>
        </div>
        <div className="grid gap-3 text-xs md:grid-cols-2">
          <div className="rounded-2xl bg-white/90 p-4 shadow-soft ring-1 ring-slate-100">
            <h2 className="mb-1 text-sm font-semibold text-slate-900">Property Listings</h2>
            <p className="text-xs text-slate-600">
              Quickly search residential, commercial, and rental properties with clear pricing and status.
            </p>
          </div>
          <div className="rounded-2xl bg-white/90 p-4 shadow-soft ring-1 ring-slate-100">
            <h2 className="mb-1 text-sm font-semibold text-slate-900">Construction Services</h2>
            <p className="text-xs text-slate-600">
              Flooring, painting, interiors, and turnkey execution managed digitally from inquiry to completion.
            </p>
          </div>
          <div className="rounded-2xl bg-white/90 p-4 shadow-soft ring-1 ring-slate-100 md:col-span-2">
            <h2 className="mb-1 text-sm font-semibold text-slate-900">Work Portfolio</h2>
            <p className="text-xs text-slate-600">
              Showcase completed projects with photos and details to build trust with new customers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
