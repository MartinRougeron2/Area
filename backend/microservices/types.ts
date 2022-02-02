import {ObjectType, Field, ID} from 'type-graphql';
import {prop as Property, getModelForClass, Ref} from '@typegoose/typegoose';
import {__Type} from 'graphql';


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

    @Field((_type) => String)
    @Property({ref: BaseAction})
    action: Ref<BaseAction>;
}

@ObjectType({description: 'Link between trigger and effect'})
export class BayAction {
    @Field(() => ID)
    id!: string;

    @Field((_type) => String)
    @Property({ref: UniqueAction})
    action_trigger: Ref<UniqueAction>;

    @Field((_type) => String)
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

    @Field((_type) => String)
    @Property({ref: BaseAction})
    actions: Ref<BaseAction>;
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

    @Field((_type) => String)
    @Property({ref: BayAction})
    user_actions: Ref<BayAction>;
}

@ObjectType({description: 'Link Service & User'})
export class Links {
    @Field(() => ID)
    id!: string;

    @Field((_type) => String)
    @Property({ref: User})
    user: Ref<User>;

    @Field((_type) => String)
    @Property({ref: Service})
    service: Ref<Service>;

}

const BaseActionModel = getModelForClass(BaseAction);
const UniqueActionModel = getModelForClass(UniqueAction);
const BayActionModel = getModelForClass(BayAction);
const ServiceModel = getModelForClass(Service);
const UserModel = getModelForClass(User);
const LinksModel = getModelForClass(Links);

export {BaseActionModel, UniqueActionModel, BayActionModel, ServiceModel, UserModel, LinksModel};
