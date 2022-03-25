import 'package:areabay/api/graphql_config.dart';
import 'package:areabay/api/mutation.dart';
import 'package:flutter/material.dart';

import 'widget/card_login_service.dart';

class LinkAccountArgs {
  final Map data;

  LinkAccountArgs(this.data);
}

class LinkAccount extends StatefulWidget {
  final String title = "Connect Account";

  const LinkAccount({Key? key}) : super(key: key);

  @override
  _LinkAccountState createState() => _LinkAccountState();
}

class _LinkAccountState extends State<LinkAccount> {
  int _activeStepIndex = 0;
  String _name = "";

  onStepContinue() {
    if (_activeStepIndex < 2) {
      setState(() {
        _activeStepIndex += 1;
      });
    } else {
      print('Submitted');
    }
  }

  onStepCancel() {
    if (_activeStepIndex == 0) {
      return;
    }
    setState(() {
      _activeStepIndex -= 1;
    });
  }

  Map idBay = {
    "action": "",
    "reaction": "",
  };

  callBack(String key, String value) {
    print("KEY: $key | ID: $value");
    idBay[key] = value;
  }

  createBay(BuildContext context) async {
    Map data = {
      "query": createBayAction,
      "variables": {
        "trigger_id": idBay["action"],
        "effect_id": idBay["reaction"],
        "name": _name,
        "active": true,
      }
    };
    print("data: $data");
    Map result = await GraphQLConfig.postRequest(data);
    if (result["data"]?["CreateBayAction"]?["name"] != null) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text("$_name created"),
          ],
        ),
        behavior: SnackBarBehavior.floating,
        backgroundColor: Colors.green,
      ));
      Navigator.pop(context);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text("$_name cannot be created"),
              ],
            ),
            behavior: SnackBarBehavior.floating,
            backgroundColor: Colors.red),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final args = ModalRoute.of(context)!.settings.arguments as LinkAccountArgs;

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Stepper(
        controlsBuilder: (context, details) {
          return Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  onPressed: onStepContinue,
                  child: const Text('NEXT'),
                ),
              ),
              const SizedBox(
                width: 10,
              ),
              if (_activeStepIndex > 0)
                Expanded(
                  child: OutlinedButton(
                    style: ButtonStyle(
                      backgroundColor:
                          MaterialStateProperty.all<Color>(Colors.white),
                    ),
                    onPressed: onStepCancel,
                    child: const Text('BACK',
                        style: TextStyle(color: Colors.grey)),
                  ),
                )
              else
                Expanded(
                  child: OutlinedButton(
                    style: ButtonStyle(
                      backgroundColor:
                          MaterialStateProperty.all<Color>(Colors.white),
                    ),
                    onPressed: () => Navigator.pop(context),
                    child: const Text('CANCEL',
                        style: TextStyle(color: Colors.grey)),
                  ),
                )
            ],
          );
        },
        currentStep: _activeStepIndex,
        type: StepperType.horizontal,
        onStepContinue: onStepContinue,
        onStepCancel: onStepCancel,
        steps: [
          Step(
            state:
                _activeStepIndex <= 0 ? StepState.editing : StepState.complete,
            isActive: _activeStepIndex >= 0,
            title: const Text("Action"),
            content: Center(
              child: LoginServiceCard(
                serviceName: args.data["Action"]["Service"],
                actionName: args.data["Action"]["Action"],
                actionId: args.data["Action"]["id"],
                setId: callBack,
                idKey: "action",
              ),
            ),
          ),
          Step(
            state:
                _activeStepIndex <= 1 ? StepState.editing : StepState.complete,
            isActive: _activeStepIndex >= 1,
            title: const Text("Reaction"),
            content: Center(
              child: LoginServiceCard(
                serviceName: args.data["Reaction"]["Service"],
                actionName: args.data["Reaction"]["Action"],
                actionId: args.data["Reaction"]["id"],
                setId: callBack,
                idKey: "reaction",
              ),
            ),
          ),
          Step(
            state:
                _activeStepIndex <= 2 ? StepState.editing : StepState.complete,
            isActive: _activeStepIndex >= 2,
            title: const Text("Submit"),
            content: Container(
              width: MediaQuery.of(context).size.width * 0.85,
              height: MediaQuery.of(context).size.height * 0.3,
              padding: const EdgeInsets.all(10),
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
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    TextField(
                      decoration: const InputDecoration(
                        hintText: 'Enter bay name',
                        labelText: 'Name',
                      ),
                      autofocus: true,
                      onChanged: (newValue) => _name = newValue,
                    ),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(
                            vertical: 10, horizontal: 15),
                      ),
                      onPressed: () {
                        if (_name.isEmpty) {
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                            content: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: const [
                                Text("Doesn't work"),
                              ],
                            ),
                            behavior: SnackBarBehavior.floating,
                            backgroundColor: Colors.red,
                          ));
                        } else {
                          createBay(context);
                        }
                      },
                      child: const Text(
                        "Submit bay",
                        style: TextStyle(fontSize: 30),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}