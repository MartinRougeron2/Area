module.exports = (app: any) => {
    app.get('/apk', (__req: Request, res: any) => {
        console.log(__dirname);
        const file: String = `${__dirname}/../app-armeabi-v7a-release.apk`;
        res.download(file);
    })
}
