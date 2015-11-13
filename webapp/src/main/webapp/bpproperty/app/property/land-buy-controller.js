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
    BuyDetails: ['$q', '$route', 'LandService', 'LandBuyService',
      function($q, $route, LandService, LandBuyService) {

        var landBuyCriteria = {
          landId: $route.current.params['landId'],
          buyDetailId: $route.current.params['buyDetailId']
        };

        var bo = LandBuyService.queryForBO(landBuyCriteria);
        var land = LandService.query({
          landId: $route.current.params['landId']
        });

        var promises = {
          land: land,
          buyDetailBO: bo
        };

        return $q.all(promises);
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

  .controller('LandBuyDetailsCtrl', ['$rootScope', '$scope', '$uibModal', '$location', '$route', 'LandBuyService', 'NotificationService',
    function($rootScope, $scope, $uibModal, $location, $route, LandBuyService, NotificationService) {

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

              // emit to load LandBuyDetailBO
              $rootScope.$broadcast('loadLandBuyDetailBO');

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

  .controller('LandBuyGeneralDetailsCtrl', ['$scope', 'LandBuyService', 'BuyDetails',
    function($scope, LandBuyService, BuyDetails) {

      $scope.$on('loadLandBuyDetailBO', function() {
        var landBuyCriteria = {
          landId: $scope.land.id,
          buyDetailId: $scope.buyDetail.id
        };
        LandBuyService.queryForBO(landBuyCriteria).then(function(data) {
          updateScope(data);
        }, function(error) {
          alert('Unable to query LandBuyDetailBO');
        });
      });

      this.calculateUnpaidDebt = function(buyDetail) {
        if (buyDetail.buyType === 'CASH') {
          return 0;
        } else {
          return buyDetail.buyPrice - buyDetail.downPayment - buyDetail.totalInstallment;
        }
      };

      this.calculateInstallmentPerMonth = function(buyDetail) {
        if (buyDetail.buyType === 'CASH' || !buyDetail.downPayment ||
          !buyDetail.annualInterest || !buyDetail.yearsOfInstallment) {
          return null;
        }
        var calculated = (buyDetail.annualInterest / 100); // percentage of annualInterest
        return (buyDetail.buyPrice - buyDetail.downPayment) * calculated / 12 * buyDetail.yearsOfInstallment;
      };

      function updateScope(buyDetailBO) {
        $scope.installmentPerMonth = self.calculateInstallmentPerMonth(buyDetailBO);
        $scope.unpaidDebt = self.calculateUnpaidDebt(buyDetailBO);
        $scope.buyDetail = buyDetailBO;
        var name = $scope.buyDetail.buyerName.split(' ');
        $scope.customer = {
          id: $scope.buyDetail.buyerId,
          firstName: name[0],
          lastName: name[1]
        };
      }

      var self = this;
      updateScope(BuyDetails.buyDetailBO);

      $scope.land = BuyDetails.land;
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
        }],

        onRegisterApi: function(gridApi) {

          $scope.gridApi = gridApi;

          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            var buyDetail = row.entity;
            $location.path('/lands/' + buyDetail.landId + '/buydetails/' + buyDetail.id);
          });

          gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
            self.criteria.page = newPage - 1; // zero-based page index
            self.criteria.length = pageSize;
            self.queryTable();
          });

          gridApi.core.on.filterChanged($scope, function() {
            self.criteria.buyType = this.grid.columns[0].filters[0].term;
            self.criteria.firstname = this.grid.columns[1].filters[0].term;
            self.queryTable();
          });

        }
      };

      $scope.redirectToCreateLandBuyDetailPage = function() {
        $location.path('/lands/' + $scope.land.id + '/buydetails/create');
      };

      this.queryTable = function() {
        LandBuyService.query(self.criteria).then(
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

      $scope.months = [{
        key: 0,
        value: '\u0e17\u0e38\u0e01\u0e40\u0e14\u0e37\u0e2d\u0e19' // Select all
      }, {
        key: 1,
        value: '\u0e21\u0e01\u0e23\u0e32\u0e04\u0e21' // January
      }, {
        key: 2,
        value: '\u0e01\u0e38\u0e21\u0e20\u0e32\u0e1e\u0e31\u0e19\u0e18\u0e4c' // February
      }, {
        key: 3,
        value: '\u0e21\u0e35\u0e19\u0e32\u0e04\u0e21' // March
      }, {
        key: 4,
        value: '\u0e40\u0e21\u0e29\u0e32\u0e22\u0e19' // April
      }, {
        key: 5,
        value: '\u0e1e\u0e24\u0e29\u0e20\u0e32\u0e04\u0e21' // May
      }, {
        key: 6,
        value: '\u0e21\u0e34\u0e16\u0e38\u0e19\u0e32\u0e22\u0e19' // June
      }, {
        key: 7,
        value: '\u0e01\u0e23\u0e01\u0e0e\u0e32\u0e04\u0e21' // July
      }, {
        key: 8,
        value: '\u0e2a\u0e34\u0e07\u0e2b\u0e32\u0e04\u0e21' // August
      }, {
        key: 9,
        value: '\u0e01\u0e31\u0e19\u0e22\u0e32\u0e22\u0e19' // September
      }, {
        key: 10,
        value: '\u0e15\u0e38\u0e25\u0e32\u0e04\u0e21' // October
      }, {
        key: 11,
        value: '\u0e1e\u0e24\u0e28\u0e08\u0e34\u0e01\u0e32\u0e22\u0e19' // November
      }, {
        key: 12,
        value: '\u0e18\u0e31\u0e19\u0e27\u0e32\u0e04\u0e21' // December
      }];

      function generateYears(current, min) {
        var years = ['\u0e17\u0e38\u0e01\u0e1b\u0e35'];
        for (var i = current; i >= min; i--) {
          years.push(i);
        }
        return years;
      }

      this.currentYear = new Date().getFullYear();
      this.minYear = this.currentYear;
      this.preProcessing = function(data) {
        angular.forEach(data, function(row) {
          var year = new Date(row.createdTime).getFullYear();
          if (self.minYear > year) {
            self.minYear = year;
          }

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

      this.updateCriteria = function() {
        self.criteria.month = ($scope.month.key === 0) ? null : $scope.month.key - 1;
        self.criteria.year = ($scope.year === $scope.years[0]) ? null : $scope.year;
      };

      $scope.updateYear = function() {
        if ($scope.year === $scope.years[0] && $scope.month.key !== 0) {
          $scope.month = $scope.months[0];
        }
        self.updateCriteria();
        self.queryTable();
      };

      $scope.updateMonth = function() {
        if ($scope.month.key !== 0 && $scope.year === $scope.years[0]) {
          $scope.year = $scope.years[1];
        }
        self.updateCriteria();
        self.queryTable();
      };

      var self = this;
      this.preProcessing(BuyDetailList.landBuyDetail.content);

      $scope.month = $scope.months[0];
      $scope.years = generateYears(this.currentYear, this.minYear);
      $scope.year = $scope.years[0];

      this.criteria = {
        landId: $routeParams.landId,
        buyType: null,
        firstname: null,
        month: null,
        year: null,
        page: null,
        length: null
      };

      $scope.land = BuyDetailList.land;
      $scope.gridOptions.data = BuyDetailList.landBuyDetail.content;
      $scope.gridOptions.totalItems = BuyDetailList.landBuyDetail.totalRecords;
    }
  ]);

})();
