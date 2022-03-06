import 'package:url_launcher/url_launcher.dart';
import 'package:flutter/material.dart';

const baseLink = "https://10.0.2.2:5001";

loginToService(String url, BuildContext context) async {
  if (!await launch(baseLink + url)) {
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(
      content: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: const [
          Text("Doesn't work"),
        ],
      ),
      behavior: SnackBarBehavior.floating,
      backgroundColor: Colors.red,
    ));
  }
}