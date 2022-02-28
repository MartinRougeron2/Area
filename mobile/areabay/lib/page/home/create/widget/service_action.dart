import 'package:flutter/material.dart';

typedef SetDataCallBack = void Function(
    String type, String service, String action);

class ServiceAction extends StatefulWidget {
  final Map data;
  final SetDataCallBack callBack;
  final String type;

  const ServiceAction(
      {Key? key,
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
        child: Row(
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
                  widget.callBack(widget.type, '', '');
                });
              },
            ),
            DropdownButton(
              items:
                  (List.from(widget.data[value['Service']] ?? [])).map((items) {
                return DropdownMenuItem(
                  value: items as String,
                  child: Text(items),
                );
              }).toList(),
              hint: Text(value['Action']),
              onChanged: (String? newValue) {
                setState(() {
                  value['Action'] = newValue!;
                  widget.callBack(
                      widget.type, value['Service'], value['Action']);
                });
              },
            ),
          ],
        ));
  }
}