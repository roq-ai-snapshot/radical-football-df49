import { AttendanceInterface } from 'interfaces/attendance';
import { PerformanceInterface } from 'interfaces/performance';
import { CoachInterface } from 'interfaces/coach';
import { TeamInterface } from 'interfaces/team';

export interface PracticePlanInterface {
  id?: string;
  coach_id: string;
  team_id: string;
  title: string;
  description?: string;
  date: Date;
  created_at?: Date;
  updated_at?: Date;
  attendance?: AttendanceInterface[];
  performance?: PerformanceInterface[];
  coach?: CoachInterface;
  team?: TeamInterface;
  _count?: {
    attendance?: number;
    performance?: number;
  };
}
