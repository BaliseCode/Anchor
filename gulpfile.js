var gulp = require('gulp');
var concat = require('gulp-concat');
var filter = require('gulp-filter');
var fs = require('fs');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var less = require('gulp-less');
var crass = require('gulp-crass');
const md5File = require('md5-file')

const toWatch = [
    'public-style',
    'admin-style',
    'autoloader',
];

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
// BUILD COMPONENTS
gulp.task('js', function(){
    return gulp.src('components/**/public.js*','components/**/*.public.js*','app/js/*.js*')
    .pipe(babel({
        presets: ['@babel/env'],
    }))
    .pipe(concat('script.js'))
    .pipe(gulp.dest('public/js/'))
});

// GENERATE STYLESHEET
gulp.task('public-style', function(){
    let sassFilter = filter(['**/*.scss','**/*.sass'], {restore: true})
    let lessFilter = filter(['**/*.less'], {restore: true})
    return gulp.src([
        'app/scss/main.*',
        'app/sass/main.*',
        'app/less/main.*',
        'components/**/public.css',
        'components/**/public.scss',
        'components/**/public.sass',
        'components/**/public.less'
    ])
    .pipe(sassFilter).pipe(sass()).on('error', function(error) {
      // we have an error
      done(error);
    }).pipe(sassFilter.restore)
    .pipe(lessFilter).pipe(less()).on('error', function(error) {
      // we have an error
      done(error);
    }).pipe(lessFilter.restore)
    .pipe(concat('style.css'))
    .pipe(crass({pretty:false}))
    .pipe(gulp.dest('public/css'))
});
gulp.task('admin-style', function(){
    let sassFilter = filter(['**/*.scss','**/*.sass'], {restore: true})
    let lessFilter = filter(['**/*.less'], {restore: true})
    return gulp.src([
        'components/**/admin.css',
        'components/**/admin.scss',
        'components/**/admin.sass',
        'components/**/admin.less',
        'app/**/admin.scss',
        'app/**/admin.sass',
        'app/**/admin.less',
        'app/**/admin.css'
    ])
    .pipe(sassFilter).pipe(sass()).pipe(sassFilter.restore)
    .pipe(lessFilter).pipe(less()).pipe(lessFilter.restore)
    .pipe(concat('admin.css'))
    .pipe(crass({pretty:false}))
    .pipe(gulp.dest('public/editor'))
});

// CREATE AN AUTOLOADER
let md5Script = 1
let md5Style =1
if (fs.existsSync('public/css/style.css')) {
    md5Style = md5File.sync('public/css/style.css');
}
if (fs.existsSync('public/js/script.js')) {
    md5Script = md5File.sync('public/js/script.js');
}

let message = `<?php
// LOAD COMPOSER AUTO LOADER
include('vendor/autoload.php');

// LOAD SCRIPT AND STYLE
add_action( 'wp_enqueue_scripts', function(){
    if (!is_admin()) {
        wp_enqueue_style('main-style',  get_stylesheet_directory_uri().'/public/css/style.css', array(), '${md5Style}', 'all');
        wp_enqueue_script('main-script',  get_stylesheet_directory_uri().'/public/js/script.js', array(), '${md5Script}', true );
    }
});

// LOAD SCRIPT AND STYLE FOR GUTENBERG EDITOR
add_action('enqueue_block_editor_assets', function(){
    wp_enqueue_script('components',  get_stylesheet_directory_uri().'/public/editor/components.js', array(), 1, true );
    wp_enqueue_style('components',  get_stylesheet_directory_uri().'/public/editor/admin.css', array(), 1, 'all');
});

// FILES IN INCLUDE PATH
`;

gulp.task('autoloader', function(){
    fs.readdir('app/includes', function(err, items) {
        let includes = [];
        items.forEach(item => {
            if (item.substr(item.length - 4)===".php") {
                includes.push(item)
            }
        })
        fs.writeFile('functions.php', message+includes.map(inc=> `include("app/includes/${inc}");`).join("\n"), function() {

        });
    });

    return gulp.src('index.php');
})
// START
gulp.task('watch', () => {
    gulp.watch('app/**/*.js*',  gulp.series(gulp.parallel('js'),'autoloader'));
    gulp.watch('components/**/*public.js*',  gulp.series(gulp.parallel('js'),'autoloader'));
    gulp.watch('components/**/block.js*',  gulp.series(gulp.parallel('components'),'autoloader'));
    gulp.watch('components/**/*.*ss',  gulp.series(gulp.parallel('public-style'),'autoloader'));
    gulp.watch('components/**/*.*ss',  gulp.series(gulp.parallel('admin-style'),'autoloader'));
    gulp.watch('app/**/*.*',  gulp.parallel(...toWatch));
    gulp.watch(['app/**/*.php'], gulp.parallel('autoloader'));
});
gulp.task('default', gulp.parallel(...toWatch));
