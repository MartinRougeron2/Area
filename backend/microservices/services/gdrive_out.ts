import {Arg, Mutation, Resolver} from 'type-graphql';
import {CommunicationInput, LinksModel, UniqueActionModel} from "../types";
const {google} = require('googleapis');

function createFile(auth: any, name: string) {
    const drive = google.drive({version: 'v3', auth});
    return drive.files.create({
        requestBody: {
            name: name
        }
    })
}

@Resolver()
export class GDriveOutResolver {
    @Mutation(() => Boolean)
    async CreateFileDrive(@Arg('data') {action_effect_id, message}: CommunicationInput) {
        return await UniqueActionModel.findById(action_effect_id).populate('action').then(async (action_effect_res) => {
            if (!action_effect_res) return false
            if (!action_effect_res.parameters) return false

            return await LinksModel.findOne({action: action_effect_res})
                .then(async (res) => {
                    if (!res) return false

                    const tokens = res.token.split("|") // cf slack_oauth:35
                    const oAuth2Client = new google.auth.OAuth2()
                    oAuth2Client.setCredentials({access_token: tokens[0]})
                    const res_published = await createFile(message, oAuth2Client)
                    return res_published.status === 200
                })
        })
    }
}
