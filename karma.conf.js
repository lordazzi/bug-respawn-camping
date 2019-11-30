module.exports = function(config) {
    config.set({

        basePath: '',

        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-typescript-preprocessor'),
            require('karma-systemjs')
        ],

        frameworks: [
            'systemjs',
            'jasmine'
        ],

        files: [
            'src/*.spec.ts',
            'src/**/*.spec.ts',
            'src/*.spec.js',
            'src/**/*.spec.js'
        ],

        preprocessors: {
            '**/*.ts': ['typescript']
        },

        systemjs: {
            configFile: 'systemjs.config.js',
            serveFiles: [
                'src/**/*.ts'
            ]
        },

        coverageIstanbulReporter: {
            reports: ['html', 'lcovonly'],
            fixWebpackSourcePaths: true
        },

        customLaunchers: {
            ChromeHeadless: {
                base: 'Chrome',
                flags: [
                    '--headless',
                    '--disable-gpu',
                    '--remote-debugging-port=9222',
                ],
            },

            ChromeDebug: {
                base: 'Chrome',
                flags: [
                    '--disable-gpu',
                    '--remote-debugging-port=9222',
                ],
            }
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: [ 'progress' ],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['ChromeHeadless'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};
