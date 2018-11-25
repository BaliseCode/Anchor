'use strict';

var gulp = require('gulp');
var HubRegistry = require('gulp-hub');

/* tell gulp to use the tasks just loaded */
gulp.registry(new HubRegistry(['tasks/*.js']));

const toWatch = [
    'images',
    'admin-style',
    'public-style'
];

// START
gulp.task('watch', () => {
    gulp.watch('app/graphics/icons/*.svg', gulp.series(gulp.parallel('iconfont'), gulp.parallel('public-style'), 'autoloader'));
    gulp.watch('app/graphics/dashicons/*.svg', gulp.series(gulp.parallel('dashicons'), gulp.parallel('public-style'), 'autoloader'));
    gulp.watch('app/graphics/images/*', gulp.series(gulp.parallel('images'), gulp.parallel('public-style'), 'autoloader'));

    // gulp.watch('app/**/*.js*', gulp.series(gulp.parallel('js'), 'autoloader'));
    // gulp.watch('components/**/*public.js*', gulp.series(gulp.parallel('js'), 'autoloader'));
    // gulp.watch('components/**/block.js*', gulp.series(gulp.parallel('components'), 'autoloader'));
    // gulp.watch('components/**/*.*ss', gulp.series(gulp.parallel('public-style'), 'autoloader'));
    // gulp.watch('components/**/*.*ss', gulp.series(gulp.parallel('admin-style'), 'autoloader'));
    // gulp.watch('app/**/*.*', gulp.parallel(...toWatch));
    gulp.watch(['app/**/*.php'], gulp.parallel('autoloader'));
});
gulp.task('default', gulp.series('iconfont', gulp.parallel(...toWatch), 'autoloader'));