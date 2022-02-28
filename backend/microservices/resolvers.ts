import {Resolver, Arg, Query, InputType, Field, Mutation, ObjectType, Ctx} from 'type-graphql';
import {prop as Property} from "@typegoose/typegoose/lib/prop";
import {Ref} from "@typegoose/typegoose";
import {BaseAction, UniqueAction, BayAction, Service, User, Links} from './types';
import {BaseActionModel, UniqueActionModel, BayActionModel, ServiceModel, UserModel, LinksModel} from './types';

const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

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
    @Field({nullable: true})
    name?: string

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

    @Field()
    jwt_token!: string
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

    @Field()
    name!: string

    @Field()
    active!: boolean
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


@InputType()
class OptionsInputType {
    @Field()
    id!: string

    @Field()
    options!: string
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

    @Mutation((_returns) => BaseAction, {nullable: true})
    async CreateOrModifyOptionsBaseAction(@Arg('data') {id, options}: OptionsInputType) {
        const ActionFound = await BaseActionModel.findById(id).then((res) => res)
        if (!ActionFound) return null // null check

        ActionFound.options = options
        await ActionFound.save()
        return ActionFound
    }

    @Mutation((_returns) => Service, {nullable: true})
    async AttachBaseAction(@Arg('data') {service_id, baseaction_id}: InputBaseActionAttach): Promise<Service | null> {
        const service = await ServiceModel.findById({id: service_id}).then((service) => service)

        if (!service) return null // null verif

        await service.populate({
            path: 'actions',
        })

        const baseAction = await BaseActionModel.findById({id: baseaction_id}).then((res) => res)
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
        return await BaseActionModel.findById(id).then((res) => {
            if (!res) return null
            return res
        })
    }

    @Mutation((_returns) => Boolean)
    async DeleteBaseAction(@Arg('id') id: string) {
        return !!(BaseActionModel.findByIdAndDelete(id))
    }
}

@Resolver()
export class UniqueActionResolver {
    @Mutation((_returns) => UniqueAction, {nullable: true})
    async CreateUniqueActionByBaseActionId(@Arg('data') {action_id, parameters, old_values}: UniqueActionInput) {
        const id = mongoose.Types.ObjectId(action_id);
        const baseAction = await BaseActionModel.findById(id).then((res) => res)
        console.log("baseAction - " + baseAction)
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
        return await UniqueActionModel.findById(id).then((res) => {
            if (!res) return null
            return res
        })
    }


    @Mutation((_returns) => Boolean)
    async DeleteUniqueAction(@Arg('id') id: string) {
        return !!(UniqueActionModel.findByIdAndDelete(id))
    }
}

@Resolver()
export class BayActionResolver {
    @Mutation((_returns) => BayAction, {nullable: true})
    async CreateBayAction(@Ctx() ctx: any, @Arg('data') {action_trigger_id, action_effect_id, name, active}: InputBayAction) {

        action_trigger_id = mongoose.Types.ObjectId(action_trigger_id)
        action_effect_id = mongoose.Types.ObjectId(action_effect_id)

        const newBay = await BayActionModel.create({
            action_trigger: await UniqueActionModel.findById(action_trigger_id).then((res) => res),
            action_effect: await UniqueActionModel.findById(action_effect_id).then((res) => res),
            name: name,
            active: active
        })
        await newBay.save()
        console.log(ctx)
        const user = await UserModel.findById(ctx._id)
        console.log(user)
        if (!user)
            return newBay
        await user.populate({
            path: "user_actions"
        })
        user.user_actions?.push(newBay)
        await user.save()
        return newBay
    }


    @Query((_returns) => BayAction, {nullable: true})
    async GetBayActionById(@Arg('id') id: string) {
        return await BayActionModel.findById(id).then((res) => res)
    }

    @Mutation((_returns) => Boolean)
    async DeleteBayAction(@Arg('id') id: string) {
        return !!(BayActionModel.findByIdAndDelete(id))
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
        return await ServiceModel.findById(id).then((res) => res)
    }

    @Query((_returns) => [Service], {nullable: true})
    async GetAllServices() {
        return await ServiceModel.find({}).populate('actions').then((res) => res);
    }


    @Mutation((_returns) => Boolean)
    async DeleteService(@Arg('id') id: string) {
        return !!(ServiceModel.findByIdAndDelete(id))
    }
}

