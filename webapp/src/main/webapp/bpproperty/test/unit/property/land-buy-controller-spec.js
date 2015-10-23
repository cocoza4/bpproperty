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
        "downPayment": 100.55,
        "buyPrice": 100.1,
        "annualInterest": 15.0,
        "yearsOfInstallment": 5,
        "description": null,
        "area": {
          "rai": 10,
          "yarn": 5,
          "tarangwa": 10
        },
        "createdTime": 0
      }, {
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
      }]
    };

    mockLandBuyDetail = {
      "id": 1,
      "landId": 1,
      "buyType": "INSTALLMENT",
      "buyerFirstName": "firstname1",
      "buyerLastName": "lastname1",
      "downPayment": 100.55,
      "buyPrice": 100.1,
      "annualInterest": 15.0,
      "yearsOfInstallment": 5,
      "description": null,
      "area": {
        "rai": 10,
        "yarn": 5,
        "tarangwa": 10
      },
      "createdTime": 0
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
      expect($scope.currentPage).toEqual(1);
      expect($scope.selected).toBeNull();
    });

    it('validate loadCustomers', function() {
      var deferred = $q.defer();
      spyOn(CustomerService, 'query').and.returnValue(deferred.promise);
      SelectBuyerModalCtrl.loadCustomers();
      expect(CustomerService.query).toHaveBeenCalledWith({
        page: 0,
        length: 10
      });
    });

    it('validate $scope.onNextPageChanged - $scope.customers.length < 10', function() {
      spyOn(SelectBuyerModalCtrl, 'loadCustomers');
      $scope.onNextPageChanged();
      expect($scope.currentPage).toEqual(1);
      expect($scope.selected).toBeNull();
      expect(SelectBuyerModalCtrl.loadCustomers).not.toHaveBeenCalled();
    });

    it('validate $scope.onNextPageChanged - $scope.customers.length >= 10', function() {
      $scope.customers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // mock customers to be greater then 10
      spyOn(SelectBuyerModalCtrl, 'loadCustomers');
      $scope.onNextPageChanged();
      expect($scope.currentPage).toEqual(2);
      expect($scope.selected).toBeNull();
      expect(SelectBuyerModalCtrl.loadCustomers).toHaveBeenCalled();
    });

    it('validate $scope.onPreviousPageChanged - $scope.currentPage === 1', function() {
      spyOn(SelectBuyerModalCtrl, 'loadCustomers');
      $scope.onPreviousPageChanged();
      expect($scope.currentPage).toEqual(1);
      expect($scope.selected).toBeNull();
      expect(SelectBuyerModalCtrl.loadCustomers).not.toHaveBeenCalled();
    });

    it('validate $scope.onPreviousPageChanged - $scope.currentPage > 1', function() {
      $scope.currentPage = 2;
      spyOn(SelectBuyerModalCtrl, 'loadCustomers');
      $scope.onPreviousPageChanged();
      expect($scope.currentPage).toEqual(1);
      expect($scope.selected).toBeNull();
      expect(SelectBuyerModalCtrl.loadCustomers).toHaveBeenCalled();
    });

    it('validate $scope.setSelected', function() {
      expect($scope.selected).toBeNull();
      $scope.setSelected({});
      expect($scope.selected).toEqual({});
    });

    it('validate $scope.selectBuyer', function() {
      $scope.selected = 'dummy';
      $scope.selectBuyer();
      expect($modalInstance.close).toHaveBeenCalledWith('dummy');
    });

    it('validate $scope.closeModal', function() {
      $scope.closeModal();
      expect($modalInstance.dismiss).toHaveBeenCalledWith('cancel');
    });

    describe('updateScope', function() {

      it('totalRecords greater than totalDisplayRecords', function() {
        SelectBuyerModalCtrl.updateScope(mockCustomerObjTable);
        expect($scope.customers).toEqual(mockCustomerObjTable.content);
        expect($scope.totalRecords).toEqual(mockCustomerObjTable.totalRecords);
        expect($scope.startIndex).toEqual(1);
        expect($scope.endIndex).toEqual(10);
      });

      it('totalRecords equal to totalDisplayRecords', function() {
        mockCustomerObjTable.totalRecords = 10;
        mockCustomerObjTable.totalDisplayRecords = 10;
        SelectBuyerModalCtrl.updateScope(mockCustomerObjTable);
        expect($scope.customers).toEqual(mockCustomerObjTable.content);
        expect($scope.totalRecords).toEqual(mockCustomerObjTable.totalRecords);
        expect($scope.startIndex).toEqual(1);
        expect($scope.endIndex).toEqual(10);
      });

      it('totalRecords less to totalDisplayRecords', function() {
        mockCustomerObjTable.totalRecords = 10;
        mockCustomerObjTable.totalDisplayRecords = 50;
        SelectBuyerModalCtrl.updateScope(mockCustomerObjTable);
        expect($scope.customers).toEqual(mockCustomerObjTable.content);
        expect($scope.totalRecords).toEqual(mockCustomerObjTable.totalRecords);
        expect($scope.startIndex).toEqual(1);
        expect($scope.endIndex).toEqual(50);
      });

      it('2nd page', function() {
        $scope.currentPage = 2;
        SelectBuyerModalCtrl.updateScope(mockCustomerObjTable);
        expect($scope.customers).toEqual(mockCustomerObjTable.content);
        expect($scope.totalRecords).toEqual(mockCustomerObjTable.totalRecords);
        expect($scope.startIndex).toEqual(11);
        expect($scope.endIndex).toEqual(20);
      });

      it('no customers', function() {
        mockCustomerObjTable.content = [];
        mockCustomerObjTable.totalRecords = 0;
        SelectBuyerModalCtrl.updateScope(mockCustomerObjTable);
        expect($scope.customers).toEqual(mockCustomerObjTable.content);
        expect($scope.totalRecords).toEqual(mockCustomerObjTable.totalRecords);
        expect($scope.startIndex).toEqual(0);
        expect($scope.endIndex).toEqual(0);
      });
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
      LandBuyDetailListCtrl = $controller('LandBuyDetailListCtrl', {
        $scope: $scope,
        $routeParams: $routeParams,
        BuyDetailList: mockBuyDetailList,
        LandBuyService: LandBuyService,
      });
    });

    it('init', function() {
      expect($scope.recordsPerPageList).toEqual([10, 25, 50, 100]);
      expect($scope.currentPage).toEqual(1);
      expect($scope.recordsPerPage).toEqual(10);
      expect($scope.land).toEqual(mockBuyDetailList.land);
    });

    it('validate $scope.onRecordsPerPageChanged', function() {
      spyOn($scope, 'updateLandBuyTable');
      $scope.currentPage++;
      expect($scope.currentPage).toEqual(2);
      $scope.onRecordsPerPageChanged();
      expect($scope.currentPage).toEqual(1);
      expect($scope.updateLandBuyTable).toHaveBeenCalled();
    });

    it('validate $scope.updateLandBuyTable - happy path', function() {
      var deferred = $q.defer();
      spyOn(LandBuyService, 'query').and.returnValue(deferred.promise);
      spyOn(LandBuyDetailListCtrl, 'updateScope');

      $scope.updateLandBuyTable();

      deferred.resolve(mockBuyDetailObjTable);
      $rootScope.$digest();

      expect(LandBuyService.query).toHaveBeenCalledWith({
        landId: $routeParams.landId,
        page: $scope.currentPage - 1, // zero-based page index
        length: $scope.recordsPerPage
      });
      expect(LandBuyDetailListCtrl.updateScope).toHaveBeenCalledWith(mockBuyDetailObjTable);
    });

    it('validate $scope.updateLandBuyTable - non happy path', function() {
      var deferred = $q.defer();
      spyOn(LandBuyService, 'query').and.returnValue(deferred.promise);
      spyOn(LandBuyDetailListCtrl, 'updateScope');

      $scope.updateLandBuyTable();

      deferred.reject();
      $rootScope.$digest();

      expect(LandBuyService.query).toHaveBeenCalledWith({
        landId: $routeParams.landId,
        page: $scope.currentPage - 1, // zero-based page index
        length: $scope.recordsPerPage
      });
      expect(LandBuyDetailListCtrl.updateScope).not.toHaveBeenCalled();
    });

    it('validate updateScope - totalRecords greater than totalDisplayRecords', function() {
      LandBuyDetailListCtrl.updateScope(mockBuyDetailList);
      expect($scope.landBuys).toEqual(mockBuyDetailObjTable.content);
      expect($scope.totalRecords).toEqual(mockBuyDetailList.landBuyDetail.totalRecords);
      expect($scope.startIndex).toEqual(1);
      expect($scope.endIndex).toEqual(10);
    });

    it('validate updateScope - totalRecords equal to totalDisplayRecords', function() {
      mockBuyDetailList.landBuyDetail.totalRecords = 10;
      mockBuyDetailList.landBuyDetail.totalDisplayRecords = 10;
      LandBuyDetailListCtrl.updateScope(mockBuyDetailList);
      expect($scope.landBuys).toEqual(mockBuyDetailList.landBuyDetail.content);
      expect($scope.totalRecords).toEqual(mockBuyDetailList.landBuyDetail.totalRecords);
      expect($scope.startIndex).toEqual(1);
      expect($scope.endIndex).toEqual(10);
    });

    it('validate updateScope - totalRecords less to totalDisplayRecords', function() {
      mockBuyDetailList.landBuyDetail.totalRecords = 10;
      mockBuyDetailList.landBuyDetail.totalDisplayRecords = 50;
      LandBuyDetailListCtrl.updateScope(mockBuyDetailList);
      expect($scope.landBuys).toEqual(mockBuyDetailList.landBuyDetail.content);
      expect($scope.totalRecords).toEqual(mockBuyDetailList.landBuyDetail.totalRecords);
      expect($scope.startIndex).toEqual(1);
      expect($scope.endIndex).toEqual(50);
    });

    it('validate updateScope - 2nd page', function() {
      $scope.currentPage = 2;
      LandBuyDetailListCtrl.updateScope(mockBuyDetailList);
      expect($scope.landBuys).toEqual(mockBuyDetailList.landBuyDetail.content);
      expect($scope.totalRecords).toEqual(mockBuyDetailList.landBuyDetail.totalRecords);
      expect($scope.startIndex).toEqual(11);
      expect($scope.endIndex).toEqual(20);
    });

    it('validate updateScope - no land buy details', function() {
      mockBuyDetailList.landBuyDetail.content = [];
      mockBuyDetailList.landBuyDetail.totalRecords = 0;
      LandBuyDetailListCtrl.updateScope(mockBuyDetailList);
      expect($scope.landBuys).toEqual(mockBuyDetailList.landBuyDetail.content);
      expect($scope.totalRecords).toEqual(mockBuyDetailList.landBuyDetail.totalRecords);
      expect($scope.startIndex).toEqual(0);
      expect($scope.endIndex).toEqual(0);
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
            "buyPrice": 100.1,
            "annualInterest": 15.0,
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
          spyOn(LandBuyService, 'update').and.returnValue(deferred.promise);
          spyOn(NotificationService, 'notify');

          $scope.saveLandBuyDetail(true);
          deferred.resolve($scope.buyDetail);
          $scope.$digest();

          expect(LandBuyService.update).toHaveBeenCalledWith($scope.buyDetail);
          expect(NotificationService.notify).toHaveBeenCalledWith({
            type: 'success',
            msg: 'BuyDetail updated'
          });
        });

        it('should fail to update a buyDetail', function() {
          var deferred = $q.defer();
          spyOn(LandBuyService, 'update').and.returnValue(deferred.promise);
          spyOn(NotificationService, 'notify');

          $scope.saveLandBuyDetail(true);
          deferred.reject();
          $scope.$digest();

          expect(LandBuyService.update).toHaveBeenCalledWith($scope.buyDetail);
          expect(NotificationService.notify).toHaveBeenCalledWith({
            type: 'error',
            msg: 'Unable to update BuyDetail'
          });
        });

      });

    });

  });

});
