import 'package:flutter/material.dart';
import 'package:flutter_signin_button/flutter_signin_button.dart';

class LogginPage extends StatefulWidget {
  const LogginPage({Key? key}) : super(key: key);

  @override
  State<LogginPage> createState() => _LogginPageState();
}

class _LogginPageState extends State<LogginPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(),
      home: Scaffold(
        body: Center(
            child: ListView(
          shrinkWrap: true,
          padding: const EdgeInsets.all(15.0),
          children: [
            Center(
              child: Container(
                padding: const EdgeInsets.fromLTRB(10, 0, 20, 0),
                width: MediaQuery.of(context).size.width * 0.85,
                height: MediaQuery.of(context).size.height * 0.45,
                decoration: BoxDecoration(
                  borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(10),
                      topRight: Radius.circular(10),
                      bottomLeft: Radius.circular(10),
                      bottomRight: Radius.circular(10)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.5),
                      spreadRadius: 5,
                      blurRadius: 7,
                      offset: const Offset(0, 3), // changes position of shadow
                    ),
                  ],
                  color: Colors.white,
                ),
                child: Form(
                  key: _formKey,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      Text(
                        'AreaBay',
                        style: TextStyle(
                          color: Colors.blue[800],
                          fontSize: 33,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      TextFormField(
                        decoration: const InputDecoration(
                          hintText: 'Enter your username',
                          icon: Icon(Icons.person),
                          labelText: 'Username',
                        ),
                        keyboardType: TextInputType.name,
                        autocorrect: false,
                        validator: (String? value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your username';
                          }
                          return null;
                        },
                      ),
                      TextFormField(
                        decoration: const InputDecoration(
                          hintText: 'Password',
                          labelText: 'Password',
                          icon: Icon(Icons.password),
                        ),
                        keyboardType: TextInputType.visiblePassword,
                        obscureText: true,
                        enableSuggestions: false,
                        autocorrect: false,
                        validator: (String? value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your password';
                          }
                          return null;
                        },
                      ),
                      ElevatedButton(
                        onPressed: () {
                          // Validate will return true if the form is valid, or false if
                          // the form is invalid.
                          if (_formKey.currentState!.validate()) {
                            print(const Text("Check with DB"));
                            Navigator.pushNamed(context, "/homePage");
                            // Process data.
                          } else {
                            print(const Text("Is not logged"));
                          }
                        },
                        child: const Text('SIGN IN', style: TextStyle()),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text('Don\'t have an account ?'),
                TextButton(
                  child: const Text('Sign Up'),
                  onPressed: () {
                    Navigator.pushNamed(context, '/signup');
                  },
                )
              ],
            ),
            Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: SignInButton(
                  Buttons.Google,
                  mini: false,
                  onPressed: () {
                    print("COMMAND TO GOOGLE");
                  },
                )),
          ],
        )),
      ),
    );
  }
}
