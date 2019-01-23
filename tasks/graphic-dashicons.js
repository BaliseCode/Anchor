const gulp = require('gulp');
const iconfont = require('gulp-iconfont');
const fs = require('fs');
var runTimestamp = Math.round(Date.now() / 1000);


let iconfontTemplate = `
@font-face {
    font-family: 'dashicons-custom';
    src:  url('../fonts/dashicons.eot?%random%');
    src:  url('../fonts/dashicons.eot?%random%#iefix') format('embedded-opentype'),
    url('../fonts/dashicons.ttf?%random%') format('truetype'),
    url('../fonts/dashicons.woff?%random%') format('woff');
    font-weight: normal;
    font-style: normal;
}
[class^="dashicons-"]:before,
[class*=" dashicons-"]:before {
    display: inline-block;
    width: 20px;
    height: 20px;
    font-size: 20px;
    line-height: 1;
    font-family: dashicons;
    text-decoration: inherit;
    font-weight: normal;
    font-style: normal;
    vertical-align: top;
    text-align: center;
    transition: color .1s ease-in 0;
    -webkit-font-smoothing: antialiased;
}
`;

gulp.task('dashicons', function () {
    return gulp.src(['app/graphics/dashicons/*.svg'])
        .pipe(iconfont({
            fontName: 'dashicons', // required
            prependUnicode: false, // recommended option
            normalize: true,
            fontHeight: 1001,
            formats: ['ttf', 'eot', 'woff', "svg"], // default, 'woff2' and 'svg' are available
            timestamp: runTimestamp, // recommended to get consistent builds when watching files
        })).on('glyphs', function (glyphs, options) {
            let string = iconfontTemplate.replace('%random%', runTimestamp) + glyphs.map(g => {
                return `.dashicons-${g.name}:before{font-family: 'dashicons-custom' !important;content:'\\${g.unicode[0].charCodeAt(0).toString(16).toLowerCase()}'}`
            }).join('')
            fs.writeFile('public/fonts/dashicons.css', string, function () { }) 
        }).pipe(gulp.dest('public/fonts/'));
}); 