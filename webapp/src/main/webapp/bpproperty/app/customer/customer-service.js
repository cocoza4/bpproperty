(function() {

  'use strict';

  angular

    .module('customer-service', ['ngResource'])

  .service('CustomerService', ['Customer', 'CustomerLands', function(Customer, CustomerLands) {

    this.query = function(criteria) {
      return Customer.query(criteria).$promise;
    }

    this.queryByCustomerId = function(id) {
      return CustomerLands.query(id).$promise;
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
      '/bpproperty/api/customers/:id', {
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
  }])

  .factory('CustomerLands', ['$resource', function($resource) {
    return $resource(
      '/bpproperty/api/customers/:id/lands', {
        id: '@id'
      });
  }]);


})();
