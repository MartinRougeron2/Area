import 'dart:convert';
import 'package:http/http.dart' as http;

class GraphQLConfig {

  static const String urlGraphQL = 'http://10.0.2.2:5000/graphql';

  static const Map<String, String> header = {
    "Content-Type": "application/json",
    "x-token": ""
  };

  static Future<Map> postRequest(Map convertBody) async {
    String body = json.encode(convertBody).toString();

    return json.decode((await http.post(
        Uri.parse(GraphQLConfig.urlGraphQL),
        headers: GraphQLConfig.header, body: body
    )).body);
  }
}