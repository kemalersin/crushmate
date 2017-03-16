'use strict';

export function routeConfig($urlRouterProvider, $locationProvider, $sceDelegateProvider) {
  'ngInject';

  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    new RegExp('^(http[s]?):\/\/(w{3}.)?facebook\.com/.+$')
  ]);
}
