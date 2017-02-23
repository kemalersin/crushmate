import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
    constructor() {
        'ngInject';
    }

    $onInit() {
        const sr = ScrollReveal();

        sr.reveal('.sr-icons', {
            duration: 600,
            scale: 0.3,
            distance: '0px'
        }, 200);

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
            distance: '90px',
            easing: 'ease-in-out',
            rotate: {z: 15},
            scale: 1.3
        });
    }
}

export default angular.module('crushMatchApp.main', [uiRouter])
    .config(routing)
    .component('main', {
        template: require('./main.pug'),
        controller: MainController
    })
    .name;
