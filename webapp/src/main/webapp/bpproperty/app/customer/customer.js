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
    LandBuyDetailList: ['$route', 'CustomerService', function($route, CustomerService) {
      var criteria = {
        'id': $route.current.params['id']
      };
      return CustomerService.queryByCustomerId(criteria);
    }]
  };

  angular

    .module('customer', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {

    $routeProvider

      .when('/customer', {
      templateUrl: 'customer/customer-list.tpl.html',
      controller: 'CustomerListCtrl',
      resolve: CustomerListResolve
    })

    .when('/customer/create', {
      templateUrl: 'customer/customer-detail.tpl.html',
      controller: 'CreateCustomerCtrl'
    })

    .when('/customer/:id', {
      templateUrl: 'customer/customer-detail.tpl.html',
      controller: 'CustomerCtrl',
      resolve: CustomerResolve
    })

    .when('/customer/:id/lands', {
      templateUrl: 'customer/customer-lands.tpl.html',
      controller: 'CustomerLandsCtrl',
      resolve: CustomerLandsResolve
    });

  }])

  .controller('CustomerCtrl', ['$scope', '$routeParams', 'Customer', 'CustomerService', 'NotificationService',
    function($scope, $routeParams, Customer, CustomerService, NotificationService) {
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
      $scope.submit = function(isValid) {

        if (isValid) {
          CustomerService.create($scope.customer).then(function(data) {

            $scope.customer = data;

            NotificationService.notify({
              type: 'success',
              msg: 'Customer created'
            });

            // redirect to customer details page
            var url = '/customer/' + data.id;
            $location.path(url);

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

  .controller('CustomerLandsCtrl', ['$scope', '$location', 'LandBuyDetailList', function($scope, $location, LandBuyDetailList) {

    $scope.redirect = function(landBuyDetail) {
      var url = 'land/' + landBuyDetail.landId + '/buyDetail/' + landBuyDetail.id;
      $location.path(url);
    };

    $scope.landBuyDetails = LandBuyDetailList;

  }])

  .controller('CustomerListCtrl', ['$scope', '$location', 'Customer', 'Customers', function($scope, $location, Customer, Customers) {

    $scope.redirect = function(url) {
      $location.path(url);
    };

    $scope.onRecordsPerPageChanged = function() {
      $scope.currentPage = 1; // TODO: should remove this - added to prevent calling "updateCustomerTable()" twice
      $scope.updateCustomerTable();
    };

    $scope.updateCustomerTable = function() {

      var criteria = {
        page: $scope.currentPage - 1, // zero-based page index
        length: $scope.recordsPerPage
      };

      Customer.query(criteria).$promise.then(
        function(data) {
          self.updateScope(data);
          console.log('[Query Customer] - length:' + data.content.length);
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
      $scope.startIndex = (($scope.currentPage - 1) * $scope.recordsPerPage) + 1;
      $scope.endIndex = $scope.startIndex + data.totalDisplayRecords - 1;
    }

    $scope.recordsPerPageList = [10, 25, 50, 100];
    $scope.currentPage = 1;
    $scope.recordsPerPage = 10;

    this.updateScope(Customers);

  }]);
})();
