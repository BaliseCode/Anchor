# Anchor, a Wordpress Theme Boilerplate
Anchor is a Wordpress theme boilerplate made to simplify your theme creation workflow

## Getting Started

You have to get composer and node to start. 
- Composer is used to load theme dependencies
- Node is requiered to compile assets

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
- LESS, SCSS, SASS and CSS packaging
- Image minification
- IconFont creation
- Autoincludes
- Autoincludes

### Blade support
Anchor supports Blade templating language as a replacement for Wordpress php file structure.

### Javascript Packaging
Javascript assets are compiled with Gulp (https://gulpjs.com)

### LESS, SCSS, SASS and CSS packaging
Stylesheet assets are compiled with Gulp (https://gulpjs.com). Use what ever you want for styling we support LESS, SASS or plain old CSS. The Gulp file will compile main.scss, main.css and main.less into a single file main.css file which will be enqueud into the  frontend part of your site.

It will also take any admin.css, admin.scss and admin.less and compile the into a single admin.css file which will be enqueud into the backend part of your site.


## Theme structure

/app/ Where the magic happens
/components/ Place to pub your Gutenberg components

