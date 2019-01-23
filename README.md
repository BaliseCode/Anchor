# Anchor, a Wordpress Theme Boilerplate
Anchor is a Wordpress theme boilerplate made to simplify your theme creation workflow

## Getting Started

You have to get composer and node to start. 
- Composer is used to load theme dependencies 
- Node is required to compile assets

To create a new project go into your CLI (Terminal, Powershell, etc) and type

```bash
composer create-project your_project_name
npm install
``` 
To compile your assets type 

```bash
npm start
```

## Features
- Blade support for templating

- Javascript Packaging
-- Vue.JS support
-- React support

- Gutenberg Ready
-- Compilation for Gutenberg blocks

- LESS, SCSS, SASS and CSS packaging

- Graphics
-- Image minification
-- IconFont creation
-- Possibility to add custom dashicons 

- Auto includes for PHP files

### Blade support
Anchor supports Blade templating language as a replacement for Wordpress PHP file structure. The Blade file structure use the exact same hierarchy as Wordpress does (https://wphierarchy.com/) with 2 exceptions

1) Anchor will fetch app/views and subfolder with no fetch limitation (whereas Wordpress only look 1 level ahead)
2) Anchor will consider posttype/single.blade.php as a replacement for /single-posttype.blade.php and posttype/archive.blade.php /archive-posttype.blade.php for a cleaner folder structure

### Javascript Packaging
Javascript assets are compiled with Gulp (https://gulpjs.com). This supports React and Vue so you can choose you favorite Framework

### LESS, SCSS, SASS and CSS packaging
Stylesheet assets are compiled with Gulp (https://gulpjs.com). Use the css compiler you want for styling. We support LESS, SASS or plain old CSS. 

*PUBLIC STYLES*
The Gulp file will compile main.scss, main.css, and main.less into a single file main.css file which will be enqueued into the frontend part of your site.

*ADMIN STYLES*
It will also take any admin.css, admin.scss and admin.less and compile them into a single admin.css file which will be enqueued into the backend part of your site.


## Theme structure
| File          | Description                                                |
|---------------|------------------------------------------------------------|
| /app/         | Where the magic happens                                    |
| /components/  | Place to pub your Gutenberg components                     |
| /public/      | Compilation target for css, icons, blade templates etc.    |
| functions.php | Default wordpress function file that gets rewriten by Gulp |
| index.php     | Default wordpress index file                               |
| style.css     | Default wordpress style file                               |
