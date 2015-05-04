(function () {

  'use strict';

  angular

  .module('land-service', ['ngResource'])

  .factory('Land', ['$resource', '$location', function($resource, $location) {
      return $resource(

      '/bpproperty/api/land/:landId',
      {
        landId: '@landId'
      },
      {
        'update': { method:'PUT' }
      });
  }]);


})();