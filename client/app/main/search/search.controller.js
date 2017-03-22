'use strict';
// @flow

export default class SearchController {
  Auth;
  $scope;

  profiles = [];
  error = false;
  loading = true;

  constructor(Auth, $scope) {
    'ngInject';

    this.Auth = Auth;
    this.$scope = $scope;
  }

  $onInit() {
    this.Auth.getFriends(this.$scope.query)
      .then(data => {
        this.loading = false;
        this.profiles = data;
      })
      .catch(err => this.error = err);
  }
}
