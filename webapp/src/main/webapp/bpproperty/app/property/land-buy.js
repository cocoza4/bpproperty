(function () {

    'use strict';

    var LandBuyDetailListResolve = {
      BuyDetailList: ['$route', 'LandBuyService', function($route, LandBuyService) {
        var criteria = {
          landId: $route.current.params['landId'],
        };
        return LandBuyService.query(criteria);
      }]
    };

    var LandBuyDetailResolve = {
        BuyDetails: function($q, $route, LandService, LandBuy, Customer) {

            var landBuyCriteria = {
                landId: $route.current.params['landId'],
                buyDetailId: $route.current.params['buyDetailId']
            };

            var buyDetail = LandBuy.get(landBuyCriteria);
            var land = LandService.query({landId: $route.current.params['landId']});

            var loadBuyDetail = function() {
                return $q.all([buyDetail.$promise, land.$promise])
                            .then(function(response) {

                                return {
                                    buyDetail: response[0],
                                    land: response[1]
                                };

                        });
            },loadCustomer = function(buyDetails) {
                return Customer.get({id: buyDetails.buyDetail.customerId}).$promise.then(function (response) {
                    return {
                        buyDetail: buyDetails.buyDetail,
                        land: buyDetails.land,
                        customer: response
                    }
                });
            };

            return loadBuyDetail().then(loadCustomer);
//            return $q.all({buyDetail: buyDetail.$promise, land: land.$promise, customer: customer.$promise});
        }
    };

    angular

        .module('land-buy', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {

             $routeProvider

                 .when('/land/:landId/buyDetail/create', {
                     templateUrl: 'property/land-buy-detail.tpl.html',
                     controller: 'createLandBuyDetailCtrl'
                 })

                 .when('/land/:landId/buyDetail/:buyDetailId', {
                     templateUrl: 'property/land-buy-detail.tpl.html',
                     controller: 'LandBuyDetailCtrl',
                     resolve: LandBuyDetailResolve
                 })

                 .when('/land/:landId/buyDetail', {
                     templateUrl: 'property/land-buy-list.tpl.html',
                     controller: 'LandBuyDetailListCtrl',
                     resolve: LandBuyDetailListResolve
                 });

         }])

        .controller('LandBuyDetailCtrl', ['$scope', '$routeParams', 'LandBuyService', 'Customer', 'BuyDetails', function ($scope, $routeParams, LandBuyService, Customer, BuyDetails) {

            $scope.buyTypeItems = ['CASH', 'INSTALLMENT'];

            // $scope.buyTypeItems = ['สด', 'ผ่อน'];

            $scope.submit = function () {
                LandBuyService.update($scope.buyDetail).then(function(data) {
                  $scope.notification = {
                    type: 'success',
                    header: 'Success',
                    message: 'BuyDetail has been updated',
                    display: false
                  };
                  $scope.notification.display = true;

                }, function(error) {
                  console.log(error);
                  $scope.notification = {
                    type: 'danger',
                    header: 'Error',
                    message: 'Unable to update BuyDetail',
                    display: false
                  };
                  $scope.notification.display = true;
                });

            };

            // if (BuyDetails.buyDetail.buyType == 'INSTALLMENT') {
            //   BuyDetails.buyDetail.buyType = 'ผ่อน';
            //   alert(BuyDetails.buyDetail.buyType);
            // } else {
            //   BuyDetails.buyDetail.buyType = 'สด';
            // }
            $scope.buyDetail = BuyDetails.buyDetail;
            $scope.land = BuyDetails.land;
            $scope.customer = BuyDetails.customer;

        }])

        .controller('createLandBuyDetailCtrl', ['$scope', '$routeParams', 'LandBuy', 'Land', 'Customer',
                                                    function ($scope, $routeParams, LandBuy, Land, Customer) {

            $scope.buyTypeItems = ['CASH', 'INSTALLMENT'];

            $scope.submit = function () {
                $scope.buyDetail.$save({
                    landId: $routeParams.landId
                });
                alert('saved')
            };

            $scope.buyDetail = new LandBuy({landId: $routeParams.landId});
            $scope.land = Land.get({landId: $routeParams.landId});

        }])

        .controller('LandBuyDetailListCtrl', ['$scope', '$location', '$routeParams', 'BuyDetailList', 'LandBuyService',
                                              function ($scope, $location, $routeParams, BuyDetailList, LandBuyService) {

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
                    function (data) {
                        self.updateScope($scope, data);
                        console.log('[Query LandBuy] - length:' + data.content.length); // TODO: remove this - this is for debugging
                    },
                    function (error) {
                        alert('Unable to query from table LandBuy');
                    }
                );
            };

            $scope.redirect = function (buyDetailId) {
                $location.path('/land/' + $routeParams.landId + '/buyDetail/' + buyDetailId);
            };

            $scope.redirectToCreateLandBuyDetailPage = function () {
                $location.path('/land/' + $routeParams.landId + '/buyDetail/create');
            };

            this.updateScope = function(scope, data) {
                $scope.landBuys = data.content;
                $scope.totalRecords = data.totalRecords;
                $scope.startIndex = (($scope.currentPage - 1) * $scope.recordsPerPage) + 1;
                $scope.endIndex = $scope.startIndex + data.totalDisplayRecords - 1;
            }

            var self = this;

            $scope.recordsPerPageList = [10, 25, 50, 100];
            $scope.currentPage = 1;
            $scope.recordsPerPage = 10;

            this.updateScope($scope, BuyDetailList);

        }]).controller('InstallmentListCtrl', ['$scope', '$route', 'LandBuyService', 'InstallmentService',
                                                    function ($scope, $route, LandBuyService, InstallmentService) {

            var self = this;

            var installmentDialog = $('#installmentDialog').on('hidden.bs.modal', function (e) {
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
                  }, function(error) {
                    alert('Unable to add new Installment');
                    $scope.installment = {}; // reset data
                  });
                } else {
                  InstallmentService.update(installmentCriteria, $scope.installment, selectedMonth, selectedYear).then(function(data) {
                    installmentDialog.modal('hide'); // hide dialog
                    self.loadInstallments();
                    $scope.installment = {}; // reset data
                  }, function(error) {
                    alert('Unable to update existing Installment');
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
              
              $scope.installment = installment;

              installmentDialog.modal();
            };

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

            var months = [{key: 0, value: 'มกราคม'}, {key: 1, value: 'กุมภาพันธ์'}, {key: 2, value: 'มีนาคม'}, {key: 3, value: 'เมษายน'},
                          {key: 4, value: 'พฤษภาคม'}, {key: 5, value: 'มิถุนายน'}, {key: 6, value: 'กรกฎาคม'}, {key: 7, value: 'สิงหาคม'},
                          {key: 8, value: 'กันยายน'}, {key: 9, value: 'ตุลาคม'}, {key: 10, value: 'พฤศจิกายน'}, {key: 11, value: 'ธันวาคม'}];

            var years = [currentYear - 7,currentYear - 6,currentYear - 5, currentYear - 4,
                        currentYear - 3, currentYear - 2, currentYear - 1, currentYear];

            this.loadInstallments();


            $scope.installment = {};
            $scope.months = months;
            $scope.years = years;
            $scope.selectedMonth = months[currentMonth];
            $scope.selectedYear = currentYear;

        }]);

})();
