/*jshint -W069 */
(function() {

  'use strict';

  angular

    .module('land-installment', ['ngRoute', 'ui.bootstrap', 'my-notification', 'land-buy', 'land-installment-service'])

  .controller('ConfirmDeleteModalCtrl', ['$rootScope', '$scope', '$route', '$modalInstance', 'InstallmentService',
    'NotificationService', 'installment',
    function($rootScope, $scope, $route, $modalInstance, InstallmentService, NotificationService, installment) {

      $scope.delete = function() {
        var criteria = {
          landId: $route.current.params['landId'],
          buyDetailId: $route.current.params['buyDetailId'],
          installmentId: $scope.installment.id
        };

        InstallmentService.delete(criteria).then(function(response) {
            NotificationService.notify({
              type: 'success',
              msg: 'Installment deleted'
            });

            // emit to load installments
            $rootScope.$broadcast('loadInstallments');
          },
          function(error) {
            NotificationService.notify({
              type: 'error',
              msg: 'Unable to delete the selected Installment'
            });
          });

        $modalInstance.dismiss('cancel');
      };

      $scope.closeModal = function() {
        $modalInstance.dismiss('cancel');
      };

      $scope.installment = installment;
    }
  ])

  .controller('InstallmentListCtrl', ['$scope', '$route', '$uibModal', 'LandBuyService', 'InstallmentService',
    function($scope, $route, $uibModal, LandBuyService, InstallmentService) {

      $scope.gridOptions = {
        enableSorting: true,
        showColumnFooter: true,
        enableGridMenu: true,
        enableColumnResizing: true,
        fastWatch: true,

        // useExternalPagination: true,
        paginationPageSizes: [10, 25, 50, 100, 500],
        paginationPageSize: 10,

        columnDefs: [
          {
            field: 'sequence',
            displayName: 'No.',
            headerCellClass: 'center',
            cellClass: 'center',
            enableSorting: false,
            width: '5%',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
          },{
          field: 'payFor',
          displayName: 'payFor',
          cellFilter: 'date: "MMMM yyyy"',
          headerCellClass: 'center',
          cellClass: 'right',
        }, {
          field: 'amount',
          displayName: 'amount',
          cellFilter: 'number',
          headerCellClass: 'center',
          cellClass: 'right'
        }, {
          field: 'createdTime',
          displayName: 'payment date',
          cellFilter: 'date:"MMMM d, yyyy \' \u0e40\u0e27\u0e25\u0e32 \' h:mm a"',
          headerCellClass: 'center',
          cellClass: 'right'
        }, {
          name: 'Revise',
          headerCellClass: 'center',
          cellClass: 'center',
          width: '10%',
          cellTemplate: '<span class="glyphicon glyphicon-edit" style="color:#337ab7;vertical-align: middle"></span>'

        }, {
          name: 'Delete',
          headerCellClass: 'center',
          cellClass: 'center',
          width: '10%',
          cellTemplate: '<span class="glyphicon glyphicon-remove" style="color:#d9534f;vertical-align: middle"></span>'
        }],

        onRegisterApi: function(gridApi) {

          $scope.gridApi = gridApi;

          // gridApi.selection.on.rowSelectionChanged($scope, function(row) {
          //   var buyDetail = row.entity;
          //   $location.path('/lands/' + buyDetail.landId + '/buydetails/' + buyDetail.id);
          // });
          //
          // gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
          //   self.criteria.page = newPage - 1; // zero-based page index
          //   self.criteria.length = pageSize;
          //   self.queryTable();
          // });
          //
          // gridApi.core.on.filterChanged($scope, function() {
          //   self.criteria.buyType = this.grid.columns[0].filters[0].term;
          //   self.criteria.firstname = this.grid.columns[1].filters[0].term;
          //   self.queryTable();
          // });

        }
      };

      this.saveInstallmentModal = function(selected) {
        $uibModal.open({
          animation: true,
          templateUrl: 'saveInstallmentModal.html',
          controller: 'SaveInstallmentModalCtrl',
          resolve: {
            installment: function() {
              return selected;
            }
          }
        });
      };

      this.confirmDeleteModal = function(selected) {
        $uibModal.open({
          animation: true,
          templateUrl: 'confirmDeleteModal.html',
          controller: 'ConfirmDeleteModalCtrl',
          resolve: {
            installment: function() {
              return selected;
            }
          }
        });
      };

      this.loadInstallments = function() {
        var installmentCriteria = {
          landId: $route.current.params['landId'],
          buyDetailId: $route.current.params['buyDetailId'],
        };

        var landBuyCriteria = {
          landId: $route.current.params['landId'],
          buyDetailId: $route.current.params['buyDetailId']
        };

        InstallmentService.query(installmentCriteria).then(function(data) {

          $scope.gridOptions.data = data;

          $scope.installments = data;
          return LandBuyService.query(landBuyCriteria);
        }).then(function(data) {


          // $scope.gridOptions.totalItems = BuyDetailList.landBuyDetail.totalRecords;

          $scope.landBuy = data;
          $scope.totalAmount = InstallmentService.getTotalPayment($scope.installments);
          $scope.remaining = data.buyPrice - data.downPayment - $scope.totalAmount;
        });
      };

      $scope.$on('loadInstallments', function() {
        self.loadInstallments();
      });

      var self = this;
      this.loadInstallments();
    }
  ])

  .controller('SaveInstallmentModalCtrl', ['$rootScope', '$scope', '$route', '$modalInstance',
    'InstallmentService', 'NotificationService', 'installment',
    function($rootScope, $scope, $route, $modalInstance, InstallmentService, NotificationService, installment) {

      $scope.closeModal = function() {
        $modalInstance.dismiss('cancel');
      };

      $scope.saveInstallment = function(isValid) {
        if (isValid) {

          $scope.installment.buyDetailId = $route.current.params['buyDetailId'];

          var installmentCriteria = {
            landId: $route.current.params['landId'],
            buyDetailId: $route.current.params['buyDetailId'],
          };
          var selectedMonth = $scope.selectedMonth.key;
          var selectedYear = $scope.selectedYear;

          var isNew = !$scope.installment.id;

          if (isNew) {
            InstallmentService.create(installmentCriteria, $scope.installment, selectedMonth, selectedYear).then(function(data) {

              $modalInstance.dismiss('cancel'); // hide dialog

              NotificationService.notify({
                type: 'success',
                msg: 'Installment created'
              });

              // emit to load installments
              $rootScope.$broadcast('loadInstallments');

            }, function(error) {
              NotificationService.notify({
                type: 'error',
                msg: 'Unable to create Installment'
              });
            });
          } else {
            InstallmentService.update(installmentCriteria, $scope.installment, selectedMonth, selectedYear).then(function(data) {
              $modalInstance.dismiss('cancel'); // hide dialog

              NotificationService.notify({
                type: 'success',
                msg: 'Installment updated'
              });

              // emit to load installments
              $rootScope.$broadcast('loadInstallments');

            }, function(error) {
              NotificationService.notify({
                type: 'error',
                msg: 'Unable to update existing Installment'
              });
            });
          }

        }
      };

      $scope.months = [{
        key: 0,
        value: '\u0e21\u0e01\u0e23\u0e32\u0e04\u0e21' // January
      }, {
        key: 1,
        value: '\u0e01\u0e38\u0e21\u0e20\u0e32\u0e1e\u0e31\u0e19\u0e18\u0e4c' // February
      }, {
        key: 2,
        value: '\u0e21\u0e35\u0e19\u0e32\u0e04\u0e21' // March
      }, {
        key: 3,
        value: '\u0e40\u0e21\u0e29\u0e32\u0e22\u0e19' // April
      }, {
        key: 4,
        value: '\u0e1e\u0e24\u0e29\u0e20\u0e32\u0e04\u0e21' // May
      }, {
        key: 5,
        value: '\u0e21\u0e34\u0e16\u0e38\u0e19\u0e32\u0e22\u0e19' // June
      }, {
        key: 6,
        value: '\u0e01\u0e23\u0e01\u0e0e\u0e32\u0e04\u0e21' // July
      }, {
        key: 7,
        value: '\u0e2a\u0e34\u0e07\u0e2b\u0e32\u0e04\u0e21' // August
      }, {
        key: 8,
        value: '\u0e01\u0e31\u0e19\u0e22\u0e32\u0e22\u0e19' // September
      }, {
        key: 9,
        value: '\u0e15\u0e38\u0e25\u0e32\u0e04\u0e21' // October
      }, {
        key: 10,
        value: '\u0e1e\u0e24\u0e28\u0e08\u0e34\u0e01\u0e32\u0e22\u0e19' // November
      }, {
        key: 11,
        value: '\u0e18\u0e31\u0e19\u0e27\u0e32\u0e04\u0e21' // December
      }];

      var currentTime = new Date();
      var currentYear = currentTime.getFullYear();
      var currentMonth = currentTime.getMonth();

      function generateYears(current, selected) {
        var years = [];
        for (var i = current; i >= selected; i--) {
          years.push(i);
        }
        return years;
      }

      if (installment.id) { // update installment
        var selectedDate = new Date(installment.payFor);
        var selectedYear = selectedDate.getFullYear();
        var selectedMonth = selectedDate.getMonth();

        $scope.selectedMonth = $scope.months[selectedMonth];
        $scope.selectedYear = selectedYear;
        $scope.years = generateYears(currentYear, selectedYear);

      } else { // create new installment
        $scope.years = [currentYear];
        $scope.selectedMonth = $scope.months[currentMonth];
        $scope.selectedYear = currentYear;
      }

      $scope.installment = angular.copy(installment);
    }
  ]);


})();
