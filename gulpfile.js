const gulp = require('gulp');
const concat = require('gulp-concat');
const filter = require('gulp-filter');
const fs = require('fs');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const less = require('gulp-less');
const crass = require('gulp-crass');
const md5File = require('md5-file')
const minifyjs = require('gulp-js-minify');
const iconfont = require('gulp-iconfont')


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

// LOAD EVERYTHING IN content
$files=glob(__DIR__."/app/content/*.php");
foreach ($files as $file) {
    require_once($file);
}

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


let iconfontTemplate = `
@font-face {
    font-family: 'iconfont';
    src:  url('../fonts/iconfont.eot?%random%');
    src:  url('../fonts/iconfont.eot?%random%#iefix') format('embedded-opentype'),
    url('../fonts/iconfont.ttf?%random%') format('truetype'),
    url('../fonts/iconfont.woff?%random%') format('woff');
    font-weight: normal;
    font-style: normal;
}
i[class^="icon-"], i[class*=" icon-"] {
    font-family: 'iconfont' !important;
    speak: none;
    font-style: normal;
    display: inline-block;
    vertical-align: middle;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
`;


var runTimestamp = Math.round(Date.now()/1000);

const toWatch = [

    'public-style',
    'admin-style',
    'autoloader',
    'components',
    'js'
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



gulp.task('iconfont', function(){
    return gulp.src(['app/icons/*.svg'])
    .pipe(iconfont({
        fontName: 'iconfont', // required
        prependUnicode: false, // recommended option
        normalize:true,
        fontHeight: 1001,
        formats: ['ttf', 'eot', 'woff',"svg"], // default, 'woff2' and 'svg' are available
        timestamp: runTimestamp, // recommended to get consistent builds when watching files
    })).on('glyphs', function(glyphs, options) {
        let string = iconfontTemplate.replace('%random%',runTimestamp) + glyphs.map(g => {
            return `i.icon-${g.name}:before{content:'\\${g.unicode[0].charCodeAt(0).toString(16).toLowerCase()}'}`
        }).join('')
        fs.writeFile('public/fonts/iconfont.css', string, function() {})
    }).pipe(gulp.dest('public/fonts/'));
});

// GENERATE STYLESHEET
gulp.task('public-style', function(){
    let sassFilter = filter(['**/*.scss','**/*.sass'], {restore: true})
    let lessFilter = filter(['**/*.less'], {restore: true})
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
    gulp.watch('app/icons/*.svg',  gulp.series(gulp.parallel('iconfont'),gulp.parallel('public-style'),'autoloader'));

    gulp.watch('app/**/*.js*',  gulp.series(gulp.parallel('js'),'autoloader'));
    gulp.watch('components/**/*public.js*',  gulp.series(gulp.parallel('js'),'autoloader'));
    gulp.watch('components/**/block.js*',  gulp.series(gulp.parallel('components'),'autoloader'));
    gulp.watch('components/**/*.*ss',  gulp.series(gulp.parallel('public-style'),'autoloader'));
    gulp.watch('components/**/*.*ss',  gulp.series(gulp.parallel('admin-style'),'autoloader'));
    gulp.watch('app/**/*.*',  gulp.parallel(...toWatch));
    gulp.watch(['app/**/*.php'], gulp.parallel('autoloader'));
});
gulp.task('default', gulp.series('iconfont', gulp.parallel(...toWatch)));
