var webpack = require('webpack');

var entries = {
    'simpledom-component': ['./src/main.js']
};

module.exports = {
    output: {
        filename: '[name].js',
        library: 'SimpleDomComponent',
        libraryTarget: 'umd'
    },
    entry: entries,
    module: {
        rules: [
            {
                // preprocess all files with babel to turn ES6 code into ES5 code
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ["@babel/preset-env", "@babel/preset-react"],
                    plugins: [
                        ["@babel/transform-react-jsx", { "pragma": "SimpleDom.el" }],
                        '@babel/plugin-proposal-class-properties'
                    ]
                }
            }
        ]
    }
};
