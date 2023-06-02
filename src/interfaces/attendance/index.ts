import { PlayerInterface } from 'interfaces/player';
import { PracticePlanInterface } from 'interfaces/practice-plan';

export interface AttendanceInterface {
  id?: string;
  player_id: string;
  practice_plan_id: string;
  attended: boolean;
  created_at?: Date;
  updated_at?: Date;

  player?: PlayerInterface;
  practice_plan?: PracticePlanInterface;
  _count?: {};
}
