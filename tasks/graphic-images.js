const gulp = require('gulp');
const imagemin = require('gulp-imagemin');

// IMAGES
gulp.task('images', () =>
    gulp.src('app/graphics/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('public/images'))
);