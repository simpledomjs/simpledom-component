// Karma configuration
// Generated on Mon Sep 21 2015 11:15:10 GMT+0200 (CEST)

module.exports = function(config) {
    const autoWatch = process.env.AUTO_WATCH !== "false";

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha'],


        // list of files / patterns to load in the browser
        files: [
            'tests/**/*.spec.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor

        preprocessors: {
            'tests/**/*.spec.js': ['webpack'],
            'src/**/*.js': ['webpack']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: autoWatch,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],

        webpack: {
            mode: 'development',
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
                                ["@babel/transform-react-jsx", {"pragma": "SimpleDom.el"}],
                                '@babel/plugin-proposal-class-properties'
                            ]
                        }
                    }
                ]
            }
        },
        webpackMiddleware: {noInfo: true},


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: !autoWatch
    })
};