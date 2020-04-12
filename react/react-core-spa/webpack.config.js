var path = require('path');

var isEnvironmentTest = process.env.NODE_ENV === 'test';
var nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        globalObject: `typeof self !== 'undefined' ? self : this`,
        path: path.resolve(__dirname, 'dist'),
        filename: "index.js",
        library: 'core-spa',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$|\.jsx$/,
                exclude: /(node_modules|dist)/,
                use: 'babel-loader',
                enforce: 'post',
            }].concat(isEnvironmentTest ?
            {
                test: /\.js$|\.jsx$/,
                include: path.resolve(__dirname, 'src'),
                use: {
                    loader: 'istanbul-instrumenter-loader',
                    options: {
                        esModules: true,
                        presets: ["env", "react", "stage-2"]
                    }
                },
                enforce: 'post'
            } : [])
    },
    externals: [!isEnvironmentTest ? nodeExternals({
        modulesFromFile: {
            exclude: ['dependencies']
        }
    }) : ''],
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
};
