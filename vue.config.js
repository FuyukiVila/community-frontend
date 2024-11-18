const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        client: {
            overlay: false
        },
        historyApiFallback: true,
        compress: true,
        allowedHosts: "all",
        webSocketServer: false,
    },
    publicPath: './',
})
