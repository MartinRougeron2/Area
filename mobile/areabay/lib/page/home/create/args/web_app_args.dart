typedef SetDataCallBack = void Function(String key, String value);

class WebAppArgs {
  final String url;
  final String idKey;
  final SetDataCallBack callBack;

  WebAppArgs(this.url, this.idKey, this.callBack);
}