@Resolver()
export class UserResolver {
    @Mutation((_returns) => ResultUser, {nullable: true})
    async CreateUser(@Arg('data') {name, email, password}: InputUser) {
        const resUser = new ResultUser()
        let new_jwt = null

        const obj = await UserModel.findOne().or([{email: email}, {name: name}]).then((res) => {
            if (!res) return null
            return res
        })

        if (obj) {
            resUser.user = obj as User
            resUser.is_new = false
            if (bcrypt.compareSync(password, resUser.user.password)) {
                new_jwt = jwt.sign({id: resUser.user.id}, process.env.TOKEN_JWT, {expiresIn: "7d"})
            } else {
                resUser.user.password = ""
                new_jwt = "bad"
            }
            resUser.jwt_token = new_jwt
            return resUser
            //if bad password jwt is bad
        }
        const newUser = await UserModel.create({
            name: name,
            password: bcrypt.hashSync(password, 8),
            email: email
        })
        await newUser.save()

        resUser.user = newUser
        resUser.is_new = true
        resUser.jwt_token = jwt.sign({id: newUser.id}, process.env.TOKEN_JWT, {expiresIn: "7d"})
        return resUser
    }

    @Query((_returns) => ResultUser, {nullable: true})
    async LoginUser(@Arg('data') {email, password}: InputUser) {
        const resUser = new ResultUser()
        let new_jwt = null

        const obj = await UserModel.findOne().or([{email: email}]).then((res) => {
            if (!res) return null
            return res
        })

        if (obj) {
            resUser.user = obj as User
            resUser.is_new = false
            if (bcrypt.compareSync(password, resUser.user.password)){
                new_jwt = jwt.sign({id: resUser.user.id}, process.env.TOKEN_JWT, {expiresIn: "7d"})
            }
            else {
                resUser.user.password = ""
                new_jwt = "bad"
            }
            resUser.jwt_token = new_jwt
            return resUser
        }
        resUser.is_new = true
        resUser.jwt_token = "account not registered"
        return resUser
    }


    @Query((_returns) => String, {nullable: true})
    async RefreshToken(@Ctx() ctx: any) {
        return jwt.sign({id: ctx._id}, process.env.TOKEN_JWT, {expiresIn: "7d"})
    }

    @Query((_returns) => User, {nullable: true})
    async GetUser(@Ctx() ctx: any, @Arg('id', {nullable: true}) id?: string) {
        console.log(ctx)
        if (!ctx) return null

        if (!id && ctx._id) {
            id = ctx._id
        }
        return await UserModel.findById(id).populate({
            path: 'user_actions',
            model: BayActionModel,
            populate: {
                path: 'action_trigger',
                model: UniqueActionModel,
                populate: {
                    path: 'action',
                    model: BaseActionModel
                }
            },
        }).populate({
            path: 'user_actions',
            model: BayActionModel,
            populate: {
                path: 'action_effect',
                model: UniqueActionModel,
                populate: {
                    path: 'action',
                    model: BaseActionModel
                }
            },
        }).then((res) => res)
    }


    @Mutation((_returns) => Boolean)
    async DeleteUser(@Arg('id') id: string) {
        return !!(UserModel.findByIdAndDelete(id))
    }
}

@Resolver()
export class LinksResolver {
    @Mutation((_returns) => Links, {nullable: true})
    async CreateLinksWithActionId(@Arg('data') {action_id, token}: InputLink) {

        const id = mongoose.Types.ObjectId(action_id);

        const action = await UniqueActionModel.findById(id).then((res) => res)

        if (!action) return null // check null

        const obj = await LinksModel.findOne({action: action})
            .catch(err => {
                console.log("CreateLinksWithActionId - " + err)
            })
            .then((res) => {
                if (!res) return null
                res.token = token
                res.save()
                return res
            })
        if (obj) return obj
        const newLink = await LinksModel.create({
            action: action,
            token: token,
            refresh_token_url: await action.service().then(res => res?.refresh_token_url)
        })
        await newLink.save()
        return newLink
    }


    @Query((_returns) => Links, {nullable: true})
    async GetLinksById(@Arg('id') id: string) {
        return await LinksModel.findById(id).then((res) => res)
    }

    @Mutation((_returns) => Boolean)
    async DeleteLinks(@Arg('id') id: string) {
        return !!(LinksModel.findByIdAndDelete(id))
    }
}
