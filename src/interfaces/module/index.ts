import { AssessmentInterface } from 'interfaces/assessment';
import { AssignmentInterface } from 'interfaces/assignment';
import { StudentProgressInterface } from 'interfaces/student-progress';
import { CourseInterface } from 'interfaces/course';
import { GetQueryInterface } from 'interfaces';

export interface ModuleInterface {
  id?: string;
  title: string;
  description?: string;
  course_id?: string;
  created_at?: any;
  updated_at?: any;
  assessment?: AssessmentInterface[];
  assignment?: AssignmentInterface[];
  student_progress?: StudentProgressInterface[];
  course?: CourseInterface;
  _count?: {
    assessment?: number;
    assignment?: number;
    student_progress?: number;
  };
}

export interface ModuleGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  description?: string;
  course_id?: string;
}
