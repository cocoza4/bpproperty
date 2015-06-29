(function() {

  'use strict';

  angular

    .module('customer-service', ['ngResource'])

  .service('CustomerService', ['Customer', function(Customer) {

    this.query = function(criteria) {
      return Customer.query(criteria).$promise;
    }

    this.create = function(customer) {
      return Customer.save(customer).$promise;
    };

    this.update = function(customer) {
      return Customer.update(customer).$promise;
    }

  }])

  .factory('Customer', ['$resource', function($resource) {

    return $resource(
      '/bpproperty/api/customer/:id', {
        id: '@id'
      }, {
        'update': {
          method: 'PUT'
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
