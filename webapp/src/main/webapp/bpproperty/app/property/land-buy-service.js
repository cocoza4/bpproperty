(function() {

  'use strict';

  angular

    .module('land-buy-service', ['ngResource'])

  .service('LandBuyService', ['LandBuy', 'LandBuyBO', function(LandBuy, LandBuyBO) {

    this.getUnpaidDebt = function(data) {
      if (data.buyType === 'CASH') {
        return 0;
      }
      return data.buyPrice - data.downPayment - data.totalInstallment;
    };

    this.getInstallmentPerMonth = function(data) {
      if (data.buyType === 'CASH' || !data.downPayment || !data.annualInterest || !data.yearsOfInstallment) {
        return null;
      }
      var initialDebt = (data.buyPrice - data.downPayment);
      var interest = initialDebt * (data.annualInterest / 100) * data.yearsOfInstallment;
      return (initialDebt + interest) / (12 * data.yearsOfInstallment);
    };

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
