describe('land-installment', function() {

  beforeEach(module('land-installment'));

  beforeEach(inject(function($injector, _$controller_) {
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $controller = _$controller_;
    $q = $injector.get('$q');
    LandBuyService = $injector.get('LandBuyService');
    NotificationService = $injector.get('NotificationService');
    InstallmentService = $injector.get('InstallmentService');
  }));

  describe('ConfirmDeleteModalCtrl', function() {

    beforeEach(inject(function($injector) {

      mockInstallment = {
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
            installmentId: 1
          }
        }
      };

      ConfirmDeleteModalCtrl = $controller('ConfirmDeleteModalCtrl', {
        $rootScope: $rootScope,
        $scope: $scope,
        $route: $route,
        $modalInstance: $modalInstance,
        InstallmentService: InstallmentService,
        NotificationService: NotificationService,
        installment: mockInstallment,
      });
      $scope.$digest();
    }));

    it('init', function() {
      expect($scope.installment).toEqual(mockInstallment);
    });

    it('validate $scope.closeModal', function() {
      $scope.closeModal();
      expect($modalInstance.dismiss).toHaveBeenCalledWith('cancel');
    });

    it('validate $scope.delete - happy path', function() {
      spyOn($rootScope, '$broadcast').and.callThrough();
      spyOn(NotificationService, 'notify');

      spyOn(InstallmentService, 'delete').and.callFake(function() {
        var deferred = $q.defer();
        deferred.resolve('response');
        return deferred.promise;
      });

      $scope.delete();
      $rootScope.$digest();

      expect($rootScope.$broadcast).toHaveBeenCalledWith('loadLandBuyDetailBO');
      expect($rootScope.$broadcast).toHaveBeenCalledWith('loadInstallments');
      expect($modalInstance.dismiss).toHaveBeenCalledWith('cancel');
      expect(NotificationService.notify).toHaveBeenCalledWith({
        type: 'success',
        msg: 'Installment deleted'
      });
    });

    it('validate $scope.delete - non happy path', function() {
      spyOn($rootScope, '$broadcast').and.callThrough();
      spyOn(NotificationService, 'notify');

      spyOn(InstallmentService, 'delete').and.callFake(function() {
        var deferred = $q.defer();
        deferred.reject();
        return deferred.promise;
      });

      $scope.delete();
      $scope.$digest();

      expect($modalInstance.dismiss).toHaveBeenCalledWith('cancel');
      expect(NotificationService.notify).toHaveBeenCalledWith({
        type: 'error',
        msg: 'Unable to delete the selected Installment'
      });
    });

  });

  describe('SaveInstallmentModalCtrl', function() {

    beforeEach(inject(function($injector) {

      var baseTime = new Date(2015, 0, 1);
      jasmine.clock().mockDate(baseTime);

      mockInstallment = {
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
            installmentId: 1
          }
        }
      };

    }));

    describe('Save a new Installment', function() {

      beforeEach(function() {
        SaveInstallmentModalCtrl = $controller('SaveInstallmentModalCtrl', {
          $rootScope: $rootScope,
          $scope: $scope,
          $route: $route,
          $modalInstance: $modalInstance,
          InstallmentService: InstallmentService,
          NotificationService: NotificationService,
          installment: {},
        });
        $scope.$digest();
      });

      it('init - new installment', function() {
        expect($scope.installment).toEqual({});
        expect($scope.years).toEqual([2015]);
        expect($scope.selectedYear).toEqual(2015);
        expect($scope.selectedMonth).toEqual({
          key: 0,
          value: '\u0e21\u0e01\u0e23\u0e32\u0e04\u0e21' // January
        });
      });

      it('should successfully create a new Installment', function() {
        var deferred = $q.defer();
        spyOn(NotificationService, 'notify');
        spyOn($rootScope, '$broadcast').and.callThrough();
        spyOn(InstallmentService, 'create').and.returnValue(deferred.promise);

        $scope.saveInstallment(true);
        deferred.resolve();
        $scope.$digest();

        expect($scope.installment.buyDetailId).toEqual(1);
        expect(InstallmentService.create).toHaveBeenCalledWith({
          landId: 1,
          buyDetailId: 1,
        }, $scope.installment, $scope.selectedMonth.key, $scope.selectedYear);
        expect($modalInstance.dismiss).toHaveBeenCalledWith('cancel');
        expect($rootScope.$broadcast).toHaveBeenCalledWith('loadLandBuyDetailBO');
        expect($rootScope.$broadcast).toHaveBeenCalledWith('loadInstallments');
        expect(NotificationService.notify).toHaveBeenCalledWith({
          type: 'success',
          msg: 'Installment created'
        });
      });

      it('should fail to create a new Installment', function() {
        var deferred = $q.defer();
        spyOn(NotificationService, 'notify');
        spyOn($rootScope, '$broadcast').and.callThrough();
        spyOn(InstallmentService, 'create').and.returnValue(deferred.promise);

        $scope.saveInstallment(true);
        deferred.reject();
        $scope.$digest();

        expect($scope.installment.buyDetailId).toEqual(1);
        expect(InstallmentService.create).toHaveBeenCalledWith({
          landId: 1,
          buyDetailId: 1,
        }, $scope.installment, $scope.selectedMonth.key, $scope.selectedYear);
        expect($modalInstance.dismiss).not.toHaveBeenCalledWith('cancel');
        expect($rootScope.$broadcast).not.toHaveBeenCalledWith('loadLandBuyDetailBO');
        expect($rootScope.$broadcast).not.toHaveBeenCalledWith('loadInstallments');
        expect(NotificationService.notify).toHaveBeenCalledWith({
          type: 'error',
          msg: 'Unable to create Installment'
        });
      });

    });

    describe('Save an existing Installment', function() {
      beforeEach(function() {
        SaveInstallmentModalCtrl = $controller('SaveInstallmentModalCtrl', {
          $rootScope: $rootScope,
          $scope: $scope,
          $route: $route,
          $modalInstance: $modalInstance,
          InstallmentService: InstallmentService,
          NotificationService: NotificationService,
          installment: mockInstallment,
        });
        $scope.$digest();
      });

      it('init - existing installment', function() {
        expect($scope.installment).toEqual(mockInstallment);
        expect($scope.years).toEqual([2015, 2014]);
        expect($scope.selectedYear).toEqual(2014);
        expect($scope.selectedMonth).toEqual({
          key: 1,
          value: '\u0e01\u0e38\u0e21\u0e20\u0e32\u0e1e\u0e31\u0e19\u0e18\u0e4c' // February
        });
      });

      it('should successfully update an existing Installment', function() {
        var deferred = $q.defer();
        spyOn(NotificationService, 'notify');
        spyOn($rootScope, '$broadcast').and.callThrough();
        spyOn(InstallmentService, 'update').and.returnValue(deferred.promise);

        $scope.saveInstallment(true);
        deferred.resolve();
        $scope.$digest();

        expect($scope.installment.buyDetailId).toEqual(1);
        expect(InstallmentService.update).toHaveBeenCalledWith({
          landId: 1,
          buyDetailId: 1,
        }, $scope.installment, $scope.selectedMonth.key, $scope.selectedYear);
        expect($modalInstance.dismiss).toHaveBeenCalledWith('cancel');
        expect($rootScope.$broadcast).toHaveBeenCalledWith('loadLandBuyDetailBO');
        expect($rootScope.$broadcast).toHaveBeenCalledWith('loadInstallments');
        expect(NotificationService.notify).toHaveBeenCalledWith({
          type: 'success',
          msg: 'Installment updated'
        });
      });

      it('should fail to create a new Installment', function() {
        var deferred = $q.defer();
        spyOn(NotificationService, 'notify');
        spyOn($rootScope, '$broadcast').and.callThrough();
        spyOn(InstallmentService, 'update').and.returnValue(deferred.promise);

        $scope.saveInstallment(true);
        deferred.reject();
        $scope.$digest();

        expect($scope.installment.buyDetailId).toEqual(1);
        expect(InstallmentService.update).toHaveBeenCalledWith({
          landId: 1,
          buyDetailId: 1,
        }, $scope.installment, $scope.selectedMonth.key, $scope.selectedYear);
        expect($modalInstance.dismiss).not.toHaveBeenCalledWith('cancel');
        expect($rootScope.$broadcast).not.toHaveBeenCalledWith('loadLandBuyDetailBO');
        expect($rootScope.$broadcast).not.toHaveBeenCalledWith('loadInstallments');
        expect(NotificationService.notify).toHaveBeenCalledWith({
          type: 'error',
          msg: 'Unable to update existing Installment'
        });
      });

    });

  });

  describe('InstallmentListCtrl', function() {

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

      mockInstallments = [{
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

      $route = {
        current: {
          params: {
            landId: 1,
            buyDetailId: 1
          }
        }
      };

      spyOn(InstallmentService, 'query').and.callFake(function() {
        var deferred = $q.defer();
        deferred.resolve(mockInstallments);
        return deferred.promise;
      });

      spyOn(LandBuyService, 'query').and.callFake(function() {
        var deferred = $q.defer();
        deferred.resolve(mockLandBuyDetail);
        return deferred.promise;
      });

      InstallmentListCtrl = $controller('InstallmentListCtrl', {
        $scope: $scope,
        $route: $route,
        $uibModal: $uibModal,
        $location: $location,
        LandBuyService: LandBuyService,
        InstallmentService: InstallmentService,
      });
      $scope.$digest();
    }));

    it('init', function() {
      expect(InstallmentListCtrl.installmentCriteria).toEqual({
        landId: $route.current.params.landId,
        buyDetailId: $route.current.params.buyDetailId,
        page: 0,
        length: 10
      });
    });

    it('validate loadInstallments()', function() {
      InstallmentListCtrl.loadInstallments();
      $scope.$digest();
      expect(InstallmentService.query).toHaveBeenCalledWith(InstallmentListCtrl.installmentCriteria);
    });

    it('validate $scope.saveInstallmentModal()', function() {
      var dummy = "dummy";
      spyOn($uibModal, 'open');
      $scope.saveInstallmentModal(dummy);
      $scope.$digest();
      expect($uibModal.open).toHaveBeenCalledWith({
        animation: true,
        templateUrl: 'saveInstallmentModal.html',
        controller: 'SaveInstallmentModalCtrl',
        resolve: {
          installment: jasmine.any(Function)
        }
      });
    });

    it('validate $scope.confirmDeleteModal()', function() {
      var dummy = "dummy";
      spyOn($uibModal, 'open');
      $scope.confirmDeleteModal(dummy);
      $scope.$digest();
      expect($uibModal.open).toHaveBeenCalledWith({
        animation: true,
        templateUrl: 'confirmDeleteModal.html',
        controller: 'ConfirmDeleteModalCtrl',
        resolve: {
          installment: jasmine.any(Function)
        }
      });
    });

  });

});
