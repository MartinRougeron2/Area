import 'package:flutter/material.dart';
import 'home/list/list.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;
  static const TextStyle optionStyle =
      TextStyle(fontSize: 30, fontWeight: FontWeight.bold);

  static const List<Widget> _widgetOptions = <Widget>[
    ShowAllAction(),
    Text(
      'Index 1: Business',
      style: optionStyle,
    ),
    Text(
      'Index 2: School',
      style: optionStyle,
    ),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        home: Scaffold(
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.apps),
            label: 'List',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.add_to_photos_sharp),
            label: 'Create',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
        backgroundColor: const Color.fromRGBO(34, 79, 129, 1),
        selectedItemColor: const Color.fromARGB(255, 197, 197, 197),
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
      ),
      body: SafeArea(child: _widgetOptions.elementAt(_selectedIndex)),
    ));
  }
}