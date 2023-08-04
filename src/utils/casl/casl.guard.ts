import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from './casl-ability.factory';
import { CHECK_ABILITY, RequireRule } from './casl.decorator';
import { ForbiddenError } from '@casl/ability';

@Injectable()
export class CaslGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requireRules = this.reflector.getAllAndOverride<RequireRule[]>(
      CHECK_ABILITY,
      [context.getHandler(), context.getClass()],
    );

    if (!requireRules) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const ability = this.caslAbilityFactory.defineAbility(user);
    try {
      requireRules.forEach((rule) =>
        ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject),
      );
      return true;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}
