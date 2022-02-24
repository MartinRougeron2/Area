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
            return actionList[index];
          },
          separatorBuilder: (BuildContext context, int index) =>
              const Divider(),
        ));
  }
}