(function() {

  'use strict';

  var CustomerListResolve = {
    Customers: ['CustomerService', function(CustomerService) {
      var criteria = {
        page: 0, // zero-based page index
        length: 10
      };
      return CustomerService.query(criteria);
    }]
  };

  var CustomerResolve = {
    Customer: ['$route', 'CustomerService', function($route, CustomerService) {
      var criteria = {
        id: $route.current.params['id']
      };
      return CustomerService.query(criteria);
    }]
  };

  var CustomerLandsResolve = {
    CustomerLands: ['$q', '$route', 'CustomerService', function($q, $route, CustomerService) {
      var criteria = {
        id: $route.current.params['id']
      };
      var landBuyDetails = CustomerService.queryByCustomerId(criteria);
      var customer = CustomerService.query(criteria);

      var promises = {
        customer: customer,
        landBuyDetails: landBuyDetails
      }
      return $q.all(promises);
    }]
  };

  angular

    .module('customer', ['ngRoute', 'my-notification', 'customer-service'])

  .config(['$routeProvider', function($routeProvider) {

    $routeProvider

      .when('/customers', {
      templateUrl: 'customer/customer-list.tpl.html',
      controller: 'CustomerListCtrl',
      resolve: CustomerListResolve
    })

    .when('/customers/create', {
      templateUrl: 'customer/customer-detail.tpl.html',
      controller: 'CreateCustomerCtrl'
    })

    .when('/customers/:id', {
      templateUrl: 'customer/customer-detail.tpl.html',
      controller: 'CustomerCtrl',
      resolve: CustomerResolve
    })

    .when('/customers/:id/lands', {
      templateUrl: 'customer/customer-lands.tpl.html',
      controller: 'CustomerLandsCtrl',
      resolve: CustomerLandsResolve
    });

  }])

  .controller('CustomerCtrl', ['$scope', 'Customer', 'CustomerService', 'NotificationService',
    function($scope, Customer, CustomerService, NotificationService) {

      $scope.submit = function(isValid) {

        if (isValid) {
          CustomerService.update($scope.customer).then(function(data) {
            NotificationService.notify({
              type: 'success',
              msg: 'Customer updated'
            });
          }, function(error) {
            NotificationService.notify({
              type: 'error',
              msg: 'Unable to update Customer'
            });
          });
        }

      };

      $scope.customer = Customer;
    }
  ])

  .controller('CreateCustomerCtrl', ['$scope', '$location', 'CustomerService', 'NotificationService',
    function($scope, $location, CustomerService, NotificationService) {

      var self = this;
      this.redirectToCustomerPage = function(id) {
        var url = '/customers/' + id;
        $location.path(url);
      }

      $scope.submit = function(isValid) {

        if (isValid) {
          CustomerService.create($scope.customer).then(function(data) {

            $scope.customer = data;

            NotificationService.notify({
              type: 'success',
              msg: 'Customer created'
            });

            self.redirectToCustomerPage(data.id);

          }, function(error) {
            NotificationService.notify({
              type: 'error',
              msg: 'Unable to create Customer'
            });
          });
        }

      };

      $scope.customer = {};
    }
  ])

  .controller('CustomerLandsCtrl', ['$scope', '$location', 'CustomerLands', function($scope, $location, CustomerLands) {

    $scope.redirect = function(landBuyDetail) {
      var url = 'lands/' + landBuyDetail.landId + '/buydetails/' + landBuyDetail.id;
      $location.path(url);
    };

    $scope.customer = CustomerLands.customer;
    $scope.landBuyDetails = CustomerLands.landBuyDetails;

  }])

  .controller('CustomerListCtrl', ['$scope', '$location', 'CustomerService', 'Customers',
    function($scope, $location, CustomerService, Customers) {

      $scope.redirect = function(customer) {
        var url = '/customers/' + customer.id;
        $location.path(url);
      };

      $scope.onRecordsPerPageChanged = function() {
        $scope.currentPage = 1;
        $scope.updateCustomerTable();
      };

      $scope.updateCustomerTable = function() {

        var criteria = {
          page: $scope.currentPage - 1, // zero-based page index
          length: $scope.recordsPerPage
        };

        CustomerService.query(criteria).then(
          function(data) {
            self.updateScope(data);
          },
          function(error) {
            alert('Unable to query from table Customer');
          }
        );
      };

      var self = this;

      this.updateScope = function(data) {
        $scope.customers = data.content;
        $scope.totalRecords = data.totalRecords;
        if ($scope.totalRecords == 0) {
          $scope.startIndex = 0;
          $scope.endIndex = 0;
        } else {
          $scope.startIndex = (($scope.currentPage - 1) * $scope.recordsPerPage) + 1;
          $scope.endIndex = $scope.startIndex + data.totalDisplayRecords - 1;
        }
      }

      $scope.recordsPerPageList = [10, 25, 50, 100];
      $scope.currentPage = 1;
      $scope.recordsPerPage = 10;

      this.updateScope(Customers);

    }
  ]);
})();
