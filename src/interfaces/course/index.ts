import { ModuleInterface } from 'interfaces/module';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface CourseInterface {
  id?: string;
  title: string;
  description?: string;
  content_creator_id?: string;
  created_at?: any;
  updated_at?: any;
  module?: ModuleInterface[];
  user?: UserInterface;
  _count?: {
    module?: number;
  };
}

export interface CourseGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  description?: string;
  content_creator_id?: string;
}
