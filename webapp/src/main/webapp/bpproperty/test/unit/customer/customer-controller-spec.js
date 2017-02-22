/*jshint esnext: true */
describe('customer', function() {

  mockCustomer = {
    id: 1,
    firstName: 'firstName',
    lastName: 'lastName'
  };

  mockLandBuyDetailObjTable = {
    "totalRecords": 100,
    "totalDisplayRecords": 10,
    "content": [{
      "id": 1,
      "landId": 1,
      "buyType": "INSTALLMENT",
      "buyerFirstName": "firstname1",
      "buyerLastName": "lastname1",
      "downPayment": 100.55,
      "buyPrice": 1000.1,
      "annualInterest": 15.0,
      "totalPayment": 500,
      "installmentMonths": 5,
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
      "installmentMonths": null,
      "description": null,
      "area": {
        "rai": 5,
        "yarn": 5,
        "tarangwa": 10
      },
      "createdTime": 1446183913864
    }]
  };

  beforeEach(module('customer'));

  beforeEach(inject(function($injector, _$controller_) {
    $location = $injector.get('$location');
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $controller = _$controller_;
    $q = $injector.get('$q');
    NotificationService = $injector.get('NotificationService');
    CustomerService = $injector.get('CustomerService');
    LandBuyService = $injector.get('LandBuyService');
  }));

  describe('CreateCustomerCtrl', function() {

    beforeEach(function() {

      createCustomerCtrl = $controller('CreateCustomerCtrl', {
        $scope: $scope,
        $location: $location,
        CustomerService: CustomerService,
        NotificationService: NotificationService,
      });

    });

    it('init', function() {
      expect($scope.customer).toEqual({});
    });

    it('should create a new customer', function() {
      $scope.customer = mockCustomer;
      var deferred = $q.defer();
      spyOn(CustomerService, 'create').and.returnValue(deferred.promise);
      spyOn(NotificationService, 'notify');
      spyOn(createCustomerCtrl, 'redirectToCustomerPage');

      $scope.submit(true);

      deferred.resolve($scope.customer);
      $scope.$digest();

      expect(CustomerService.create).toHaveBeenCalledWith($scope.customer);
      expect(NotificationService.notify).toHaveBeenCalledWith({
        type: 'success',
        msg: 'Customer created'
      });
      expect(createCustomerCtrl.redirectToCustomerPage).toHaveBeenCalled();
    });

    it('should fail to create a new customer', function() {
      $scope.customer = mockCustomer;
      var deferred = $q.defer();
      spyOn(CustomerService, 'create').and.returnValue(deferred.promise);
      spyOn(NotificationService, 'notify');
      spyOn(createCustomerCtrl, 'redirectToCustomerPage');

      $scope.submit(true);

      deferred.reject();
      $scope.$digest();

      expect(CustomerService.create).toHaveBeenCalledWith($scope.customer);
      expect(NotificationService.notify).toHaveBeenCalledWith({
        type: 'error',
        msg: 'Unable to create Customer'
      });
      expect(createCustomerCtrl.redirectToCustomerPage).not.toHaveBeenCalled();
    });

    it('should not update a customer - invalid input data', function() {

      $scope.customer = mockCustomer;
      spyOn(CustomerService, 'create');
      spyOn(NotificationService, 'notify');
      spyOn(createCustomerCtrl, 'redirectToCustomerPage');

      $scope.submit(false);

      expect(CustomerService.create).not.toHaveBeenCalledWith($scope.customer);
      expect(NotificationService.notify).not.toHaveBeenCalledWith();
      expect(createCustomerCtrl.redirectToCustomerPage).not.toHaveBeenCalled();
    });

  });

  describe('CustomerLandsCtrl', function() {
    beforeEach(inject(function($injector) {
      customerLands = {
        customer: mockCustomer,
        landBuyDetails: mockLandBuyDetailObjTable
      };
      CustomerLandsCtrl = $controller('CustomerLandsCtrl', {
        $scope: $scope,
        $location: $location,
        CustomerService: CustomerService,
        LandBuyService: LandBuyService,
        CustomerLands: customerLands
      });
    }));

    it('init', function() {
      expect($scope.gridOptions.data).toEqual(mockLandBuyDetailObjTable.content);
      expect($scope.gridOptions.totalItems).toEqual(mockLandBuyDetailObjTable.totalRecords);
      expect($scope.customer).toEqual(mockCustomer);
      expect(CustomerLandsCtrl.criteria).toEqual({
        id: 1,
        buyType: null,
        page: null,
        length: null
      });
    });

    it('validate queryTable() - happy path', function() {
      var deferred = $q.defer();
      spyOn(CustomerService, 'queryByCustomerId').and.returnValue(deferred.promise);

      CustomerLandsCtrl.queryTable();

      deferred.resolve(mockLandBuyDetailObjTable);
      $scope.$digest();

      expect(CustomerService.queryByCustomerId).toHaveBeenCalledWith(CustomerLandsCtrl.criteria);
      expect($scope.gridOptions.totalItems).toEqual(100);
      expect($scope.gridOptions.data).toEqual(mockLandBuyDetailObjTable.content);
    });

  });

  describe('CustomerCtrl', function() {

    beforeEach(inject(function($injector) {
      $uibModal = $injector.get('$uibModal');
      customerCtrl = $controller('CustomerCtrl', {
        $scope: $scope,
        $uibModal: $uibModal,
        Customer: mockCustomer,
        CustomerService: CustomerService,
        NotificationService: NotificationService,
      });
    }));

    it('init', function() {
      expect($scope.customer).toEqual(mockCustomer);
    });

    it('validate deleteModal()', function() {
      spyOn($uibModal, 'open');
      customerCtrl.deleteModal();
      expect($uibModal.open).toHaveBeenCalledWith({
        animation: true,
        templateUrl: 'confirmDeleteModal.html',
        controller: 'ConfirmDeleteCustomerModalCtrl',
        resolve: {
          customer: jasmine.any(Function),
          exists: jasmine.any(Function)
        }
      });
    });

    it('should update a customer successfully', function() {

      var deferred = $q.defer();
      spyOn(CustomerService, 'update').and.returnValue(deferred.promise);
      spyOn(NotificationService, 'notify');

      $scope.submit(true);

      deferred.resolve();
      $rootScope.$digest();

      expect(CustomerService.update).toHaveBeenCalledWith($scope.customer);
      expect(NotificationService.notify).toHaveBeenCalledWith({
        type: 'success',
        msg: 'Customer updated'
      });
    });

    it('should fail to update a customer', function() {

      var deferred = $q.defer();
      spyOn(CustomerService, 'update').and.returnValue(deferred.promise);
      spyOn(NotificationService, 'notify');

      $scope.submit(true);

      deferred.reject();
      $rootScope.$digest();

      expect(CustomerService.update).toHaveBeenCalledWith($scope.customer);
      expect(NotificationService.notify).toHaveBeenCalledWith({
        type: 'error',
        msg: 'Unable to update Customer'
      });
    });

    it('should not update a customer - invalid input data', function() {

      spyOn(CustomerService, 'update');
      spyOn(NotificationService, 'notify');

      $scope.submit(false);

      expect(CustomerService.update).not.toHaveBeenCalled();
      expect(NotificationService.notify).not.toHaveBeenCalledWith();
    });
  });

  describe('CustomerListCtrl', function() {

    beforeEach(function() {

      mockCustomerObjTable = {
        totalDisplayRecords: 10,
        totalRecords: 100,
        content: [
          mockCustomer,
          mockCustomer
        ]
      };

      customerListCtrl = $controller('CustomerListCtrl', {
        $scope: $scope,
        $location: $location,
        CustomerService: CustomerService,
        Customers: mockCustomerObjTable,
      });
    });

    it('init', function() {
      expect($scope.gridOptions.data).toEqual(mockCustomerObjTable.content);
      expect($scope.gridOptions.totalItems).toEqual(mockCustomerObjTable.totalRecords);
      expect($scope.criteria).toEqual({
        firstname: null,
        lastname: null,
        address: null,
        tel: null,
        page: null,
        length: null
      });
    });

    it('validate $scope.queryTable() - happy path', function() {
      var deferred = $q.defer();
      spyOn(CustomerService, 'query').and.returnValue(deferred.promise);

      $scope.queryTable();

      deferred.resolve(mockCustomerObjTable);
      $scope.$digest();

      expect(CustomerService.query).toHaveBeenCalledWith($scope.criteria);
      expect($scope.gridOptions.totalItems).toEqual(100);
      expect($scope.gridOptions.data).toEqual(mockCustomerObjTable.content);
    });

  });

  describe('ConfirmDeleteCustomerModalCtrl', function() {

    beforeEach(inject(function($injector) {
      $modalInstance = jasmine.createSpyObj('$modalInstance', ['close', 'dismiss']);
      ConfirmDeleteCustomerModalCtrl = $controller('ConfirmDeleteCustomerModalCtrl', {
        $scope: $scope,
        $location: $location,
        $modalInstance: $modalInstance,
        NotificationService: NotificationService,
        CustomerService: CustomerService,
        customer: mockCustomer,
        exists: true,
      });
    }));

    it('init', function() {
      expect($scope.customer).toEqual(mockCustomer);
      expect($scope.exists).toBeTruthy();
    });

    it('validate $scope.delete() - success', function() {
      var deferred = $q.defer();
      spyOn($location, 'path');
      spyOn(CustomerService, 'delete').and.returnValue(deferred.promise);
      spyOn(NotificationService, 'notify');

      $scope.delete();
      deferred.resolve();
      $scope.$digest();

      expect($location.path).toHaveBeenCalledWith('/customers');
      expect($modalInstance.dismiss).toHaveBeenCalledWith('cancel');
      expect(CustomerService.delete).toHaveBeenCalledWith($scope.customer);
      expect(NotificationService.notify).toHaveBeenCalledWith({
        type: 'success',
        msg: 'Customer deleted'
      });
    });

    it('validate $scope.delete() - failure', function() {
      var deferred = $q.defer();
      spyOn(CustomerService, 'delete').and.returnValue(deferred.promise);
      spyOn(NotificationService, 'notify');

      $scope.delete();
      deferred.reject();
      $scope.$digest();

      expect($modalInstance.dismiss).toHaveBeenCalledWith('cancel');
      expect(CustomerService.delete).toHaveBeenCalledWith($scope.customer);
      expect(NotificationService.notify).toHaveBeenCalledWith({
        type: 'error',
        msg: 'Unable to delete'
      });
    });

  });

});
