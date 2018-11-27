export default {
    base: './',
    publicPath: './',
    history: 'hash',
    hash:true,
    extraPostCSSPlugins:[
        require('autoprefixer')({
            browsers:['> 0%']
        })
    ],
    // proxy: {
    //     "/api/": {
    //         "target": "http://xxx.com/",
    //         "changeOrigin": true,
    //         "pathRewrite": { "^/api/" : "" }
    //     }
    // },
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
