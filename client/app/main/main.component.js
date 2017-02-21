import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
    constructor() {
        'ngInject';
    }

    $onInit() {
    }
}

export default angular.module('crushMatchApp.main', [uiRouter])
    .config(routing)
    .component('main', {
        template: require('./main.pug'),
        controller: MainController
    })
    .name;
