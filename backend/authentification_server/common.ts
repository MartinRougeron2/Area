import {gql} from "apollo-boost";
import {client} from "./apollo_client";

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

function create_unique_action(action_id: string, parameters_json: string, token: string) {
    client.mutate({
        mutation: CREATE_UNIQUE_ACTION,
        variables: {
            action_id: action_id,
            parameters: parameters_json,
            old_values: ""
        }
    }).catch((err: any) => {
        console.log(err)
    }).then((result: any) => {
        console.log(result.data.CreateUniqueActionByBaseActionId.id)
        client.mutate({
            mutation: CREATE_LINK,
            variables: {
                action_id: result.data.CreateUniqueActionByBaseActionId.id,
                token: token
            }
        }).catch((err: any) => {
            console.log(err)
        }).then((result: any) => console.log(result));
    });
}
export {CREATE_UNIQUE_ACTION, CREATE_LINK, create_unique_action}
