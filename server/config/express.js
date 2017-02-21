'use strict';

import express from 'express';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import shrinkRay from 'shrink-ray';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import errorHandler from 'errorhandler';
import path from 'path';
import lusca from 'lusca';
import config from './environment';
import passport from 'passport';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';

const MongoStore = connectMongo(session);

export default function (app) {
    const env = app.get('env');

    if (env === 'development' || env === 'test') {
        app.use(express.static(path.join(config.root, '.tmp')));
    }

    if (env === 'production') {
        app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
    }

    app.set('appPath', path.join(config.root, 'client'));
    app.use(express.static(app.get('appPath')));
    app.use(morgan('dev'));

    app.set('views', `${config.root}/server/views`);
    app.set('view engine', 'pug');
    app.use(shrinkRay());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(passport.initialize());

    app.use(session({
        secret: config.secrets.session,
        saveUninitialized: true,
        resave: false,
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            db: 'crush-match'
        })
    }));

    if (env !== 'test' && !process.env.SAUCE_USERNAME) {
        app.use(lusca({
            csrf: {
                angular: true
            },
            xframe: 'SAMEORIGIN',
            hsts: {
                maxAge: 31536000,
                includeSubDomains: true,
                preload: true
            },
            xssProtection: true
        }));
    }

    if (env === 'development') {
        const webpackDevMiddleware = require('webpack-dev-middleware');
        const stripAnsi = require('strip-ansi');
        const webpack = require('webpack');
        const makeWebpackConfig = require('../../webpack.make');
        const webpackConfig = makeWebpackConfig({DEV: true});
        const compiler = webpack(webpackConfig);
        const browserSync = require('browser-sync').create();

        browserSync.init({
            open: false,
            logFileChanges: false,
            proxy: `localhost:${config.port}`,
            ws: true,
            middleware: [
                webpackDevMiddleware(compiler, {
                    noInfo: false,
                    stats: {
                        colors: true,
                        timings: true,
                        chunks: false
                    }
                })
            ],
            port: config.browserSyncPort,
            plugins: ['bs-fullscreen-message']
        });

        compiler.plugin('done', function (stats) {
            console.log('webpack done hook');
            if (stats.hasErrors() || stats.hasWarnings()) {
                return browserSync.sockets.emit('fullscreen:message', {
                    title: 'Webpack Error:',
                    body: stripAnsi(stats.toString()),
                    timeout: 100000
                });
            }
            browserSync.reload();
        });
    }

    if (env === 'development' || env === 'test') {
        app.use(errorHandler());
    }
}
