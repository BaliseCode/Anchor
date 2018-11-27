var gulp = require('gulp');
const babel = require('gulp-babel');
const minifyjs = require('gulp-js-minify');
const concat = require('gulp-concat');

// BUILD COMPONENTS
gulp.task('js', function(){
    return gulp.src(['app/js/*.js*','app/js/*.js','components/**/public.js*','components/**/*.public.js*'])
    .pipe(babel({
        presets: ['@babel/env'],
    })).on('error', function(error) {
        done(error);
    })
    .pipe(minifyjs())
    .pipe(concat('script.js'))
    .pipe(gulp.dest('public/js/'))
});
