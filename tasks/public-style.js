const gulp = require('gulp');
const concat = require('gulp-concat');
const filter = require('gulp-filter');
const sass = require('gulp-sass');
const less = require('gulp-less');
const cssc = require('gulp-css-condense');
// GENERATE STYLESHEET 
gulp.task('public-style', function () {
    let sassFilter = filter(['**/*.scss', '**/*.sass'], { restore: true })
    let lessFilter = filter(['**/*.less'], { restore: true })
    return gulp.src([
        'public/fonts/iconfont.css',
        'app/scss/main.*',
        'app/sass/main.*',
        'app/less/main.*',
        'components/**/public.css', 
        'components/**/public.scss',
        'components/**/public.sass',
        'components/**/public.less'
    ], {
        allowEmpty: true
    })
        .pipe(sassFilter).pipe(sass().on('error', function () { console.log('\x1b[31m',`Your SASS code has an ERROR. OMG!`,"\x1b[0m"); this.emit('end'); })).pipe(sassFilter.restore)
        .pipe(lessFilter).pipe(less()).pipe(lessFilter.restore)
        .pipe(concat('style.css'))
        .pipe(cssc())
        .pipe(gulp.dest('public/css'))
});