import 'package:flutter/material.dart';

typedef SetDataCallBack = void Function(
    String type, String service, String action, String id);

class ServiceAction extends StatefulWidget {
  final Map data;
  final SetDataCallBack callBack;
  final String type;
  final String title;

  const ServiceAction(
      {Key? key,
      required this.title,
      required this.callBack,
      required this.data,
      required this.type})
      : super(key: key);

  @override
  _ServiceActionState createState() => _ServiceActionState();
}

class _ServiceActionState extends State<ServiceAction> {
  Map value = {
    'Service': '',
    'Action': '',
  };

  @override
  Widget build(BuildContext context) {
    return Container(
        color: Colors.grey[100],
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.title,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                DropdownButton(
                  items: (List.from(widget.data.keys)).map((items) {
                    return DropdownMenuItem(
                      value: items as String,
                      child: Text(items),
                    );
                  }).toList(),
                  hint: Text(value['Service']),
                  onChanged: (String? newValue) {
                    setState(() {
                      value['Service'] = newValue!;
                      value['Action'] = '';
                      widget.callBack(widget.type, '', '', '');
                    });
                  },
                ),
                DropdownButton(
                  items: List.from(
                          (widget.data[value['Service']]?["action"] ?? []))
                      .map((items) {
                    print("TAG $items");
                    return DropdownMenuItem(
                      value: items["actionName"],
                      child: Text(items["actionName"]),
                    );
                  }).toList(),
                  hint: Text(value['Action']),
                  onChanged: (newValue) {
                    setState(() {
                      value['Action'] = newValue!;
                      String id = "";
                      widget.data[value['Service']]?['action'].forEach((value) {
                        print("DATA: ${value['actionName'] == newValue}");
                        if (value["actionName"] == newValue) {
                          id = value["actionId"];
                          print("ID: $id");
                          return;
                        }
                      });
                      widget.callBack(
                          widget.type, value['Service'], value['Action'], id);
                    });
                  },
                ),
              ],
            ),
          ],
        ));
  }
}