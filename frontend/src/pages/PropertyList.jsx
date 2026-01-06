import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProperties } from '../api/properties';

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    min_price: '',
    max_price: '',
  });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pageSize = 9;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = {
          page,
          page_size: pageSize,
          type: filters.type || undefined,
          location: filters.location || undefined,
          min_price: filters.min_price || undefined,
          max_price: filters.max_price || undefined,
        };
        const data = await fetchProperties(params);
        setProperties(data.items);
        setTotal(data.total);
      } catch (e) {
        setError('Unable to load properties. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, filters, pageSize]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Available Properties</h1>
          <p className="text-sm text-slate-500">
            Browse properties for sale and rent. Use filters to quickly find what you need.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
          <input
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            placeholder="Type (Apartment, Plot...)"
            className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <input
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Location"
            className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <input
            type="number"
            name="min_price"
            value={filters.min_price}
            onChange={handleFilterChange}
            placeholder="Min price"
            className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <input
            type="number"
            name="max_price"
            value={filters.max_price}
            onChange={handleFilterChange}
            placeholder="Max price"
            className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-sm text-slate-500">
          Loading properties...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <p className="text-sm font-medium text-slate-700">No properties match your criteria.</p>
          <p className="text-xs text-slate-500">Try clearing filters or adjusting your price range.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {properties.map((p) => (
              <Link
                key={p.id}
                to={`/properties/${p.id}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-slate-50/60 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-white hover:shadow-soft"
              >
                <div className="h-32 w-full overflow-hidden bg-gradient-to-tr from-slate-100 via-slate-50 to-brand-50">
                  {p.images && p.images.length > 0 ? (
                    <img
                      src={p.images[0].url}
                      alt={p.property_name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col gap-1 px-3 pb-3 pt-2">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-slate-500">
                    <span>{p.type}</span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      {p.status}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">{p.property_name}</div>
                  <div className="text-xs text-slate-500">{p.location}</div>
                  <div className="mt-1 text-sm font-bold text-brand-700">
                    ₹{Number(p.price).toLocaleString('en-IN')}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-full border border-slate-200 px-3 py-1 font-medium transition enabled:hover:border-brand-500 enabled:hover:text-brand-600 disabled:opacity-40"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-full border border-slate-200 px-3 py-1 font-medium transition enabled:hover:border-brand-500 enabled:hover:text-brand-600 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
