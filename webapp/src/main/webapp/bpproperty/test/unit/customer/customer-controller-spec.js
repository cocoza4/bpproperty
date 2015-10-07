describe('customer', function() {

  var mockCustomer = {
    id: 1,
    firstName: 'firstName',
    lastName: 'lastName',
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
      $rootScope.$digest();

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
      $rootScope.$digest();

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

  describe('CustomerCtrl', function() {

    beforeEach(function() {
      customerCtrl = $controller('CustomerCtrl', {
        $scope: $scope,
        Customer: mockCustomer,
        CustomerService: CustomerService,
        NotificationService: NotificationService,
      });
    });

    it('init', function() {
      expect($scope.customer).toEqual(mockCustomer);
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
        content: [{
          mockCustomer
        }, {
          mockCustomer
        }]
      };

      customerListCtrl = $controller('CustomerListCtrl', {
        $scope: $scope,
        $location: $location,
        CustomerService: CustomerService,
        Customers: mockCustomerObjTable,
      });
    });

    it('init', function() {
      expect($scope.recordsPerPageList).toEqual([10, 25, 50, 100]);
      expect($scope.currentPage).toEqual(1)
      expect($scope.recordsPerPage).toEqual(10)
    });

    it('validate $scope.onRecordsPerPageChanged', function() {
      spyOn($scope, 'updateCustomerTable');
      $scope.currentPage++;
      expect($scope.currentPage).toEqual(2)
      $scope.onRecordsPerPageChanged();
      expect($scope.currentPage).toEqual(1);
      expect($scope.updateCustomerTable).toHaveBeenCalled();
    });

    it('validate $scope.updateCustomerTable - happy path', function() {
      var deferred = $q.defer();
      spyOn(CustomerService, 'query').and.returnValue(deferred.promise);
      spyOn(customerListCtrl, 'updateScope');

      $scope.updateCustomerTable();

      deferred.resolve(mockCustomerObjTable);
      $rootScope.$digest();

      expect(CustomerService.query).toHaveBeenCalledWith({
        page: $scope.currentPage - 1, // zero-based page index
        length: $scope.recordsPerPage
      });
      expect(customerListCtrl.updateScope).toHaveBeenCalledWith(mockCustomerObjTable);
    });

    it('validate $scope.updateCustomerTable - non happy path', function() {
      var deferred = $q.defer();
      spyOn(CustomerService, 'query').and.returnValue(deferred.promise);
      spyOn(customerListCtrl, 'updateScope');

      $scope.updateCustomerTable();

      deferred.reject();
      $rootScope.$digest();

      expect(CustomerService.query).toHaveBeenCalledWith({
        page: $scope.currentPage - 1, // zero-based page index
        length: $scope.recordsPerPage
      });
      expect(customerListCtrl.updateScope).not.toHaveBeenCalled();
    });

    it('validate updateScope - totalRecords greater than totalDisplayRecords', function() {
      customerListCtrl.updateScope(mockCustomerObjTable);
      expect($scope.customers).toEqual(mockCustomerObjTable.content);
      expect($scope.totalRecords).toEqual(mockCustomerObjTable.totalRecords);
      expect($scope.startIndex).toEqual(1);
      expect($scope.endIndex).toEqual(10);
    });

    it('validate updateScope - totalRecords equal to totalDisplayRecords', function() {
      mockCustomerObjTable.totalRecords = 10;
      mockCustomerObjTable.totalDisplayRecords = 10;
      customerListCtrl.updateScope(mockCustomerObjTable);
      expect($scope.customers).toEqual(mockCustomerObjTable.content);
      expect($scope.totalRecords).toEqual(mockCustomerObjTable.totalRecords);
      expect($scope.startIndex).toEqual(1);
      expect($scope.endIndex).toEqual(10);
    });

    it('validate updateScope - totalRecords less to totalDisplayRecords', function() {
      mockCustomerObjTable.totalRecords = 10;
      mockCustomerObjTable.totalDisplayRecords = 50;
      customerListCtrl.updateScope(mockCustomerObjTable);
      expect($scope.customers).toEqual(mockCustomerObjTable.content);
      expect($scope.totalRecords).toEqual(mockCustomerObjTable.totalRecords);
      expect($scope.startIndex).toEqual(1);
      expect($scope.endIndex).toEqual(50);
    });

    it('validate updateScope - 2nd page', function() {
      $scope.currentPage = 2;
      customerListCtrl.updateScope(mockCustomerObjTable);
      expect($scope.customers).toEqual(mockCustomerObjTable.content);
      expect($scope.totalRecords).toEqual(mockCustomerObjTable.totalRecords);
      expect($scope.startIndex).toEqual(11);
      expect($scope.endIndex).toEqual(20);
    });

    it('validate updateScope - no customers', function() {
      mockCustomerObjTable.content = [];
      mockCustomerObjTable.totalRecords = 0;
      customerListCtrl.updateScope(mockCustomerObjTable);
      expect($scope.customers).toEqual(mockCustomerObjTable.content);
      expect($scope.totalRecords).toEqual(mockCustomerObjTable.totalRecords);
      expect($scope.startIndex).toEqual(0);
      expect($scope.endIndex).toEqual(0);
    });

  });

});
