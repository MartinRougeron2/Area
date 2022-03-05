import 'dart:convert';
import 'package:http/http.dart' as http;

class GraphQLConfig {
  static const String token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMTM5MTA2NDYwNGNmN2JiMzcxYWQ2MCIsImlhdCI6MTY0NjMwNzIzOCwiZXhwIjoxNjQ2OTEyMDM4fQ.7KfnUG5utlvbOlkcEiH6vlrTH-H-U1tHNRnV-nd-cGc";

  static const String urlGraphQL = 'http://10.0.2.2:5000/graphql';

  static const Map<String, String> header = {
    "Content-Type": "application/json",
    "x-token": token
  };

  static Future<Map> postRequest(Map convertBody) async {
    String body = json.encode(convertBody).toString();

    return json.decode((await http.post(
        Uri.parse(GraphQLConfig.urlGraphQL),
        headers: GraphQLConfig.header, body: body
    )).body);
  }
}