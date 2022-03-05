String loginUserQuery = """
query Login(\$password: String!, \$email: String!) {
  LoginUser(data: {email: \$email, password: \$password}) {
    jwt_token
    is_new
  }
}
""";

String userGoogle = """
query Login(\$token: String!, \$email: String!) {
  LoginUserWithGoogle(data: {email: \$email, token: \$token}) {
    jwt_token
    is_new
  }
}
""";