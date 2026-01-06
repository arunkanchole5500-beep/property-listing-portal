import apiClient from './client';

export async function fetchProperties(params = {}) {
  const { data } = await apiClient.get('/properties', { params });
  return data;
}

export async function fetchProperty(id) {
  const { data } = await apiClient.get(`/properties/${id}`);
  return data;
}

export async function createProperty(payload) {
  const { data } = await apiClient.post('/properties', payload);
  return data;
}

export async function updateProperty(id, payload) {
  const { data } = await apiClient.put(`/properties/${id}`, payload);
  return data;
}

export async function deleteProperty(id) {
  await apiClient.delete(`/properties/${id}`);
}
