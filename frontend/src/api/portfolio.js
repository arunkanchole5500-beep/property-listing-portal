import apiClient from './client';

export async function fetchPortfolioProjects(params = {}) {
  const { data } = await apiClient.get('/portfolio/projects', { params });
  return data;
}

export async function createPortfolioProject(payload) {
  const { data } = await apiClient.post('/portfolio/projects', payload);
  return data;
}

export async function updatePortfolioProject(id, payload) {
  const { data } = await apiClient.put(`/portfolio/projects/${id}`, payload);
  return data;
}

export async function deletePortfolioProject(id) {
  await apiClient.delete(`/portfolio/projects/${id}`);
}

export async function fetchServiceProjects() {
  const { data } = await apiClient.get('/portfolio/services');
  return data;
}

export async function createServiceProject(payload) {
  const { data } = await apiClient.post('/portfolio/services', payload);
  return data;
}

export async function updateServiceProject(id, payload) {
  const { data } = await apiClient.put(`/portfolio/services/${id}`, payload);
  return data;
}

export async function deleteServiceProject(id) {
  await apiClient.delete(`/portfolio/services/${id}`);
}
