<?php
// LOAD THE BASEMENT WRAPPER
include('framework/anchor/Anchor.php');

// LOAD COMPOSER AUTO LOADER
include('vendor/autoload.php');

// LOAD SCRIPT AND STYLE
add_action( 'wp_enqueue_scripts', function(){
    if (!is_admin()) {
        wp_enqueue_style('main-style',  get_stylesheet_directory_uri().'/public/css/style.css', array(), '1', 'all');
        wp_enqueue_script('main-script',  get_stylesheet_directory_uri().'/public/js/script.js', array(), '1', true );
    }
});

// LOAD SCRIPT AND STYLE FOR GUTENBERG EDITOR
add_action('enqueue_block_editor_assets', function(){
    wp_enqueue_script('components',  get_stylesheet_directory_uri().'/public/editor/components.js', array(), 1, true );
    wp_enqueue_style('components',  get_stylesheet_directory_uri().'/public/editor/admin.css', array(), 1, 'all');
});

// FILES IN INCLUDE PATH
include("app/includes/test.php");
include("app/includes/theme_support.php");
