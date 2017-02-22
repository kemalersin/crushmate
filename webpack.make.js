'use strict';

/*eslint-env node*/

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const fs = require('fs');
const path = require('path');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

module.exports = function makeWebpackConfig(options) {
    const BUILD = !!options.BUILD;
    const TEST = !!options.TEST;
    const E2E = !!options.E2E;
    const DEV = !!options.DEV;

    let config = {};

    if (TEST) {
        config.entry = {};
    } else {
        config.entry = {
            app: './client/app/app.js',
            polyfills: './client/polyfills.js',
            vendor: [
                'angular',
                'angular-aria',
                'angular-cookies',
                'angular-resource',
                'angular-ui-router',
                'angular-ui-scrollpoint',
                'angular-scroll',
                'angular-scroll-animate',
                'scrollreveal'
            ]
        };
    }

    if (TEST) {
        config.output = {};
    } else {
        config.output = {
            path: BUILD ? path.join(__dirname, '/dist/client/') : path.join(__dirname, '/.tmp/'),
            publicPath: BUILD || DEV || E2E ? '/' : `http://localhost:${8080}/`,
            filename: BUILD ? '[name].[hash].js' : '[name].bundle.js',
            chunkFilename: BUILD ? '[name].[hash].js' : '[name].bundle.js'
        };
    }


    if (TEST) {
        config.resolve = {
            modulesDirectories: [
                'node_modules'
            ],
            extensions: ['', '.js', '.ts']
        };
    }

    if (TEST) {
        config.devtool = 'inline-source-map';
    } else if (BUILD || DEV) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'eval';
    }

    config.sassLoader = {
        outputStyle: 'compressed',
        precision: 10,
        sourceComments: false
    };

    config.babel = {
        shouldPrintComment(commentContents) {
            let regex = DEV
                // keep `// @flow`, `/*@ngInject*/`, & flow type comments in dev
                ? /(@flow|@ngInject|^:)/
                // keep `/*@ngInject*/`
                : /@ngInject/;
            return regex.test(commentContents);
        }
    };

    config.module = {
        preLoaders: [],
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            include: [
                path.resolve(__dirname, 'client/'),
                path.resolve(__dirname, 'node_modules/lodash-es/')
            ]
        }, {
            test: /\.ts$/,
            loader: 'awesome-typescript-loader',
            query: {
                tsconfig: path.resolve(__dirname, 'tsconfig.client.json')
            },
            include: [
                path.resolve(__dirname, 'client/')
            ]
        }, {
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)([\?]?.*)$/,
            loader: 'file'
        }, {
            test: /\.(jade|pug)$/,
            loaders: ['pug-html']
        }, {
            test: /\.css$/,
            loader: !TEST
                ? ExtractTextPlugin.extract('style', 'css!postcss')
                : 'null'
        }, {
            test: /\.(scss|sass)$/,
            loaders: ['style', 'css', 'sass'],
            include: [
                path.resolve(__dirname, 'node_modules/bootstrap-sass/assets/stylesheets/*.scss'),
                path.resolve(__dirname, 'client/app/app.scss')
            ]
        }, {
            test: /scrollreveal\.js$/,
            loader: 'expose?ScrollReveal'
        }]
    };

    config.module.postLoaders = [{
        test: /\.js$/,
        loader: 'ng-annotate?single_quotes'
    }];

    if (TEST) {
        config.module.preLoaders.push({
            test: /\.js$/,
            exclude: /(node_modules|spec\.js|mock\.js)/,
            loader: 'isparta-instrumenter',
            query: {
                babel: {
                    // optional: ['runtime', 'es7.classProperties', 'es7.decorators']
                }
            }
        });
    }

    config.postcss = [
        autoprefixer({
            browsers: ['last 2 version']
        })
    ];

    config.plugins = [
        new ForkCheckerPlugin(),
        new ExtractTextPlugin('[name].[hash].css', {
            disable: !BUILD || TEST
        })
    ];

    if (!TEST) {
        config.plugins.push(new CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity
        }));
    }

    if (!TEST) {
        let htmlConfig = {
            template: 'client/_index.html',
            filename: '../client/index.html',
            alwaysWriteToDisk: true
        };

        config.plugins.push(
            new HtmlWebpackPlugin(htmlConfig),
            new HtmlWebpackHarddiskPlugin()
        );
    }

    if (BUILD) {
        config.plugins.push(
            new webpack.NoErrorsPlugin(),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin({
                mangle: false,
                output: {
                    comments: false
                },
                compress: {
                    warnings: false
                }
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"production"'
                }
            })
        );
    }

    if (DEV) {
        config.plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"development"'
                }
            })
        );
    }

    config.cache = DEV;

    if (TEST) {
        config.stats = {
            colors: true,
            reasons: true
        };
        config.debug = false;
    }

    config.devServer = {
        contentBase: './client/',
        stats: {
            modules: false,
            cached: false,
            colors: true,
            chunk: false
        }
    };

    config.node = {
        global: 'window',
        process: true,
        crypto: 'empty',
        clearImmediate: false,
        setImmediate: false
    };

    return config;
};
