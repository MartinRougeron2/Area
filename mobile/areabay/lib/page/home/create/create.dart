import 'package:areabay/api/query.dart';
import 'package:areabay/page/home/create/link_account.dart';
import 'package:areabay/page/home/create/widget/service_action.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class CreateBayPage extends StatefulWidget {
  const CreateBayPage({Key? key}) : super(key: key);

  @override
  _CreateBayPageState createState() => _CreateBayPageState();
}

class _CreateBayPageState extends State<CreateBayPage> {
  Map serviceAction = {};
  Map serviceReaction = {};

  Map<String, Map<String, String>> data = {
    "Action": {
      "Service": "",
      "Action": "",
    },
    "Reaction": {
      "Service": "",
      "Action": "",
    }
  };

  parseData(QueryResult result) {
    serviceAction = {};
    serviceReaction = {};
    for (Map service in result.data?["GetAllServices"]) {
      if (serviceAction[service["name"]] == null) {
        serviceAction[service["name"]] = {"id": service["id"], "action": []};
      }
      if (serviceReaction[service["name"]] == null) {
        serviceReaction[service["name"]] = {"id": service["id"], "action": []};
      }
      for (Map action in service["actions"]) {
        if (action["type"] == "TRIGGER" || action["type"] == "BOTH") {
          serviceAction[service["name"]]["action"] += [
            {
              "actionId": action["id"],
              "actionName": action["name"],
              "actionOption": action["options"],
            }
          ];
        }
        if (action["type"] == "EFFECT" || action["type"] == "BOTH") {
          serviceReaction[service["name"]]["action"] = [
            {
              "actionId": action["id"],
              "actionName": action["name"],
              "actionOption": action["options"],
            }
          ];
        }
      }
    }
  }

  callBackSetData(String type, String service, String action) => setState(() {
        data[type]!["Service"] = service;
        data[type]!["Action"] = action;
      });

  @override
  Widget build(BuildContext context) {
    return Query(
      options: QueryOptions(
        document: gql(getAllService),
      ),
      builder: (QueryResult result,
          {VoidCallback? refetch, FetchMore? fetchMore}) {
        if (result.hasException) {
          return Text(result.exception.toString());
        }

        if (result.isLoading) {
          return const Text('Loading');
        }
        parseData(result);

        return Container(
          padding: const EdgeInsets.all(10),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              ServiceAction(
                data: serviceAction,
                callBack: callBackSetData,
                type: "Action",
                title: "Action",
              ),
              const Icon(Icons.arrow_circle_down_outlined,
                  size: 50, color: Colors.black),
              ServiceAction(
                data: serviceReaction,
                callBack: callBackSetData,
                type: "Reaction",
                title: "Reaction",
              ),
              ElevatedButton(
                onPressed: () {
                  if (data["Action"]!["Service"] == "" ||
                      data["Reaction"]!["Service"] == "") {
                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                      content: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          Text("Select Action and Reaction before attempt"),
                        ],
                      ),
                      behavior: SnackBarBehavior.floating,
                      backgroundColor: Colors.red,
                    ));
                    return;
                  }

                  Navigator.pushNamed(context, "/homePage/create/linkAccount",
                      arguments: LinkAccountArgs(data));
                },
                child: const Text("Create bay"),
              )
            ],
          ),
        );
      },
    );
  }
}