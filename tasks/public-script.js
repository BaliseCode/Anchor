const gulp = require('gulp');
const concat = require('gulp-concat');
const webpack = require('webpack-stream');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

// BUILD COMPONENTS
gulp.task('public-script', function () {
    return gulp.src(['app/js/*.js*', 'app/js/*.js', 'components/**/public.js*', 'components/**/*.public.js*'], {
        allowEmpty: true
    })
        .pipe(webpack({
            mode: 'development',
            resolve: {
                alias: {
                    'vue$': 'vue/dist/vue.esm.js'
                }
            },
            module: {
                rules: [
                    {
                        test: /\.vue$/,
                        loader: 'vue-loader'
                    },{ 
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
                    }
                ]
            },
            plugins: [
                new VueLoaderPlugin()
            ]
        })).on('error', function (error) {
            this.emit('end');
        })
    .pipe(concat('script.js')).on('error', function (error) {})
        .pipe(gulp.dest('public/js/')).on('error', function (error) {})
});
