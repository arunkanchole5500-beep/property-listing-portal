import apiClient from './client';

export async function submitInquiry(payload) {
  const { data } = await apiClient.post('/inquiries', payload);
  return data;
}

export async function fetchInquiries(params = {}) {
  const { data } = await apiClient.get('/inquiries', { params });
  return data;
}
