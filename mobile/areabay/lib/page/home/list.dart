import 'package:flutter/material.dart';
import 'widget/show_action.dart';

class ShowAllAction extends StatefulWidget {
  const ShowAllAction({Key? key}) : super(key: key);

  @override
  ShowAllActionState createState() => ShowAllActionState();
}

class ShowAllActionState extends State<ShowAllAction> {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(15.0),
      child: Column(children: const [
        ActionWidget(
            reactionLogo: "instagram.png",
            reactionDesc: "ReactionDesc",
            actionLogo: "instagram.png",
            actionDesc: "actionDesc"),
        // DescBay(logo: "qsd", desc: "cv"),
      ]),
    );
  }
}
