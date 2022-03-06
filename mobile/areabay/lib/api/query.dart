String loginUserQuery = """
query Login(\$password: String!, \$email: String!) {
  LoginUser(data: {email: \$email, password: \$password}) {
    jwt_token
    is_new
    user {
      id
    }
  }
}
""";

String getAllService = """
query get_services {
  GetAllServices {
    id
    name
    actions {
      id
      name
      options
      type
    }
  }
}
""";

String userGoogle = """
query Login(\$token: String!, \$email: String!) {
  LoginUserWithGoogle(data: {email: \$email, token: \$token}) {
    jwt_token
    is_new
    user {
      id
    }
  }
}
""";

String fetchBay = """
  query FetchBay {
    GetUser {
      name
      user_actions {
        name
        active
        id
        action_effect {
          action {
            name
          }
          service {
            name
          }
        }
        action_trigger {
          action {
              name
          }
          service {
            name
          }
        }
      }
    }
  }
""";