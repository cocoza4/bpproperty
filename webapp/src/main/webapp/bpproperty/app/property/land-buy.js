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

  .controller('LandBuyDetailsCtrl', ['$scope', '$location', '$route', 'LandBuyService', 'NotificationService',
    function($scope, $location, $route, LandBuyService, NotificationService) {

      $scope.saveLandBuyDetail = function(isValid) {

        if (isValid) {

          var isNew = $scope.buyDetail.id == null;

          if (isNew) {
            $scope.buyDetail.customerId = 7; // TODO: fix this hard coded customerId
            LandBuyService.create($scope.buyDetail).then(function(data) {
              NotificationService.notify({
                type: 'success',
                msg: 'BuyDetail created'
              });
              $scope.buyDetail = data;

              // reload the page
              var url = '/land/' + $route.current.params['landId'] + '/buyDetail/' + $scope.buyDetail.id;
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

  .controller('CreateLandBuyDetailCtrl', ['$scope', '$routeParams', 'LandService',
    function($scope, $routeParams, LandService) {

      //TODO: unneccessary request is sent, fix it

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

      var landCriteria = {
        landId: $routeParams.landId
      };

      LandService.query(landCriteria).then(function(data) {
        $scope.land = data;
      });

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
