(function() {

  'use strict';

  angular

    .module('land-installment', ['ngRoute', 'ui.bootstrap', 'my-notification', 'land-installment-service'])

  .controller('ConfirmDeleteModalCtrl', ['$rootScope', '$scope', '$route', '$modalInstance',
    'InstallmentService', 'NotificationService', 'installment',
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

  .controller('InstallmentListCtrl', ['$scope', '$route', '$uibModal', 'LandBuyService', 'InstallmentService', 'NotificationService',
    function($scope, $route, $uibModal, LandBuyService, InstallmentService, NotificationService) {

      this.confirmDeleteModal = function(selected) {

        $scope.modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'myModalContent.html',
          controller: 'ConfirmDeleteModalCtrl',
          resolve: {
            installment: function() {
              return selected;
            }
          }
        });
      };

      var installmentDialog = $('#installmentDialog').on('hidden.bs.modal', function(e) {
        $scope.installment = {};
      });

      $scope.$on('loadInstallments', function() {
        self.loadInstallments();
      });

      $scope.saveInstallment = function(isValid) {

        if (isValid) {

          $scope.installment.buyDetailId = $route.current.params['buyDetailId'];

          var selectedMonth = $scope.selectedMonth.key;
          var selectedYear = $scope.selectedYear;

          var isNew = $scope.installment.createdTime == null;

          if (isNew) {
            InstallmentService.create(installmentCriteria, $scope.installment, selectedMonth, selectedYear).then(function(data) {
              installmentDialog.modal('hide'); // hide dialog
              self.loadInstallments();
              $scope.installment = {}; // reset data
              NotificationService.notify({
                type: 'success',
                msg: 'Installment created'
              });
            }, function(error) {
              NotificationService.notify({
                type: 'error',
                msg: 'Unable to create Installment'
              });
              $scope.installment = {}; // reset data
            });
          } else {
            InstallmentService.update(installmentCriteria, $scope.installment, selectedMonth, selectedYear).then(function(data) {
              installmentDialog.modal('hide'); // hide dialog
              self.loadInstallments();
              $scope.installment = {}; // reset data
              NotificationService.notify({
                type: 'success',
                msg: 'Installment updated'
              });
            }, function(error) {
              NotificationService.notify({
                type: 'error',
                msg: 'Unable to update existing Installment'
              });
              $scope.installment = {}; // reset data
            });
          }

        }
      };

      $scope.viewInstallment = function(installment) {

        var selectedDate = new Date(installment.payFor);
        var selectedYear = selectedDate.getFullYear();
        var selectedMonth = selectedDate.getMonth();

        $scope.selectedMonth = $scope.months[selectedMonth];
        $scope.selectedYear = selectedYear;

        $scope.installment = angular.copy(installment);

        installmentDialog.modal();
      };

      var self = this;
      var installmentCriteria = {
        landId: $route.current.params['landId'],
        buyDetailId: $route.current.params['buyDetailId'],
      };

      var landBuyCriteria = {
        landId: $route.current.params['landId'],
        buyDetailId: $route.current.params['buyDetailId']
      };

      this.loadInstallments = function() {
        InstallmentService.query(installmentCriteria).then(function(data) {
          $scope.installments = data;
          return LandBuyService.query(landBuyCriteria);
        }).then(function(data) {
          $scope.landBuy = data;
          $scope.totalAmount = InstallmentService.getTotalPayment($scope.installments);
          $scope.remaining = data.buyPrice - data.downPayment - $scope.totalAmount;
        });
      };

      var currentTime = new Date();
      var currentYear = currentTime.getFullYear();
      var currentMonth = currentTime.getMonth();

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

      this.loadInstallments();

      $scope.installment = {};
      $scope.years = [currentYear - 3, currentYear - 2, currentYear - 1, currentYear];
      $scope.selectedMonth = $scope.months[currentMonth];
      $scope.selectedYear = currentYear;

    }
  ]);


})();
