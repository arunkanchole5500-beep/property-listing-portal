import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProperty } from '../api/properties';

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        const data = await fetchProperty(id);
        setProperty(data);
      } catch (e) {
        setError('Property not found or could not be loaded.');
      }
    };
    load();
  }, [id]);

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  if (!property) {
    return <div className="text-sm text-slate-500">Loading property details...</div>;
  }

  const handleInquiry = () => {
    navigate(`/inquiry?property_id=${property.id}`);
  };

  return (
    <div className="grid gap-6 md:grid-cols-[3fr,2fr]">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {property.property_name}
          </h1>
          <p className="text-sm text-slate-500">{property.location}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-2xl font-extrabold text-brand-700">
            ₹{Number(property.price).toLocaleString('en-IN')}
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-600">
            {property.type}
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {property.status}
          </span>
        </div>
        {property.images?.length > 0 && (
          <div className="grid gap-3 md:grid-cols-3">
            {property.images.map((img) => (
              <img
                key={img.id}
                src={img.url}
                alt={property.property_name}
                className="h-32 w-full rounded-lg object-cover shadow-sm md:h-40"
              />
            ))}
          </div>
        )}
      </div>
      <aside className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/80 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Interested in this property?</h2>
        <p className="text-xs text-slate-500">
          Share your contact details and our team will call you with more information and a site visit.
        </p>
        <button
          type="button"
          onClick={handleInquiry}
          className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
        >
          Send Inquiry
        </button>
        <p className="text-[11px] text-slate-400">
          Please mention the property name or ID when you speak with our team.
        </p>
      </aside>
    </div>
  );
}
