'use strict';

export default function routes($stateProvider) {
    'ngInject';

    $stateProvider.state('main', {
        url: '/',
        template: '<main></main>'
    })
      .state('logout', {
        url: '/logout?referrer',
        referrer: 'main',
        template: '',
        controller($state, Auth) {
          'ngInject';

          let referrer = $state.params.referrer ||
            $state.current.referrer ||
            'main';

          Auth.logout();
          $state.go(referrer);
        }
      });
}
