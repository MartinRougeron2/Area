import 'dart:async';
import 'package:flutter/material.dart';
import 'page/home_page.dart';
import 'page/loggin_page.dart';
import 'page/signup_page.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "AreaBay",
      theme: ThemeData(),
      home: const Scaffold(
        body: StartApp(),
      ),
      routes: <String, WidgetBuilder>{
        "/login": (BuildContext context) => const LogginPage(),
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
        Navigator.pushNamed(context, '/login');
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
