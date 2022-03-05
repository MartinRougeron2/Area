import 'package:areabay/api/graphql_config.dart';
import 'package:areabay/api/mutation.dart';
import 'package:areabay/api/query.dart';
import 'package:flutter/material.dart';
import 'package:flutter_signin_button/flutter_signin_button.dart';
import 'package:google_sign_in/google_sign_in.dart';

GoogleSignIn _googleSignIn = GoogleSignIn(
  scopes: [
    'email',
  ],
);

class SignUpPage extends StatefulWidget {
  const SignUpPage({Key? key}) : super(key: key);

  @override
  _SignUpPageState createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  String _username = "";
  String _email = "";
  String _password = "";
  bool _alreadyInDb = false;

  GoogleSignInAccount? _currentUser;

  Future<bool> _handleSignIn() async {
    try {
      await _googleSignIn.signIn();
      _currentUser = _googleSignIn.currentUser;

      Map data = {
        "query": userGoogle,
        "variables": {"email": _currentUser?.email, "token": _currentUser?.id}
      };
      Map response = await GraphQLConfig.postRequest(data);
      return response["data"]?["LoginUser"]?["jwt_token"] ==
          "account not registered";
    } catch (error) {
      print(error);
    }
    return false;
  }
// username: aaaa
// mail: aaaa@gmail.com
// password: aaaa
  Future<bool> createAccount() async {
    Map data = {
      "query": createUserMutation,
      "variables": {"name": _username, "email": _email, "password": _password}
    };

    Map response = await GraphQLConfig.postRequest(data);

    return response["data"]?["CreateUser"]?["is_new"];
  }

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
                padding: const EdgeInsets.fromLTRB(10, 10, 20, 10),
                width: MediaQuery.of(context).size.width * 0.85,
                height: MediaQuery.of(context).size.height * 0.60,
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
                        // keyboardType: TextInputType.name,
                        autocorrect: false,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your username';
                          }
                          return null;
                        },
                        onChanged: (text) {
                          _username = text;
                        },
                      ),
                      TextFormField(
                        decoration: const InputDecoration(
                          hintText: 'Enter your email',
                          icon: Icon(Icons.email),
                          labelText: 'Email',
                        ),
                        keyboardType: TextInputType.emailAddress,
                        autocorrect: false,
                        validator: (String? value) {
                          if (value == null || value.isEmpty || !RegExp("^(.+)@(.+)\$").hasMatch(value)) {
                            return 'Please enter your email';
                          }
                          return null;
                        },
                        onChanged: (text) {
                          _email = text;
                        },
                      ),
                      TextFormField(
                        decoration: const InputDecoration(
                          hintText: 'Password',
                          labelText: 'password',
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
                        onChanged: (text) {
                          _password = text;
                        },
                      ),
                      TextFormField(
                        decoration: const InputDecoration(
                          hintText: 'Password confirmation',
                          labelText: 'Password confirmation',
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
                          if (value != _password) {
                            return "Passwords doesn't match";
                          }
                          return null;
                        },
                      ),
                      ElevatedButton(
                        onPressed: () async {
                          if (_formKey.currentState!.validate()) {
                            if (await createAccount()) {
                              Navigator.popAndPushNamed(context, "/homePage");
                            } else {
                              _alreadyInDb = true;
                            }
                          }
                        },
                        child: const Text('SIGN UP', style: TextStyle()),
                      ),
                      if (_alreadyInDb)
                        const Text("Account already create", style: TextStyle(color: Colors.red, fontSize: 12),)
                    ],
                  ),
                ),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text('Already an account ?'),
                TextButton(
                  child: const Text('Log in'),
                  onPressed: () {
                    Navigator.pushNamed(context, '/login');
                  },
                )
              ],
            ),
            Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: SignInButton(
                  Buttons.Google,
                  mini: false,
                  text: "Sign up with Google",
                  onPressed: () async {
                    if (await _handleSignIn()) {
                      Navigator.popAndPushNamed(context, "/homePage");
                    }
                  },
                )),
          ],
        )),
      ),
    );
  }
}