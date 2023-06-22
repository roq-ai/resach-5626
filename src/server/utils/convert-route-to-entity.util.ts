const mapping: Record<string, string> = {
  assessments: 'assessment',
  assignments: 'assignment',
  companies: 'company',
  courses: 'course',
  modules: 'module',
  'student-progresses': 'student_progress',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
