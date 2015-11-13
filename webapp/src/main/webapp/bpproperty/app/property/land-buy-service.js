(function() {

  'use strict';

  angular

    .module('land-buy-service', ['ngResource'])

  .service('LandBuyService', ['LandBuy', 'LandBuyBO', function(LandBuy, LandBuyBO) {

    this.queryForBO = function(criteria) {
      return LandBuyBO.query(criteria).$promise;
    };

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

    this.exists = function(id) {
      return LandBuy.exists({
        landId: id
      }).$promise;
    };

  }])

  .factory('LandBuyBO', ['$resource', function($resource) {
    return $resource(
      '/api/lands/:landId/buydetailbos/:buyDetailId', {
        landId: '@landId',
        buyDetailId: '@buyDetailId'
      }, {
        'query': {
          method: 'GET',
          isArray: false
        }
      });
  }])

  .factory('LandBuy', ['$resource', function($resource) {
    return $resource(
      '/api/lands/:landId/buydetails/:buyDetailId', {
        landId: '@landId',
        buyDetailId: '@buyDetailId'
      }, {
        'update': {
          method: 'PUT'
        },
        'delete': {
          method: 'DELETE'
        },
        'exists': {
          method: 'HEAD'
        },
        'query': {
          method: 'GET',
          params: {
            landId: '@landId',
            firstname: '@firstname',
            buyType: '@buyType',
            month: '@month',
            year: '@year',
            page: '@page',
            length: '@length'
          }
        }
      });
  }]);

})();
