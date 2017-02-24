import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
    $window;
    $document;
    $timeout;

    user;
    Auth;

    constructor(Auth, $window, $document, $timeout) {
        'ngInject';

        this.$window = $window;
        this.$document = $document;
        this.$timeout = $timeout;

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

        this.Auth.isLoggedIn().then(user => {
           if (user) {
               this.user = user;

               this.$timeout(() => {
                   this.$document.scrollToElementAnimated(angular.element(document.getElementById('search')), 50);
               });
           }
        });
    }

    login(provider) {
        this.$window.location.href = `/auth/${provider}`;
    };

    searchToggle(event) {
        const el = angular.element(event.currentTarget);

        let container = el.closest('.search-wrapper');
        let input = container.find('.search-input');

        if (!container.hasClass('active')) {
            //input.focus();
            container.addClass('active');
        }
        else if (container.hasClass('active') && el.closest('.input-holder').length == 0) {
            input.val('');
            container.removeClass('active');
        }
    }
}

export default angular.module('crushMatchApp.main', [uiRouter])
    .config(routing)
    .component('main', {
        template: require('./main.pug'),
        controllerAs: 'vm',
        controller: MainController
    })
    .name;
