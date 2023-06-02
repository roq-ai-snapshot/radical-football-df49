import axios from 'axios';
import queryString from 'query-string';
import { PerformanceInterface } from 'interfaces/performance';
import { GetQueryInterface } from '../../interfaces';

export const getPerformances = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/performances${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPerformance = async (performance: PerformanceInterface) => {
  const response = await axios.post('/api/performances', performance);
  return response.data;
};

export const updatePerformanceById = async (id: string, performance: PerformanceInterface) => {
  const response = await axios.put(`/api/performances/${id}`, performance);
  return response.data;
};

export const getPerformanceById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/performances/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePerformanceById = async (id: string) => {
  const response = await axios.delete(`/api/performances/${id}`);
  return response.data;
};
