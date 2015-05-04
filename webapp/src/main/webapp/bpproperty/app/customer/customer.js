(function () {

  'use strict';

  angular

  .module('customer', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {

    $routeProvider

    .when('/customer', {
      templateUrl: 'customer/customer-list.tpl.html',
      controller: 'customerListCtrl'
    })

    .when('/customer/:id', {
      templateUrl: 'customer/customer-detail.tpl.html',
      controller: 'customerCtrl'
    })

    .when('/customer/create', {
      templateUrl: 'customer/customer-detail.tpl.html',
      controller: 'createCustomerCtrl'
    });

  }])

  .controller('customerCtrl', ['$scope', '$routeParams', 'Customer', function($scope, $routeParams, Customer) {
    $scope.submit = function() {
      $scope.customer.$update();
      alert('updated');
    };

      $scope.customer = Customer.get({id: $routeParams.id});
  }])

  .controller('createCustomerCtrl', ['$scope', 'Customer', function($scope, Customer) {
    $scope.submit = function() {
      Customer.save($scope.customer);
      alert('saved');
    };

    $scope.customer = {};
  }])

  .controller('customerListCtrl', ['$scope', '$location', 'Customer', function($scope, $location, Customer) {

    $scope.redirect = function(url) {
      $location.path(url);
    }

    $scope.isActive = function(index) {
      return $scope.page === index;
    };

    $scope.init = function() {

      $location.search('pageSize', $scope.pageSize);

      var criteria = {
            page: $scope.page - 1, // zero-based page index
            length: $scope.pageSize
      };

      Customer.query(criteria).$promise.then(

        function(data) {

          $scope.customers = data.content;
          $scope.totalRecords = data.totalRecords;
          $scope.totalDisplayRecords = data.totalDisplayRecords;
          $scope.offset = Math.ceil(data.totalDisplayRecords / $scope.pageSize);

          var pages = [];

          var from = ($scope.page > 1) ? $scope.page - 1 : 1;
          var to = ($scope.totalDisplayRecords === 0) ? from + 2 : from + 4;
          for (var i = from; i < to; i++) {
            pages.push(i);
          }
          $scope.pages = pages;
        },
        function(error) {
          alert('error');
        }
      );
    }

    $scope.pageSizes = [10, 25, 50, 100];

    var temp = $location.search()['page'];
    var page = (temp != undefined) ? parseInt(temp) : 1;
    $scope.page = page;

    temp = $location.search()['pageSize'];
    $scope.pageSize = (temp != undefined) ? parseInt(temp) : 10;

    $scope.init();

  }]);

})();