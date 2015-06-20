(function() {

  'use strict';

  var LandListResolve = {
    Lands: function(LandService) {
      var criteria = {
        page: 0, // zero-based page index
        length: 10
      };
      return LandService.query(criteria).$promise;
    }
  };

  var LandDetailResolve = {
    Land: function($route, LandService) {
      return LandService.query({
        landId: $route.current.params['landId']
      }).$promise;
    }
  }

  angular

    .module('land', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {

    $routeProvider

      .when('/land', {

      templateUrl: 'property/land-list.tpl.html',
      controller: 'LandListCtrl',
      resolve: LandListResolve
    })

    .when('/land/create', {
      templateUrl: 'property/land.tpl.html',
      controller: 'createLandCtrl'
    })

    .when('/land/:landId', {
      templateUrl: 'property/land.tpl.html',
      controller: 'LandDetailCtrl',
      resolve: LandDetailResolve
    })

    .otherwise({
      redirectTo: '/land'
    });

  }])

  .controller('createLandCtrl', ['$scope', 'LandService', function($scope, LandService) {

    $scope.submit = function(isValid) {
      if (isValid) {
        LandService.create($scope.land).then(function(data) {
          $scope.notification = {
            type: 'success',
            header: 'Success',
            message: $scope.land.name + ' has been created',
            display: false
          };
          $scope.notification.display = true;
        }, function(error) {
          $scope.notification = {
            type: 'danger',
            header: 'Error',
            message: 'Unable to create new Land',
            display: false
          };
          $scope.notification.display = true;
        });
      }
    };

    $scope.land = {};

  }])

  .controller('LandListCtrl', ['$scope', '$location', 'LandService', 'Lands', function($scope, $location, LandService, Lands) {

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

      LandService.query(criteria).$promise.then(
        function(data) {
          self.updateScope($scope, data);
          console.log('[Query Land] - length:' + data.content.length);
        },
        function(error) {
          alert('Unable to query from table Land');
        }
      );
    };

    var self = this;

    this.updateScope = function(scope, data) {
      $scope.lands = data.content;
      $scope.totalRecords = data.totalRecords;
      $scope.startIndex = (($scope.currentPage - 1) * $scope.recordsPerPage) + 1;
      $scope.endIndex = $scope.startIndex + data.totalDisplayRecords - 1;
    }

    $scope.recordsPerPageList = [10, 25, 50, 100];
    $scope.currentPage = 1;
    $scope.recordsPerPage = 10;

    this.updateScope($scope, Lands);
  }])

  .controller('LandDetailCtrl', ['$scope', '$routeParams', 'Land', 'LandService', function($scope, $routeParams, Land, LandService) {

    $scope.submit = function(isValid) {
      if (isValid) {
        LandService.update($scope.land).then(function(data) {
          $scope.notification = {
            type: 'success',
            header: 'Success',
            message: Land.name + ' has been updated',
            display: false
          };
          $scope.notification.display = true;
        }, function(error) {
          $scope.notification = {
            type: 'danger',
            header: 'Error',
            message: 'Unable to update Land',
            display: false
          };
          $scope.notification.display = true;
        });

      }
    };

    $scope.land = Land;

  }]);

})();
