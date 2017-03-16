'use strict';
// @flow

import _ from 'lodash';

class _User {
  _id: string = '';
  name: string = '';
  email: string = '';
  role: string = '';
  facebook: {
    email: string;
    id: string;
    name: string;
  };
  $promise = undefined;
}

export function AuthService($location, $cookies, $q, appConfig, Util, User) {
  'ngInject';

  let safeCb = Util.safeCb;
  let currentUser: _User = new _User();

  const userRoles = appConfig.userRoles || [];

  const hasRole = function (userRole, role) {
    return userRoles.indexOf(userRole) >= userRoles.indexOf(role);
  };

  if ($cookies.get('token') && $location.path() !== '/logout') {
    currentUser = User.get();
  }

  const Auth = {
    logout() {
      $cookies.remove('token');
      currentUser = new _User();
    },

    getCurrentUser(callback ?: Function) {
      const value = _.get(currentUser, '$promise') ? currentUser.$promise : currentUser;

      return $q.when(value)
        .then(user => {
          safeCb(callback)(user);
          return user;
        }, () => {
          safeCb(callback)({});
          return {};
        });
    },

    getCurrentUserSync() {
      return currentUser;
    },

    isLoggedIn(callback ?: Function) {
      return Auth.getCurrentUser(undefined)
        .then(user => {
          let is = _.get(user, 'role');

          safeCb(callback)(is);
          return is;
        });
    },

    isLoggedInSync() {
      return !!_.get(currentUser, 'role');
    },

    hasRole(role, callback ?: Function) {
      return Auth.getCurrentUser(undefined)
        .then(user => {
          let has = hasRole(_.get(user, 'role'), role);

          safeCb(callback)(has);
          return has;
        });
    },

    hasRoleSync(role) {
      return hasRole(_.get(currentUser, 'role'), role);
    },

    getToken() {
      return $cookies.get('token');
    },

    getFriends(q) {
      return User.friends({q}).$promise;
    }
  };

  return Auth;
}
