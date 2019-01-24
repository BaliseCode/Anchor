const gulp = require('gulp');
const concat = require('gulp-concat');
const filter = require('gulp-filter');
const sass = require('gulp-sass');
const less = require('gulp-less');
const crass = require('gulp-crass');
function done() { }

gulp.task('admin-style', function () {
    let sassFilter = filter(['**/*.scss', '**/*.sass'], { restore: true })
    let lessFilter = filter(['**/*.less'], { restore: true })
    return gulp.src([

        'public/fonts/dashicons.css',
        'components/**/admin.css',
        'components/**/admin.scss',
        'components/**/admin.sass',
        'components/**/admin.less',
        'app/**/admin.scss',
        'app/**/admin.sass',
        'app/**/admin.less',
        'app/**/admin.css'
    ], {
        allowEmpty: true
    })
        .pipe(sassFilter).pipe(sass()).on('error', function (error) {
            // we have an error
            done(error);
        }).pipe(sassFilter.restore)
        .pipe(lessFilter).pipe(less()).on('error', function (error) {
            // we have an error
            done(error);
        }).pipe(lessFilter.restore)
        .pipe(concat('admin.css'))
        .pipe(crass({ pretty: false }))
        .pipe(gulp.dest('public/editor'))
});
