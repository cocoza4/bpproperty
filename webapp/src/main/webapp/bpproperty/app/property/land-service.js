(function() {

  'use strict';

  angular

    .module('land-service', ['ngResource'])

  .service('LandService', ['Land', function(Land) {

    this.query = function(criteria) {
      return Land.query(criteria).$promise;
    };

    this.create = function(land) {
      return Land.save(land).$promise;
    };

    this.update = function(land) {
      return Land.update({
        landId: land.id
      }, land).$promise;
    };

    this.delete = function(land) {
      return Land.delete({
        landId: land.id
      }).$promise;
    };

  }])

  .factory('Land', ['$resource', function($resource) {
    return $resource(
      '/api/lands/:landId', {
        landId: '@landId'
      }, {
        'update': {
          method: 'PUT'
        },
        'delete': {
          method: 'DELETE'
        },
        'query': {
          method: 'GET',
          params: {
            page: '@page',
            length: '@length'
          }
        }
      });
  }]);


})();
