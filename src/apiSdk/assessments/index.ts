import axios from 'axios';
import queryString from 'query-string';
import { AssessmentInterface, AssessmentGetQueryInterface } from 'interfaces/assessment';
import { GetQueryInterface } from '../../interfaces';

export const getAssessments = async (query?: AssessmentGetQueryInterface) => {
  const response = await axios.get(`/api/assessments${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createAssessment = async (assessment: AssessmentInterface) => {
  const response = await axios.post('/api/assessments', assessment);
  return response.data;
};

export const updateAssessmentById = async (id: string, assessment: AssessmentInterface) => {
  const response = await axios.put(`/api/assessments/${id}`, assessment);
  return response.data;
};

export const getAssessmentById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/assessments/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteAssessmentById = async (id: string) => {
  const response = await axios.delete(`/api/assessments/${id}`);
  return response.data;
};
