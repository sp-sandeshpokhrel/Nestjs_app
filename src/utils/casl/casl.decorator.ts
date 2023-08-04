import { SetMetadata } from '@nestjs/common';
import { Action, Subjects } from './casl-ability.factory';

export interface RequireRule {
  action: Action;
  subject: Subjects;
}
export const CHECK_ABILITY = 'check_ability';
export const CheckAbilities = (...requirements: RequireRule[]) =>
  SetMetadata(CHECK_ABILITY, requirements);
