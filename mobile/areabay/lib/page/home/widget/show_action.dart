import 'package:flutter/material.dart';

class ActionWidget extends StatefulWidget {
  final String reactionLogo;
  final String reactionDesc;
  final String actionLogo;
  final String actionDesc;

  const ActionWidget(
      {Key? key,
      required this.reactionLogo,
      required this.reactionDesc,
      required this.actionLogo,
      required this.actionDesc})
      : super(key: key);

  @override
  _ActionWidgetState createState() => _ActionWidgetState();
}

enum actionMenu { modify, delete }

class _ActionWidgetState extends State<ActionWidget> {
  actionMenu _selection = actionMenu.modify;


  @override
  Widget build(BuildContext context) {
    return Container(
        padding: const EdgeInsets.all(5),
        height: MediaQuery.of(context).size.height * 0.15,
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
          color: const Color.fromRGBO(34, 79, 129, 1),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            DescBay(
              logo: widget.reactionLogo,
              desc: widget.reactionDesc,
            ),
            const Icon(Icons.arrow_forward_rounded,
                size: 40, color: Colors.white),
            DescBay(logo: widget.actionLogo, desc: widget.actionDesc),
            PopupMenuButton<actionMenu>(
              onSelected: (actionMenu result) {
                setState(() {
                  _selection = result;
                  print(_selection);
                });
              },
              itemBuilder: (BuildContext context) =>
                  <PopupMenuEntry<actionMenu>>[
                const PopupMenuItem<actionMenu>(
                  value: actionMenu.modify,
                  child: Text('Modify'),
                ),
                const PopupMenuItem<actionMenu>(
                  value: actionMenu.delete,
                  child: Text('Delete'),
                ),
              ],
            )
          ],
        ));
  }
}

class DescBay extends StatefulWidget {
  final String logo;
  final String desc;

  const DescBay({Key? key, required this.logo, required this.desc})
      : super(key: key);

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
        Image(image: AssetImage(widget.logo)),
        const Padding(padding: EdgeInsets.all(5)),
        SizedBox(
            width: MediaQuery.of(context).size.width * 0.3,
            child: Center(
                child: Text(widget.desc,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(color: Colors.white),
                    textAlign: TextAlign.center))),
      ],
    );
  }
}