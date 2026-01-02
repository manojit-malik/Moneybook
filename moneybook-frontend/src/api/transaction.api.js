import api from "./axios";

export const getDashboardSummary = async () => {
  const res = await api.get("/transactions/summary");
  return res.data;
};

export const getTransactions = async () => {
  const res = await api.get("/transactions");
  return res.data;
};

export const addTransaction = async (payload) => {
  const res = await api.post("/transactions", payload);
  return res.data;
};

export const getTransactionTypes = async () => {
  const res = await api.get("/transactions/types");
  return res.data;
};

export const getTransactionById = async (id) => {
  const res = await api.get(`/transactions/${id}`);
  return res.data;
};

export const updateTransaction = async (id, payload) => {
  const res = await api.put(`/transactions/${id}`, payload);
  return res.data;
};
