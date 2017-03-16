import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';
import SearchController from './search/search.controller';

export class MainController {
  $scope;
  $rootScope;
  $window;
  $document;
  $timeout;
  $uibModal;

  user;
  query;

  Auth;

  constructor(Auth, $scope, $rootScope, $window, $document, $timeout, $uibModal) {
    'ngInject';

    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$window = $window;
    this.$document = $document;
    this.$timeout = $timeout;
    this.$uibModal = $uibModal;

    this.Auth = Auth;
  }

  $onInit() {
    const sr = ScrollReveal();

    sr.reveal('.sr-contact', {
      duration: 600,
      scale: 0.3,
      distance: '0px'
    }, 300);

    sr.reveal('.sr-text', {
      duration: 600,
      distance: '0px',
      easing: 'ease-in-out',
      rotate: {z: 8},
      scale: 1.4,
      viewFactor: .5
    });

    this.Auth.isLoggedIn().then(is => {
      if (is) {
        this.user = this.Auth.getCurrentUserSync();

        this.$timeout(() => {
          this.$document.scrollToElementAnimated(
            angular.element(document.getElementById('search')
            ), 50);
        });
      }
    });
  }

  login(provider) {
    this.$window.location.href = `/auth/${provider}`;
  };

  search() {
    if (this.query) {
      let modalScope = this.$rootScope.$new();

      angular.extend(modalScope, {query: this.query});

      this.$uibModal.open({
        size: 'lg',
        scope: modalScope,
        backdrop: 'static',
        windowClass: 'modal-default',
        controllerAs: 'vm',
        controller: 'SearchController',
        template: require('./search/search.pug')
      });
    }
  }

  searchToggle(event) {
    const el = angular.element(event.currentTarget);

    let container = el.closest('.search-wrapper');
    let input = container.find('.search-input');

    if (!container.hasClass('active')) {
      container.addClass('active');
    }
    else if (container.hasClass('active') && el.closest('.input-holder').length == 0) {
      this.query = null;
      container.removeClass('active');
    }
  }
}

export default angular.module('crushMatchApp.main', [uiRouter])
  .config(routing)
  .controller('SearchController', SearchController)
  .component('main', {
    template: require('./main.pug'),
    controllerAs: 'vm',
    controller: MainController
  })
  .name;
