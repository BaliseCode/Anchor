const gulp = require('gulp');
const concat = require('gulp-concat');
const filter = require('gulp-filter');
const sass = require('gulp-sass');
const less = require('gulp-less');
const crass = require('gulp-crass');
function done() {}
// GENERATE STYLESHEET
gulp.task('public-style', function () {
    let sassFilter = filter(['**/*.scss', '**/*.sass'], { restore: true })
    let lessFilter = filter(['**/*.less'], { restore: true })
    return gulp.src([
        'public/fonts/*.css',
        'app/scss/main.*',
        'app/sass/main.*',
        'app/less/main.*',
        'components/**/public.css',
        'components/**/public.scss',
        'components/**/public.sass',
        'components/**/public.less'
    ])
        .pipe(sassFilter).pipe(sass()).on('error', function (error) {
            // we have an error
            done(error);
        }).pipe(sassFilter.restore)
        .pipe(lessFilter).pipe(less()).on('error', function (error) {
            // we have an error
            done(error);
        }).pipe(lessFilter.restore)
        .pipe(concat('style.css'))
        .pipe(crass({ pretty: false }))
        .pipe(gulp.dest('public/css'))
});