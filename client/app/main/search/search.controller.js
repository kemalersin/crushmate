'use strict';
// @flow

export default class SearchController {
  Auth;
  $http;
  $scope;

  profiles = [];
  error = false;
  loading = true;

  constructor(Auth, $scope, $http) {
    'ngInject';

    this.Auth = Auth;
    this.$http = $http;
    this.$scope = $scope;
  }

  $onInit() {
    $.ajax({
      url: 'https://www.facebook.com/ajax/typeahead/search.php?dpr=2&value=kemal+ersin+y%C4%B1lmaz&viewer=100004919073716&rsp=search&context=default&__user=100004919073716&__a=1',
      dataType: 'jsonp',
      success: function(data, textStatus, jqXHR) {
        console.log('jQuery success:', data, textStatus, jqXHR);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log('jQuery error:', jqXHR, textStatus, errorThrown);
      },
    });

    // this.$http(
    //     {
    //       url: 'https://www.facebook.com/ajax/typeahead/search.php?dpr=2&value=kemal+ersin+y%C4%B1lmaz&viewer=100004919073716&rsp=search&context=default&__user=100004919073716&__a=1',
    //       method: 'JSONP'
    //     }
    //   )
    //   .then(console.log);
    // this.Auth.getFriends(this.$scope.query)
    //   .then(data => {
    //     this.loading = false;
    //     //this.profiles = data;
    //   })
    //   .catch(err => this.error = err);
  }
}
