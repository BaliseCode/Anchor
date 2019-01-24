const gulp = require('gulp');
const iconfont = require('gulp-iconfont');
const fs = require('fs');
var runTimestamp = Math.round(Date.now() / 1000);


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

gulp.task('iconfont', function () {
    return gulp.src(['app/graphics/icons/*.svg'])
        .pipe(iconfont({
            fontName: 'iconfont', // required
            prependUnicode: false, // recommended option
            normalize: true,
            fontHeight: 1001,
            formats: ['ttf', 'eot', 'woff', "svg"], // default, 'woff2' and 'svg' are available
            timestamp: runTimestamp, // recommended to get consistent builds when watching files
        })).on('glyphs', function (glyphs, options) {
            let string = iconfontTemplate.replace('%random%', runTimestamp) + glyphs.map(g => {
                return `i.icon-${g.name}:before{content:'\\${g.unicode[0].charCodeAt(0).toString(16).toLowerCase()}'}`
            }).join('')
            fs.writeFile('public/fonts/iconfont.css', string, function () { })
        }).pipe(gulp.dest('public/fonts/'));
});