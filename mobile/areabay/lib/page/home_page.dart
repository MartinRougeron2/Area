import 'package:flutter/material.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        theme: ThemeData(),
        home: Scaffold(
          appBar: AppBar(title: const Text("Action list")),
          body: const Text('aze'),
          // showAction(
          //   reactionIcon: "reaction",
          //   actionIcon: "action",
        ));
  }
}
