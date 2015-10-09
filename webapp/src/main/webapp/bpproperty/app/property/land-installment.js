(function() {

  'use strict';

  angular

    .module('land-installment', ['ngRoute', 'my-notification', 'land-installment-service'])

  .controller('InstallmentListCtrl', ['$scope', '$route', 'LandBuyService', 'InstallmentService', 'NotificationService',
    function($scope, $route, LandBuyService, InstallmentService, NotificationService) {

      var self = this;

      var installmentDialog = $('#installmentDialog').on('hidden.bs.modal', function(e) {
        $scope.installment = {};
      });

      var confirmDeleteDialog = $('#confirmDeleteDialog').on('hidden.bs.modal', function(e) {
        $scope.installment = {};
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

        $scope.selectedMonth = months[selectedMonth];
        $scope.selectedYear = selectedYear;

        $scope.installment = angular.copy(installment);

        installmentDialog.modal();
      };

      $scope.confirmDeleteDialog = function(installment) {
        $scope.installment = installment;
        confirmDeleteDialog.modal();
      }

      $scope.deleteInstallment = function() {
        var deleteCriteria = {
          landId: $route.current.params['landId'],
          buyDetailId: $route.current.params['buyDetailId'],
          installmentId: $scope.installment.id
        };
        InstallmentService.delete(deleteCriteria).then(function(response) {
            NotificationService.notify({
              type: 'success',
              msg: 'Installment deleted'
            });
            self.loadInstallments();
          },
          function(error) {
            NotificationService.notify({
              type: 'error',
              msg: 'Unable to delete existing Installment'
            });
          });

        confirmDeleteDialog.modal('hide'); // hide dialog
      }

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

      var months = [{
        key: 0,
        value: 'มกราคม'
      }, {
        key: 1,
        value: 'กุมภาพันธ์'
      }, {
        key: 2,
        value: 'มีนาคม'
      }, {
        key: 3,
        value: 'เมษายน'
      }, {
        key: 4,
        value: 'พฤษภาคม'
      }, {
        key: 5,
        value: 'มิถุนายน'
      }, {
        key: 6,
        value: 'กรกฎาคม'
      }, {
        key: 7,
        value: 'สิงหาคม'
      }, {
        key: 8,
        value: 'กันยายน'
      }, {
        key: 9,
        value: 'ตุลาคม'
      }, {
        key: 10,
        value: 'พฤศจิกายน'
      }, {
        key: 11,
        value: 'ธันวาคม'
      }];

      var years = [currentYear - 3, currentYear - 2, currentYear - 1, currentYear];

      this.loadInstallments();

      $scope.installment = {};
      $scope.months = months;
      $scope.years = years;
      $scope.selectedMonth = months[currentMonth];
      $scope.selectedYear = currentYear;

    }
  ]);


})();
