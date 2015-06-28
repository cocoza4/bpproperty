(function() {

  'use strict';

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
    BuyDetails: ['$q', '$route', 'LandService', 'LandBuyService', 'Customer',
      function($q, $route, LandService, LandBuyService, Customer) {

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
            return Customer.get({
              id: buyDetails.buyDetail.customerId
            }).$promise.then(function(response) {
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

      .when('/land/:landId/buyDetail/create', {
      templateUrl: 'property/land-buy-main.tpl.html',
      controller: 'CreateLandBuyDetailCtrl'
    })

    .when('/land/:landId/buyDetail/:buyDetailId', {
      templateUrl: 'property/land-buy-main.tpl.html',
      controller: 'LandBuyGeneralDetailsCtrl',
      resolve: LandBuyDetailResolve
    })

    .when('/land/:landId/buyDetail', {
      templateUrl: 'property/land-buy-list.tpl.html',
      controller: 'LandBuyDetailListCtrl',
      resolve: LandBuyDetailListResolve
    });

  }])

  .controller('LandBuyDetailsCtrl', ['$scope', '$route', 'LandBuyService', 'NotificationService',
    function($scope, $route, LandBuyService, NotificationService) {

      $scope.submit = function() {

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

      };

      var landBuyCriteria = {
        landId: $route.current.params['landId'],
        buyDetailId: $route.current.params['buyDetailId']
      };

      $scope.buyTypeItems = ['CASH', 'INSTALLMENT'];

      LandBuyService.query(landBuyCriteria).then(function(data) {
        $scope.buyDetail = data;
      });

    }
  ])

  .controller('LandBuyGeneralDetailsCtrl', ['$scope', 'BuyDetails',
    function($scope, BuyDetails) {
      $scope.buyDetail = BuyDetails.buyDetail;
      $scope.land = BuyDetails.land;
      $scope.customer = BuyDetails.customer;
    }
  ])

  .controller('CreateLandBuyDetailCtrl', ['$scope', '$routeParams', 'LandService',
    function($scope, $routeParams, LandService) {

      $scope.buyTypeItems = ['CASH', 'INSTALLMENT'];

      // $scope.submit = function() {
      //   $scope.buyDetail.$save({
      //     landId: $routeParams.landId
      //   });
      //   alert('saved')
      // };

      // $scope.buyDetail = new LandBuy({
      //   landId: $routeParams.landId
      // });
      // $scope.land = LandService.query({
      //   landId: $routeParams.landId
      // });

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
            console.log('[Query LandBuy] - length:' + data.content.length); // TODO: remove this - this is for debugging
          },
          function(error) {
            alert('Unable to query from table LandBuy');
          }
        );
      };

      $scope.redirect = function(buyDetailId) {
        $location.path('/land/' + $routeParams.landId + '/buyDetail/' + buyDetailId);
      };

      $scope.redirectToCreateLandBuyDetailPage = function() {
        $location.path('/land/' + $routeParams.landId + '/buyDetail/create');
      };

      this.updateScope = function(data) {
        $scope.land = data.land;
        $scope.landBuys = data.landBuyDetail.content;
        $scope.totalRecords = data.landBuyDetail.totalRecords;
        $scope.startIndex = (($scope.currentPage - 1) * $scope.recordsPerPage) + 1;
        $scope.endIndex = $scope.startIndex + data.landBuyDetail.totalDisplayRecords - 1;
      }

      var self = this;

      $scope.recordsPerPageList = [10, 25, 50, 100];
      $scope.currentPage = 1;
      $scope.recordsPerPage = 10;

      this.updateScope(BuyDetailList);

    }
  ]);

})();
