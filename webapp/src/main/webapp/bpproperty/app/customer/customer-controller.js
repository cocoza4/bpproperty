/*jshint -W069 */
(function() {

  'use strict';

  var CustomerListResolve = {
    Customers: ['CustomerService', function(CustomerService) {
      return CustomerService.query();
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
      };
      return $q.all(promises);
    }]
  };

  angular

    .module('customer', ['ngRoute', 'ui.bootstrap', 'ui.grid', 'ui.grid.selection',
    'ui.grid.pagination', 'my-notification', 'customer-service'
  ])

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
      controllerAs: 'customerCtrl',
      resolve: CustomerResolve
    })

    .when('/customers/:id/lands', {
      templateUrl: 'customer/customer-lands.tpl.html',
      controller: 'CustomerLandsCtrl',
      resolve: CustomerLandsResolve
    });

  }])

  .controller('ConfirmDeleteCustomerModalCtrl', ['$scope', '$location', '$modalInstance',
    'NotificationService', 'CustomerService', 'customer', 'exists',
    function($scope, $location, $modalInstance, NotificationService, CustomerService, customer, exists) {

      $scope.delete = function() {
        CustomerService.delete($scope.customer).then(function(response) {
            NotificationService.notify({
              type: 'success',
              msg: 'Customer deleted'
            });
            $location.path('/customers');
          },
          function(error) {
            NotificationService.notify({
              type: 'error',
              msg: 'Unable to delete'
            });
          });

        $modalInstance.dismiss('cancel');
      };

      $scope.closeModal = function() {
        $modalInstance.dismiss('cancel');
      };

      $scope.customer = customer;
      $scope.exists = exists;
    }
  ])

  .controller('CustomerCtrl', ['$scope', '$uibModal', 'Customer', 'CustomerService', 'NotificationService',
    function($scope, $uibModal, Customer, CustomerService, NotificationService) {

      this.deleteModal = function() {
        $uibModal.open({
          animation: true,
          templateUrl: 'confirmDeleteModal.html',
          controller: 'ConfirmDeleteCustomerModalCtrl',
          resolve: {
            customer: function() {
              return $scope.customer;
            },
            exists: function() {
              return CustomerService.exists($scope.customer).then(function() {
                return true;
              }).catch(function() {
                return false;
              });
            }
          }
        });
      };

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
      };

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

      $scope.gridOptions = {
        enableSorting: true,
        enableGridMenu: true,
        enableColumnResizing: true,
        fastWatch: true,
        enableRowHeaderSelection: false,

        enableFiltering: true,

        useExternalPagination: true,
        paginationPageSizes: [10, 25, 50, 100, 500],
        paginationPageSize: 10,

        columnDefs: [{
          field: 'firstName',
          displayName: '\u0e0a\u0e37\u0e48\u0e2d\u0e08\u0e23\u0e34\u0e07',
          headerCellClass: 'center',
          cellClass: 'right',
        }, {
          field: 'lastName',
          displayName: '\u0e19\u0e32\u0e21\u0e2a\u0e01\u0e38\u0e25',
          headerCellClass: 'center',
          cellClass: 'right'
        }, {
          field: 'address',
          displayName: '\u0e17\u0e35\u0e48\u0e2d\u0e22\u0e39\u0e48',
          headerCellClass: 'center',
          cellClass: 'right',
        }, {
          field: 'tel',
          displayName: '\u0e42\u0e17\u0e23',
          headerCellClass: 'center',
          cellClass: 'right',
        }, {
          field: 'createdTime',
          enableFiltering: false,
          displayName: '\u0e27\u0e31\u0e19\u0e17\u0e35\u0e48\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01',
          cellFilter: 'date:"MMMM d, yyyy"',
          headerCellClass: 'center',
          cellClass: 'right'
        }, {
          name: '\u0e22\u0e2d\u0e14\u0e01\u0e32\u0e23\u0e0b\u0e37\u0e49\u0e2d',
          enableSorting: false,
          enableFiltering: false,
          headerCellClass: 'center',
          cellClass: 'center',
          width: '9%',
          cellTemplate: '<span class="glyphicon glyphicon-shopping-cart pointer" ' +
            'ng-click="$event.stopPropagation(); grid.appScope.redirectToCustomerSalesPage(row.entity)" ' +
            'style="vertical-align: middle"></span>'
        }],

        onRegisterApi: function(gridApi) {
          $scope.gridApi = gridApi;

          gridApi.core.on.filterChanged($scope, function() {
            self.criteria.firstname = this.grid.columns[0].filters[0].term;
            self.criteria.lastname = this.grid.columns[1].filters[0].term;
            self.criteria.address = this.grid.columns[2].filters[0].term;
            self.criteria.tel = this.grid.columns[3].filters[0].term;
            self.queryTable();
          });

          gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
            self.criteria.page = newPage - 1; // zero-based page index
            self.criteria.length = pageSize;
            self.queryTable();
          });

          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            var customer = row.entity;
            $location.path('/customers/' + customer.id);
          });

        }
      };

      this.queryTable = function() {
        CustomerService.query(self.criteria).then(
          function(data) {
            $scope.gridOptions.totalItems = data.totalRecords;
            $scope.gridOptions.data = data.content;
          },
          function(error) {
            alert('Unable to query from table Customer');
          }
        );
      };

      $scope.redirectToCustomerSalesPage = function(entity) {
        $location.path('/customers/' + entity.id + '/lands');
      };

      this.criteria = {
        firstname: null,
        lastname: null,
        address: null,
        tel: null,
        page: null,
        length: null
      };

      var self = this;
      $scope.gridOptions.data = Customers.content;
      $scope.gridOptions.totalItems = Customers.totalRecords;

    }
  ]);
})();
