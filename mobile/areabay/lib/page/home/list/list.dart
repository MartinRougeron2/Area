import 'package:flutter/material.dart';

import 'widget/show_action.dart';

class ShowAllAction extends StatefulWidget {
  const ShowAllAction({Key? key}) : super(key: key);

  @override
  ShowAllActionState createState() => ShowAllActionState();
}

class ShowAllActionState extends State<ShowAllAction> {
  final List<Widget> actionList = const [
    ActionWidget(
        reactionLogo: "assets\\instagram.png",
        reactionDesc: " eqsdazeazdqsd ",
        actionLogo: "assets\\instagram.png",
        actionDesc: "actionDesc"),
    ActionWidget(
        reactionLogo: "assets\\instagram.png",
        reactionDesc:
            "reactionDesc aze qsd azeazeqsdzaer e aeaz eqsdazeazdqsd ",
        actionLogo: "assets\\instagram.png",
        actionDesc: "actionDesc"),
    ActionWidget(
        reactionLogo: "assets\\instagram.png",
        reactionDesc:
            "reactionDesc aze qsd azeazeqsdzaer e aeaz eqsdazeazdqsd ",
        actionLogo: "assets\\instagram.png",
        actionDesc: "actionDesc"),
    ActionWidget(
        reactionLogo: "assets\\instagram.png",
        reactionDesc:
            "reactionDesc aze qsd azeazeqsdzaer e aeaz eqsdazeazdqsd ",
        actionLogo: "assets\\instagram.png",
        actionDesc: "actionDesc"),
    ActionWidget(
        reactionLogo: "assets\\instagram.png",
        reactionDesc:
            "reactionDesc aze qsd azeazeqsdzaer e aeaz eqsdazeazdqsd ",
        actionLogo: "assets\\instagram.png",
        actionDesc: "actionDesc"),
    ActionWidget(
        reactionLogo: "assets\\instagram.png",
        reactionDesc:
            "reactionDesc aze qsd azeazeqsdzaer e aeaz eqsdazeazdqsd ",
        actionLogo: "assets\\instagram.png",
        actionDesc: "actionDesc"),
    ActionWidget(
        reactionLogo: "assets\\instagram.png",
        reactionDesc:
            "reactionDesc aze qsd azeazeqsdzaer e aeaz eqsdazeazdqsd ",
        actionLogo: "assets\\instagram.png",
        actionDesc: "actionDesc"),
  ];

  @override
  Widget build(BuildContext context) {
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
  }
}