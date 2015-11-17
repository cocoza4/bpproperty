describe('land-buy', function() {

  beforeEach(module('land-buy'));

  beforeEach(inject(function($injector, _$controller_) {
    $location = $injector.get('$location');
    $rootScope = $injector.get('$rootScope');
    $routeParams = $injector.get('$routeParams');
    $routeParams.landId = 1;
    $scope = $rootScope.$new();
    $controller = _$controller_;
    $q = $injector.get('$q');
    NotificationService = $injector.get('NotificationService');
    LandBuyService = $injector.get('LandBuyService');
    CustomerService = $injector.get('CustomerService');

    mockLand = {
      "id": 1,
      "createdBy": 0,
      "createdTime": 0,
      "updatedBy": null,
      "updatedTime": null,
      "name": "Por Permpol",
      "address": "address1",
      "description": "description",
      "area": {
        "rai": 100,
        "yarn": 5,
        "tarangwa": 10
      }
    };

    mockBuyDetailObjTable = {
      "totalRecords": 100,
      "totalDisplayRecords": 10,
      "content": [{
        "id": 1,
        "landId": 1,
        "buyType": "INSTALLMENT",
        "buyerFirstName": "firstname1",
        "buyerLastName": "lastname1",
        "downPayment": 50000,
        "buyPrice": 250000,
        "annualInterest": 8,
        "totalInstallment": 0,
        "yearsOfInstallment": 5,
        "description": null,
        "area": {
          "rai": 10,
          "yarn": 5,
          "tarangwa": 10
        },
        "createdTime": 1446183913864
      }, {
        "id": 2,
        "landId": 1,
        "buyType": "CASH",
        "buyerFirstName": "firstname2",
        "buyerLastName": "lastname2",
        "downPayment": null,
        "buyPrice": 10.8,
        "annualInterest": null,
        "yearsOfInstallment": null,
        "description": null,
        "area": {
          "rai": 5,
          "yarn": 5,
          "tarangwa": 10
        },
        "createdTime": 1446183913864
      }]
    };

    mockLandBuyDetail = {
      "id": 1,
      "landId": 1,
      "buyType": "INSTALLMENT",
      "buyerFirstName": "firstname1",
      "buyerLastName": "lastname1",
      "downPayment": 100.55,
      "buyPrice": 1000.1,
      "annualInterest": 15.0,
      "yearsOfInstallment": 5,
      "description": null,
      "area": {
        "rai": 10,
        "yarn": 5,
        "tarangwa": 10
      },
      "createdTime": 1446183913864
    };

    mockBuyDetailList = {
      land: mockLand,
      landBuyDetail: mockBuyDetailObjTable
    };

  }));

  describe('SelectBuyerModalCtrl', function() {

    beforeEach(inject(function($injector) {
      $modalInstance = jasmine.createSpyObj('$modalInstance', ['close', 'dismiss']);

      mockCustomerObjTable = {
        "totalRecords": 31,
        "totalDisplayRecords": 10,
        "content": [{
          "id": 1,
          "createdBy": 0,
          "createdTime": 0,
          "updatedBy": null,
          "updatedTime": null,
          "firstName": "firstname1",
          "lastName": "lastname1",
          "address": "address1",
          "tel": "074-360999"
        }, {
          "id": 2,
          "createdBy": 0,
          "createdTime": 0,
          "updatedBy": null,
          "updatedTime": null,
          "firstName": "firstname2",
          "lastName": "lastname2",
          "address": "address2",
          "tel": "074-360999"
        }, {
          "id": 3,
          "createdBy": 0,
          "createdTime": 0,
          "updatedBy": null,
          "updatedTime": null,
          "firstName": "firstname3",
          "lastName": "lastname3",
          "address": "address3",
          "tel": "074-360999"
        }]
      };

      SelectBuyerModalCtrl = $controller('SelectBuyerModalCtrl', {
        $scope: $scope,
        $modalInstance: $modalInstance,
        CustomerService: CustomerService,
        dataTableObject: mockCustomerObjTable,
      });

    }));

    it('init', function() {
      expect($scope.gridOptions.columnDefs[4].visible).toBeFalsy();
      expect($scope.gridOptions.columnDefs[5].visible).toBeFalsy();
      expect($scope.selected).toBeNull();
    });

    it('validate $scope.selectBuyer', function() {
      $scope.selected = 'dummy';
      $scope.selectBuyer();
      expect($modalInstance.close).toHaveBeenCalledWith('dummy');
    });

    it('validate $scope.selectBuyer - no buyer selected', function() {
      $scope.selected = null;
      $scope.selectBuyer();
      expect($modalInstance.close).not.toHaveBeenCalled();
    });

    it('validate $scope.closeModal', function() {
      $scope.closeModal();
      expect($modalInstance.dismiss).toHaveBeenCalledWith('cancel');
    });

  });

  describe('SelectBuyerCtrl', function() {

    beforeEach(inject(function($injector) {

      $uibModal = $injector.get('$uibModal');

      SelectBuyerCtrl = $controller('SelectBuyerCtrl', {
        $scope: $scope,
        $uibModal: $uibModal,
        Land: mockLand,
        CustomerService: CustomerService,
      });

    }));

    it('init', function() {
      expect($scope.customer).toBeNull();
      expect($scope.land).toEqual(mockLand);
    });

    it('validate selectBuyerModal', function() {

      // fake promise
      var modalResult = {
        then: function(callback) {
          callback("fake"); // passing fake value as result
        }
      };

      spyOn($uibModal, 'open').and.returnValue({
        result: modalResult
      });

      SelectBuyerCtrl.selectBuyerModal();

      expect($uibModal.open).toHaveBeenCalledWith({
        animation: true,
        size: 'lg',
        templateUrl: 'myModalContent.html',
        controller: 'SelectBuyerModalCtrl',
        resolve: {
          dataTableObject: jasmine.any(Function)
        }
      });
    });

  });

  describe('LandBuyDetailListCtrl', function() {

    beforeEach(function() {
      var baseTime = new Date(2016, 0, 1);
      jasmine.clock().mockDate(baseTime);

      LandBuyDetailListCtrl = $controller('LandBuyDetailListCtrl', {
        $scope: $scope,
        $routeParams: $routeParams,
        BuyDetailList: mockBuyDetailList,
        LandBuyService: LandBuyService,
      });
      $scope.$digest();
    });

    it('init', function() {
      expect($scope.month).toEqual({
        key: 0,
        value: '\u0e17\u0e38\u0e01\u0e40\u0e14\u0e37\u0e2d\u0e19' // Select all
      });
      expect($scope.years).toEqual(['\u0e17\u0e38\u0e01\u0e1b\u0e35', 2016, 2015]);
      expect($scope.gridOptions.paginationPageSizes).toEqual([10, 25, 50, 100, 500]);
      expect($scope.gridOptions.paginationPageSize).toEqual(10);
      expect($scope.land).toEqual(mockBuyDetailList.land);
      expect($scope.gridOptions.data).toEqual(mockBuyDetailObjTable.content);
      expect($scope.gridOptions.totalItems).toEqual(mockBuyDetailObjTable.totalRecords);
      expect(LandBuyDetailListCtrl.criteria).toEqual({
        landId: mockBuyDetailList.land.id,
        buyType: null,
        firstname: null,
        month: null,
        year: null,
        page: null,
        length: null
      });
    });

    it('validate queryTable() - happy path', function() {
      LandBuyDetailListCtrl.criteria = {
        landId: mockBuyDetailList.land.id,
        buyType: 'I',
        firstname: 'test',
        page: null,
        length: null
      };
      var deferred = $q.defer();
      spyOn(LandBuyService, 'query').and.returnValue(deferred.promise);
      spyOn(LandBuyDetailListCtrl, 'preProcessing');

      LandBuyDetailListCtrl.queryTable();

      deferred.resolve(mockBuyDetailObjTable);
      $scope.$digest();

      expect(LandBuyService.query).toHaveBeenCalledWith(LandBuyDetailListCtrl.criteria);
      expect(LandBuyDetailListCtrl.preProcessing).toHaveBeenCalledWith(mockBuyDetailObjTable.content);
      expect($scope.gridOptions.totalItems).toEqual(100);
      expect($scope.gridOptions.data).toEqual(mockBuyDetailObjTable.content);
    });

    it('validate minYear in preProcessing()', function() {
      var data = mockBuyDetailObjTable.content;
      LandBuyDetailListCtrl.preProcessing(data);
      expect(LandBuyDetailListCtrl.minYear).toEqual(2015);
    });

    it('validate $scope.updateYear() - default year', function() {
      spyOn(LandBuyDetailListCtrl, 'queryTable');
      $scope.updateYear();
      expect(LandBuyDetailListCtrl.criteria.month).toBeNull();
      expect(LandBuyDetailListCtrl.criteria.year).toBeNull();
      expect(LandBuyDetailListCtrl.queryTable).toHaveBeenCalled();
    });

    it('validate $scope.updateYear() - selected year', function() {
      spyOn(LandBuyDetailListCtrl, 'queryTable');
      $scope.year = $scope.years[1];
      $scope.updateYear();
      expect(LandBuyDetailListCtrl.criteria.month).toBeNull();
      expect(LandBuyDetailListCtrl.criteria.year).toEqual($scope.year);
      expect(LandBuyDetailListCtrl.queryTable).toHaveBeenCalled();
    });

    it('validate $scope.updateYear() when $scope.month and $scope.year are not defaults', function() {
      spyOn(LandBuyDetailListCtrl, 'queryTable');
      $scope.month = $scope.months[1];
      $scope.year = $scope.years[1];
      $scope.updateYear();
      expect(LandBuyDetailListCtrl.criteria.month).toEqual(0);
      expect(LandBuyDetailListCtrl.criteria.year).toEqual($scope.year);
      expect(LandBuyDetailListCtrl.queryTable).toHaveBeenCalled();
    });

    it('validate $scope.updateYear() - when $scope.year is default and $scope.month is not', function() {
      spyOn(LandBuyDetailListCtrl, 'queryTable');
      $scope.month = $scope.months[1];
      $scope.year = $scope.years[0];
      $scope.updateYear();
      expect(LandBuyDetailListCtrl.criteria.month).toBeNull();
      expect(LandBuyDetailListCtrl.criteria.year).toBeNull();
      expect(LandBuyDetailListCtrl.queryTable).toHaveBeenCalled();
    });

    it('validate $scope.updateMonth() - default $scope.month', function() {
      spyOn(LandBuyDetailListCtrl, 'queryTable');
      $scope.updateMonth();
      expect(LandBuyDetailListCtrl.criteria.month).toBeNull();
      expect(LandBuyDetailListCtrl.criteria.year).toBeNull();
      expect(LandBuyDetailListCtrl.queryTable).toHaveBeenCalled();
    });

    it('validate $scope.updateMonth() - selected $scope.month', function() {
      spyOn(LandBuyDetailListCtrl, 'queryTable');
      $scope.month = $scope.months[1];
      $scope.updateMonth();
      expect(LandBuyDetailListCtrl.criteria.month).toEqual(0);
      expect(LandBuyDetailListCtrl.criteria.year).toEqual($scope.year);
      expect(LandBuyDetailListCtrl.queryTable).toHaveBeenCalled();
    });

    it('validate $scope.updateMonth() - selected $scope.month and $scope.year', function() {
      spyOn(LandBuyDetailListCtrl, 'queryTable');
      $scope.month = $scope.months[2];
      $scope.year = $scope.years[2];
      $scope.updateMonth();
      expect(LandBuyDetailListCtrl.criteria.month).toEqual(1);
      expect(LandBuyDetailListCtrl.criteria.year).toEqual(2015);
      expect(LandBuyDetailListCtrl.queryTable).toHaveBeenCalled();
    });

  });

  describe('ConfirmDeleteLandBuyModalCtrl', function() {
    beforeEach(inject(function($injector) {
      mockBuyDetail = {
        "id": 2,
        "landId": 1,
        "buyType": "CASH",
        "buyerFirstName": "firstname2",
        "buyerLastName": "lastname2",
        "downPayment": 100.55,
        "buyPrice": 10.8,
        "annualInterest": 10.0,
        "yearsOfInstallment": 3,
        "description": null,
        "area": {
          "rai": 5,
          "yarn": 5,
          "tarangwa": 10
        },
        "createdTime": 0
      };

      $modalInstance = jasmine.createSpyObj('$modalInstance', ['close', 'dismiss']);

      ConfirmDeleteLandBuyModalCtrl = $controller('ConfirmDeleteLandBuyModalCtrl', {
        $scope: $scope,
        $location: $location,
        $modalInstance: $modalInstance,
        NotificationService: NotificationService,
        LandBuyService: LandBuyService,
        buyDetail: mockBuyDetail,
      });
    }));

    it('init', function() {
      expect($scope.buyDetail).toEqual(mockBuyDetail);
    });

    it('validate $scope.delete() - success', function() {
      var deferred = $q.defer();
      spyOn(LandBuyService, 'delete').and.returnValue(deferred.promise);
      spyOn(NotificationService, 'notify');

      $scope.delete();
      deferred.resolve();
      $scope.$digest();

      expect($modalInstance.dismiss).toHaveBeenCalledWith('cancel');
      expect(LandBuyService.delete).toHaveBeenCalledWith($scope.buyDetail);
      expect(NotificationService.notify).toHaveBeenCalledWith({
        type: 'success',
        msg: 'BuyDetail deleted'
      });
    });

    it('validate $scope.delete() - failure', function() {
      var deferred = $q.defer();
      spyOn(LandBuyService, 'delete').and.returnValue(deferred.promise);
      spyOn(NotificationService, 'notify');

      $scope.delete();
      deferred.reject();
      $scope.$digest();

      expect($modalInstance.dismiss).toHaveBeenCalledWith('cancel');
      expect(LandBuyService.delete).toHaveBeenCalledWith($scope.buyDetail);
      expect(NotificationService.notify).toHaveBeenCalledWith({
        type: 'error',
        msg: 'Unable to delete'
      });
    });

  });

  describe('LandBuyDetailsCtrl', function() {

    beforeEach(inject(function($injector) {

      mockCustomer = {
        "id": 1,
        "createdBy": 0,
        "createdTime": 0,
        "updatedBy": null,
        "updatedTime": null,
        "firstName": "firstname1",
        "lastName": "lastname1",
        "address": "address1",
        "tel": "074-360999"
      };

      $route = {
        current: {
          params: {
            landId: 1
          }
        }
      };

      $uibModal = $injector.get('$uibModal');

      spyOn($location, 'path').and.returnValue('#/lands/1/buydetails/create');

      LandBuyDetailsCtrl = $controller('LandBuyDetailsCtrl', {
        $rootScope: $rootScope,
        $scope: $scope,
        $uibModal: $uibModal,
        $location: $location,
        $route: $route,
        LandBuyService: LandBuyService,
        NotificationService: NotificationService,
      });
      $scope.$digest();
    }));

    it('init', function() {
      expect($scope.buyTypeItems).toEqual(['CASH', 'INSTALLMENT']);
      expect($scope.buyDetail).toEqual({
        landId: 1,
        buyType: 'CASH',
        downPayment: null,
        annualInterest: null,
        yearsOfInstallment: null
      });
    });

    it('validate buyDetail.buyType listener', function() {
      $scope.buyDetail = mockLandBuyDetail;
      $scope.$digest();
      $scope.buyDetail.buyType = 'CASH';
      $scope.$digest();
      expect($scope.buyDetail.downPayment).toBeNull();
      expect($scope.buyDetail.annualInterest).toBeNull();
      expect($scope.buyDetail.yearsOfInstallment).toBeNull();
    });

    it('validate validateBuyDetail() - no cusotmer selected', function() {
      spyOn(NotificationService, 'notify');
      expect(LandBuyDetailsCtrl.validateBuyDetail()).toBeFalsy();
      expect(NotificationService.notify).toHaveBeenCalledWith({
        type: 'error',
        msg: 'Please select a buyer'
      });
    });

    it('validate deleteModal()', function() {
      spyOn($uibModal, 'open');
      LandBuyDetailsCtrl.deleteModal();
      $scope.$digest();
      expect($uibModal.open).toHaveBeenCalledWith({
        animation: true,
        templateUrl: 'confirmDeleteModal.html',
        controller: 'ConfirmDeleteLandBuyModalCtrl',
        resolve: {
          buyDetail: jasmine.any(Function)
        }
      });
    });

    it('validate validateBuyDetail() - customer selected', function() {
      spyOn(NotificationService, 'notify');
      $scope.customer = 'something';
      expect(LandBuyDetailsCtrl.validateBuyDetail()).toBeTruthy();
      expect(NotificationService.notify).not.toHaveBeenCalled();
    });

    describe('$scope.saveLandBuyDetail()', function() {

      beforeEach(function() {
        $scope.customer = mockCustomer;
      });

      describe('create new buyDetail', function() {
        it('should successfully create a new buyDetail', function() {
          var deferred = $q.defer();
          spyOn(LandBuyService, 'create').and.returnValue(deferred.promise);
          spyOn(NotificationService, 'notify');
          spyOn(LandBuyDetailsCtrl, 'redirectToBuyDetailPage');

          $scope.saveLandBuyDetail(true);
          deferred.resolve($scope.buyDetail);
          $scope.$digest();

          expect(LandBuyDetailsCtrl.redirectToBuyDetailPage).toHaveBeenCalled();
          expect(LandBuyService.create).toHaveBeenCalledWith($scope.buyDetail);
          expect(NotificationService.notify).toHaveBeenCalledWith({
            type: 'success',
            msg: 'BuyDetail created'
          });

          expect($scope.buyDetail.customerId).toEqual($scope.customer.id);
        });

        it('should fail to create buyDetail', function() {
          var deferred = $q.defer();
          spyOn(LandBuyDetailsCtrl, 'redirectToBuyDetailPage');
          spyOn(LandBuyService, 'create').and.returnValue(deferred.promise);
          spyOn(NotificationService, 'notify');

          $scope.saveLandBuyDetail(true);
          deferred.reject();
          $scope.$digest();

          expect(LandBuyDetailsCtrl.redirectToBuyDetailPage).not.toHaveBeenCalled();
          expect(LandBuyService.create).toHaveBeenCalledWith($scope.buyDetail);
          expect(NotificationService.notify).toHaveBeenCalledWith({
            type: 'error',
            msg: 'Unable to create BuyDetail'
          });

          expect($scope.buyDetail.customerId).toEqual($scope.customer.id);
        });
      });

      describe('update an existing buyDetail', function() {

        beforeEach(function() {
          $scope.buyDetail = {
            "id": 1,
            "createdBy": 0,
            "createdTime": 0,
            "updatedBy": null,
            "updatedTime": null,
            "landId": 1,
            "customerId": 1,
            "buyType": "INSTALLMENT",
            "downPayment": 100.55,
            "buyPrice": 1000.1,
            "annualInterest": 15.0,
            "totalInstallment": 500,
            "yearsOfInstallment": 5,
            "description": null,
            "area": {
              "rai": 10,
              "yarn": 5,
              "tarangwa": 10
            }
          };
        });

        it('should successfully update a buyDetail', function() {
          var deferred = $q.defer();
          spyOn($rootScope, '$broadcast').and.callThrough();
          spyOn(LandBuyService, 'update').and.returnValue(deferred.promise);
          spyOn(NotificationService, 'notify');

          $scope.saveLandBuyDetail(true);
          deferred.resolve($scope.buyDetail);
          $rootScope.$digest();

          expect($rootScope.$broadcast).toHaveBeenCalledWith('loadLandBuyDetailBO');
          expect(LandBuyService.update).toHaveBeenCalledWith($scope.buyDetail);
          expect(NotificationService.notify).toHaveBeenCalledWith({
            type: 'success',
            msg: 'BuyDetail updated'
          });
        });

        it('should fail to update a buyDetail', function() {
          var deferred = $q.defer();
          spyOn($rootScope, '$broadcast').and.callThrough();
          spyOn(LandBuyService, 'update').and.returnValue(deferred.promise);
          spyOn(NotificationService, 'notify');

          $scope.saveLandBuyDetail(true);
          deferred.reject();
          $rootScope.$digest();

          expect($rootScope.$broadcast).not.toHaveBeenCalledWith('loadLandBuyDetailBO');
          expect(LandBuyService.update).toHaveBeenCalledWith($scope.buyDetail);
          expect(NotificationService.notify).toHaveBeenCalledWith({
            type: 'error',
            msg: 'Unable to update BuyDetail'
          });
        });

      });

    });

  });

  describe('LandBuyGeneralDetailsCtrl', function() {

    beforeEach(inject(function($injector) {

      mockBuyDetailBO = {
        "id": 6,
        "landId": 1,
        "buyType": "INSTALLMENT",
        "buyerId": 6,
        "buyerFirstName": "firstname",
        "buyerLastName": "lastname",
        "downPayment": 30000.0,
        "buyPrice": 125000.0,
        "annualInterest": 3,
        "yearsOfInstallment": 12.5,
        "totalInstallment": 0.0,
        "description": null,
        "area": {
          "rai": 0,
          "yarn": 0,
          "tarangwa": 25
        },
        "createdTime": 1446185713723
      };

      BuyDetails = {
        land: mockLand,
        buyDetailBO: mockBuyDetailBO
      };

      LandBuyGeneralDetailsCtrl = $controller('LandBuyGeneralDetailsCtrl', {
        $scope: $scope,
        LandBuyService: LandBuyService,
        BuyDetails: BuyDetails
      });
    }));

    it('init', function() {
      expect($scope.buyDetail).toEqual(mockBuyDetailBO);
      expect($scope.land).toEqual(mockLand);
      expect($scope.installmentPerMonth).toBeCloseTo(870.83);
      expect($scope.unpaidDebt).toEqual(95000);
      expect($scope.customer).toEqual({
        id: 6,
        firstName: 'firstname',
        lastName: 'lastname'
      });
    });

  });

});
