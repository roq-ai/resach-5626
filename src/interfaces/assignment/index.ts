import { ModuleInterface } from 'interfaces/module';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface AssignmentInterface {
  id?: string;
  title: string;
  description?: string;
  module_id?: string;
  teaching_assistant_id?: string;
  created_at?: any;
  updated_at?: any;

  module?: ModuleInterface;
  user?: UserInterface;
  _count?: {};
}

export interface AssignmentGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  description?: string;
  module_id?: string;
  teaching_assistant_id?: string;
}
