(function() {

  'use strict';

  angular

    .module('land-buy-service', ['ngResource'])

  .service('LandBuyService', ['LandBuy', function(LandBuy) {

    this.query = function(criteria) {
      return LandBuy.query(criteria).$promise;
    };

    this.create = function(landBuy) {
      return LandBuy.save(landBuy).$promise;
    };

    this.update = function(landBuy) {
      return LandBuy.update({
        landId: landBuy.landId,
        buyDetailId: landBuy.id
      }, landBuy).$promise;
    };

    this.delete = function(landBuy) {
      return LandBuy.delete({
        landId: landBuy.landId,
        buyDetailId: landBuy.id
      }).$promise;
    };

  }])

  .factory('LandBuy', ['$resource', function($resource) {
    return $resource(
      '/bpproperty/api/lands/:landId/buydetails/:buyDetailId', {
        landId: '@landId',
        buyDetailId: '@buyDetailId'
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
            landId: '@landId',
            page: '@page',
            length: '@length'
          }
        }
      });
  }]);

})();
