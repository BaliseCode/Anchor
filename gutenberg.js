const gulp = require('gulp');
const concat = require('gulp-concat');
const webpack = require('webpack-stream');

// BUILD COMPONENTS
gulp.task('gutenberg', function () {
    return gulp.src('./components/**/block.js*', './components/**/*.block.js*') 
        .pipe(webpack({
            mode: 'production',
            resolve: {
                alias: {
                    'vue$': 'vue/dist/vue.esm.js'
                }
            },
            module: {
                rules: [{
                    test: /\.m?jsx?$/, 
                        exclude: /(node_modules|bower_components)/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                "presets": [
                                    [
                                        "@babel/preset-react",  {
                                            "pragma": 'wp.element.createElement'
                                        }
                                    ], 
                                    "@babel/preset-env"
                                ],
                            },
                        }
                    }
                    
                ]
            }
        })).on('error', function (error) {
            this.emit('end');
        })
        .pipe(concat('components.js')).on('error', function (error) {})
        .pipe(gulp.dest('public/editor')).on('error', function (error) {})
});