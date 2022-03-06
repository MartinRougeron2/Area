import 'dart:async';

import 'package:areabay/api/graphql_config.dart';
import 'package:flutter/material.dart';
import 'globals.dart' as global;
import 'package:graphql_flutter/graphql_flutter.dart';

import 'page/home_page.dart';
import 'page/login_page.dart';
import 'page/signup_page.dart';

void main() async {
  await initHiveForFlutter();

  final HttpLink httpLink =
      HttpLink(GraphQLConfig.urlGraphQL, defaultHeaders: GraphQLConfig.header);

  final AuthLink authLink = AuthLink(
    getToken: () async => '',
  );

  final Link link = authLink.concat(httpLink);

  global.client = ValueNotifier(
    GraphQLClient(
      link: link,
      cache: GraphQLCache(store: HiveStore()),
    ),
  );

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "AreaBay",
      home: const Scaffold(
        body: StartApp(),
      ),
      routes: <String, WidgetBuilder>{
        "/login": (BuildContext context) => const LoginPage(),
        "/signup": (BuildContext context) => const SignUpPage(),
        "/homePage": (BuildContext context) => const HomePage(),
      },
    );
  }
}

class StartApp extends StatefulWidget {
  const StartApp({Key? key}) : super(key: key);

  @override
  StartAppState createState() => StartAppState();
}

class StartAppState extends State<StartApp> {
  @override
  void initState() {
    super.initState();

    Future.delayed(const Duration(seconds: 1), () {
      setState(() {
        Navigator.popAndPushNamed(context, '/login');
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text(
        'AreaBay',
        style: TextStyle(fontSize: 50),
      ),
    );
  }
}