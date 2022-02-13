const webpack = require('webpack');
const path_to_static_js = '/source/static/js'
const config = {
    entry: {
        index: [__dirname + path_to_static_js + '/src/index.jsx']
    },
    output: {
        path: __dirname + path_to_static_js + '/dep',
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.jsx?/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
        ],
    },
    mode: 'development'
};
module.exports = config;