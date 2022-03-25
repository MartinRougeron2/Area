import 'package:flutter/material.dart';

typedef SetDataCallBack = void Function(
    String type, String service, String action, String id);

class ServiceAction extends StatefulWidget {
  final Map data;
  final SetDataCallBack callBack;
  final String type;
  final String title;

  const ServiceAction(
      {Key? key,
      required this.title,
      required this.callBack,
      required this.data,
      required this.type})
      : super(key: key);

  @override
  _ServiceActionState createState() => _ServiceActionState();
}

class _ServiceActionState extends State<ServiceAction> {
  Map value = {
    'Service': '',
    'Action': '',
  };

  @override
  Widget build(BuildContext context) {
    return Container(
        color: Colors.grey[100],
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.title,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                DropdownButton(
                  items: (List.from(widget.data.keys)).map((items) {
                    return DropdownMenuItem(
                      value: items as String,
                      child: Text(items),
                    );
                  }).toList(),
                  hint: Text(value['Service']),
                  onChanged: (String? newValue) {
                    setState(() {
                      value['Service'] = newValue!;
                      value['Action'] = '';
                      widget.callBack(widget.type, '', '', '');
                    });
                  },
                ),
                DropdownButton(
                  items: List.from(
                          (widget.data[value['Service']]?["action"] ?? []))
                      .map((items) {
                    return DropdownMenuItem(
                      value: items["actionName"],
                      child: Text(items["actionName"]),
                    );
                  }).toList(),
                  hint: Text(value['Action']),
                  onChanged: (newValue) {
                    setState(() {
                      value['Action'] = newValue!;
                      String id = "";
                      widget.data[value['Service']]?['action'].forEach((value) {
                        if (value["actionName"] == newValue) {
                          id = value["actionId"];
                          return;
                        }
                      });
                      widget.callBack(
                          widget.type, value['Service'], value['Action'], id);
                    });
                  },
                ),
              ],
            ),
          ],
        ));
  }
}

// https://myareabay.slack.com/oauth?client_id=2871127362496.3049888625011&scope=incoming-webhook%2Cchat%3Awrite%2Ccalls%3Aread%2Cchannels%3Aread%2Cgroups%3Aread%2Cmpim%3Aread%2Cim%3Aread%2Cchannels%3Ahistory%2Cgroups%3Ahistory%2Cim%3Ahistory%2Cmpim%3Ahistory&user_scope=&redirect_uri=https%3A%2F%2Flocalhost%3A5001%2Fauth%2Fslack-redirect&state=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnN0YWxsT3B0aW9ucyI6eyJzY29wZXMiOlsiaW5jb21pbmctd2ViaG9vayIsImNoYXQ6d3JpdGUiLCJjYWxsczpyZWFkIiwiY2hhbm5lbHM6cmVhZCIsImdyb3VwczpyZWFkIiwibXBpbTpyZWFkIiwiaW06cmVhZCIsImNoYW5uZWxzOmhpc3RvcnkiLCJncm91cHM6aGlzdG9yeSIsImltOmhpc3RvcnkiLCJtcGltOmhpc3RvcnkiXSwibWV0YWRhdGEiOiI2MjAzYzVkMDdmNTlhOWJiZjAxOWE3M2YiLCJyZWRpcmVjdFVyaSI6Imh0dHBzOi8vbG9jYWxob3N0OjUwMDEvYXV0aC9zbGFjay1yZWRpcmVjdCJ9LCJub3ciOiIyMDIyLTAzLTIyVDIxOjIyOjMwLjkzNVoiLCJpYXQiOjE2NDc5ODQxNTB9.Vw4VOvqerX_eq8ouHJ2d7pD6jOeJKAoXHGwAqxqSnHw&granular_bot_scope=1&single_channel=0&install_redirect=&tracked=1&team=