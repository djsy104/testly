import { useEffect, useState } from 'react';
import {
  fetchTests,
  createTest as createTestApi,
  updateTest as updateTestApi,
  deleteTest as deleteTestApi,
} from './testApi';

export function useTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    numberOfPages: 1,
  });

  useEffect(() => {
    loadTests();
  }, []);

  async function loadTests(query = {}) {
    setLoading(true);
    try {
      const data = await fetchTests(query);

      setTests(data.tests);
      setMeta({
        total: data.total,
        page: data.page,
        limit: data.limit,
        numberOfPages: data.numberOfPages,
      });
    } finally {
      setLoading(false);
    }
  }

  async function createTest(payload) {
    const newTest = await createTestApi(payload);
    setTests((prev) => [newTest, ...prev]);
  }

  async function updateTest(id, payload) {
    const updated = await updateTestApi(id, payload);
    setTests((prev) => prev.map((t) => (t._id === id ? updated : t)));
  }

  async function deleteTest(id) {
    await deleteTestApi(id);
    setTests((prev) => prev.filter((t) => t._id !== id));
  }

  return {
    tests,
    loading,
    meta,
    loadTests,
    createTest,
    updateTest,
    deleteTest,
  };
}
