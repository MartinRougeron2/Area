import {BaseAction, BayActionModel, UniqueAction} from "./types";
import {Ref} from "@typegoose/typegoose";
import {gql} from "apollo-boost";
import {client as apolloClient} from "../authentification_server/apollo_client";

function trigger_effects(unique_actions: UniqueAction, text_to_send: string) {
    BayActionModel.find({action_trigger: unique_actions}).populate('action_effect').then(async (res_bay) => {
    console.log("res", res_bay)
        for (const i in res_bay) {
            await res_bay[i].populate('action_effect.action')
            if (!res_bay[i]) return;
            if (!res_bay[i].action_effect) return;

            await dispatch_event(res_bay[i].action_effect, text_to_send)
        }
    })
}


async function dispatch_event(action_effect_ref: Ref<UniqueAction>, msg: string) {
    console.log(action_effect_ref, msg)
    if (!action_effect_ref) return // null check
    if (!msg) return // null check

    const action_effect = action_effect_ref as UniqueAction // populate before : Ref => Complete Model

    if (!action_effect) return // null check

    const effect_base = action_effect.action

    if (!effect_base) return // null check
    if (!(effect_base instanceof BaseAction) || effect_base?.name) return // null check

    const mutation = gql`
        mutation NewEventMutation($action_id: String!, $text: String!) {
            ${effect_base.name}(data: {action_effect_id: $action_id, message: $text})
        }`;

    apolloClient.mutate({
        mutation: mutation,
        variables: {
            action_id: action_effect.id,
            text: msg
        }
    }).catch((err: any) => {
        console.log(err)
    }).then((result: any) => {
        console.log(result)
    })
    return true

}

export {trigger_effects, dispatch_event}
