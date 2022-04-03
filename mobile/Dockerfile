FROM cirrusci/flutter
WORKDIR /mobile
COPY ./areabay/pubspec.yaml /mobile
RUN flutter pub get
CMD ["flutter", "build",  "apk", "--build-name='AreaBay'"]
EXPOSE
