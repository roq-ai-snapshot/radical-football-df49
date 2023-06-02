import { AttendanceInterface } from 'interfaces/attendance';
import { PerformanceInterface } from 'interfaces/performance';
import { UserInterface } from 'interfaces/user';
import { TeamInterface } from 'interfaces/team';

export interface PlayerInterface {
  id?: string;
  user_id: string;
  team_id: string;
  position?: string;
  birth_date?: Date;
  created_at?: Date;
  updated_at?: Date;
  attendance?: AttendanceInterface[];
  performance?: PerformanceInterface[];
  user?: UserInterface;
  team?: TeamInterface;
  _count?: {
    attendance?: number;
    performance?: number;
  };
}
