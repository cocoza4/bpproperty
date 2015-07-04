(function() {

  'use strict';

  var LandListResolve = {
    Lands: function(LandService) {
      var criteria = {
        page: 0, // zero-based page index
        length: 10
      };
      return LandService.query(criteria);
    }
  };

  var LandDetailResolve = {
    Land: function($route, LandService) {
      var criteria = {
        landId: $route.current.params['landId']
      };
      return LandService.query(criteria);
    }
  }

  angular

    .module('land', ['ngRoute'])

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
      resolve: LandDetailResolve
    })

    .otherwise({
      redirectTo: '/lands'
    });

  }])

  .controller('CreateLandCtrl', ['$scope', 'LandService', 'NotificationService',
    function($scope, LandService, NotificationService) {

      $scope.submit = function(isValid) {
        if (isValid) {
          LandService.create($scope.land).then(function(data) {

            NotificationService.notify({
              type: 'success',
              msg: 'Land created'
            });

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

      LandService.query(criteria).then(
        function(data) {
          self.updateScope(data);
          console.log('[Query Land] - length:' + data.content.length);
        },
        function(error) {
          alert('Unable to query from table Land');
        }
      );
    };

    var self = this;

    this.updateScope = function(data) {
      $scope.lands = data.content;
      $scope.totalRecords = data.totalRecords;
      $scope.startIndex = (($scope.currentPage - 1) * $scope.recordsPerPage) + 1;
      $scope.endIndex = $scope.startIndex + data.totalDisplayRecords - 1;
    }

    $scope.recordsPerPageList = [10, 25, 50, 100];
    $scope.currentPage = 1;
    $scope.recordsPerPage = 10;

    this.updateScope(Lands);
  }])

  .controller('LandDetailCtrl', ['$scope', '$routeParams', 'Land', 'LandService', 'NotificationService',
    function($scope, $routeParams, Land, LandService, NotificationService) {

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
