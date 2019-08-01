'use strict';

var gulp = require('gulp');
var HubRegistry = require('gulp-hub');
var dotenv = require('dotenv');
var browserSync = require('browser-sync').create();

/* tell gulp to use the tasks just loaded */
gulp.registry(new HubRegistry(['tasks/*.js']));

// START
const setProduction =(e) => {
    global.WebPackMode = global.WebPackMode || "production"
    return Promise.resolve('the value is ignored');
}
const setDeveloppement =(e) => {
    global.WebPackMode = global.WebPackMode || 'development'
    return Promise.resolve('the value is ignored');
}
gulp.task('watcher', () => {
    // Graphic tasks
    gulp.watch('app/graphics/icons/*.svg', gulp.series(gulp.parallel('iconfont'), gulp.parallel('public-style'), 'autoloader'));
    gulp.watch('app/graphics/dashicons/*.svg', gulp.series(gulp.parallel('dashicons'), gulp.parallel('admin-style'), 'autoloader'));
    gulp.watch('app/graphics/images/*', gulp.series(gulp.parallel('images'), gulp.parallel('public-style'), 'autoloader'));

    // Public Elements
    gulp.watch('app/**/*.vue', gulp.series(gulp.parallel('public-script'), 'autoloader'));
    gulp.watch('app/**/*.js*', gulp.series(gulp.parallel('public-script'), 'autoloader'));
    gulp.watch('app/**/*.*ss', gulp.series(gulp.parallel('admin-style', 'public-style'), 'autoloader')); /** */

    // Gutenberg Elements
    gulp.watch('components/**/*public.js*', gulp.series(gulp.parallel('public-script'), 'autoloader'));
    gulp.watch('components/**/*.js*', gulp.series(gulp.parallel('gutenberg'), 'autoloader'));
    gulp.watch('components/**/*.*ss', gulp.series(gulp.parallel('admin-style', 'public-style'), 'autoloader'));

    // Autoloader for PHP
    gulp.watch(['app/**/*.php'], gulp.parallel('autoloader'));
});
gulp.task('watch', gulp.series(setDeveloppement, 'default', gulp.parallel('browsersync', 'watcher')));

gulp.task('default', gulp.series(
    setProduction,
    gulp.parallel([
        'iconfont',
        'dashicons'
    ]),
    gulp.parallel([
        'images',
        'admin-style',
        'public-style',
        'public-script'
    ]),
    'autoloader'
));


gulp.task('browsersync', () => {
    const env = dotenv.config()
    if (!process.env.WP_HOME) {
        //require('dotenv').config({ path: __dirname+'/../../../..' })
    }
    if (process.env.WP_HOME) {
        let files = [
            './app/**/*.php',
            './app/*.php',
            './public/**/*.*'
        ];
        browserSync.init(files, {
            proxy: process.env.WP_HOME
        });
    }
})
