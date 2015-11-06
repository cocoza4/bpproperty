/*jshint -W069 */
(function() {

  'use strict';

  var LandResolve = {
    Land: ['$route', 'LandService', function($route, LandService) {
      var criteria = {
        landId: $route.current.params['landId']
      };
      return LandService.query(criteria);
    }]
  };

  var LandBuyDetailListResolve = {
    BuyDetailList: ['$q', '$route', 'LandService', 'LandBuyService',
      function($q, $route, LandService, LandBuyService) {

        var landId = $route.current.params['landId'];
        var criteria = {
          landId: landId
        };

        var landBuyDetail = LandBuyService.query(criteria);
        var land = LandService.query(criteria);

        var promises = {
          land: land,
          landBuyDetail: landBuyDetail
        };
        return $q.all(promises);

      }
    ]
  };

  var LandBuyDetailResolve = {
    BuyDetails: ['$q', '$route', 'LandService', 'LandBuyService', 'CustomerService',
      function($q, $route, LandService, LandBuyService, CustomerService) {

        var landBuyCriteria = {
          landId: $route.current.params['landId'],
          buyDetailId: $route.current.params['buyDetailId']
        };

        var buyDetail = LandBuyService.query(landBuyCriteria);
        var land = LandService.query({
          landId: $route.current.params['landId']
        });

        var loadBuyDetail = function() {
            return $q.all([buyDetail, land])
              .then(function(response) {

                return {
                  buyDetail: response[0],
                  land: response[1]
                };

              });
          },
          loadCustomer = function(buyDetails) {
            return CustomerService.query({
              id: buyDetails.buyDetail.customerId
            }).then(function(response) {
              return {
                buyDetail: buyDetails.buyDetail,
                land: buyDetails.land,
                customer: response
              };
            });
          };
        return loadBuyDetail().then(loadCustomer);
      }
    ]
  };

  angular

    .module('land-buy', ['ngRoute', 'ui.bootstrap', 'ui.grid', 'ui.grid.selection',
    'ui.grid.pagination', 'my-notification', 'land-buy-service', 'land-service', 'customer-service'
  ])

  .config(['$routeProvider', function($routeProvider) {

    $routeProvider

      .when('/lands/:landId/buydetails/create', {
      templateUrl: 'property/land-buy-main.tpl.html',
      controller: 'SelectBuyerCtrl',
      controllerAs: 'selectBuyerCtrl',
      resolve: LandResolve
    })

    .when('/lands/:landId/buydetails/:buyDetailId', {
      templateUrl: 'property/land-buy-main.tpl.html',
      controller: 'LandBuyGeneralDetailsCtrl',
      resolve: LandBuyDetailResolve
    })

    .when('/lands/:landId/buydetails', {
      templateUrl: 'property/land-buy-list.tpl.html',
      controller: 'LandBuyDetailListCtrl',
      resolve: LandBuyDetailListResolve
    });

  }])

  .controller('ConfirmDeleteLandBuyModalCtrl', ['$scope', '$location', '$modalInstance',
    'NotificationService', 'LandBuyService', 'buyDetail',
    function($scope, $location, $modalInstance, NotificationService, LandBuyService, buyDetail) {

      function redirectToBuyDetailListPage() {
        var url = '/lands/' + $scope.buyDetail.landId + '/buydetails';
        $location.path(url);
      }

      $scope.delete = function() {
        LandBuyService.delete($scope.buyDetail).then(function(response) {
            NotificationService.notify({
              type: 'success',
              msg: 'BuyDetail deleted'
            });
            redirectToBuyDetailListPage();
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

      $scope.buyDetail = buyDetail;
    }
  ])

  .controller('LandBuyDetailsCtrl', ['$scope', '$uibModal', '$location', '$route', 'LandBuyService', 'NotificationService',
    function($scope, $uibModal, $location, $route, LandBuyService, NotificationService) {

      this.deleteModal = function() {
        $uibModal.open({
          animation: true,
          templateUrl: 'confirmDeleteModal.html',
          controller: 'ConfirmDeleteLandBuyModalCtrl',
          resolve: {
            buyDetail: function() {
              return $scope.buyDetail;
            }
          }
        });
      };

      this.validateBuyDetail = function() {
        if (!$scope.customer) {
          NotificationService.notify({
            type: 'error',
            msg: 'Please select a buyer'
          });
          return false;
        }
        return true;
      };

      this.redirectToBuyDetailPage = function() {
        var url = '/lands/' + $route.current.params['landId'] + '/buydetails/' + $scope.buyDetail.id;
        $location.path(url);
      };

      $scope.$watch('buyDetail.buyType', function() {
        if ($scope.buyDetail.buyType == 'CASH') {
          $scope.buyDetail.downPayment = null;
          $scope.buyDetail.annualInterest = null;
          $scope.buyDetail.yearsOfInstallment = null;
        }
      });

      $scope.saveLandBuyDetail = function(isValid) {

        if (isValid && self.validateBuyDetail()) {

          var isNew = !$scope.buyDetail.id;

          if (isNew) {
            $scope.buyDetail.customerId = $scope.customer.id;
            LandBuyService.create($scope.buyDetail).then(function(data) {

              $scope.buyDetail = data;
              NotificationService.notify({
                type: 'success',
                msg: 'BuyDetail created'
              });

              // reload the page
              self.redirectToBuyDetailPage();

            }, function(error) {
              NotificationService.notify({
                type: 'error',
                msg: 'Unable to create BuyDetail'
              });
            });
          } else {
            LandBuyService.update($scope.buyDetail).then(function(data) {

              NotificationService.notify({
                type: 'success',
                msg: 'BuyDetail updated'
              });

            }, function(error) {
              NotificationService.notify({
                type: 'error',
                msg: 'Unable to update BuyDetail'
              });
            });
          }
        }
      };

      var self = this;
      $scope.buyTypeItems = ['CASH', 'INSTALLMENT'];

      if ($location.path().endsWith('create')) {
        $scope.buyDetail = {
          landId: $route.current.params['landId'],
          buyType: 'CASH'
        };
      } else {
        var landBuyCriteria = {
          landId: $route.current.params['landId'],
          buyDetailId: $route.current.params['buyDetailId']
        };

        LandBuyService.query(landBuyCriteria).then(function(data) {
          $scope.buyDetail = data;
        });
      }

    }
  ])

  .controller('LandBuyGeneralDetailsCtrl', ['$scope', 'BuyDetails',
    function($scope, BuyDetails) {
      $scope.buyDetail = BuyDetails.buyDetail;
      $scope.land = BuyDetails.land;
      $scope.customer = BuyDetails.customer;
    }
  ])

  .controller('SelectBuyerModalCtrl', ['$scope', '$modalInstance', 'CustomerService', 'dataTableObject',
    function($scope, $modalInstance, CustomerService, dataTableObject) {

      this.loadCustomers = function() {
        var criteria = {
          page: $scope.currentPage - 1, // zero-based page index
          length: recordsPerPage
        };
        CustomerService.query(criteria).then(function(data) {
          self.updateScope(data);
        });
      };

      this.updateScope = function(data) {
        $scope.customers = data.content;
        $scope.totalRecords = data.totalRecords;
        if ($scope.totalRecords === 0) {
          $scope.startIndex = 0;
          $scope.endIndex = 0;
        } else {
          $scope.startIndex = (($scope.currentPage - 1) * recordsPerPage) + 1;
          $scope.endIndex = $scope.startIndex + data.totalDisplayRecords - 1;
        }
      };

      $scope.onNextPageChanged = function() {
        if ($scope.customers.length < 10) return;
        $scope.currentPage = $scope.currentPage + 1;
        self.loadCustomers();
        $scope.selected = null;
      };

      $scope.onPreviousPageChanged = function() {
        if ($scope.currentPage === 1) return;
        $scope.currentPage = $scope.currentPage - 1;
        self.loadCustomers();
        $scope.selected = null;
      };

      $scope.setSelected = function(customer) {
        $scope.selected = customer;
      };

      $scope.selectBuyer = function() {
        $modalInstance.close($scope.selected);
      };

      $scope.closeModal = function() {
        $modalInstance.dismiss('cancel');
      };

      var self = this;
      var recordsPerPage = 10;

      $scope.currentPage = 1;
      $scope.selected = null;

      this.updateScope(dataTableObject);
    }
  ])

  .controller('SelectBuyerCtrl', ['$scope', '$uibModal', 'CustomerService', 'Land',
    function($scope, $uibModal, CustomerService, Land) {

      this.selectBuyerModal = function() {
        $scope.modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'myModalContent.html',
          controller: 'SelectBuyerModalCtrl',
          resolve: {
            dataTableObject: function() {
              return CustomerService.query();
            }
          }
        });

        $scope.modalInstance.result.then(function(selected) {
          $scope.customer = selected;
        });
      };

      var self = this;
      $scope.customer = null;
      $scope.land = Land;
    }
  ])

  .controller('LandBuyDetailListCtrl', ['$scope', '$location', '$routeParams', 'uiGridConstants',
    'BuyDetailList', 'LandBuyService',
    function($scope, $location, $routeParams, uiGridConstants, BuyDetailList, LandBuyService) {

      $scope.gridOptions = {
        enableSorting: true,
        showColumnFooter: true,
        enableGridMenu: true,

        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,

        useExternalFiltering: true,
        enableFiltering: true,

        useExternalPagination: true,
        paginationPageSizes: [10, 25, 50, 100],
        paginationPageSize: $scope.recordsPerPage,

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
              value: 'INSTALLMENT',
              label: '\u0e1c\u0e48\u0e2d\u0e19'
            }, {
              value: 'CASH',
              label: '\u0e2a\u0e14'
            }]
          },
          footerCellClass: 'right',
          footerCellTemplate: '<div class="ui-grid-cell-contents">Total</div>'
        }, {
          field: 'buyerName',
          displayName: '\u0e0a\u0e37\u0e48\u0e2d\u0e1c\u0e39\u0e49\u0e0b\u0e37\u0e49\u0e2d',
          headerCellClass: 'center',
          cellClass: 'right'
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
          field: "annualInterest",
          displayName: "\u0e1c\u0e48\u0e2d\u0e19 \u002f \u0e40\u0e14\u0e37\u0e2d\u0e19",
          headerCellClass: 'center',
          cellClass: 'right',
          width: '10%',
          enableFiltering: false
        }, {
          field: "createdTime",
          displayName: '\u0e40\u0e27\u0e25\u0e32\u0e17\u0e35\u0e48\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01',
          headerCellClass: 'center',
          cellClass: 'right',
          cellFilter: "date:\"MMMM d, yyyy h:mm a\"",
          enableFiltering: false,
        }],

        onRegisterApi: function(gridApi) {

          $scope.gridApi = gridApi;

          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            var buyDetail = row.entity;
            $location.path('/lands/' + buyDetail.landId + '/buydetails/' + buyDetail.id);
          });

          gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
            queryTable(newPage, pageSize);
          });

          $scope.gridApi.core.on.filterChanged( $scope, function() {
            var nameFilter = this.grid.columns[1].filters[0].term;
            alert(nameFilter);
          });

        }
      };

      $scope.gridOptions.data = BuyDetailList.landBuyDetail.content;
      $scope.gridOptions.totalItems = BuyDetailList.landBuyDetail.totalRecords;

      var queryTable = function(page, pageSize) {
        var criteria = {
          landId: $routeParams.landId,
          page: page - 1, // zero-based page index
          length: pageSize
        };
        LandBuyService.query(criteria).then(
          function(data) {
            $scope.gridOptions.totalItems = data.totalRecords;
            $scope.gridOptions.data = data.content;
          },
          function(error) {
            alert('Unable to query from table LandBuy');
          }
        );
      };

      $scope.onRecordsPerPageChanged = function() {
        $scope.currentPage = 1;
        $scope.updateLandBuyTable();
      };

      $scope.updateLandBuyTable = function() {

        var criteria = {
          landId: $routeParams.landId,
          page: $scope.currentPage - 1, // zero-based page index
          length: $scope.recordsPerPage
        };
        LandBuyService.query(criteria).then(
          function(data) {
            self.updateScope(data);
          },
          function(error) {
            alert('Unable to query from table LandBuy');
          }
        );
      };

      $scope.redirect = function(buyDetailId) {
        $location.path('/lands/' + $routeParams.landId + '/buydetails/' + buyDetailId);
      };

      $scope.redirectToCreateLandBuyDetailPage = function() {
        $location.path('/lands/' + $routeParams.landId + '/buydetails/create');
      };

      this.updateScope = function(data) {
        if (data.landBuyDetail) { //TODO: this causes a bug when changing page
          $scope.landBuys = data.landBuyDetail.content;
          $scope.totalRecords = data.landBuyDetail.totalRecords;
          if ($scope.totalRecords === 0) {
            $scope.startIndex = 0;
            $scope.endIndex = 0;
          } else {
            $scope.startIndex = (($scope.currentPage - 1) * $scope.recordsPerPage) + 1;
            $scope.endIndex = $scope.startIndex + data.landBuyDetail.totalDisplayRecords - 1;
          }
        }
      };

      var self = this;
      $scope.recordsPerPageList = [10, 25, 50, 100];
      $scope.currentPage = 1;
      $scope.recordsPerPage = 10;

      $scope.land = BuyDetailList.land;
      this.updateScope(BuyDetailList);
    }
  ]);

})();
