String createUserMutation = """
mutation create(\$name: String!, \$email: String!, \$password: String!) {
  CreateUser(data: {name: \$name, email: \$email, password: \$password}) {
    is_new
    jwt_token
  }
}
""";

String createUniqueActionMutation = """
mutation createUniqueAction(\$action_id: String!, \$parameters: String!, \$old_values: String!) {
  CreateUniqueActionByBaseActionId(data: {action_id: \$action_id, parameters: \$parameters, old_values: \$old_values}) {
    id
    action {
      auth_url
    }
  }
}
""";

String createBayAction = """
mutation createUniqueAction(\$trigger_id: String!, \$effect_id: String!, \$name: String!, \$active: Boolean!) {
  CreateBayAction(data: {action_trigger_id: \$trigger_id, action_effect_id: \$effect_id, name: \$name, active: \$active}) {
    name
  }
}
""";