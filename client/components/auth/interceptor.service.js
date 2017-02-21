'use strict';

export function authInterceptor($rootScope, $q, $cookies, $injector, Util) {
    'ngInject';

    let state;

    return {
        request(config) {
            config.headers = config.headers || {};

            if ($cookies.get('token') && Util.isSameOrigin(config.url)) {
                config.headers.Authorization = `Bearer ${$cookies.get('token')}`;
            }

            return config;
        },

        responseError(response) {
            if (response.status === 401) {
                (state || (state = $injector.get('$state')))
                    .go('login');

                $cookies.remove('token');
            }
            return $q.reject(response);
        }
    };
}
