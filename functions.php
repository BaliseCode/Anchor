<?php
// LOAD COMPOSER AUTO LOADER
@include('vendor/autoload.php'); 


// ENQUEUE STYLES AND SCRIPTS
add_action( 'wp_enqueue_scripts', function(){
    if (!is_admin()) {
        wp_enqueue_style('public-style',  get_stylesheet_directory_uri().'/public/css/public.css', array(), 'aa66a54a2837173e4ccec2e896a5dbd8', 'all');
        wp_enqueue_script('public-script',  get_stylesheet_directory_uri().'/public/js/public.js', array('jquery'), 'f1dda8413a204e991255f692fb01e602', true );
    }
});

// LOAD ADMIN STYLES AND SCRIPTS
add_action( 'admin_enqueue_scripts', function () {
    if (is_admin()) {
        wp_enqueue_style('admin-style', get_stylesheet_directory_uri() . '/public/js/admin.css', array(), 'd41d8cd98f00b204e9800998ecf8427e', 'all');
    }
});

// FILES IN INCLUDE PATH

include_once("app/includes/acf.imagecenter.php");
include_once("app/includes/cleaner_backend.php");
include_once("app/includes/component.php");
include_once("app/includes/hide_email.php");
include_once("app/includes/theme_support.php");
