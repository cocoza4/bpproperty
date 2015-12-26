/*jshint -W069 */
(function() {

  'use strict';

  angular

    .module('land-payment', ['ngRoute', 'ui.bootstrap', 'ui.grid', 'ui.grid.selection',
    'ui.grid.pagination', 'my-notification', 'land-buy', 'land-payment-service'
  ])

  .controller('ConfirmDeleteModalCtrl', ['$rootScope', '$scope', '$route', '$modalInstance', 'PaymentService',
    'NotificationService', 'payment',
    function($rootScope, $scope, $route, $modalInstance, PaymentService, NotificationService, payment) {

      $scope.delete = function() {
        var criteria = {
          landId: $route.current.params['landId'],
          buyDetailId: $route.current.params['buyDetailId'],
          paymentId: $scope.payment.id
        };

        PaymentService.delete(criteria).then(function(response) {
            NotificationService.notify({
              type: 'success',
              msg: 'Payment deleted'
            });

            // emit to load installments
            $rootScope.$broadcast('loadLandBuyDetailBO');
            $rootScope.$broadcast('loadPayments');
          },
          function(error) {
            NotificationService.notify({
              type: 'error',
              msg: 'Unable to delete the selected Payment'
            });
          });

        $modalInstance.dismiss('cancel');
      };

      $scope.closeModal = function() {
        $modalInstance.dismiss('cancel');
      };

      $scope.payment = payment;
    }
  ])

  .controller('PaymentListCtrl', ['$scope', '$route', '$uibModal', 'uiGridConstants',
    'PaymentService', '$cacheFactory',
    function($scope, $route, $uibModal, uiGridConstants, PaymentService, $cacheFactory) {

      $scope.gridOptions = {
        enableSorting: true,
        showColumnFooter: true,
        enableGridMenu: true,
        enableColumnResizing: true,
        fastWatch: true,

        useExternalPagination: true,
        paginationPageSizes: [10, 25, 50, 100, 500],
        paginationPageSize: 10,

        columnDefs: [{
          name: 'print',
          headerCellTemplate: '<span class=""></span>',
          headerCellClass: 'center',
          cellClass: 'center',
          width: '3%',
          cellTemplate: '<span class="glyphicon glyphicon-print pointer" ' +
            'ng-click="grid.appScope.print(row.entity)" ' +
            'style="color:#999933;vertical-align: middle"></span>'
        }, {
          field: 'id', // receipt id
          displayName: '\u0e43\u0e1a\u0e40\u0e2a\u0e23\u0e47\u0e08 \u0023',
          headerCellClass: 'center',
          cellClass: 'right',
          width: '10%',
          footerCellClass: 'right',
          footerCellTemplate: '<div class="ui-grid-cell-contents">Total</div>'
        }, {
          field: 'payFor',
          displayName: '\u0e1b\u0e23\u0e30\u0e08\u0e33\u0e40\u0e14\u0e37\u0e2d\u0e19',
          cellFilter: 'date: "MMMM yyyy"',
          headerCellClass: 'center',
          cellClass: 'right',
          footerCellClass: 'right',
          footerCellTemplate: '<div class="ui-grid-cell-contents">Total</div>'
        }, {
          field: 'amount',
          displayName: '\u0e08\u0e33\u0e19\u0e27\u0e19',
          cellFilter: 'number',
          headerCellClass: 'center',
          cellClass: 'right',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          aggregationHideLabel: true,
          footerCellClass: 'right',
          footerCellFilter: 'number'
        }, {
          field: 'createdTime',
          displayName: '\u0e27\u0e31\u0e19\u0e17\u0e35\u0e48\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01',
          cellFilter: 'date:"MMMM d, yyyy \' \u0e40\u0e27\u0e25\u0e32 \' h:mm a"',
          headerCellClass: 'center',
          cellClass: 'right'
        }, {
          name: '\u0e41\u0e01\u0e49\u0e44\u0e02',
          headerCellClass: 'center',
          cellClass: 'center',
          width: '5%',
          cellTemplate: '<span class="glyphicon glyphicon-edit pointer" ' +
            'ng-click="grid.appScope.savePaymentModal(row.entity)" ' +
            'style="color:#337ab7;vertical-align: middle"></span>'

        }, {
          name: '\u0e25\u0e1a',
          headerCellClass: 'center',
          cellClass: 'center',
          width: '5%',
          cellTemplate: '<span class="glyphicon glyphicon-remove pointer" ' +
            'ng-click="grid.appScope.confirmDeleteModal(row.entity)" ' +
            'style="color:#d9534f;vertical-align: middle"></span>'
        }],

        onRegisterApi: function(gridApi) {
          $scope.gridApi = gridApi;

          gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
            self.paymentCriteria.page = newPage - 1;
            self.payment.length = pageSize;
            self.loadPayments();
          });

        }
      };

      $scope.print = function(selected) {
        alert('fuck');
      };

      $scope.savePaymentModal = function(selected) {

        if ($scope.landBuy.buyType == 'INSTALLMENT') {
          $uibModal.open({
            animation: true,
            templateUrl: 'saveInstallmentModal.html',
            controller: 'SaveInstallmentModalCtrl',
            resolve: {
              payment: function() {
                return selected;
              }
            }
          });
        } else {
          $uibModal.open({
            animation: true,
            templateUrl: 'savePaymentModal.html',
            controller: 'SavePaymentModalCtrl',
            resolve: {
              payment: function() {
                return selected;
              }
            }
          });
        }

      };

      $scope.confirmDeleteModal = function(selected) {
        $uibModal.open({
          animation: true,
          templateUrl: 'confirmDeleteModal.html',
          controller: 'ConfirmDeleteModalCtrl',
          resolve: {
            payment: function() {
              return selected;
            }
          }
        });
      };

      this.loadPayments = function() {
        PaymentService.query(self.paymentCriteria).then(function(data) {
          $scope.gridOptions.data = data.content;
          $scope.gridOptions.totalItems = data.totalRecords;
        });
      };

      this.paymentCriteria = {
        landId: $route.current.params.landId,
        buyDetailId: $route.current.params.buyDetailId,
        page: 0,
        length: 10
      };

      $scope.$on('loadPayments', function(event) {
        self.loadPayments();
      });

      var self = this;
      this.loadPayments();

      $scope.landBuy = $cacheFactory.get('land-cache').get('buyDetail');

      if ($scope.landBuy.buyType == 'CASH') { // TODO: write test for this
        $scope.gridOptions.columnDefs[2].visible = false; // disable payFor field
      }

    }
  ])

  .controller('SavePaymentModalCtrl', ['$rootScope', '$scope', '$route', '$modalInstance',
    'PaymentService', 'NotificationService', 'payment',
    function($rootScope, $scope, $route, $modalInstance, PaymentService, NotificationService, payment) {

      $scope.closeModal = function() {
        $modalInstance.dismiss('cancel');
      };

      $scope.savePayment = function(isValid) {

        if (isValid) {
          $scope.payment.buyDetailId = $route.current.params['buyDetailId'];
          var paymentCriteria = {
            landId: $route.current.params['landId'],
            buyDetailId: $route.current.params['buyDetailId'],
          };

          var isNew = !$scope.payment.id;
          if (isNew) {
            PaymentService.create(paymentCriteria, $scope.payment).then(function(data) {

              $modalInstance.dismiss('cancel'); // hide dialog

              NotificationService.notify({
                type: 'success',
                msg: 'Payment created'
              });

              // emit to load payments
              $rootScope.$broadcast('loadLandBuyDetailBO');
              $rootScope.$broadcast('loadPayments');

            }, function(error) {
              NotificationService.notify({
                type: 'error',
                msg: 'Unable to create Payment'
              });
            });
          } else {
            PaymentService.update(paymentCriteria, $scope.payment).then(function(data) {
              $modalInstance.dismiss('cancel'); // hide dialog

              NotificationService.notify({
                type: 'success',
                msg: 'Payment updated'
              });

              // emit to load payments
              $rootScope.$broadcast('loadLandBuyDetailBO');
              $rootScope.$broadcast('loadPayments');

            }, function(error) {
              NotificationService.notify({
                type: 'error',
                msg: 'Unable to update existing Payment'
              });
            });
          }

        }
      };

      $scope.payment = angular.copy(payment);

    }
  ])

  .controller('SaveInstallmentModalCtrl', ['$rootScope', '$scope', '$route', '$modalInstance',
    'PaymentService', 'NotificationService', 'payment',
    function($rootScope, $scope, $route, $modalInstance, PaymentService, NotificationService, payment) {

      $scope.closeModal = function() {
        $modalInstance.dismiss('cancel');
      };

      $scope.savePayment = function(isValid) {
        if (isValid) {

          $scope.payment.buyDetailId = $route.current.params['buyDetailId'];

          var paymentCriteria = {
            landId: $route.current.params['landId'],
            buyDetailId: $route.current.params['buyDetailId'],
          };
          var selectedMonth = $scope.selectedMonth.key;
          var selectedYear = $scope.selectedYear;

          var isNew = !$scope.payment.id;

          if (isNew) {
            PaymentService.create(paymentCriteria, $scope.payment, selectedMonth, selectedYear).then(function(data) {

              $modalInstance.dismiss('cancel'); // hide dialog

              NotificationService.notify({
                type: 'success',
                msg: 'Payment created'
              });

              // emit to load payments
              $rootScope.$broadcast('loadLandBuyDetailBO');
              $rootScope.$broadcast('loadPayments');

            }, function(error) {
              NotificationService.notify({
                type: 'error',
                msg: 'Unable to create Payment'
              });
            });
          } else {
            PaymentService.update(paymentCriteria, $scope.payment, selectedMonth, selectedYear).then(function(data) {
              $modalInstance.dismiss('cancel'); // hide dialog

              NotificationService.notify({
                type: 'success',
                msg: 'Payment updated'
              });

              // emit to load payments
              $rootScope.$broadcast('loadLandBuyDetailBO');
              $rootScope.$broadcast('loadPayments');

            }, function(error) {
              NotificationService.notify({
                type: 'error',
                msg: 'Unable to update existing Payment'
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

      if (payment.id) { // update payment
        var selectedDate = new Date(payment.payFor);
        var selectedYear = selectedDate.getFullYear();
        var selectedMonth = selectedDate.getMonth();

        $scope.selectedMonth = $scope.months[selectedMonth];
        $scope.selectedYear = selectedYear;
        $scope.years = generateYears(currentYear, selectedYear);

      } else { // create new payment
        $scope.years = [currentYear];
        $scope.selectedMonth = $scope.months[currentMonth];
        $scope.selectedYear = currentYear;
      }

      $scope.payment = angular.copy(payment);
    }
  ]);

})();
