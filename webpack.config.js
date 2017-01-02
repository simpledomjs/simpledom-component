var webpack = require('webpack');

var entries = {
    'simpledom-component': ['./src/main.js']
};

module.exports = {
    output: {
        path: './dist/',
        filename: '[name].js',
        library: 'SimpleDomComponent',
        libraryTarget: 'umd'
    },
    entry: entries,
    resolve: {
        extensions: ['','.js']  // handle all those extensions
    },
    module: {
        loaders: [
            {
                // preprocess all files with babel to turn ES6 code into ES5 code
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['stage-0', 'es2015'],
                    plugins: [
                        ["transform-react-jsx", { "pragma": "SimpleDom.el" }],
                        "babel-plugin-add-module-exports",
                        "transform-class-properties"
                    ]
                }
            }
        ]
    },
    eslint: {
        configFile: './lint-es6.json' // set of rules for ES6 files
    },
    plugins: [
        new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]) // saves ~100k from build
    ]
};
