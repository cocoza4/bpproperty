(function() {

  'use strict';

  angular

    .module('land-payment-service', ['ngResource'])

  .service('PaymentService', ['Payment', '$window', function(Payment, $window) {

    function updatePayDate(payment, month, year) {
      if (month && year) {
        var date = new Date(year, month, 1);
        payment.payFor = date.getTime();
      }
    }

    this.loadReceipt = function(landId, buyId, params) {
      var url = '/api/lands/' + landId + '/buydetails/' + buyId + '/receipt?' + $.param(params);
      $window.open(url, '_blank');
    };

    this.query = function(criteria) {
      return Payment.query(criteria).$promise;
    };

    this.create = function(criteria, payment, month, year) {
      updatePayDate(payment, month, year);
      return Payment.save(criteria, payment).$promise;
    };

    this.update = function(criteria, payment, month, year) {
      updatePayDate(payment, month, year);
      return Payment.update(criteria, payment).$promise;
    };

    this.delete = function(criteria, id) {
      return Payment.delete(criteria, id).$promise;
    };

    this.getTotalPayment = function(payments) {
      var total = 0;
      for (var i = 0; i < payments.length; i++) {
        var payment = payments[i];
        total += payment.amount;
      }
      return total;
    };

  }])

  .factory('Payment', ['$resource', function($resource) {
    return $resource(
      '/api/lands/:landId/buydetails/:buyDetailId/payments/:paymentId', {
        landId: '@landId',
        buyDetailId: '@buyDetailId',
        paymentId: '@paymentId'
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
          isArray: false
        }
      });
  }]);


})();
