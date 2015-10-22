(function() {

  'use strict';

  angular

    .module('land-installment-service', ['ngResource'])

  .service('InstallmentService', ['Installment', function(Installment) {

    this.query = function(criteria) {
      return Installment.query(criteria).$promise;
    };

    this.create = function(criteria, installment, month, year) {
      var date = new Date(year, month, 1);
      installment.payFor = date.getTime();
      return Installment.save(criteria, installment).$promise;
    };

    this.update = function(criteria, installment, month, year) {
      var date = new Date(year, month, 1);
      installment.payFor = date.getTime();
      return Installment.update(criteria, installment).$promise;
    };

    this.delete = function(criteria, id) {
      return Installment.delete(criteria, id).$promise;
    };

    this.getTotalPayment = function(installments) {
      var total = 0;
      for (var i = 0; i < installments.length; i++) {
        var installment = installments[i];
        total += installment.amount;
      }
      return total;
    };

  }])

  .factory('Installment', ['$resource', function($resource) {
    return $resource(
      '/api/lands/:landId/buydetails/:buyDetailId/installments/:installmentId', {
        landId: '@landId',
        buyDetailId: '@buyDetailId',
        installmentId: '@installmentId'
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
          },
          isArray: true
        }
      });
  }]);


})();
