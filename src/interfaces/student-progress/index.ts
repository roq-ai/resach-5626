import { UserInterface } from 'interfaces/user';
import { ModuleInterface } from 'interfaces/module';
import { GetQueryInterface } from 'interfaces';

export interface StudentProgressInterface {
  id?: string;
  student_id?: string;
  module_id?: string;
  progress: number;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  module?: ModuleInterface;
  _count?: {};
}

export interface StudentProgressGetQueryInterface extends GetQueryInterface {
  id?: string;
  student_id?: string;
  module_id?: string;
}
