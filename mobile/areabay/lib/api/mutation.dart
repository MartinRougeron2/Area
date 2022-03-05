String createUserMutation = """
mutation create(\$name: String!, \$email: String!, \$password: String!) {
  CreateUser(data: {name: \$name, email: \$email, password: \$password}) {
    is_new
    jwt_token
  }
}
""";