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

  .controller('CustomerLandsCtrl', ['$scope', '$location', 'uiGridConstants', 'CustomerService', 'CustomerLands',
    function($scope, $location, uiGridConstants, CustomerService, CustomerLands) {

      $scope.gridOptions = {
        enableSorting: true,
        showColumnFooter: true,
        enableGridMenu: true,
        enableColumnResizing: true,
        fastWatch: true,

        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,

        useExternalFiltering: true,
        enableFiltering: true,

        useExternalPagination: true,
        paginationPageSizes: [10, 25, 50, 100, 500],
        paginationPageSize: 10,

        columnDefs: [{
          field: 'buyType',
          displayName: '\u0e1b\u0e23\u0e30\u0e40\u0e20\u0e17',
          cellFilter: 'buyType',
          headerCellClass: 'center',
          cellClass: 'right',
          width: '8%',
          filter: {
            type: uiGridConstants.filter.SELECT,
            selectOptions: [{
              value: 'I', // I for Installment
              label: '\u0e1c\u0e48\u0e2d\u0e19'
            }, {
              value: 'C', // C for Cash
              label: '\u0e2a\u0e14'
            }]
          },
          footerCellClass: 'right',
          footerCellTemplate: '<div class="ui-grid-cell-contents">Total</div>'
        }, {
          field: 'area.rai',
          displayName: '\u0e44\u0e23\u0e48',
          headerCellClass: 'center',
          cellClass: 'right',
          cellFilter: 'unit',
          enableFiltering: false,
          width: '7%',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          aggregationHideLabel: true,
          footerCellClass: 'right',
          footerCellFilter: 'number'
        }, {
          field: 'area.yarn',
          displayName: '\u0e07\u0e32\u0e19',
          headerCellClass: 'center',
          cellClass: 'right',
          cellFilter: 'unit',
          enableFiltering: false,
          width: '7%',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          aggregationHideLabel: true,
          footerCellClass: 'right',
          footerCellFilter: 'number'
        }, {
          field: 'area.tarangwa',
          displayName: '\u0e15\u0e32\u0e23\u0e32\u0e07\u0e27\u0e32',
          headerCellClass: 'center',
          cellClass: 'right',
          cellFilter: 'unit',
          enableFiltering: false,
          width: '7%',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          aggregationHideLabel: true,
          footerCellClass: 'right',
          footerCellFilter: 'number'
        }, {
          field: 'buyPrice',
          displayName: '\u0e23\u0e32\u0e04\u0e32\u0e0b\u0e37\u0e49\u0e2d',
          cellFilter: 'number',
          headerCellClass: 'center',
          cellClass: 'right',
          enableFiltering: false,
          width: '10%',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          aggregationHideLabel: true,
          footerCellClass: 'right',
          footerCellFilter: 'number'
        }, {
          field: "downPayment",
          displayName: "\u0e14\u0e32\u0e27\u0e19\u0e4c",
          cellFilter: 'number',
          headerCellClass: 'center',
          cellClass: 'right',
          width: '10%',
          enableFiltering: false,
          aggregationType: uiGridConstants.aggregationTypes.sum,
          aggregationHideLabel: true,
          footerCellClass: 'right',
          footerCellFilter: 'number'
        }, {
          field: "getInstallmentPerMonth()",
          displayName: "\u0e1c\u0e48\u0e2d\u0e19 \u002f \u0e40\u0e14\u0e37\u0e2d\u0e19",
          headerCellClass: 'center',
          cellClass: 'right',
          width: '10%',
          cellFilter: 'number',
          enableFiltering: false
        }, {
          field: "totalInstallment",
          displayName: "\u0e22\u0e2d\u0e14\u0e1c\u0e48\u0e2d\u0e19",
          headerCellClass: 'center',
          cellFilter: 'number',
          cellClass: 'right',
          width: '10%',
          enableFiltering: false,
          aggregationType: uiGridConstants.aggregationTypes.sum,
          aggregationHideLabel: true,
          footerCellClass: 'right',
          footerCellFilter: 'number'
        }, {
          field: 'getDebt()',
          displayName: "\u0e22\u0e2d\u0e14\u0e04\u0e07\u0e04\u0e49\u0e32\u0e07",
          headerCellClass: 'center',
          cellFilter: 'number',
          cellClass: 'right',
          width: '10%',
          enableFiltering: false,
          aggregationType: uiGridConstants.aggregationTypes.sum,
          aggregationHideLabel: true,
          footerCellClass: 'right',
          footerCellFilter: 'number'
        }, {
          field: 'createdTime',
          enableFiltering: false,
          displayName: '\u0e27\u0e31\u0e19\u0e17\u0e35\u0e48\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01',
          cellFilter: 'date:"MMMM d, yyyy"',
          headerCellClass: 'center',
          cellClass: 'right'
        }],

        onRegisterApi: function(gridApi) {
          $scope.gridApi = gridApi;

          gridApi.core.on.filterChanged($scope, function() {
            self.criteria.buyType = this.grid.columns[0].filters[0].term;
            self.queryTable();
          });

          gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
            self.criteria.page = newPage - 1; // zero-based page index
            self.criteria.length = pageSize;
            self.queryTable();
          });

          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            var landBuyDetail = row.entity;
            $location.path('lands/' + landBuyDetail.landId + '/buydetails/' + landBuyDetail.id);
          });

        }
      };

      this.preProcessing = function(data) {
        angular.forEach(data, function(row) {
          row.getInstallmentPerMonth = function() {
            if (this.buyType === 'CASH' || !this.downPayment || !this.annualInterest || !this.yearsOfInstallment) {
              return;
            }
            var calculated = (this.annualInterest / 100); // percentage of annualInterest
            return (this.buyPrice - this.downPayment) * calculated / 12 * this.yearsOfInstallment;
          };

          row.getDebt = function() {
            if (this.buyType === 'CASH') {
              return 0;
            }
            return this.buyPrice - this.downPayment - this.totalInstallment;
          };
        });
      };

      this.queryTable = function() {
        CustomerService.queryByCustomerId(self.criteria).then(
          function(data) {
            $scope.gridOptions.totalItems = data.totalRecords;
            self.preProcessing(data.content);
            $scope.gridOptions.data = data.content;
          },
          function(error) {
            alert('Unable to query from table LandBuy');
          }
        );
      };

      this.criteria = {
        id: CustomerLands.customer.id,
        buyType: null,
        page: null,
        length: null
      };

      var self = this;
      this.preProcessing(CustomerLands.landBuyDetails.content);
      $scope.gridOptions.data = CustomerLands.landBuyDetails.content;
      $scope.gridOptions.totalItems = CustomerLands.landBuyDetails.totalRecords;
      $scope.customer = CustomerLands.customer;

    }
  ])

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
