const gulp = require('gulp');
const concat = require('gulp-concat');
const filter = require('gulp-filter');
const sass = require('gulp-sass');
const less = require('gulp-less');
const cssc = require('gulp-css-condense');
const sort = require('gulp-sort');


// GENERATE STYLESHEET 
gulp.task('public-style', function () {
    let scssFilter = filter(['**/*.scss'], {
        restore: true
    })
    let sassFilter = filter(['**/*.sass'], {
        restore: true
    })
    let lessFilter = filter(['**/*.less'], {
        restore: true
    })
    return gulp.src([
            'app/scss/main.scss',
            'app/*.public.css',
            'app/*.public.scss',
            'app/*.public.less',
            'app/*.public.sass',
            'app/**/*.public.css',
            'app/**/*.public.scss',
            'app/**/*.public.less',
            'app/**/*.public.sass',
            'public/fonts/iconfont.css',
        ], {
            allowEmpty: true
        })
        .pipe(sort({
            comparator: (a, b) => {
                if (a.path.indexOf("app/scss/main.scss")>-1) return -1
                if (b.path.indexOf("app/scss/main.scss")>-1) return 1
                return a.path.localeCompare(b.path);
            }
        }))

        .pipe(scssFilter)
        .pipe(sass().on('error', function (error) {
            console.log('\x1b[31m', `Your SASS code has an ERROR. OMG!`, "\x1b[0m", error);
            this.emit('end');
        }))
        
        .pipe(concat('style.scss'))
        .pipe(scssFilter.restore)

        .pipe(sassFilter)
        .pipe(sass().on('error', function (error) {
            console.log('\x1b[31m', `Your SCSS code has an ERROR. OMG!`, "\x1b[0m", error);
            this.emit('end');
        }))
        .pipe(concat('style.sass'))
        .pipe(sassFilter.restore)

        .pipe(lessFilter)
        .pipe(concat('style.less'))
        .pipe(less().on('error', function (error) {
            console.log('\x1b[31m', `Your LESS code has an ERROR. OMG!`, "\x1b[0m");
            this.emit('end');
        }))
        .pipe(lessFilter.restore)

        .pipe(concat('public.css'))
        .pipe(cssc({
            consolidateViaDeclarations: true,
            consolidateViaSelectors: false,
            consolidateMediaQueries: true
        }))
        .pipe(gulp.dest('public/css'))
});