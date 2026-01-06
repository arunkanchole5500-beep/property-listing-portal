import { useEffect, useState } from 'react';
import { fetchPortfolioProjects, fetchServiceProjects } from '../api/portfolio';

export default function Services() {
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [projectsData, servicesData] = await Promise.all([
          fetchPortfolioProjects({ page: 1, page_size: 20 }),
          fetchServiceProjects(),
        ]);
        setProjects(projectsData.items);
        setServices(servicesData);
      } catch (e) {
        setError('Unable to load portfolio. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-slate-500">
        Loading portfolio...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Our Work Portfolio</h1>
        <p className="mt-2 text-sm text-slate-600">
          Explore our completed construction and interior design projects. We specialize in flooring, painting, interiors, and turnkey solutions.
        </p>
      </div>

      {projects.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Portfolio Projects</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((p) => (
              <div
                key={p.id}
                className="group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft"
              >
                <div className="p-5">
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">{p.title}</h3>
                  {p.description && (
                    <p className="text-sm leading-relaxed text-slate-600">{p.description}</p>
                  )}
                  {p.service_projects && p.service_projects.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {p.service_projects.map((sp) => (
                        <div
                          key={sp.id}
                          className="rounded-lg border border-slate-100 bg-slate-50/60 p-3"
                        >
                          <div className="mb-1 flex items-start justify-between">
                            <div>
                              <div className="text-sm font-semibold text-slate-900">{sp.title}</div>
                              {sp.location && (
                                <div className="text-xs text-slate-500">{sp.location}</div>
                              )}
                            </div>
                          </div>
                          {sp.ddescription && (
                            <p className="mt-1 text-xs text-slate-600">{sp.ddescription}</p>
                          )}
                          {sp.images && sp.images.length > 0 && (
                            <div className="mt-2 grid grid-cols-3 gap-2">
                              {sp.images.slice(0, 3).map((img) => (
                                <img
                                  key={img.id}
                                  src={img.url}
                                  alt={sp.title}
                                  className="h-20 w-full rounded object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {services.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Service Projects</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.id}
                className="group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft"
              >
                {s.images && s.images.length > 0 && (
                  <div className="h-40 overflow-hidden bg-slate-100">
                    <img
                      src={s.images[0].url}
                      alt={s.title}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.className = 'h-40 bg-gradient-to-tr from-slate-100 via-slate-50 to-brand-50';
                      }}
                    />
                  </div>
                )}
                {(!s.images || s.images.length === 0) && (
                  <div className="h-40 bg-gradient-to-tr from-slate-100 via-slate-50 to-brand-50" />
                )}
                <div className="p-4">
                  <div className="mb-1 text-sm font-semibold text-slate-900">{s.title}</div>
                  {s.location && <div className="mb-2 text-xs text-slate-500">{s.location}</div>}
                  {s.ddescription && (
                    <p className="line-clamp-2 text-xs text-slate-600">{s.ddescription}</p>
                  )}
                  {s.images && s.images.length > 1 && (
                    <div className="mt-2 text-xs text-slate-500">
                      +{s.images.length - 1} more image{s.images.length - 1 !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length === 0 && services.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <p className="text-sm font-medium text-slate-700">No portfolio projects available yet.</p>
          <p className="text-xs text-slate-500">Check back soon to see our completed work.</p>
        </div>
      )}
    </div>
  );
}
