import 'package:flutter/material.dart';

class LoginServiceCard extends StatefulWidget {
  final String serviceName;
  final String serviceLogo;
  final String serviceLogin;

  const LoginServiceCard(
      {Key? key,
      required this.serviceName,
      required this.serviceLogin,
      required this.serviceLogo})
      : super(key: key);

  @override
  _LoginServiceCardState createState() => _LoginServiceCardState();
}

class _LoginServiceCardState extends State<LoginServiceCard> {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: MediaQuery.of(context).size.width * 0.85,
      height: MediaQuery.of(context).size.height * 0.3,
      padding: const EdgeInsets.all(10),
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
        color: Colors.white,
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          Text(
            widget.serviceName,
            style: const TextStyle(fontSize: 40),
          ),
          Image(image: AssetImage(widget.serviceLogo), fit: BoxFit.fitHeight),
          ElevatedButton(
              onPressed: () {},
              style:
                  ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 15)),
              child: const Text("Connect", style: TextStyle(fontSize: 30)))
        ],
      ),
    );
  }
}