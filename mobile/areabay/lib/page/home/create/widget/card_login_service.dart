import 'package:flutter/material.dart';
import 'package:areabay/api/graphql_config.dart';
import 'package:areabay/api/query.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import '../args/web_app_args.dart';

typedef SetDataCallBack = void Function(String key, String value);

class LoginServiceCard extends StatefulWidget {
  final String serviceName;
  final String actionId;
  final String actionName;
  final SetDataCallBack setId;
  final String idKey;

  final ChromeSafariBrowser browser = ChromeSafariBrowser();

  LoginServiceCard(
      {Key? key, required this.serviceName, required this.actionId, required this.actionName, required this.setId, required this.idKey})
      : super(key: key);

  @override
  _LoginServiceCardState createState() => _LoginServiceCardState();
}

class _LoginServiceCardState extends State<LoginServiceCard> {

  getData(BuildContext context) async {
    Map data = {
      "query": getBaseActionById,
      "variables": {
        "id": widget.actionId,
      }
    };
    Map result = await GraphQLConfig.postRequest(data);
    // widget.setId(widget.idKey, result["data"]?["CreateUniqueActionByBaseActionId"]?["id"]);

    const baseLink = "https://10.0.2.2:5001";


    print("VALUE $result");
    print( baseLink + result["data"]?["GetBaseActionById"]?["auth_url"] + "?id=" + widget.actionId);
    WebAppArgs args = WebAppArgs(
        baseLink + result["data"]?["GetBaseActionById"]?["auth_url"] + "?id=" + widget.actionId,
        widget.idKey,
        widget.setId
    );

    Uri url = Uri.parse(baseLink + result["data"]?["GetBaseActionById"]?["auth_url"] + "?id=" + widget.actionId);
    Navigator.pushNamed(context, "/homePage/create/webView", arguments: args);
  }

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
          Text(
            widget.actionName,
            style: const TextStyle(fontSize: 20),
          ),
          // Image(image: AssetImage(widget.serviceLogo), fit: BoxFit.fitHeight),
          ElevatedButton(
              onPressed: () {
                getData(context);
                // TODO LOGIN TO SERVICE
              },
              style: ElevatedButton.styleFrom(
                  padding:
                  const EdgeInsets.symmetric(vertical: 10, horizontal: 15)),
              child: const Text("Connect", style: TextStyle(fontSize: 30)))
        ],
      ),
    );
  }

}