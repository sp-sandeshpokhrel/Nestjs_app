import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { ArticleEntity } from 'src/articles/entities/article.entity';
import { UserEntity } from 'src/users/entities/user.entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects =
  | InferSubjects<typeof ArticleEntity | typeof UserEntity>
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  defineAbility(user: UserEntity) {
    const { can, cannot, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>,
    );

    if (user.roles.includes('admin')) {
      can(Action.Manage, 'all');
    } else {
      can(Action.Read, 'all');
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
