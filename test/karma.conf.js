/* global module */

/* Karma configuration */
module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: './..',
        preprocessors: {
            '**/*.html': ['ng-html2js']
        },
        ngHtml2JsPreprocessor: {
            stripPrefix: 'src',
            moduleName: 'uss-utilities',
            cacheIdFromPath: function(filepath) {
                // example strips 'public/' from anywhere in the path
                // module(app/templates/template.html) => app/public/templates/template.html
                return filepath.replace(/(src\/)/, '');
            }
        },
        frameworks: ['jasmine'],
        plugins: [
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-ng-html2js-preprocessor'
        ],
        // list of files / patterns to load in the browser
        files: [
            'lib/angular/1.5.8/angular.js',
            'lib/angular/1.5.8/angular-resource.js',
            'lib/angular/1.5.8/angular-mocks.js',
            'src/**/*.js',
            'test/common.js',
            'test/services/**/*.js',
            'test/interceptors/**/*.js'
        ],
        // list of files to exclude
        exclude: [],
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['dots'],
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome', 'Firefox', 'PhantomJS'],
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
