import { api } from '@/lib/apiClient';

export async function fetchTests(params = {}) {
  const res = await api.get('/api/tests', { params });
  return res.data;
}

export async function createTest(payload) {
  const res = await api.post('/api/tests', payload);
  return res.data.test;
}

export async function updateTest(id, payload) {
  const res = await api.patch(`/api/tests/${id}`, payload);
  return res.data.test;
}

export async function deleteTest(id) {
  const res = await api.delete(`/api/tests/${id}`);
  return res.data.test;
}
