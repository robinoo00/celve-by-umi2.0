export default {
    proxy: {
        "/api/": {
            "target": "http://xxx.com/",
            "changeOrigin": true,
            "pathRewrite": { "^/api/" : "" }
        }
    },
    "theme": {
        "@primary-color": "#1DA57A"
    }
}
