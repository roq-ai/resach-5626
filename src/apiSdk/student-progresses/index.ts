import axios from 'axios';
import queryString from 'query-string';
import { StudentProgressInterface, StudentProgressGetQueryInterface } from 'interfaces/student-progress';
import { GetQueryInterface } from '../../interfaces';

export const getStudentProgresses = async (query?: StudentProgressGetQueryInterface) => {
  const response = await axios.get(`/api/student-progresses${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createStudentProgress = async (studentProgress: StudentProgressInterface) => {
  const response = await axios.post('/api/student-progresses', studentProgress);
  return response.data;
};

export const updateStudentProgressById = async (id: string, studentProgress: StudentProgressInterface) => {
  const response = await axios.put(`/api/student-progresses/${id}`, studentProgress);
  return response.data;
};

export const getStudentProgressById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/student-progresses/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteStudentProgressById = async (id: string) => {
  const response = await axios.delete(`/api/student-progresses/${id}`);
  return response.data;
};
