'use strict';

import angular from 'angular';
import {routeConfig} from './app.config';

import main from './main/main.component';
import constants from './app.constants';
import _Auth from '../components/auth/auth.module';
import util from '../components/util/util.module';

import './app.scss';

angular.module('crushMatchApp', [
  'ngCookies', 'ngResource', 'ui.router', 'ui.scrollpoint',
  'ui.bootstrap', 'duScroll', 'angular-scroll-animate',
  'ngAnimate', 'ng-scroll-bar',
  _Auth, main, constants, util
])
  .value('duScrollDuration', 1500)
  .value('duScrollEasing', t =>
    t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  )
  .config(routeConfig)
  .run(() => {
    'ngInject';

    if (window.location.hash == '#_=_') {
      history.replaceState
        ? history.replaceState(null, null, window.location.href.split('#')[0])
        : window.location.hash = '';
    }
  });

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['crushMatchApp'], {
      strictDi: true
    });
  });
