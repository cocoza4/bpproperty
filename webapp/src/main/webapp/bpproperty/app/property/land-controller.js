/*jshint -W069 */
(function() {

  'use strict';

  var LandListResolve = {
    Lands: ['LandService', function(LandService) {
      return LandService.query();
    }]
  };

  var LandDetailResolve = {
    Land: ['$route', 'LandService', function($route, LandService) {
      var criteria = {
        landId: $route.current.params['landId']
      };
      return LandService.query(criteria);
    }]
  };

  angular

    .module('land', ['ngRoute', 'ui.bootstrap', 'my-notification', 'land-service', 'land-buy-service'])

  .config(['$routeProvider', function($routeProvider) {

    $routeProvider

      .when('/lands', {

      templateUrl: 'property/land-list.tpl.html',
      controller: 'LandListCtrl',
      resolve: LandListResolve
    })

    .when('/lands/create', {
      templateUrl: 'property/land.tpl.html',
      controller: 'CreateLandCtrl'
    })

    .when('/lands/:landId', {
      templateUrl: 'property/land.tpl.html',
      controller: 'LandDetailCtrl',
      controllerAs: 'landDetailCtrl',
      resolve: LandDetailResolve
    });

  }])

  .controller('CreateLandCtrl', ['$scope', '$location', 'LandService', 'NotificationService',
    function($scope, $location, LandService, NotificationService) {

      var self = this;
      this.redirectToLandPage = function(id) {
        var url = '/lands/' + id;
        $location.path(url);
      };

      $scope.submit = function(isValid) {
        if (isValid) {
          LandService.create($scope.land).then(function(data) {

            NotificationService.notify({
              type: 'success',
              msg: 'Land created'
            });

            self.redirectToLandPage(data.id);

          }, function(error) {
            NotificationService.notify({
              type: 'error',
              msg: 'Unable to create Land'
            });
          });
        }
      };

      $scope.land = {};
    }
  ])

  .controller('LandListCtrl', ['$scope', '$location', 'LandService', 'Lands',
    function($scope, $location, LandService, Lands) {

      $scope.redirect = function(url) {
        $location.path(url);
      };

      $scope.onRecordsPerPageChanged = function() {
        $scope.currentPage = 1;
        $scope.updateLandTable();
      };

      $scope.updateLandTable = function() {

        var criteria = {
          page: $scope.currentPage - 1, // zero-based page index
          length: $scope.recordsPerPage
        };

        LandService.query(criteria).then(
          function(data) {
            self.updateScope(data);
          },
          function(error) {
            alert('Unable to query from table Land');
          }
        );
      };

      this.updateScope = function(data) {
        $scope.lands = data.content;
        $scope.totalRecords = data.totalRecords;
        if ($scope.totalRecords === 0) {
          $scope.startIndex = 0;
          $scope.endIndex = 0;
        } else {
          $scope.startIndex = (($scope.currentPage - 1) * $scope.recordsPerPage) + 1;
          $scope.endIndex = $scope.startIndex + data.totalDisplayRecords - 1;
        }
      };

      var self = this;
      $scope.recordsPerPageList = [10, 25, 50, 100];
      $scope.currentPage = 1;
      $scope.recordsPerPage = 10;

      this.updateScope(Lands);
    }
  ])

  .controller('ConfirmDeleteLandModalCtrl', ['$scope', '$location', '$modalInstance',
    'NotificationService', 'LandService', 'land', 'exists',
    function($scope, $location, $modalInstance, NotificationService, LandService, land, exists) {

      function redirectToLandListPage() {
        $location.path('/lands');
      }

      $scope.delete = function() {
        LandService.delete($scope.land).then(function(response) {
            NotificationService.notify({
              type: 'success',
              msg: 'Land deleted'
            });
            redirectToLandListPage();
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

      $scope.land = land;
      $scope.exists = exists;
    }
  ])

  .controller('LandDetailCtrl', ['$scope', '$uibModal', 'Land', 'LandService', 'LandBuyService', 'NotificationService',
    function($scope, $uibModal, Land, LandService, LandBuyService, NotificationService) {

      this.deleteModal = function() {
        $uibModal.open({
          animation: true,
          templateUrl: 'confirmDeleteModal.html',
          controller: 'ConfirmDeleteLandModalCtrl',
          resolve: {
            land: function() {
              return $scope.land;
            },
            exists: function() {
              return LandBuyService.exists($scope.land.id).then(function() {
                return true;
              }).catch(function(fallback) {
                return false;
              });
            }
          }
        });
      };

      $scope.submit = function(isValid) {
        if (isValid) {
          LandService.update($scope.land).then(function(data) {
            NotificationService.notify({
              type: 'success',
              msg: $scope.land.name + ' updated'
            });
          }, function(error) {
            NotificationService.notify({
              type: 'error',
              msg: 'Unable to update ' + $scope.land.name
            });
          });

        }
      };

      $scope.land = Land;
    }
  ]);

})();
