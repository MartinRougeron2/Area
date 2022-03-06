# Backend

## API

Link to postman doc: https://documenter.getpostman.com/view/18222595/UVksLZFJ


## Models
See : [Model documenation](backend/documentation/schema/index.html)

# TUTO

## Create New Actions / Reactions

You will need to create a oauth connection, a cron / link to service API and a model in MOGODB

### Authentification server

The goal is to get user's token.

The authentification is also the step were we create unique action. The base action id is pass in the url.

The first step is to create 2 routes: /auth/service_name and /auth/service_name/callback

The second step is in the callback:
you call ```create_unique_action ``` function, it needs base action id, parameters for your action and tokens.

### MONGODB

Go to AreaCluster, baseActions

Create your action, please, take attention to type parameter.

### Microservicies

If it's an action: the file is named : ```service_in.ts ```
Create a cron task, and use THIS :
```
    ServiceModel.findOne({name: "service"}).populate('actions').then((res: any | null) => {
        if (!res?.actions) return // null verif


        UniqueActionModel.find({action: {"$in": res.actions}}).populate('action').then(async (res_unique_actions) => {
            console.log(res_unique_actions)
            if (!res_unique_actions) return // null verif

            for (let unique_actions of res_unique_actions) {
                // @ts-ignore
                if (unique_actions.action.type == 1) continue;

                const obj = JSON.parse(unique_actions.parameters)

                LinksModel.findOne({action: unique_actions}).then(async (link_res) => {
                    console.log("link_res", link_res)
                    if (!link_res) return // null verif

                    const tokens = link_res.token.split("|")
...
if (smthg)// if diff
                        trigger_effects(unique_actions, whatever you want to send)
                        unique_actions
                        await unique_actions.save()
                    }
```

then in ```server.ts``` require the file you created


if it's a reaction: the file is named ```service_out.ts```

Then create a Resover in graphql,
the mutation you create will have the same name as in the db:

```
import {Arg, Mutation, Resolver} from 'type-graphql';
import {CommunicationInput, LinksModel, UniqueActionModel} from "../types";


@Resolver()
export class ServiceOutResolver {
    @Mutation(() => Boolean)
    async BaseActionName(@Arg('data') {action_effect_id, message}: CommunicationInput) {
        return await UniqueActionModel.findById(action_effect_id).populate('action').then(async (action_effect_res) => {
        if (!action_effect_res) return false
                if (!action_effect_res.parameters) return false

                return await LinksModel.findOne({action: action_effect_res})
                    .then(async (res) => {
                        if (!res) return false

```
And where you can call all the functions you want, you have access to the paraemters and the tokens.

Finally in ```graphql.ts``` import your resolver and add it to the others.