import {ObjectType, Field, ID, InputType, registerEnumType, } from 'type-graphql';
import {prop as Property, getModelForClass, Ref} from '@typegoose/typegoose';

enum ActionType {
    TRIGGER,
    EFFECT,
    BOTH
}

registerEnumType(ActionType, {name: 'ActionType'})

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

    @Field(() => ActionType)
    @Property({default: ActionType.BOTH})
    type!: ActionType
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

    @Field(() => BaseAction)
    @Property({ref: () => BaseAction})
    public action!: Ref<BaseAction>;

    @Field(() => Service)
    async service(): Promise<Service | null> {
        // @ts-ignore
        return await ServiceModel.findOne({actions: this._doc.action}).then((res) => res)

    }
}

@ObjectType({description: 'Link between trigger and effect'})
export class BayAction {
    @Field(() => ID)
    id!: string;

    @Field({defaultValue: ""})
    name!: string;

    @Field({defaultValue: true})
    active!: boolean;

    @Field(() => UniqueAction)
    @Property({ref: () => UniqueAction})
    public action_trigger!: Ref<UniqueAction>;

    @Field(() => UniqueAction)
    @Property({ref: () => UniqueAction})
    public action_effect!: Ref<UniqueAction>;
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

    @Field()
    @Property()
    icon!: String;

    @Field(() => [BaseAction])
    @Property({ref: () => BaseAction})
    public actions?: Ref<BaseAction>[];
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

    @Field(() => [BayAction])
    @Property({ref: () => BayAction})
    public user_actions!: Ref<BayAction>[];
}

@ObjectType({description: 'Link Service & User'})
export class Links {
    @Field(() => ID)
    id!: string;

    @Field()
    @Property()
    token!: string

    @Field(() => UniqueAction)
    @Property({ref: () => UniqueAction})
    public action!: Ref<UniqueAction>;
}

@InputType()
export class CommunicationInput {
    @Field()
    action_effect_id!: string;

    @Field()
    message!: string;
}

const BaseActionModel = getModelForClass(BaseAction, {schemaOptions: {}});
const UniqueActionModel = getModelForClass(UniqueAction);
const BayActionModel = getModelForClass(BayAction);
const ServiceModel = getModelForClass(Service);
const UserModel = getModelForClass(User);
const LinksModel = getModelForClass(Links);

export {BaseActionModel, UniqueActionModel, BayActionModel, ServiceModel, UserModel, LinksModel};
