const gulp = require('gulp');
const concat = require('gulp-concat');
const webpack = require('webpack-stream');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

// BUILD COMPONENTS
gulp.task('gutenberg', function () {
    return gulp.src(['app/js/*.js*','app/js/*.js','components/**/public.js*','components/**/*.public.js*'])
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
                                    "@babel/preset-react", 
                                    "@babel/preset-env"
                                ],
                            },
                        }
                    }, 
                    {
                        test: /\.vue$/,
                        exclude: /(node_modules|bower_components|public|task|vendor)/,
                        use: {
                            loader: 'vue-loader',
                            options: {
                                compilerWhitespace: false
                            } 
                        }
                    }
                ]
            },
            plugins: [
                new VueLoaderPlugin()
            ]
        })).on('error', function (error) {
            this.emit('end');
        })
        .pipe(minifyjs()).on('error', function (error) {})
    .pipe(concat('script.js')).on('error', function (error) {})
        .pipe(gulp.dest('public/js/')).on('error', function (error) {})
});