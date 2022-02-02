import { Resolver, Arg, Query } from 'type-graphql';
import { BaseAction, UniqueAction, BayAction, Service, User, Links } from './types';

@Resolver()
export class BaseActionResolver {
  @Query((_returns) => BaseAction, { nullable: true })
  async GetBaseActionById(@Arg('id') id?: string) {
    if (id) {
      return null
    }
    return null
  }
}

@Resolver()
export class UniqueActionResolver {
  @Query((_returns) => UniqueAction, { nullable: true })
  async GetUniqueActionById(@Arg('id') id?: string) {
    if (id) {
      return null
    }
    return null
  }
}

@Resolver()
export class BayActionResolver {
  @Query((_returns) => BayAction, { nullable: true })
  async GetBayActionById(@Arg('id') id?: string) {
    if (id) {
      return null
    }
    return null
  }
}

@Resolver()
export class ServiceResolver {
  @Query((_returns) => Service, { nullable: true })
  async GetServiceById(@Arg('id') id?: string) {
    if (id) {
      return null
    }
    return null
  }
}

@Resolver()
export class UserResolver {
  @Query((_returns) => User, { nullable: true })
  async GetUserById(@Arg('id') id?: string) {
    if (id) {
      return null
    }
    return null
  }
}

@Resolver()
export class LinksResolver {
  @Query((_returns) => Links, { nullable: true })
  async GetLinksById(@Arg('id') id?: string) {
    if (id) {
      return null
    }
    return null
  }
}
