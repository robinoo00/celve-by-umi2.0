export default {
    base: './',
    publicPath: './',
    history: 'hash',
    browserslist: [
        "> 1%",
        "last 2 versions",
        "iOS >= 7",
        "Android > 4.1",
        "Firefox > 20",
    ],
    plugins: [
        ['umi-plugin-react', {
            antd: true,
            dva: true,
            dynamicImport: false,
            title: 'test-umi',
            dll: true,
            pwa: false,
            routes: {
                exclude: [
                    /components/,
                    /models/,
                    /services/,
                    /images/,
                    /styles/,
                ],
            },
            hardSource: false,
        }],
    ],
}
