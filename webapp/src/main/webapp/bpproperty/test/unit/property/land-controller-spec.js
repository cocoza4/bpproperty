describe('land', function() {

  var mockLand = {
    id: 1,
    name: 'bpproperty land',
    address: 'address',
    area: {
      rai: 1,
      yarn: 1,
      tarangwa: 1
    }
  }

  beforeEach(module('land'));

  beforeEach(inject(function($injector, _$controller_) {
    $location = $injector.get('$location');
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $controller = _$controller_;
    $q = $injector.get('$q');
    NotificationService = $injector.get('NotificationService');
    LandService = $injector.get('LandService');
  }));

  describe('CreateLandCtrl', function() {

    beforeEach(function() {
      createLandCtrl = $controller('CreateLandCtrl', {
        $scope: $scope,
        $location: $location,
        LandService: LandService,
        NotificationService: NotificationService,
      });
    });

    it('init', function() {
      expect($scope.land).toEqual({});
    });

    it('should create a new land', function() {
      $scope.land = mockLand;
      var deferred = $q.defer();
      spyOn(LandService, 'create').and.returnValue(deferred.promise);
      spyOn(NotificationService, 'notify');
      spyOn(createLandCtrl, 'redirectToLandPage');

      $scope.submit(true);

      deferred.resolve($scope.land);
      $rootScope.$digest();

      expect(LandService.create).toHaveBeenCalledWith($scope.land);
      expect(NotificationService.notify).toHaveBeenCalledWith({
        type: 'success',
        msg: 'Land created'
      });
      expect(createLandCtrl.redirectToLandPage).toHaveBeenCalled();
    });

    it('should fail to create a new land', function() {
      $scope.land = mockLand;
      var deferred = $q.defer();
      spyOn(LandService, 'create').and.returnValue(deferred.promise);
      spyOn(NotificationService, 'notify');
      spyOn(createLandCtrl, 'redirectToLandPage');

      $scope.submit(true);

      deferred.reject();
      $rootScope.$digest();

      expect(LandService.create).toHaveBeenCalledWith($scope.land);
      expect(NotificationService.notify).toHaveBeenCalledWith({
        type: 'error',
        msg: 'Unable to create Land'
      });
      expect(createLandCtrl.redirectToLandPage).not.toHaveBeenCalled();
    });

    it('should not update a land - invalid input data', function() {
      $scope.land = mockLand;
      spyOn(LandService, 'create');
      spyOn(NotificationService, 'notify');
      spyOn(createLandCtrl, 'redirectToLandPage');

      $scope.submit(false);

      expect(LandService.create).not.toHaveBeenCalledWith($scope.land);
      expect(NotificationService.notify).not.toHaveBeenCalledWith();
      expect(createLandCtrl.redirectToLandPage).not.toHaveBeenCalled();
    });

  });

  describe('LandListCtrl', function() {

    beforeEach(function() {
      mockLandObjTable = {
        totalDisplayRecords: 10,
        totalRecords: 100,
        content: [{
          mockLand
        }, {
          mockLand
        }]
      };

      landListCtrl = $controller('LandListCtrl', {
        $scope: $scope,
        $location: $location,
        LandService: LandService,
        Lands: mockLandObjTable,
      });
    });

    it('init', function() {
      expect($scope.recordsPerPageList).toEqual([10, 25, 50, 100]);
      expect($scope.currentPage).toEqual(1);
      expect($scope.recordsPerPage).toEqual(10);
    });

    it('validate $scope.onRecordsPerPageChanged', function() {
      spyOn($scope, 'updateLandTable');
      $scope.currentPage++;
      expect($scope.currentPage).toEqual(2);
      $scope.onRecordsPerPageChanged();
      expect($scope.currentPage).toEqual(1);
      expect($scope.updateLandTable).toHaveBeenCalled();
    });

    it('validate $scope.updateLandTable - happy path', function() {
      var deferred = $q.defer();
      spyOn(LandService, 'query').and.returnValue(deferred.promise);
      spyOn(landListCtrl, 'updateScope');

      $scope.updateLandTable();

      deferred.resolve(mockLandObjTable);
      $rootScope.$digest();

      expect(LandService.query).toHaveBeenCalledWith({
        page: $scope.currentPage - 1, // zero-based page index
        length: $scope.recordsPerPage
      });
      expect(landListCtrl.updateScope).toHaveBeenCalledWith(mockLandObjTable);
    });

    it('validate $scope.updateLandTable - non happy path', function() {
      var deferred = $q.defer();
      spyOn(LandService, 'query').and.returnValue(deferred.promise);
      spyOn(landListCtrl, 'updateScope');

      $scope.updateLandTable();

      deferred.reject();
      $rootScope.$digest();

      expect(LandService.query).toHaveBeenCalledWith({
        page: $scope.currentPage - 1, // zero-based page index
        length: $scope.recordsPerPage
      });
      expect(landListCtrl.updateScope).not.toHaveBeenCalled();
    });

    it('validate updateScope - totalRecords greater than totalDisplayRecords', function() {
      landListCtrl.updateScope(mockLandObjTable);
      expect($scope.lands).toEqual(mockLandObjTable.content);
      expect($scope.totalRecords).toEqual(mockLandObjTable.totalRecords);
      expect($scope.startIndex).toEqual(1);
      expect($scope.endIndex).toEqual(10);
    });

    it('validate updateScope - totalRecords equal to totalDisplayRecords', function() {
      mockLandObjTable.totalRecords = 10;
      mockLandObjTable.totalDisplayRecords = 10;
      landListCtrl.updateScope(mockLandObjTable);
      expect($scope.lands).toEqual(mockLandObjTable.content);
      expect($scope.totalRecords).toEqual(mockLandObjTable.totalRecords);
      expect($scope.startIndex).toEqual(1);
      expect($scope.endIndex).toEqual(10);
    });

    it('validate updateScope - totalRecords less to totalDisplayRecords', function() {
      mockLandObjTable.totalRecords = 10;
      mockLandObjTable.totalDisplayRecords = 50;
      landListCtrl.updateScope(mockLandObjTable);
      expect($scope.lands).toEqual(mockLandObjTable.content);
      expect($scope.totalRecords).toEqual(mockLandObjTable.totalRecords);
      expect($scope.startIndex).toEqual(1);
      expect($scope.endIndex).toEqual(50);
    });

    it('validate updateScope - 2nd page', function() {
      $scope.currentPage = 2;
      landListCtrl.updateScope(mockLandObjTable);
      expect($scope.lands).toEqual(mockLandObjTable.content);
      expect($scope.totalRecords).toEqual(mockLandObjTable.totalRecords);
      expect($scope.startIndex).toEqual(11);
      expect($scope.endIndex).toEqual(20);
    });

    it('validate updateScope - no customers', function() {
      mockLandObjTable.content = [];
      mockLandObjTable.totalRecords = 0;
      landListCtrl.updateScope(mockLandObjTable);
      expect($scope.lands).toEqual(mockLandObjTable.content);
      expect($scope.totalRecords).toEqual(mockLandObjTable.totalRecords);
      expect($scope.startIndex).toEqual(0);
      expect($scope.endIndex).toEqual(0);
    });

  });

  describe('LandDetailCtrl', function() {

    beforeEach(inject(function($injector) {
      $uibModal = $injector.get('$uibModal');
      LandBuyService = $injector.get('LandBuyService');

      LandDetailCtrl = $controller('LandDetailCtrl', {
        $scope: $scope,
        $uibModal: $uibModal,
        Land: mockLand,
        LandService: LandService,
        LandBuyService: LandBuyService,
        NotificationService: NotificationService,
      });
    }));

    it('init', function() {
      expect($scope.land).toEqual(mockLand);
    });

    it('validate deleteModal()', function() {
      spyOn($uibModal, 'open');
      LandDetailCtrl.deleteModal();
      expect($uibModal.open).toHaveBeenCalledWith({
        animation: true,
        templateUrl: 'confirmDeleteModal.html',
        controller: 'ConfirmDeleteLandModalCtrl',
        resolve: {
          land: jasmine.any(Function),
          exists: jasmine.any(Function)
        }
      });
    });

    it('should update a land successfully', function() {

      var deferred = $q.defer();
      spyOn(LandService, 'update').and.returnValue(deferred.promise);
      spyOn(NotificationService, 'notify');

      $scope.submit(true);

      deferred.resolve();
      $rootScope.$digest();

      expect(LandService.update).toHaveBeenCalledWith($scope.land);
      expect(NotificationService.notify).toHaveBeenCalledWith({
        type: 'success',
        msg: $scope.land.name + ' updated'
      });
    });

    it('should fail to update a land', function() {

      var deferred = $q.defer();
      spyOn(LandService, 'update').and.returnValue(deferred.promise);
      spyOn(NotificationService, 'notify');

      $scope.submit(true);

      deferred.reject();
      $rootScope.$digest();

      expect(LandService.update).toHaveBeenCalledWith($scope.land);
      expect(NotificationService.notify).toHaveBeenCalledWith({
        type: 'error',
        msg: 'Unable to update ' + $scope.land.name
      });
    });

    it('should not update a land - invalid input data', function() {

      spyOn(LandService, 'update');
      spyOn(NotificationService, 'notify');

      $scope.submit(false);

      expect(LandService.update).not.toHaveBeenCalled();
      expect(NotificationService.notify).not.toHaveBeenCalledWith();
    });

  });

  describe('ConfirmDeleteLandModalCtrl', function() {

    beforeEach(inject(function($injector) {
      $modalInstance = jasmine.createSpyObj('$modalInstance', ['close', 'dismiss']);
      ConfirmDeleteLandModalCtrl = $controller('ConfirmDeleteLandModalCtrl', {
        $scope: $scope,
        $location: $location,
        $modalInstance: $modalInstance,
        NotificationService: NotificationService,
        LandService: LandService,
        land: mockLand,
        exists: true,
      });
    }));

    it('init', function() {
      expect($scope.land).toEqual(mockLand);
      expect($scope.exists).toBeTruthy();
    });

    it('validate $scope.delete() - success', function() {
      var deferred = $q.defer();
      spyOn(LandService, 'delete').and.returnValue(deferred.promise);
      spyOn(NotificationService, 'notify');

      $scope.delete();
      deferred.resolve();
      $scope.$digest();

      expect($modalInstance.dismiss).toHaveBeenCalledWith('cancel');
      expect(LandService.delete).toHaveBeenCalledWith($scope.land);
      expect(NotificationService.notify).toHaveBeenCalledWith({
        type: 'success',
        msg: 'Land deleted'
      });
    });

    it('validate $scope.delete() - failure', function() {
      var deferred = $q.defer();
      spyOn(LandService, 'delete').and.returnValue(deferred.promise);
      spyOn(NotificationService, 'notify');

      $scope.delete();
      deferred.reject();
      $scope.$digest();

      expect($modalInstance.dismiss).toHaveBeenCalledWith('cancel');
      expect(LandService.delete).toHaveBeenCalledWith($scope.land);
      expect(NotificationService.notify).toHaveBeenCalledWith({
        type: 'error',
        msg: 'Unable to delete'
      });
    });

  });

});
