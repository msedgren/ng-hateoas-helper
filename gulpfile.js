'use strict';

var pkg = require('./package.json'),
    gulp = require('gulp'),
    concat = require('gulp-concat-util'),
    gutil = require('gulp-util'),
    path = require('path'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    ngtemplate = require('gulp-ngtemplate'),
    ngAnnotate = require('gulp-ng-annotate'),
    htmlmin = require('gulp-htmlmin'),
    Server = require('karma').Server;

var paths = {
    src: 'src',
    dist: 'dist',
    scripts: '**/*.js',
    extName: 'ng-hateoas-helper'
};

var banner = gutil.template('/**\n' +
    ' * <%= pkg.name %>\n' +
    ' * @version v<%= pkg.version %> - <%= today %>\n' +
    ' */\n', {
        file: '',
        pkg: pkg,
        today: new Date().toISOString().substr(0, 10)
    });


var exclude = ['angular'];

// CLEAN
gulp.task('clean', function() {
    del.sync([paths.dist]);
});

//Test
gulp.task('test', function() {
    var server = new Server({
        configFile: path.join(process.cwd(), '/test/karma.conf.js'),
        browsers: ['PhantomJS'],
        singleRun: true
    });

    server.start();
});

gulp.task('tdd', function(done) {
    new Server({
        configFile: path.join(process.cwd(), '/test/karma.conf.js'),
        browsers: ['Chrome', 'Firefox', 'PhantomJS'],
        singleRun: false
    }, done).start();
});

//SCRIPTS
gulp.task('buildScripts', ['clean'], function() {
    return gulp.src(['module.js', paths.scripts], {
            cwd: paths.src
        })
        .pipe(ngAnnotate())
        .pipe(concat(pkg.name + '.js', {
            process: function(src) {
                return '// Source: ' + path.basename(this.path) + '\n' + (src.trim() + '\n').replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
            }
        }))
        .pipe(concat.header('(function(window, document, undefined) {\n\'use strict\';\n'))
        .pipe(concat.footer('\n})(window, document);\n'))
        .pipe(concat.header(banner))
        .pipe(gulp.dest(paths.dist))
        .pipe(rename(function(path) {
            path.extname = '.min.js'
        }))
        .pipe(uglify())
        .pipe(concat.header(banner))
        .pipe(gulp.dest(paths.dist));
});

//Default
gulp.task('build', ['buildScripts']);
gulp.task('dist', ['test', 'build']);
gulp.task('default', ['dist']);
