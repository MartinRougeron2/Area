import {Arg, Mutation, Resolver} from 'type-graphql';
import {CommunicationInput, LinksModel, UniqueActionModel} from "../types";

const fetch = require("node-fetch");

async function createRepository(token: string, name: string): Promise<any> {
    const body = {
        "name": name.replace(/[^a-zA-Z ]/g,"").split(" ", 1),
        "auto_init": true,
        "private": false,
        "gitignore_template": "nanoc"
    }

    return await fetch("https://api.github.com/user/repos", {
        method: "POST",
        headers: {
            Authorization: `token ${token}`
        },
        body: JSON.stringify(body)
    })
}

@Resolver()
export class GithubOutResolver {
    @Mutation(() => Boolean)
    async CreateGithubRepo(@Arg('data') {action_effect_id, message}: CommunicationInput) {
        return await UniqueActionModel.findById(action_effect_id).then(async (action_effect_res) => {
            if (!action_effect_res) return false
            if (!action_effect_res.parameters) return false

            let parameters = JSON.parse(action_effect_res.parameters)
            if (!parameters.access_token) return false
            const token = await LinksModel.findOne({action: action_effect_res}).then(res => res)
            // @ts-ignore
            const result_post = await createRepository(token, message)
            return true
        })
    }
}
