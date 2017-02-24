import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
    $window;
    isLoggedIn: Function;

    constructor(Auth, $window) {
        'ngInject';

        this.$window = $window;
        this.isLoggedIn = Auth.isLoggedInSync;
    }

    $onInit() {
        const sr = ScrollReveal();

        sr.reveal('.sr-button', {
            delay: 500,
            duration: 1000
        });

        sr.reveal('.sr-contact', {
            duration: 600,
            scale: 0.3,
            distance: '0px'
        }, 300);

        sr.reveal('.sr-text', {
            delay: 200,
            duration: 500,
            distance: '0px',
            easing: 'ease-in-out',
            rotate: {z: 15},
            scale: 1.3,
            viewFactor: 1
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
