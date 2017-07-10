var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

 module.exports = {
     entry: './js/main.js',
     output: {
         path: path.resolve(__dirname, 'build'),
         filename: 'app.bundle.js'
     },
     module: {
         loaders: [
             {
                 test: /\.js$/,
                 loader: 'babel-loader',
                 exclude: /node_modules/,
                 query: {
                     presets: ['es2015']
                 }
             },
         ]
     },
     stats: {
         colors: true
     },
     devtool: 'source-map',
     plugins: [
        new webpack.ProvidePlugin({
            _: 'underscore'
        }),
        new CopyWebpackPlugin([{ from: 'index.html'}, { from: 'css/styles.css'}])
    ]
 };