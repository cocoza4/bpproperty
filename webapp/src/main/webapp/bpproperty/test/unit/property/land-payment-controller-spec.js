describe('land-payment', function() {

  beforeEach(module('land-payment'));

  beforeEach(inject(function($injector, _$controller_) {
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $controller = _$controller_;
    $q = $injector.get('$q');
    LandBuyService = $injector.get('LandBuyService');
    NotificationService = $injector.get('NotificationService');
    PaymentService = $injector.get('PaymentService');
  }));

  describe('ConfirmDeleteModalCtrl', function() {

    beforeEach(inject(function($injector) {

      mockPayment = {
        "id": 1,
        "createdBy": 0,
        "createdTime": 1422631659000,
        "updatedBy": 1,
        "updatedTime": 1444840281934,
        "buyDetailId": 1,
        "payFor": 1422723600000,
        "amount": 1.0,
        "description": "description"
      };

      $modalInstance = jasmine.createSpyObj('$modalInstance', ['close', 'dismiss']);

      $route = {
        current: {
          params: {
            landId: 1,
            buyDetailId: 1,
            paymentId: 1
          }
        }
      };

      ConfirmDeleteModalCtrl = $controller('ConfirmDeleteModalCtrl', {
        $rootScope: $rootScope,
        $scope: $scope,
        $route: $route,
        $modalInstance: $modalInstance,
        PaymentService: PaymentService,
        NotificationService: NotificationService,
        payment: mockPayment,
      });
      $scope.$digest();
    }));

    it('init', function() {
      expect($scope.payment).toEqual(mockPayment);
    });

    it('validate $scope.closeModal()', function() {
      $scope.closeModal();
      expect($modalInstance.dismiss).toHaveBeenCalledWith('cancel');
    });

    it('validate $scope.delete() - happy path', function() {
      spyOn($rootScope, '$broadcast').and.callThrough();
      spyOn(NotificationService, 'notify');

      spyOn(PaymentService, 'delete').and.callFake(function() {
        var deferred = $q.defer();
        deferred.resolve('response');
        return deferred.promise;
      });

      $scope.delete();
      $rootScope.$digest();

      expect($rootScope.$broadcast).toHaveBeenCalledWith('loadLandBuyDetailBO');
      expect($rootScope.$broadcast).toHaveBeenCalledWith('loadPayments');
      expect($modalInstance.close).toHaveBeenCalledWith('success');
      expect(NotificationService.notify).toHaveBeenCalledWith({
        type: 'success',
        msg: 'Payment deleted'
      });
    });

    it('validate $scope.delete() - non happy path', function() {
      spyOn($rootScope, '$broadcast').and.callThrough();
      spyOn(NotificationService, 'notify');

      spyOn(PaymentService, 'delete').and.callFake(function() {
        var deferred = $q.defer();
        deferred.reject();
        return deferred.promise;
      });

      $scope.delete();
      $scope.$digest();

      expect(NotificationService.notify).toHaveBeenCalledWith({
        type: 'error',
        msg: 'Unable to delete the selected Payment'
      });
    });

  });

  describe('SaveInstallmentModalCtrl', function() {

    beforeEach(inject(function($injector) {

      var baseTime = new Date(2015, 0, 1);
      jasmine.clock().mockDate(baseTime);

      mockPayment = {
        "id": 1,
        "createdBy": 0,
        "createdTime": 1422631659000,
        "updatedBy": 1,
        "updatedTime": 1444840281934,
        "buyDetailId": 1,
        "payFor": new Date(2014, 1, 1).getTime(),
        "amount": 1.0,
        "description": "description"
      };

      $modalInstance = jasmine.createSpyObj('$modalInstance', ['close', 'dismiss']);

      $route = {
        current: {
          params: {
            landId: 1,
            buyDetailId: 1,
            paymentId: 1
          }
        }
      };

    }));

    describe('Save a new Payment', function() {

      beforeEach(function() {
        SaveInstallmentModalCtrl = $controller('SaveInstallmentModalCtrl', {
          $rootScope: $rootScope,
          $scope: $scope,
          $route: $route,
          $modalInstance: $modalInstance,
          PaymentService: PaymentService,
          NotificationService: NotificationService,
          payment: {},
        });
        $scope.$digest();
      });

      it('init - new payment', function() {
        expect($scope.payment).toEqual({});
        expect($scope.years).toEqual([2016, 2015, 2014]);
        expect($scope.selectedYear).toEqual(2015);
        expect($scope.selectedMonth).toEqual({
          key: 0,
          value: '\u0e21\u0e01\u0e23\u0e32\u0e04\u0e21' // January
        });
      });

      it('should successfully create a new Payment', function() {
        var deferred = $q.defer();
        spyOn(NotificationService, 'notify');
        spyOn($rootScope, '$broadcast').and.callThrough();
        spyOn(PaymentService, 'create').and.returnValue(deferred.promise);

        $scope.savePayment(true);
        deferred.resolve();
        $scope.$digest();

        expect($scope.payment.buyDetailId).toEqual(1);
        expect(PaymentService.create).toHaveBeenCalledWith({
          landId: 1,
          buyDetailId: 1,
        }, $scope.payment, $scope.selectedMonth.key, $scope.selectedYear);
        expect($modalInstance.dismiss).toHaveBeenCalledWith('cancel');
        expect($rootScope.$broadcast).toHaveBeenCalledWith('loadLandBuyDetailBO');
        expect($rootScope.$broadcast).toHaveBeenCalledWith('loadPayments');
        expect(NotificationService.notify).toHaveBeenCalledWith({
          type: 'success',
          msg: 'Payment created'
        });
      });

      it('should fail to create a new Payment', function() {
        var deferred = $q.defer();
        spyOn(NotificationService, 'notify');
        spyOn($rootScope, '$broadcast').and.callThrough();
        spyOn(PaymentService, 'create').and.returnValue(deferred.promise);

        $scope.savePayment(true);
        deferred.reject();
        $scope.$digest();

        expect($scope.payment.buyDetailId).toEqual(1);
        expect(PaymentService.create).toHaveBeenCalledWith({
          landId: 1,
          buyDetailId: 1,
        }, $scope.payment, $scope.selectedMonth.key, $scope.selectedYear);
        expect($modalInstance.dismiss).not.toHaveBeenCalledWith('cancel');
        expect($rootScope.$broadcast).not.toHaveBeenCalledWith('loadLandBuyDetailBO');
        expect($rootScope.$broadcast).not.toHaveBeenCalledWith('loadPayments');
        expect(NotificationService.notify).toHaveBeenCalledWith({
          type: 'error',
          msg: 'Unable to create Payment'
        });
      });

    });

    describe('Save an existing Payment', function() {
      beforeEach(function() {
        SaveInstallmentModalCtrl = $controller('SaveInstallmentModalCtrl', {
          $rootScope: $rootScope,
          $scope: $scope,
          $route: $route,
          $modalInstance: $modalInstance,
          PaymentService: PaymentService,
          NotificationService: NotificationService,
          payment: mockPayment,
        });
        $scope.$digest();
      });

      it('init - existing payment', function() {
        expect($scope.payment).toEqual(mockPayment);
        expect($scope.years).toEqual([2016, 2015, 2014, 2013]);
        expect($scope.selectedYear).toEqual(2014);
        expect($scope.selectedMonth).toEqual({
          key: 1,
          value: '\u0e01\u0e38\u0e21\u0e20\u0e32\u0e1e\u0e31\u0e19\u0e18\u0e4c' // February
        });
      });

      it('should successfully update an existing Payment', function() {
        var deferred = $q.defer();
        spyOn(NotificationService, 'notify');
        spyOn($rootScope, '$broadcast').and.callThrough();
        spyOn(PaymentService, 'update').and.returnValue(deferred.promise);

        $scope.savePayment(true);
        deferred.resolve();
        $scope.$digest();

        expect($scope.payment.buyDetailId).toEqual(1);
        expect(PaymentService.update).toHaveBeenCalledWith({
          landId: 1,
          buyDetailId: 1,
        }, $scope.payment, $scope.selectedMonth.key, $scope.selectedYear);
        expect($modalInstance.dismiss).toHaveBeenCalledWith('cancel');
        expect($rootScope.$broadcast).toHaveBeenCalledWith('loadLandBuyDetailBO');
        expect($rootScope.$broadcast).toHaveBeenCalledWith('loadPayments');
        expect(NotificationService.notify).toHaveBeenCalledWith({
          type: 'success',
          msg: 'Payment updated'
        });
      });

      it('should fail to create a new Payment', function() {
        var deferred = $q.defer();
        spyOn(NotificationService, 'notify');
        spyOn($rootScope, '$broadcast').and.callThrough();
        spyOn(PaymentService, 'update').and.returnValue(deferred.promise);

        $scope.savePayment(true);
        deferred.reject();
        $scope.$digest();

        expect($scope.payment.buyDetailId).toEqual(1);
        expect(PaymentService.update).toHaveBeenCalledWith({
          landId: 1,
          buyDetailId: 1,
        }, $scope.payment, $scope.selectedMonth.key, $scope.selectedYear);
        expect($modalInstance.dismiss).not.toHaveBeenCalledWith('cancel');
        expect($rootScope.$broadcast).not.toHaveBeenCalledWith('loadLandBuyDetailBO');
        expect($rootScope.$broadcast).not.toHaveBeenCalledWith('loadPayments');
        expect(NotificationService.notify).toHaveBeenCalledWith({
          type: 'error',
          msg: 'Unable to update existing Payment'
        });
      });

    });

  });

  describe('SavePaymentModalCtrl', function() {

    beforeEach(inject(function($injector) {

      $modalInstance = jasmine.createSpyObj('$modalInstance', ['close', 'dismiss']);

      mockPayment = {
        "id": 1,
        "createdBy": 0,
        "createdTime": 1422631659000,
        "updatedBy": 1,
        "updatedTime": 1444840281934,
        "buyDetailId": 1,
        "amount": 1.0,
        "description": "description"
      };

      $route = {
        current: {
          params: {
            landId: 1,
            buyDetailId: 1,
            paymentId: 1
          }
        }
      };

      SavePaymentModalCtrl = $controller('SavePaymentModalCtrl', {
        $rootScope: $rootScope,
        $scope: $scope,
        $route: $route,
        $modalInstance: $modalInstance,
        PaymentService: PaymentService,
        NotificationService: NotificationService,
        payment: {},
      });
      $scope.$digest();

    }));

    it('init - new payment', function() {
      expect($scope.payment).toEqual({});
    });

    it('should successfully create a new Payment', function() {
      var deferred = $q.defer();
      spyOn(NotificationService, 'notify');
      spyOn($rootScope, '$broadcast').and.callThrough();
      spyOn(PaymentService, 'create').and.returnValue(deferred.promise);

      $scope.savePayment(true);
      deferred.resolve();
      $scope.$digest();

      expect($scope.payment.buyDetailId).toEqual(1);
      expect(PaymentService.create).toHaveBeenCalledWith({
        landId: 1,
        buyDetailId: 1,
      }, $scope.payment);
      expect($modalInstance.close).toHaveBeenCalledWith('success');
      expect($rootScope.$broadcast).toHaveBeenCalledWith('loadLandBuyDetailBO');
      expect($rootScope.$broadcast).toHaveBeenCalledWith('loadPayments');
      expect(NotificationService.notify).toHaveBeenCalledWith({
        type: 'success',
        msg: 'Payment created'
      });
    });

    it('should fail to create a new Payment', function() {
      var deferred = $q.defer();
      spyOn(NotificationService, 'notify');
      spyOn($rootScope, '$broadcast').and.callThrough();
      spyOn(PaymentService, 'create').and.returnValue(deferred.promise);

      $scope.savePayment(true);
      deferred.reject();
      $scope.$digest();

      expect($scope.payment.buyDetailId).toEqual(1);
      expect(PaymentService.create).toHaveBeenCalledWith({
        landId: 1,
        buyDetailId: 1,
      }, $scope.payment);
      expect($modalInstance.dismiss).not.toHaveBeenCalledWith('cancel');
      expect($rootScope.$broadcast).not.toHaveBeenCalledWith('loadLandBuyDetailBO');
      expect($rootScope.$broadcast).not.toHaveBeenCalledWith('loadPayments');
      expect(NotificationService.notify).toHaveBeenCalledWith({
        type: 'error',
        msg: 'Unable to create Payment'
      });
    });

    describe('Update Existing Payment', function() {

      beforeEach(function() {
        SavePaymentModalCtrl = $controller('SavePaymentModalCtrl', {
          $rootScope: $rootScope,
          $scope: $scope,
          $route: $route,
          $modalInstance: $modalInstance,
          PaymentService: PaymentService,
          NotificationService: NotificationService,
          payment: mockPayment,
        });
      });

      it('should successfully update an existing Payment', function() {
        var deferred = $q.defer();
        spyOn(NotificationService, 'notify');
        spyOn($rootScope, '$broadcast').and.callThrough();
        spyOn(PaymentService, 'update').and.returnValue(deferred.promise);

        $scope.savePayment(true);
        deferred.resolve();
        $scope.$digest();

        expect($scope.payment.buyDetailId).toEqual(1);
        expect(PaymentService.update).toHaveBeenCalledWith({
          landId: 1,
          buyDetailId: 1,
        }, $scope.payment);
        expect($modalInstance.dismiss).toHaveBeenCalledWith('cancel');
        expect($rootScope.$broadcast).toHaveBeenCalledWith('loadLandBuyDetailBO');
        expect($rootScope.$broadcast).toHaveBeenCalledWith('loadPayments');
        expect(NotificationService.notify).toHaveBeenCalledWith({
          type: 'success',
          msg: 'Payment updated'
        });
      });

      it('should fail to update an existing Payment', function() {
        var deferred = $q.defer();
        spyOn(NotificationService, 'notify');
        spyOn($rootScope, '$broadcast').and.callThrough();
        spyOn(PaymentService, 'update').and.returnValue(deferred.promise);

        $scope.savePayment(true);
        deferred.reject();
        $scope.$digest();

        expect($scope.payment.buyDetailId).toEqual(1);
        expect(PaymentService.update).toHaveBeenCalledWith({
          landId: 1,
          buyDetailId: 1,
        }, $scope.payment);
        expect($modalInstance.dismiss).not.toHaveBeenCalledWith('cancel');
        expect($rootScope.$broadcast).not.toHaveBeenCalledWith('loadLandBuyDetailBO');
        expect($rootScope.$broadcast).not.toHaveBeenCalledWith('loadPayments');
        expect(NotificationService.notify).toHaveBeenCalledWith({
          type: 'error',
          msg: 'Unable to update existing Payment'
        });
      });

    });

  });

  describe('PaymentListCtrl', function() {

    beforeEach(inject(function($injector) {
      mockLandBuyDetail = {
        "id": 1,
        "landId": 1,
        "buyType": "INSTALLMENT",
        "buyerFirstName": "firstname1",
        "buyerLastName": "lastname1",
        "downPayment": 100.55,
        "buyPrice": 100000,
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

      mockCashLandBuyDetail = {
        "id": 1,
        "landId": 1,
        "buyType": "CASH",
        "buyerFirstName": "firstname1",
        "buyerLastName": "lastname1",
        "buyPrice": 100000,
        "description": null,
        "area": {
          "rai": 10,
          "yarn": 5,
          "tarangwa": 10
        },
        "createdTime": 0
      };

      mockPayments = [{
        "id": 1,
        "createdBy": 0,
        "createdTime": 1422631659000,
        "updatedBy": 1,
        "updatedTime": 1444840281934,
        "buyDetailId": 1,
        "payFor": 1422723600000,
        "amount": 1.0,
        "description": "description"
      }, {
        "id": 2,
        "createdBy": 0,
        "createdTime": 1425310059000,
        "updatedBy": null,
        "updatedTime": null,
        "buyDetailId": 1,
        "payFor": 1425310059000,
        "amount": 6000.0,
        "description": "description"
      }];

      $uibModal = $injector.get('$uibModal');
      $cacheFactory = $injector.get('$cacheFactory');

      cache = $cacheFactory('land-cache'); // init cache object
      cache.put('buyDetail', mockLandBuyDetail);

      $route = {
        current: {
          params: {
            landId: 1,
            buyDetailId: 1
          }
        }
      };

      modalInstance = {
        result: {
          then: function(confirmCallback, cancelCallback) {
            this.confirmCallBack = confirmCallback;
            this.cancelCallback = cancelCallback;
          }
        }
      };

      spyOn(PaymentService, 'query').and.callFake(function() {
        var deferred = $q.defer();
        deferred.resolve(mockPayments);
        return deferred.promise;
      });

      spyOn(LandBuyService, 'query').and.callFake(function() {
        var deferred = $q.defer();
        deferred.resolve(mockLandBuyDetail);
        return deferred.promise;
      });

      PaymentListCtrl = $controller('PaymentListCtrl', {
        $scope: $scope,
        $route: $route,
        $uibModal: $uibModal,
        $location: $location,
        LandBuyService: LandBuyService,
        PaymentService: PaymentService,
        $cacheFactory: $cacheFactory
      });
      $scope.$digest();
    }));

    it('init - CASH buy', function() {
      cache.put('buyDetail', mockCashLandBuyDetail);
      PaymentListCtrl = $controller('PaymentListCtrl', {
        $scope: $scope,
        $route: $route,
        $uibModal: $uibModal,
        $location: $location,
        LandBuyService: LandBuyService,
        PaymentService: PaymentService,
        $cacheFactory: $cacheFactory
      });
      $scope.$digest();
      expect($scope.landBuy).toEqual(mockCashLandBuyDetail);
      expect($scope.gridOptions.columnDefs[2].visible).toBeFalsy();
      expect(PaymentListCtrl.paymentCriteria).toEqual({
        landId: $route.current.params.landId,
        buyDetailId: $route.current.params.buyDetailId,
        page: 0,
        length: 10
      });
    });

    it('init', function() {
      expect($scope.landBuy).toEqual(mockLandBuyDetail);
      expect($scope.gridOptions.columnDefs[2].visible).toBeTruthy();
      expect(PaymentListCtrl.paymentCriteria).toEqual({
        landId: $route.current.params.landId,
        buyDetailId: $route.current.params.buyDetailId,
        page: 0,
        length: 10
      });
    });

    it('validate $scope.loadReceipt()', function() {
      var expectedParams = {
        receiptId: mockPayments[0].id
      };
      spyOn(PaymentService, 'loadReceipt');
      $scope.loadReceipt(mockPayments[0]);
      expect(PaymentService.loadReceipt).toHaveBeenCalledWith(mockLandBuyDetail.landId,
        mockLandBuyDetail.id,
        expectedParams);
    });

    it('validate loadPayments()', function() {
      PaymentListCtrl.loadPayments();
      $scope.$digest();
      expect(PaymentService.query).toHaveBeenCalledWith(PaymentListCtrl.paymentCriteria);
    });

    it('validate $scope.savePaymentModal() - INSTALLMENT', function() {
      var dummy = "dummy";
      spyOn($uibModal, 'open');
      $scope.savePaymentModal(dummy);
      $scope.$digest();
      expect($uibModal.open).toHaveBeenCalledWith({
        animation: true,
        templateUrl: 'saveInstallmentModal.html',
        controller: 'SaveInstallmentModalCtrl',
        resolve: {
          payment: jasmine.any(Function)
        }
      });
    });

    it('validate $scope.savePaymentModal() - CASH', function() {
      $scope.landBuy = mockCashLandBuyDetail;
      var dummy = "dummy";
      spyOn($uibModal, 'open').and.returnValue(modalInstance);
      $scope.savePaymentModal(dummy);
      $scope.$digest();
      expect($uibModal.open).toHaveBeenCalledWith({
        animation: true,
        templateUrl: 'savePaymentModal.html',
        controller: 'SavePaymentModalCtrl',
        resolve: {
          payment: jasmine.any(Function)
        }
      });
    });

    it('validate $scope.confirmDeleteModal() - CASH', function() {
      $scope.landBuy = mockCashLandBuyDetail;
      var dummy = "dummy";
      spyOn($uibModal, 'open').and.returnValue(modalInstance);
      $scope.confirmDeleteModal(dummy);
      $scope.$digest();
      expect($uibModal.open).toHaveBeenCalledWith({
        animation: true,
        templateUrl: 'confirmDeleteModal.html',
        controller: 'ConfirmDeleteModalCtrl',
        resolve: {
          payment: jasmine.any(Function)
        }
      });
    });

    it('validate $scope.confirmDeleteModal() - INSTALLMENT', function() {
      $scope.landBuy = mockLandBuyDetail;
      var dummy = "dummy";
      spyOn($uibModal, 'open');
      $scope.confirmDeleteModal(dummy);
      $scope.$digest();
      expect($uibModal.open).toHaveBeenCalledWith({
        animation: true,
        templateUrl: 'confirmDeleteModal.html',
        controller: 'ConfirmDeleteModalCtrl',
        resolve: {
          payment: jasmine.any(Function)
        }
      });
    });

  });

});
