var gulp = require('gulp');
const babel = require('gulp-babel');
const minifyjs = require('gulp-js-minify');
const concat = require('gulp-concat');

// BUILD COMPONENTS
gulp.task('components', function(){
    return gulp.src('components/**/block.js*','components/**/*.block.js*')
    .pipe(babel({
        presets: ['@babel/env'],
        plugins: [

            [ 'transform-react-jsx', {
                pragma: 'wp.element.createElement',
            } ],
        ]
    }))
    .pipe(concat('components.js'))
    .pipe(gulp.dest('public/editor'))
});
