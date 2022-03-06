import 'package:flutter/material.dart';

class ActionWidget extends StatefulWidget {
  final String name;
  final String reactionService;
  final String reactionDesc;
  final String actionService;
  final String actionDesc;

  const ActionWidget({
    Key? key,
    required this.name,
    required this.reactionService,
    required this.reactionDesc,
    required this.actionService,
    required this.actionDesc,
  }) : super(key: key);

  @override
  _ActionWidgetState createState() => _ActionWidgetState();
}

/*

Gmail
Discord

 */
class _ActionWidgetState extends State<ActionWidget> {

  getLogo(String serviceName) {
    String logo;

    switch (serviceName) {
      case "Gmail":
        logo = "assets\\gmail.png";
        break;
      case "Discord":
        logo = "assets\\discord.png";
        break;
      default:
        logo = "assets\\instagram.png";
    }
    return logo;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: const EdgeInsets.all(5),
        height: MediaQuery
            .of(context)
            .size
            .height * 0.15,
        decoration: BoxDecoration(
          borderRadius: const BorderRadius.all(Radius.circular(10)),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.5),
              spreadRadius: 5,
              blurRadius: 7,
              offset: const Offset(0, 3), // changes position of shadow
            ),
          ],
          color: const Color.fromRGBO(34, 79, 129, 1),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            DescBay(
              logo: getLogo(widget.actionService),
              name: widget.reactionService,
              desc: widget.actionDesc,
            ),
            const Icon(Icons.arrow_forward_rounded,
                size: 40, color: Colors.white),
            DescBay(logo: getLogo(widget.reactionService),
                name: widget.actionService,
            desc: widget.reactionDesc,)
          ],
        ));
  }
}

class DescBay extends StatefulWidget {
  final String logo;
  final String name;
  final String desc;

  const DescBay({
    Key? key,
    required this.logo,
    required this.name,
    required this.desc,
  }) : super(key: key);

  @override
  _DescBayState createState() => _DescBayState();
}

class _DescBayState extends State<DescBay> {
  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Image(image: AssetImage(widget.logo), height: 20),
        const Padding(padding: EdgeInsets.all(5)),
        SizedBox(
            width: MediaQuery
                .of(context)
                .size
                .width * 0.3,
            child: Column(
              children: [
                Text(widget.name,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(color: Colors.white),
                    textAlign: TextAlign.center),
                const Padding(padding: EdgeInsets.all(2)),
                FittedBox(
                  fit: BoxFit.fitWidth,
                  child: Text(widget.desc,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(color: Colors.white),
                    textAlign: TextAlign.center),
                ),
              ],
            )),
      ],
    );
  }
}