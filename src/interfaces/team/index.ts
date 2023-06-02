import { CoachInterface } from 'interfaces/coach';
import { PlayerInterface } from 'interfaces/player';
import { PracticePlanInterface } from 'interfaces/practice-plan';
import { AcademyInterface } from 'interfaces/academy';

export interface TeamInterface {
  id?: string;
  name: string;
  academy_id: string;
  created_at?: Date;
  updated_at?: Date;
  coach?: CoachInterface[];
  player?: PlayerInterface[];
  practice_plan?: PracticePlanInterface[];
  academy?: AcademyInterface;
  _count?: {
    coach?: number;
    player?: number;
    practice_plan?: number;
  };
}
