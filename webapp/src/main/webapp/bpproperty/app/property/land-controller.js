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

    .module('land', ['ngRoute', 'ui.bootstrap', 'ui.grid', 'ui.grid.selection',
    'ui.grid.pagination', 'my-notification', 'land-service', 'land-buy-service'])

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

      $scope.gridOptions = {
        enableSorting: true,
        enableGridMenu: true,
        enableColumnResizing: true,
        fastWatch: true,
        enableRowHeaderSelection: false,

        useExternalPagination: true,
        paginationPageSizes: [10, 25, 50, 100, 500],
        paginationPageSize: 10,

        columnDefs: [{
          field: 'name',
          displayName: '\u0e0a\u0e37\u0e48\u0e2d',
          headerCellClass: 'center',
          cellClass: 'right',
        }, {
          field: 'address',
          displayName: '\u0e17\u0e35\u0e48\u0e2d\u0e22\u0e39\u0e48',
          headerCellClass: 'center',
          cellClass: 'right'
        }, {
          field: 'area.rai',
          displayName: '\u0e44\u0e23\u0e48',
          headerCellClass: 'center',
          cellClass: 'right',
          cellFilter: 'unit',
          width: '7%',
        }, {
          field: 'area.yarn',
          displayName: '\u0e07\u0e32\u0e19',
          headerCellClass: 'center',
          cellClass: 'right',
          cellFilter: 'unit',
          width: '7%',
        }, {
          field: 'area.tarangwa',
          displayName: '\u0e15\u0e32\u0e23\u0e32\u0e07\u0e27\u0e32',
          headerCellClass: 'center',
          cellClass: 'right',
          cellFilter: 'unit',
          width: '7%',
        }, {
          field: 'createdTime',
          displayName: '\u0e27\u0e31\u0e19\u0e17\u0e35\u0e48\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01',
          cellFilter: 'date:"MMMM d, yyyy"',
          headerCellClass: 'center',
          cellClass: 'right'
        }, {
          name: '\u0e22\u0e2d\u0e14\u0e02\u0e32\u0e22',
          enableSorting: false,
          headerCellClass: 'center',
          cellClass: 'center',
          width: '9%',
          cellTemplate: '<span class="glyphicon glyphicon-list-alt pointer" ' +
            'ng-click="$event.stopPropagation(); grid.appScope.redirectToLandBuyDetailPage(row.entity)" ' +
            'style="color:#337ab7;vertical-align: middle"></span>'
        }, {
          name: '\u0e08\u0e31\u0e14\u0e2a\u0e23\u0e23',
          enableSorting: false,
          headerCellClass: 'center',
          cellClass: 'center',
          width: '9%',
          cellTemplate: '<span class="glyphicon glyphicon-shopping-cart pointer" ' +
            'ng-click="$event.stopPropagation(); grid.appScope.redirectToCreateLandBuyDetailPage(row.entity)" ' +
            'style="vertical-align: middle"></span>'
        }],

        onRegisterApi: function(gridApi) {
          $scope.gridApi = gridApi;

          gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
            self.criteria.page = newPage - 1; // zero-based page index
            self.criteria.length = pageSize;
            self.queryTable();
          });

          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            var land = row.entity;
            $location.path('/lands/' + land.id);
          });

        }
      };

      $scope.redirectToLandBuyDetailPage = function(entity) {
        $location.path('/lands/' + entity.id + '/buydetails');
      };

      $scope.redirectToCreateLandBuyDetailPage = function(entity) {
        $location.path('/lands/' + entity.id + '/buydetails/create');
      };

      this.queryTable = function() {
        LandService.query(self.criteria).then(
          function(data) {
            $scope.gridOptions.totalItems = data.totalRecords;
            $scope.gridOptions.data = data.content;
          },
          function(error) {
            alert('Unable to query from table Land');
          }
        );
      };

      this.criteria = {
        page: null,
        length: null
      };

      var self = this;
      $scope.gridOptions.data = Lands.content;
      $scope.gridOptions.totalItems = Lands.totalRecords;
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
