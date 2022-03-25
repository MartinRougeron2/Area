import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:url_launcher/url_launcher.dart';
import 'args/web_app_args.dart';

class WebApp extends StatefulWidget {
  const WebApp({Key? key}) : super(key: key);

  @override
  State<WebApp> createState() => _WebAppState();
}

class _WebAppState extends State<WebApp> {
  @override
  Widget build(BuildContext context) {
    final args = ModalRoute.of(context)!.settings.arguments as WebAppArgs;

    return InAppWebView(

      initialUrlRequest: URLRequest(
        url: Uri.parse(args.url),
      ),
      initialOptions: InAppWebViewGroupOptions(
        crossPlatform: InAppWebViewOptions(
            useShouldOverrideUrlLoading: true
        ),
      ),
      onReceivedServerTrustAuthRequest: (controller, challenge) async {
        return ServerTrustAuthResponse(action: ServerTrustAuthResponseAction.PROCEED);
      },
        shouldOverrideUrlLoading: (controller, request) async {
          var url = request.request;
          var uri = url.url;

          if (uri?.host == "localhost") {
            print("IN TEST");
            String newUrl = uri.toString().replaceFirst("localhost", "10.0.2.2");
            print("newUrl $newUrl");
            Uri test = Uri.parse(newUrl);

            print("SCHEME ${test.scheme}");
            controller.loadUrl(urlRequest: URLRequest(url: Uri.parse(newUrl)));
          }

          return NavigationActionPolicy.ALLOW;
        },
      onLoadStart: (InAppWebViewController controller, Uri? url) {
        print("ACT URL: $url");
        if (url.toString().startsWith("http://10.0.2.2:8081/auth/win?id=")) {
          print("My id: ${url?.queryParameters["id"]}");
          if (url?.queryParameters != null &&
              url!.queryParameters["id"] != null) {
            String id = url.queryParameters["id"] as String;
            args.callBack(args.idKey, id);
          }

          Navigator.pop(context);
        }
      },
    );
  }
}
