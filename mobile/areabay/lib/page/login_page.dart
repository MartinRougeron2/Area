import 'package:areabay/api/graphql_config.dart';
import 'package:areabay/api/query.dart';
import 'package:flutter/material.dart';
import 'package:flutter_signin_button/flutter_signin_button.dart';
import 'package:google_sign_in/google_sign_in.dart';

GoogleSignIn _googleSignIn = GoogleSignIn(
  scopes: [
    'email',
  ],
);

class LoginPage extends StatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  String _email = "";
  String _password = "";
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
      return response["data"]?["LoginUser"]?["jwt_token"] == "account not registered";
    } catch (error) {
      print(error);
    }
    return false;
  }

  Future<bool> _handleLogIn() async {
    Map data = {
      "query": loginUserQuery,
      "variables": {"email": _email, "password": _password}
    };

    Map response = await GraphQLConfig.postRequest(data);

    print(response["data"]?["LoginUser"]);
    return response["data"]?["LoginUser"]?["jwt_token"] != "account not registered";
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
                          hintText: 'Enter your email',
                          icon: Icon(Icons.email),
                          labelText: 'Email',
                        ),
                        keyboardType: TextInputType.emailAddress,
                        autocorrect: false,
                        validator: (String? value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your email';
                          }
                          return null;
                        },
                        onChanged: (text) => _email = text,

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
                        onChanged: (text) => _password = text,
                      ),
                      ElevatedButton(
                        onPressed: () async {
                          if (_formKey.currentState!.validate()) {
                            if (await _handleLogIn()) {
                              Navigator.popAndPushNamed(context, "/homePage");
                            }
                            // TODO else bad account
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
                    Navigator.popAndPushNamed(context, '/signup');
                  },
                )
              ],
            ),
            Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: SignInButton(
                  Buttons.Google,
                  mini: false,
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