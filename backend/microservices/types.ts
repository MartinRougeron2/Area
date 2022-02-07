import {ObjectType, Field, ID, InputType} from 'type-graphql';
import {prop as Property, getModelForClass, Ref} from '@typegoose/typegoose';
import {OneToMany} from "typeorm";


@ObjectType({description: 'BaseAction'})
export class BaseAction {
    @Field(() => ID)
    id!: string;

    @Field()
    @Property()
    name!: string

    @Field()
    @Property()
    options!: string
}

@ObjectType({description: 'Derivate from base with params'})
export class UniqueAction {
    @Field(() => ID)
    id!: string;

    @Field()
    @Property()
    parameters!: string

    @Field()
    @Property()
    old_values?: string

    @Field((_type) => BaseAction)
    @Property({ref: BaseAction})
    action: Ref<BaseAction>;
}

@ObjectType({description: 'Link between trigger and effect'})
export class BayAction {
    @Field(() => ID)
    id!: string;

    @Field((_type) => UniqueAction)
    @Property({ref: UniqueAction})
    action_trigger: Ref<UniqueAction>;

    @Field((_type) => UniqueAction)
    @Property({ref: UniqueAction})
    action_effect: Ref<UniqueAction>;
}

@ObjectType({description: 'Services'})
export class Service {
    @Field(() => ID)
    id!: string;

    @Field()
    @Property()
    name!: String;

    @Field()
    @Property()
    out_url!: String;

    @Field()
    @Property()
    in_url!: String;

    @Field((_type) => [BaseAction])
    // @ts-ignore type unused
    @OneToMany(type => BaseAction, action => action.id)
    actions?: BaseAction[];
}

@ObjectType({description: 'User'})
export class User {
    @Field(() => ID)
    id!: string;

    @Field()
    @Property()
    name!: string

    @Field()
    @Property()
    email!: string

    @Field()
    @Property()
    password!: string

    @Field((_type) => [BayAction])
    @Property({ref: BayAction})
    user_actions: Ref<[BayAction]>;
}

@ObjectType({description: 'Link Service & User'})
export class Links {
    @Field(() => ID)
    id!: string;

    @Field()
    @Property()
    token!: string

    @Field((_type) => UniqueAction)
    @Property({ref: UniqueAction})
    action: Ref<UniqueAction>;

}

@InputType()
export class CommunicationInput {
    @Field()
    user_id!: string;

    @Field()
    bayaction_id!: string;

    @Field()
    message!: string;
}

const BaseActionModel = getModelForClass(BaseAction);
const UniqueActionModel = getModelForClass(UniqueAction);
const BayActionModel = getModelForClass(BayAction);
const ServiceModel = getModelForClass(Service);
const UserModel = getModelForClass(User);
const LinksModel = getModelForClass(Links);

export {BaseActionModel, UniqueActionModel, BayActionModel, ServiceModel, UserModel, LinksModel};
