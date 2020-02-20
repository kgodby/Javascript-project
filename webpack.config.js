const path = require("path")

module.exports =  {
    mode: "development",
    entry: './src/js/index.js',
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist")
    }, watchOptions: {
        ignored: /node_modules/
    },
    resolve: {
        extensions: [".js"]
    },
    watch: true
}