import axios from 'axios';
import queryString from 'query-string';
import { CourseInterface, CourseGetQueryInterface } from 'interfaces/course';
import { GetQueryInterface } from '../../interfaces';

export const getCourses = async (query?: CourseGetQueryInterface) => {
  const response = await axios.get(`/api/courses${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCourse = async (course: CourseInterface) => {
  const response = await axios.post('/api/courses', course);
  return response.data;
};

export const updateCourseById = async (id: string, course: CourseInterface) => {
  const response = await axios.put(`/api/courses/${id}`, course);
  return response.data;
};

export const getCourseById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/courses/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCourseById = async (id: string) => {
  const response = await axios.delete(`/api/courses/${id}`);
  return response.data;
};
