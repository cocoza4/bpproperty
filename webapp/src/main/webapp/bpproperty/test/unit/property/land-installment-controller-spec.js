describe('land-installment', function() {

  beforeEach(module('land-installment'));

  beforeEach(inject(function($injector, _$controller_) {
    $location = $injector.get('$location');
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

      mockCriteria = {
        landId: 1,
        buyDetailId: 1
      };

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

      spyOn(InstallmentService, 'getTotalPayment').and.callThrough();

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

    it('validate loadInstallments', function() {

      InstallmentListCtrl.loadInstallments();
      $scope.$digest();

      expect(InstallmentService.query).toHaveBeenCalledWith(mockCriteria);
      expect(LandBuyService.query).toHaveBeenCalledWith(mockCriteria);
      expect(InstallmentService.getTotalPayment).toHaveBeenCalledWith(mockInstallments);

      expect($scope.landBuy).toEqual(mockLandBuyDetail);
      expect($scope.totalAmount).toEqual(6001.0);
      expect($scope.remaining).toEqual(93898.45);
    });

    it('validate saveInstallmentModal', function() {
      var dummy = "dummy";
      spyOn($uibModal, 'open');
      InstallmentListCtrl.saveInstallmentModal(dummy);
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

    it('validate confirmDeleteModal', function() {
      var dummy = "dummy";
      spyOn($uibModal, 'open');
      InstallmentListCtrl.confirmDeleteModal(dummy);
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
