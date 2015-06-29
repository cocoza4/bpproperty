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
      // alert(landBuy.buyType == 'ผ่อน');
      // if (landBuy.buyType == 'ผ่อน') {
      //   landBuy.buyType = 'INSTALLMENT';
      // } else {
      //   landBuy.buyType = 'CASH';
      // }

      return LandBuy.update({
        landId: landBuy.landId,
        buyDetailId: landBuy.id
      }, landBuy).$promise;
    }

  }])

  .factory('LandBuy', ['$resource', function($resource) {
    return $resource(
      '/bpproperty/api/land/:landId/buyDetail/:buyDetailId', {
        landId: '@landId',
        buyDetailId: '@buyDetailId'
      }, {
        'update': {
          method: 'PUT'
        },
        'query': {
          method: 'GET',
          params: {
            landId: '@landId',
            page: '@page',
            length: '@length'
          }
        }
        //                    'query': {method: 'GET', params: {landId: '@landId', page: '@page', length: '@length'}}
      });
  }]);


})();
