import 'package:flutter/material.dart';

import 'widget/show_action.dart';
import 'package:areabay/api/query.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class ShowAllAction extends StatefulWidget {
  const ShowAllAction({Key? key}) : super(key: key);

  @override
  ShowAllActionState createState() => ShowAllActionState();
}

class ShowAllActionState extends State<ShowAllAction> {
  List actionList = [];

  parseData(QueryResult result) {
    if (result.data?["GetUser"]?["user_actions"] == null) {
      return;
    }
    List actions = result.data?["GetUser"]?["user_actions"];

    actionList = actions.map((item) {
      return ActionWidget(
        name: item["name"],
        actionService: item["action_effect"]["service"]["name"],
        actionDesc: item["action_effect"]["action"]["name"],
        reactionService: item["action_trigger"]["service"]["name"],
        reactionDesc: item["action_effect"]["action"]["name"],
      );
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Query(
      options: QueryOptions(
        document: gql(fetchBay),
        // pollInterval: const Duration(minutes: 1),
        pollInterval: const Duration(seconds: 10),
      ),
      builder: (QueryResult result, {VoidCallback? refetch, FetchMore? fetchMore}) {
        if (result.hasException && actionList.isEmpty) {
          return Text(result.exception.toString());
        } else {
          // ScaffoldMessenger.of(context)
          //     .showSnackBar(SnackBar(
          //     content: Row(
          //       mainAxisAlignment: MainAxisAlignment.center,
          //       children: const [
          //         Text("No connection"),
          //       ],
          //     ),
          //     behavior: SnackBarBehavior.floating,
          //     backgroundColor: Colors.red));
        }

        if (result.isLoading) {
          return const Text('Loading');
        }
        parseData(result);
        if (actionList.isEmpty) {
          return const Text("Let's create some bay !");
        }
        return Container(
            padding: const EdgeInsets.all(15.0),
            child: ListView.separated(
              itemCount: actionList.length,
              itemBuilder: (BuildContext context, int index) {
                return Dismissible(
                  key: UniqueKey(),
                  direction: DismissDirection.endToStart,
                  onDismissed: (_) {
                    setState(() {
                      actionList.removeAt(index);
                    });
                  },
                  child: actionList[index],
                  background: Container(
                    decoration: const BoxDecoration(
                        color: Colors.red,
                        borderRadius: BorderRadius.all(Radius.circular(10))),
                    padding: const EdgeInsets.only(right: 15),
                    alignment: Alignment.centerRight,
                    child: const Icon(
                      Icons.delete,
                      color: Colors.white,
                    ),
                  ),
                );
              },
              separatorBuilder: (BuildContext context, int index) =>
              const Divider(),
            ));
      },
    );
  }
}