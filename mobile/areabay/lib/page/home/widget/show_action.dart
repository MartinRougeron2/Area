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

class _ActionWidgetState extends State<ActionWidget> {
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
          children: const [
            DescBay(
                logo: "assets/service/instagram.png",
                desc:
                    "When someone like my publication aze aze qsd qs dwxccwsdqsd qsd "),
            Icon(Icons.arrow_forward_rounded, size: 40, color: Colors.white),
            DescBay(logo: "assets/service/instagram.png", desc: "wxc"),

            // const DescBay(logo: "qsd", desc: "wxc"),
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
        Container(
            width: MediaQuery.of(context).size.width * 0.3,
            child: Center(
                child: Text(widget.desc,
                    maxLines: 3,
                    style: const TextStyle(color: Colors.white),
                    textAlign: TextAlign.center))),
      ],
    );
  }
}
