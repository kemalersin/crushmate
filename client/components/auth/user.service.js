'use strict';

export function UserResource($resource) {
  'ngInject';

  return $resource('/api/users/:id/:controller', {
    id: 'me'
  }, {
    get: {
      method: 'GET'
    },
    friends: {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'friends'
      }
    }
  });
}
