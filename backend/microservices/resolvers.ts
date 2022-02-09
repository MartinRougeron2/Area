import {Resolver, Arg, Query, InputType, Field, Mutation, ObjectType} from 'type-graphql';
import {prop as Property} from "@typegoose/typegoose/lib/prop";
import {Ref} from "@typegoose/typegoose";
import {BaseAction, UniqueAction, BayAction, Service, User, Links} from './types';
import {BaseActionModel, UniqueActionModel, BayActionModel, ServiceModel, UserModel, LinksModel} from './types';

const bcrypt = require('bcrypt')

@InputType()
class InputService {
    @Field()
    name!: string

    @Field()
    in_url!: string

    @Field()
    out_url!: string
}

@InputType()
class InputUser {
    @Field()
    name!: string

    @Field()
    email!: string

    @Field()
    password?: string
}

@ObjectType()
class ResultUser {
    @Field((_type) => User)
    @Property({ref: User})
    user: Ref<User>;

    @Field()
    is_new!: boolean
}

@InputType()
class InputBaseAction {
    @Field()
    name!: string

    @Field()
    options?: string
}

@InputType()
class InputBaseActionAttach {
    @Field()
    service_id!: string

    @Field()
    baseaction_id!: string
}

@InputType()
class InputLink {
    @Field()
    action_id!: string

    @Field()
    token!: string
}

@InputType()
class InputBayAction {
    @Field()
    action_trigger_id!: string

    @Field()
    action_effect_id!: string
}

@InputType()
class UniqueActionInput {
    @Field()
    action_id!: string

    @Field()
    parameters!: string

    @Field()
    old_values!: string
}

@Resolver()
export class BaseActionResolver {
    @Mutation((_returns) => BaseAction, {nullable: true})
    async CreateBaseAction(@Arg('data') {name, options}: InputBaseAction) {
        const newAction = await BaseActionModel.create({
            name: name,
            options: options ?? ""
        })
        await newAction.save()
        return newAction
    }

    @Mutation((_returns) => Service, {nullable: true})
    async AttachBaseAction(@Arg('data') {service_id, baseaction_id}: InputBaseActionAttach): Promise<Service | null> {
        const service = await ServiceModel.findOne({id: service_id}).then((service) => service)

        if (!service) return null // null verif

        await service.populate({
            path: 'actions',
        })

        const baseAction = await BaseActionModel.findOne({id: baseaction_id}).then((res) => res)
        if (!service) return null// null verif
        if (!baseAction) return null // null verif

        service.actions?.push(baseAction)
        await service.save()
        return service
    }


    @Query((_returns) => BaseAction, {nullable: true})
    async GetBaseActionById(@Arg('id') id?: string) {
        if (!id) {
            return null
        }
        return await BaseActionModel.findOne({id: id}).then((res) => {
            if (!res) return null
            return res
        })
    }
}

@Resolver()
export class UniqueActionResolver {
    @Mutation((_returns) => UniqueAction, {nullable: true})
    async CreateUniqueActionByBaseActionId(@Arg('data') {action_id, parameters, old_values}: UniqueActionInput) {
        const baseAction = await BaseActionModel.findOne({id: action_id}).then((res) => res)
        if (!baseAction) return null

        const newAction = await UniqueActionModel.create({
            parameters: parameters,
            action: baseAction,
            old_values: old_values
        })
        await newAction.save()
        return newAction
    }


    @Query((_returns) => UniqueAction, {nullable: true})
    async GetUniqueActionById(@Arg('id') id?: string) {
        if (!id) {
            return null
        }
        return await UniqueActionModel.findOne({id: id}).then((res) => {
            if (!res) return null
            return res
        })
    }
}

@Resolver()
export class BayActionResolver {
    @Mutation((_returns) => BayAction, {nullable: true})
    async CreateBayAction(@Arg('data') {action_trigger_id, action_effect_id}: InputBayAction) {
        const newBay = await BayActionModel.create({
            action_trigger: UniqueActionModel.findOne({id: action_trigger_id}).then((res) => res),
            action_effect: UniqueActionModel.findOne({id: action_effect_id}).then((res) => res),
        })
        await newBay.save()
        return newBay
    }


    @Query((_returns) => BayAction, {nullable: true})
    async GetBayActionById(@Arg('id') id: string) {
        return await BayActionModel.findOne({id: id}).then((res) => res)
    }
}

@Resolver()
export class ServiceResolver {
    @Mutation((_returns) => Service, {nullable: true})
    async CreateService(@Arg('data') {name, out_url, in_url}: InputService) {
        const newService = await ServiceModel.create({
            name: name,
            in_url: in_url,
            out_url: out_url,
            actions: []
        })
        await newService.save()
        return newService
    }


    @Query((_returns) => Service, {nullable: true})
    async GetServiceById(@Arg('id') id: string) {
        return await ServiceModel.findOne({id: id}).then((res) => res)
    }

    @Query((_returns) => [Service], {nullable: true})
    async GetAllServices() {
        return await ServiceModel.find({}).populate('actions').then((res) => res);
    }
}

@Resolver()
export class UserResolver {
    @Mutation((_returns) => ResultUser, {nullable: true})
    async CreateUser(@Arg('data') {name, email, password}: InputUser) {
        const resUser = new ResultUser()
        const obj = await UserModel.findOne().or([{email: email}, {name: name}]).then((res) => {
            if (!res) return null
            return res
        })
        if (obj) {
            resUser.user = obj as User
            resUser.is_new = false
            return resUser
        }

        const newUser = await UserModel.create({
            name: name,
            password: bcrypt.hashSync(password, 8),
            email: email
        })
        await newUser.save()
        resUser.user = newUser
        resUser.is_new = true
        return resUser
    }


    @Query((_returns) => User, {nullable: true})
    async GetUserById(@Arg('id') id?: string) {
        if (!id) {
            return null
        }
        return await UserModel.findOne({id: id}).then((res) => {
            if (!res) return null
            return res
        })
    }
}

@Resolver()
export class LinksResolver {
    @Mutation((_returns) => Links, {nullable: true})
    async CreateLinksWithActionId(@Arg('data') {action_id, token}: InputLink) {
        const obj = await LinksModel.findOne({action: {id: action_id, }}).then((res) => {
            if (!res) return null
            res.token = token
            res.save()
            return res
        })
        if (obj) return obj
        const newLink = await LinksModel.create({
            action: UniqueActionModel.findOne({id: action_id}),
            token: token
        })
        await newLink.save()
        return newLink
    }


    @Query((_returns) => Links, {nullable: true})
    async GetLinksById(@Arg('id') id: string) {
        return await LinksModel.findOne({id: id}).then((res) => res)
    }
}
