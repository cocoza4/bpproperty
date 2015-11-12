(function() {

  'use strict';

  angular

    .module('customer-service', ['ngResource'])

  .service('CustomerService', ['Customer', 'CustomerLands', function(Customer, CustomerLands) {

    this.query = function(criteria) {
      return Customer.query(criteria).$promise;
    };

    this.queryByCustomerId = function(criteria) {
      return CustomerLands.query(criteria).$promise;
    };

    this.create = function(customer) {
      return Customer.save(customer).$promise;
    };

    this.update = function(customer) {
      return Customer.update(customer).$promise;
    };

    this.delete = function(customer) {
      return Customer.delete({
        id: customer.id
      }).$promise;
    };

    this.exists = function(customer) {
      return CustomerLands.exists({
        id: customer.id
      }).$promise;
    };

  }])

  .factory('Customer', ['$resource', function($resource) {

    return $resource(
      '/api/customers/:id', {
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
      '/api/customers/:id/lands', {
        id: '@id'
      }, {
        'query': {
          buyType: '@buyType',
          page: '@page',
          length: '@length'
        },
        'exists': {
          method: 'HEAD'
        },
      });
  }]);


})();
