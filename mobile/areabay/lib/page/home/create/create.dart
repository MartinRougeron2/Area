import 'package:areabay/page/home/create/link_account.dart';
import 'package:areabay/page/home/create/widget/service_action.dart';
import 'package:flutter/material.dart';
import 'package:flutter/painting.dart';
import 'package:flutter/widgets.dart';

class CreateBayPage extends StatefulWidget {
  const CreateBayPage({Key? key}) : super(key: key);

  @override
  _CreateBayPageState createState() => _CreateBayPageState();
}

class _CreateBayPageState extends State<CreateBayPage> {
  Map action = {
    'Twitter': [
      'On mp',
      'On call',
    ],
    'Facebook': [
      'On Post',
      'On Like',
    ],
    'Insta': ['on steam', 'on reno'],
  };
  Map reaction = {
    'Twitter': [
      'Do a mp',
      'Do a call',
    ],
    'Facebook': [
      'Do a Post',
      'Do a Like',
    ],
    'In': ['on steam', 'on reno']
  };

  Map<String, Map<String, String>> data= {
    "Action": {
      "Service": "",
      "Action": "",
    },
    "Reaction": {
      "Service": "",
      "Action": "",
    }
  };

  callBackSetData(String type, String service, String action) => setState(() {
        data[type]!["Service"] = service;
        data[type]!["Action"] = action;
      });

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: const EdgeInsets.all(10),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            ServiceAction(
                data: action, callBack: callBackSetData, type: "Action"),
            const Icon(Icons.arrow_circle_down_outlined,
                size: 50, color: Colors.black),
            ServiceAction(
                data: reaction, callBack: callBackSetData, type: "Reaction"),
            ElevatedButton(
              onPressed: () {
                  Navigator.pushNamed(context, "/homePage/create/linkAccount", arguments: LinkAccountArgs(data));
                // if (data["Action"]["Service"].toString().isNotEmpty && data["Reaction"]["Service"].toString().isNotEmpty) {
                //   Navigator.pushNamed(context, "/homePage/create/linkAccount", arguments: data);
                // }
              },
              child: const Text("Create bay"),
            )
          ],
        ));
  }
}