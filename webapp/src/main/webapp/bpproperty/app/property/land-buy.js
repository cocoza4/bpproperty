(function() {

  'use strict';

  var LandResolve = {
    Land: function($route, LandService) {
      var criteria = {
        landId: $route.current.params['landId']
      };
      return LandService.query(criteria);
    }
  }

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
        }
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
              }
            });
          };
        return loadBuyDetail().then(loadCustomer);
      }
    ]
  };

  angular

    .module('land-buy', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {

    $routeProvider

      .when('/lands/:landId/buydetails/create', {
      templateUrl: 'property/land-buy-main.tpl.html',
      controller: 'CreateLandBuyDetailCtrl',
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

  .controller('LandBuyDetailsCtrl', ['$scope', '$location', '$route', 'LandBuyService', 'NotificationService',
    function($scope, $location, $route, LandBuyService, NotificationService) {



      $scope.saveLandBuyDetail = function(isValid) {

        if (isValid) {

          var isNew = $scope.buyDetail.id == null;

          if (isNew) {
            $scope.buyDetail.customerId = $scope.customer.id;
            LandBuyService.create($scope.buyDetail).then(function(data) {
              NotificationService.notify({
                type: 'success',
                msg: 'BuyDetail created'
              });
              $scope.buyDetail = data;

              // reload the page
              var url = '/lands/' + $route.current.params['landId'] + '/buydetails/' + $scope.buyDetail.id;
              $location.path(url);

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

  .controller('CreateLandBuyDetailCtrl', ['$scope', '$routeParams', 'CustomerService', 'Land',
    function($scope, $routeParams, CustomerService, Land) {

      var buyerDialog = $('#selectBuyerDialog').on('hidden.bs.modal', function(e) {
        $scope.selectedCustomer = {};
      }).on('show.bs.modal', function(e) {
        self.loadCustomers();
      });

      this.loadCustomers = function() {
        var criteria = {
          page: $scope.currentPage - 1, // zero-based page index
          length: recordsPerPage
        };
        CustomerService.query(criteria).then(function(data) {
          $scope.customers = data.content;
          $scope.totalRecords = data.totalRecords;
          $scope.startIndex = (($scope.currentPage - 1) * recordsPerPage) + 1;
          $scope.endIndex = $scope.startIndex + data.totalDisplayRecords - 1;
        });
      };

      $scope.onNextPageChanged = function() {
        if ($scope.customers.length < 10) return;
        $scope.currentPage = $scope.currentPage + 1;
        self.loadCustomers();
        $scope.selectedCustomer = {};
      };

      $scope.onPreviousPageChanged = function() {
        if ($scope.currentPage === 1) return;
        $scope.currentPage = $scope.currentPage - 1;
        self.loadCustomers();
        $scope.selectedCustomer = {};
      };

      $scope.selectBuyer = function(customer) {
        $scope.selectedCustomer = customer;
      };

      $scope.updateOnScreen = function() {
        buyerDialog.modal('hide'); // hide dialog
        $scope.customer = $scope.selectedCustomer;
      }

      var self = this;
      var recordsPerPage = 10;

      $scope.currentPage = 1;
      $scope.selectedCustomer = {};

      $scope.land = Land;

    }
  ])

  .controller('LandBuyDetailListCtrl', ['$scope', '$location', '$routeParams', 'BuyDetailList', 'LandBuyService',
    function($scope, $location, $routeParams, BuyDetailList, LandBuyService) {

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
        if (data.landBuyDetail) {
          $scope.landBuys = data.landBuyDetail.content;
          $scope.totalRecords = data.landBuyDetail.totalRecords;
          if ($scope.totalRecords == 0) {
            $scope.startIndex = 0;
            $scope.endIndex = 0;
          } else {
            $scope.startIndex = (($scope.currentPage - 1) * $scope.recordsPerPage) + 1;
            $scope.endIndex = $scope.startIndex + data.landBuyDetail.totalDisplayRecords - 1;
          }
        }

      }

      var self = this;

      $scope.recordsPerPageList = [10, 25, 50, 100];
      $scope.currentPage = 1;
      $scope.recordsPerPage = 10;

      $scope.land = BuyDetailList.land;
      this.updateScope(BuyDetailList);

    }
  ]);

})();
