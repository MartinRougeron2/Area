import {gql} from "apollo-boost";
import {client} from "./apollo_client";

interface DResponse {
    access_token: string,
    expires_in: number,
    refresh_token: string,
    scope: string,
    token_type: string,
    guild: {
      id: string,
      name: string,
      icon: object,
      description: string,
      splash: string,
      discovery_splash: string,
      features: any,
      emojis: any,
      stickers: any,
      banner: string,
      owner_id: string,
      application_id: string,
      region: string,
      afk_channel_id: string,
      afk_timeout: number,
      system_channel_id: string,
      widget_enabled: boolean,
      widget_channel_id: string,
      verification_level: number,
      roles: any,
      default_message_notifications: number,
      mfa_level: number,
      explicit_content_filter: number,
      max_presences: number,
      max_members: number,
      max_video_channel_users: number,
      vanity_url_code: string,
      premium_tier: number,
      premium_subscription_count: number,
      system_channel_flags: number,
      preferred_locale: string,
      rules_channel_id: string,
      public_updates_channel_id: string,
      hub_type: string,
      premium_progress_bar_enabled: boolean,
      nsfw: boolean,
      nsfw_level: number,
      embed_enabled: boolean,
      embed_channel_id: string
    }
    webhook: {
        type: number,
        id: string,
        name: string,
        avatar: string,
        channel_id: string,
        guild_id: string,
        application_id: string,
        token: string,
        url: string
    }
}

interface IResponse {
    access_token: string,
    expires_in: number,
    refresh_token: string,
    scope: string,
    token_type: string,
    webhook: {
      type: number,
      id: string,
      name: string,
      avatar: string,
      channel_id: string,
      guild_id: string,
      application_id: string,
      token: string,
      url: string
    }
}

const CREATE_UNIQUE_ACTION = gql`
    mutation CreateUniqueActionByBaseActionIdMutation($action_id: String!, $parameters: String!, $old_values: String!) {
        CreateUniqueActionByBaseActionId(data: {action_id: $action_id, parameters: $parameters, old_values: $old_values}) {
            id
            action {
                id
            }
        }
    }
`;

const CREATE_LINK = gql`
    mutation CreateLinksWithActionIdMutation($action_id: String!, $token: String!) {
        CreateLinksWithActionId(data: {action_id: $action_id, token: $token}) {
            id
            action {
                id
            }
        }
    }
`;

async function create_unique_action(action_id: string, parameters_json: string, token: string) : Promise<string> {

    let newId = "";

    console.log(action_id);
    return await client.mutate({
        mutation: CREATE_UNIQUE_ACTION,
        variables: {
            action_id: action_id,
            parameters: parameters_json,
            old_values: ""
        }
    }).catch((err: any) => {
        console.log(err)
    }).then(async (result: any) => {
        newId = result.data.CreateUniqueActionByBaseActionId.id
        return await client.mutate({
            mutation: CREATE_LINK,
            variables: {
                action_id: result.data.CreateUniqueActionByBaseActionId.id,
                token: token
            }
        }).catch((err: any) => {
            console.log(err)
        }).then(() => newId);
    });
}
export {CREATE_UNIQUE_ACTION, CREATE_LINK, create_unique_action, DResponse, IResponse}
