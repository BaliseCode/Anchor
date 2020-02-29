const gulp = require('gulp');
const concat = require('gulp-concat');
const filter = require('gulp-filter');
const sass = require('gulp-sass');
const less = require('gulp-less');
const crass = require('gulp-crass');

gulp.task('admin-style', function () {
    let sassFilter = filter(['**/*.scss', '**/*.sass'], { restore: true })
    let lessFilter = filter(['**/*.less'], { restore: true })
    return gulp.src([

        'public/fonts/dashicons.css',
        'app/components/**/admin.css',
        'app/components/**/admin.scss',
        'app/components/**/admin.sass',
        'app/components/**/admin.less',
        'app/**/admin.scss',
        'app/**/admin.sass',
        'app/**/admin.less',
        'app/**/admin.css'
    ], {
        allowEmpty: true
    })
        .pipe(sassFilter).pipe(sass().on('error', function () { console.log('\x1b[31m',`Your SASS code has an ERROR. OMG!`,"\x1b[0m"); this.emit('end'); })).pipe(sassFilter.restore)
        .pipe(lessFilter).pipe(less()).pipe(lessFilter.restore)
        .pipe(concat('admin.css'))
        .pipe(crass({ pretty: false }))
        .pipe(gulp.dest('public/css'))
});
