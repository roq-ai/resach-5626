import axios from 'axios';
import queryString from 'query-string';
import { ModuleInterface, ModuleGetQueryInterface } from 'interfaces/module';
import { GetQueryInterface } from '../../interfaces';

export const getModules = async (query?: ModuleGetQueryInterface) => {
  const response = await axios.get(`/api/modules${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createModule = async (module: ModuleInterface) => {
  const response = await axios.post('/api/modules', module);
  return response.data;
};

export const updateModuleById = async (id: string, module: ModuleInterface) => {
  const response = await axios.put(`/api/modules/${id}`, module);
  return response.data;
};

export const getModuleById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/modules/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteModuleById = async (id: string) => {
  const response = await axios.delete(`/api/modules/${id}`);
  return response.data;
};
