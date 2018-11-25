var gulp = require('gulp');
const fs = require('fs');
const md5File = require('md5-file');

// CREATE AN AUTOLOADER
let md5Script = 1
let md5Style = 1
let md5EditorStyle = 1
if (fs.existsSync('public/css/style.css')) {
    md5Style = md5File.sync('public/css/style.css');
}
if (fs.existsSync('public/editor/admin.css')) {
    md5EditorStyle = md5File.sync('public/editor/admin.css');
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
    if (is_admin() && file_exists(__DIR__ . '/public/editor/admin.css')) {
        wp_enqueue_style('main-style', get_stylesheet_directory_uri() . '/public/editor/admin.css', array(), '${md5EditorStyle}', 'all');
    }
});

// LOAD SCRIPT AND STYLE FOR GUTENBERG EDITOR
add_action('enqueue_block_editor_assets', function(){
    wp_enqueue_script('components',  get_stylesheet_directory_uri().'/public/editor/components.js', array(), 1, true );
    wp_enqueue_style('components',  get_stylesheet_directory_uri().'/public/editor/admin.css', array(), 1, 'all');
});

// FILES IN INCLUDE PATH
`;

gulp.task('autoloader', function () {
    fs.readdir('app/includes', function (err, items) {
        let includes = [];
        items.forEach(item => {
            if (item.substr(item.length - 4) === ".php") {
                includes.push(item)
            }
        })
        fs.writeFile('functions.php', message + includes.map(inc => `include("app/includes/${inc}");`).join("\n"), function () {

        });
    });

    return gulp.src('index.php');
})
