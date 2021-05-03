var gulp = require('gulp');
const fs = require('fs');
const md5File = require('md5-file');

// LOAD public
let publicScript = "";
let publicStyle = "";
let adminScript = "";
let adminStyle = "";
if (fs.existsSync('public/css/public.css')) {
    publicStyle = `
        wp_enqueue_style('public-style',  get_stylesheet_directory_uri().'/public/css/public.css', array(), '${md5File.sync('public/css/public.css')}', 'all');`
}
if (fs.existsSync('public/css/admin.css')) {
    adminStyle = `
        wp_enqueue_style('admin-style', get_stylesheet_directory_uri() . '/public/css/admin.css', array(), '${md5File.sync('public/css/admin.css')}', 'all');`
}
if (fs.existsSync('public/js/public.js')) {
    publicScript = `
        wp_enqueue_script('public-script',  get_stylesheet_directory_uri().'/public/js/public.js', array('jquery'), '${md5File.sync('public/js/public.js')}', true );`
}
if (fs.existsSync('public/js/admin.js')) { 
    adminScript = `
        wp_enqueue_script('admin-script',  get_stylesheet_directory_uri().'/public/js/admin.js', array('jquery','wp-i18n'), '${md5File.sync('public/js/admin.js')}', true );`
}

let base = `<?php
// LOAD COMPOSER AUTO LOADER
@include('vendor/autoload.php'); 


// ENQUEUE STYLES AND SCRIPTS
add_action( 'wp_enqueue_scripts', function(){
    if (!is_admin()) {${publicStyle}${publicScript}
    }
});

// LOAD ADMIN STYLES AND SCRIPTS
add_action( 'admin_enqueue_scripts', function () {
    if (is_admin()) {${adminStyle}${adminScript}
    }
});

`;



function scanPath(searchFct, folder, input) {
    let output = input
    return new Promise((resolve, error) => {
        fs.readdir(folder, function (err, items) {
            let subCrawl = [];
            let output = input
            items.forEach(item => {
                if (searchFct(item)) {
                    output.push(folder + "/" + item)
                } else if (fs.lstatSync(folder + "/" + item).isDirectory() && folder + "/" + item !== 'app/includes') {
                    subCrawl.push(scanPath(searchFct, folder + "/" + item, input))
                }
            });
            Promise.all(subCrawl).then(() => {
                resolve(output)
            })

        });

    })
}

gulp.task('autoloader', function () {
    let message = base; 
    return scanPath((item) => {
        return item.substr(item.length - 8) === ".inc.php"
    }, 'app/components', []).then((includes) => {

        message += "// FILES IN INCLUDE PATH\n";
    }).then(() => {
        return fs.readdir('app/includes', function (err, items) {
            includes = [];
            items.forEach(item => {
                if (item.substr(item.length - 4) === ".php") {
                    includes.push('app/includes/' + item)
                } 
            });
            message += includes.map(inc => `include_once("${inc}");`).join("\n") + "\n"
        });
    }).then(() => {
        return scanPath((item) => {
            return item.substr(item.length - 8) === ".inc.php"
        }, 'app', []).then((includes) => {
            if (includes.length) {
                let init = "\n" + includes.map(inc => `include_once("${inc}");`).join("\n") + "\n"
                message += "\n//INCLUDE FUNCTIONS"
                message += `${init}` + "\n"
            }
        })
    }).then(() => {
        return scanPath((item) => {
            return item.substr(item.length - 9) === ".init.php" || item.substr(item.length - 8) === ".cpt.php" || item.substr(item.length - 8) === ".tax.php"
        }, 'app', []).then((includes) => {
            if (includes.length) {
                let init = "\n" + includes.map(inc => `    include_once("${inc}");`).join("\n") + "\n"
                message += "\n//INIT FUNCTIONS\n"
                message += `add_action( 'init', function(){${init}});` + "\n"
            }
        })
    }).then(() => {
        return fs.writeFile('functions.php', message, () => {});
    })






});