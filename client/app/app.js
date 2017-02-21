'use strict';

import angular from 'angular';

import {
    routeConfig
} from './app.config';

import main from './main/main.component';
import constants from './app.constants';
import _Auth from '../components/auth/auth.module';
import util from '../components/util/util.module';

import './app.scss';

angular.module('crushMatchApp', ['ngCookies', 'uiRouter',
    _Auth, main, constants, util
])
    .config(routeConfig)
    .run(function () {
        'ngInject';
    });

angular.element(document)
    .ready(() => {
        angular.bootstrap(document, ['crushMatchApp'], {
            strictDi: true
        });
    });
