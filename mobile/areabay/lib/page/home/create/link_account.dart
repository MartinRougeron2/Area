import 'package:flutter/material.dart';

import 'widget/card_login_service.dart';

class LinkAccountArgs {
  final Map<String, Map<String, String>> data;

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

  onStepContinue() {
    if (_activeStepIndex < 2) {
      setState(() {
        _activeStepIndex += 1;
      });
    } else {
      // ignore: avoid_print
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
              state: _activeStepIndex <= 0
                  ? StepState.editing
                  : StepState.complete,
              isActive: _activeStepIndex >= 0,
              title: const Text("Action"),
              content: const Center(
                child: LoginServiceCard(
                    serviceName: "Instagram",
                    serviceLogin: "/path/to/login",
                    serviceLogo: "assets\\instagram.png"),
              )),
          Step(
              state: _activeStepIndex <= 1
                  ? StepState.editing
                  : StepState.complete,
              isActive: _activeStepIndex >= 1,
              title: const Text("Reaction"),
              content: const Center(
                  child: LoginServiceCard(
                      serviceName: "Facebook",
                      serviceLogin: "/path/to/login",
                      serviceLogo: "assets\\instagram.png"))),
          Step(
              state: _activeStepIndex <= 2
                  ? StepState.editing
                  : StepState.complete,
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
                    child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(
                                vertical: 10, horizontal: 15)),
                        onPressed: () {
                          Navigator.pop(context);
                        },
                        child: const Text("Submit bay",
                            style: TextStyle(fontSize: 30)))),
              )),
        ],
      ),
    );
  }
}