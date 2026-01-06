import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../api/properties';
import { fetchInquiries } from '../api/inquiries';
import {
  fetchPortfolioProjects,
  createPortfolioProject,
  updatePortfolioProject,
  deletePortfolioProject,
} from '../api/portfolio';
import {
  fetchServiceProjects,
  createServiceProject,
  updateServiceProject,
  deleteServiceProject,
} from '../api/portfolio';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('properties');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Properties state
  const [properties, setProperties] = useState([]);
  const [propertyForm, setPropertyForm] = useState({
    property_name: '',
    type: '',
    price: '',
    location: '',
    status: '',
    images: [{ url: '' }],
  });
  const [editingProperty, setEditingProperty] = useState(null);

  // Inquiries state
  const [inquiries, setInquiries] = useState([]);

  // Portfolio Projects state
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [portfolioForm, setPortfolioForm] = useState({ title: '', description: '' });
  const [editingPortfolio, setEditingPortfolio] = useState(null);

  // Service Projects state
  const [serviceProjects, setServiceProjects] = useState([]);
  const [serviceForm, setServiceForm] = useState({
    portfolio_project_id: '',
    title: '',
    ddescription: '',
    location: '',
    user_email: '',
    user_phone: '',
    images: [{ url: '' }],
  });
  const [editingService, setEditingService] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [propsData, inqData, portfolioData, servicesData] = await Promise.all([
        fetchProperties({ page: 1, page_size: 100 }),
        fetchInquiries({ page: 1, page_size: 100 }),
        fetchPortfolioProjects({ page: 1, page_size: 100 }),
        fetchServiceProjects(),
      ]);
      setProperties(propsData.items);
      setInquiries(inqData.items);
      setPortfolioProjects(portfolioData.items);
      setServiceProjects(servicesData);
    } catch (e) {
      setError('Unable to load admin data. Please check your login and API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Property handlers
  const handlePropertyChange = (e) => {
    const { name, value } = e.target;
    setPropertyForm((f) => ({ ...f, [name]: value }));
  };

  const handleImageChange = (index, value) => {
    setPropertyForm((f) => {
      const newImages = [...f.images];
      newImages[index] = { url: value };
      return { ...f, images: newImages };
    });
  };

  const addImageField = () => {
    setPropertyForm((f) => ({ ...f, images: [...f.images, { url: '' }] }));
  };

  const removeImageField = (index) => {
    setPropertyForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== index),
    }));
  };

  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    if (!propertyForm.property_name || !propertyForm.type || !propertyForm.price || !propertyForm.location || !propertyForm.status) {
      setError('Please fill in all required fields.');
      return;
    }
    try {
      const images = propertyForm.images.filter((img) => img.url.trim());
      if (editingProperty) {
        await updateProperty(editingProperty.id, {
          ...propertyForm,
          price: Number(propertyForm.price),
          images: images.map((img) => ({ url: img.url })),
        });
      } else {
        await createProperty({
          ...propertyForm,
          price: Number(propertyForm.price),
          images: images.map((img) => ({ url: img.url })),
        });
      }
      setPropertyForm({
        property_name: '',
        type: '',
        price: '',
        location: '',
        status: '',
        images: [{ url: '' }],
      });
      setEditingProperty(null);
      loadData();
    } catch (e) {
      setError('Could not save property. Please verify your details and try again.');
    }
  };

  const handleEditProperty = (prop) => {
    setEditingProperty(prop);
    setPropertyForm({
      property_name: prop.property_name,
      type: prop.type,
      price: prop.price.toString(),
      location: prop.location,
      status: prop.status,
      images: prop.images && prop.images.length > 0 ? prop.images : [{ url: '' }],
    });
    setActiveTab('properties');
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await deleteProperty(id);
        loadData();
      } catch (e) {
        setError('Could not delete property.');
      }
    }
  };

  // Portfolio handlers
  const handlePortfolioChange = (e) => {
    const { name, value } = e.target;
    setPortfolioForm((f) => ({ ...f, [name]: value }));
  };

  const handlePortfolioSubmit = async (e) => {
    e.preventDefault();
    if (!portfolioForm.title) {
      setError('Title is required.');
      return;
    }
    try {
      if (editingPortfolio) {
        await updatePortfolioProject(editingPortfolio.id, portfolioForm);
      } else {
        await createPortfolioProject(portfolioForm);
      }
      setPortfolioForm({ title: '', description: '' });
      setEditingPortfolio(null);
      loadData();
    } catch (e) {
      setError('Could not save portfolio project.');
    }
  };

  const handleEditPortfolio = (project) => {
    setEditingPortfolio(project);
    setPortfolioForm({ title: project.title, description: project.description || '' });
    setActiveTab('portfolio');
  };

  const handleDeletePortfolio = async (id) => {
    if (window.confirm('Are you sure you want to delete this portfolio project?')) {
      try {
        await deletePortfolioProject(id);
        loadData();
      } catch (e) {
        setError('Could not delete portfolio project.');
      }
    }
  };

  // Service handlers
  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setServiceForm((f) => ({ ...f, [name]: value }));
  };

  const handleServiceImageChange = (index, value) => {
    setServiceForm((f) => {
      const newImages = [...f.images];
      newImages[index] = { url: value };
      return { ...f, images: newImages };
    });
  };

  const addServiceImageField = () => {
    setServiceForm((f) => ({ ...f, images: [...f.images, { url: '' }] }));
  };

  const removeServiceImageField = (index) => {
    setServiceForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== index),
    }));
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    if (!serviceForm.portfolio_project_id || !serviceForm.title) {
      setError('Portfolio project and title are required.');
      return;
    }
    try {
      const images = serviceForm.images.filter((img) => img.url.trim());
      if (editingService) {
        await updateServiceProject(editingService.id, {
          ...serviceForm,
          portfolio_project_id: Number(serviceForm.portfolio_project_id),
          images: images.map((img) => ({ url: img.url })),
        });
      } else {
        await createServiceProject({
          ...serviceForm,
          portfolio_project_id: Number(serviceForm.portfolio_project_id),
          images: images.map((img) => ({ url: img.url })),
        });
      }
      setServiceForm({
        portfolio_project_id: '',
        title: '',
        ddescription: '',
        location: '',
        user_email: '',
        user_phone: '',
        images: [{ url: '' }],
      });
      setEditingService(null);
      loadData();
    } catch (e) {
      setError('Could not save service project.');
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      portfolio_project_id: service.portfolio_project_id.toString(),
      title: service.title,
      ddescription: service.ddescription || '',
      location: service.location || '',
      user_email: service.user_email || '',
      user_phone: service.user_phone || '',
      images: service.images && service.images.length > 0 ? service.images : [{ url: '' }],
    });
    setActiveTab('services');
  };

  const handleDeleteService = async (id) => {
    if (window.confirm('Are you sure you want to delete this service project?')) {
      try {
        await deleteServiceProject(id);
        loadData();
      } catch (e) {
        setError('Could not delete service project.');
      }
    }
  };

  const tabs = [
    { id: 'properties', label: 'Properties' },
    { id: 'portfolio', label: 'Portfolio Projects' },
    { id: 'services', label: 'Service Projects' },
    { id: 'inquiries', label: 'Inquiries' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Admin Dashboard</h1>
          <p className="text-xs text-slate-500">
            Manage properties, portfolio, services, and review customer inquiries.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/properties')}
          className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-brand-500 hover:text-brand-600"
        >
          View public site
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setError(null);
                setEditingProperty(null);
                setEditingPortfolio(null);
                setEditingService(null);
              }}
              className={`border-b-2 px-3 py-2 text-xs font-medium transition ${
                activeTab === tab.id
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-sm text-slate-500">
          Loading...
        </div>
      ) : (
        <>
          {/* Properties Tab */}
          {activeTab === 'properties' && (
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="mb-3 text-sm font-semibold text-slate-800">
                  {editingProperty ? 'Edit Property' : 'Create Property'}
                </h2>
                <form className="space-y-2" onSubmit={handlePropertySubmit}>
                  <input
                    name="property_name"
                    value={propertyForm.property_name}
                    onChange={handlePropertyChange}
                    placeholder="Property name *"
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    required
                  />
                  <input
                    name="type"
                    value={propertyForm.type}
                    onChange={handlePropertyChange}
                    placeholder="Type (e.g. Apartment) *"
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    required
                  />
                  <input
                    name="price"
                    type="number"
                    value={propertyForm.price}
                    onChange={handlePropertyChange}
                    placeholder="Price *"
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    required
                  />
                  <input
                    name="location"
                    value={propertyForm.location}
                    onChange={handlePropertyChange}
                    placeholder="Location *"
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    required
                  />
                  <input
                    name="status"
                    value={propertyForm.status}
                    onChange={handlePropertyChange}
                    placeholder="Status (e.g. Available) *"
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    required
                  />
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">Image URLs (optional)</label>
                    {propertyForm.images.map((img, idx) => (
                      <div key={idx} className="flex gap-1">
                        <input
                          type="url"
                          value={img.url}
                          onChange={(e) => handleImageChange(idx, e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                        {propertyForm.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImageField(idx)}
                            className="rounded-lg border border-red-200 px-2 text-xs text-red-600 hover:bg-red-50"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addImageField}
                      className="text-xs text-brand-600 hover:text-brand-700"
                    >
                      + Add image URL
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
                    >
                      {editingProperty ? 'Update' : 'Create'}
                    </button>
                    {editingProperty && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProperty(null);
                          setPropertyForm({
                            property_name: '',
                            type: '',
                            price: '',
                            location: '',
                            status: '',
                            images: [{ url: '' }],
                          });
                        }}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
              <div>
                <h2 className="mb-3 text-sm font-semibold text-slate-800">Properties List</h2>
                <div className="max-h-[600px] overflow-auto rounded-lg border border-slate-100 bg-slate-50/60 text-sm shadow-sm">
                  {properties.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">No properties yet</div>
                  ) : (
                    properties.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between border-b border-slate-100 px-3 py-2 hover:bg-white"
                      >
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-slate-900">{p.property_name}</div>
                          <div className="text-xs text-slate-500">
                            {p.type} · {p.location} · ₹{Number(p.price).toLocaleString('en-IN')}
                          </div>
                          {p.images && p.images.length > 0 && (
                            <div className="mt-1 text-xs text-slate-400">
                              {p.images.length} image{p.images.length !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditProperty(p)}
                            className="rounded px-2 py-1 text-xs text-brand-600 hover:bg-brand-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProperty(p.id)}
                            className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="mb-3 text-sm font-semibold text-slate-800">
                  {editingPortfolio ? 'Edit Portfolio Project' : 'Create Portfolio Project'}
                </h2>
                <form className="space-y-2" onSubmit={handlePortfolioSubmit}>
                  <input
                    name="title"
                    value={portfolioForm.title}
                    onChange={handlePortfolioChange}
                    placeholder="Title *"
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    required
                  />
                  <textarea
                    name="description"
                    value={portfolioForm.description}
                    onChange={handlePortfolioChange}
                    placeholder="Description (optional)"
                    rows={4}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
                    >
                      {editingPortfolio ? 'Update' : 'Create'}
                    </button>
                    {editingPortfolio && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPortfolio(null);
                          setPortfolioForm({ title: '', description: '' });
                        }}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
              <div>
                <h2 className="mb-3 text-sm font-semibold text-slate-800">Portfolio Projects</h2>
                <div className="max-h-[600px] overflow-auto rounded-lg border border-slate-100 bg-slate-50/60 text-sm shadow-sm">
                  {portfolioProjects.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">No portfolio projects yet</div>
                  ) : (
                    portfolioProjects.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between border-b border-slate-100 px-3 py-2 hover:bg-white"
                      >
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-slate-900">{p.title}</div>
                          {p.description && (
                            <div className="mt-1 text-xs text-slate-500 line-clamp-2">{p.description}</div>
                          )}
                          {p.service_projects && p.service_projects.length > 0 && (
                            <div className="mt-1 text-xs text-slate-400">
                              {p.service_projects.length} service project{p.service_projects.length !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditPortfolio(p)}
                            className="rounded px-2 py-1 text-xs text-brand-600 hover:bg-brand-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePortfolio(p.id)}
                            className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="mb-3 text-sm font-semibold text-slate-800">
                  {editingService ? 'Edit Service Project' : 'Create Service Project'}
                </h2>
                <form className="space-y-2" onSubmit={handleServiceSubmit}>
                  <select
                    name="portfolio_project_id"
                    value={serviceForm.portfolio_project_id}
                    onChange={handleServiceChange}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    required
                  >
                    <option value="">Select Portfolio Project *</option>
                    {portfolioProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                  <input
                    name="title"
                    value={serviceForm.title}
                    onChange={handleServiceChange}
                    placeholder="Title *"
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    required
                  />
                  <textarea
                    name="ddescription"
                    value={serviceForm.ddescription}
                    onChange={handleServiceChange}
                    placeholder="Description (optional)"
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <input
                    name="location"
                    value={serviceForm.location}
                    onChange={handleServiceChange}
                    placeholder="Location (optional)"
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <input
                    name="user_email"
                    type="email"
                    value={serviceForm.user_email}
                    onChange={handleServiceChange}
                    placeholder="Customer Email (optional)"
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <input
                    name="user_phone"
                    value={serviceForm.user_phone}
                    onChange={handleServiceChange}
                    placeholder="Customer Phone (optional)"
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">Image URLs (optional)</label>
                    {serviceForm.images.map((img, idx) => (
                      <div key={idx} className="flex gap-1">
                        <input
                          type="url"
                          value={img.url}
                          onChange={(e) => handleServiceImageChange(idx, e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                        {serviceForm.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeServiceImageField(idx)}
                            className="rounded-lg border border-red-200 px-2 text-xs text-red-600 hover:bg-red-50"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addServiceImageField}
                      className="text-xs text-brand-600 hover:text-brand-700"
                    >
                      + Add image URL
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
                    >
                      {editingService ? 'Update' : 'Create'}
                    </button>
                    {editingService && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingService(null);
                          setServiceForm({
                            portfolio_project_id: '',
                            title: '',
                            ddescription: '',
                            location: '',
                            user_email: '',
                            user_phone: '',
                            images: [{ url: '' }],
                          });
                        }}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
              <div>
                <h2 className="mb-3 text-sm font-semibold text-slate-800">Service Projects</h2>
                <div className="max-h-[600px] overflow-auto rounded-lg border border-slate-100 bg-slate-50/60 text-sm shadow-sm">
                  {serviceProjects.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">No service projects yet</div>
                  ) : (
                    serviceProjects.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between border-b border-slate-100 px-3 py-2 hover:bg-white"
                      >
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-slate-900">{s.title}</div>
                          {s.location && <div className="text-xs text-slate-500">{s.location}</div>}
                          {s.ddescription && (
                            <div className="mt-1 text-xs text-slate-500 line-clamp-1">{s.ddescription}</div>
                          )}
                          {s.images && s.images.length > 0 && (
                            <div className="mt-1 text-xs text-slate-400">
                              {s.images.length} image{s.images.length !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditService(s)}
                            className="rounded px-2 py-1 text-xs text-brand-600 hover:bg-brand-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteService(s.id)}
                            className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Inquiries Tab */}
          {activeTab === 'inquiries' && (
            <div>
              <h2 className="mb-3 text-sm font-semibold text-slate-800">Customer Inquiries</h2>
              <div className="max-h-[600px] overflow-auto rounded-lg border border-slate-100 bg-slate-50/60 text-sm shadow-sm">
                {inquiries.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">No inquiries yet</div>
                ) : (
                  inquiries.map((i) => (
                    <div key={i.id} className="border-b border-slate-100 px-3 py-3 hover:bg-white">
                      <div className="mb-1 flex items-start justify-between">
                        <div>
                          <div className="text-sm font-semibold text-slate-800">
                            {i.name} <span className="font-normal text-slate-500">({i.phone})</span>
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            Property ID: {i.property_id || 'N/A'} · Inquiry #{i.id}
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-slate-700">{i.inquiry_text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
