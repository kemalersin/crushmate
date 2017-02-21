'use strict';

import angular from 'angular';

export function UtilService($window) {
    'ngInject';

    const Util = {
        safeCb(cb) {
            return angular.isFunction(cb) ? cb : angular.noop;
        },

        urlParse(url) {
            var a = document.createElement('a');
            a.href = url;

            if (a.host === '') {
                a.href = a.href;
            }

            return a;
        },

        isSameOrigin(url, origins) {
            url = Util.urlParse(url);
            origins = origins && [].concat(origins) || [];
            origins = origins.map(Util.urlParse);
            origins.push($window.location);
            origins = origins.filter(function (o) {
                let hostnameCheck = url.hostname === o.hostname;
                let protocolCheck = url.protocol === o.protocol;

                let portCheck = url.port === o.port || o.port === '' && (url.port === '80' || url.port
                    === '443');
                return hostnameCheck && protocolCheck && portCheck;
            });
            return origins.length >= 1;
        }
    };

    return Util;
}
