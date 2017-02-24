'use strict';

export function routeConfig($urlRouterProvider, $locationProvider) {
    'ngInject';

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
}
