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

  describe('CreateLandBuyDetailCtrl', function() {

    beforeEach(inject(function($injector) {

      $body = $('body'),
      html = '<div id="selectBuyerDialog"></div>';

      CreateLandBuyDetailCtrl = $controller('CreateLandBuyDetailCtrl', {
        $scope: $scope,
        Land: mockLand,
        CustomerService: CustomerService,
        Land: mockLand,
      });

      $compile = $injector.get('$compile');
      el = $compile(angular.element(html))($scope);

      // $rootScope.$digest();

    }));

    it('init', function() {
      expect($scope.currentPage).toEqual(1);
      expect($scope.customer).toEqual({});
      expect($scope.selectedCustomer).toEqual({});
      expect($scope.land).toEqual(mockLand);
    });

    // it('validate $scope.updateOnScreen', function() {
    //   // spyOn(CreateLandBuyDetailCtrl.buyerDialog, 'buyerDialog');
    //   alert(CreateLandBuyDetailCtrl.buyerDialog.show);
    //   $scope.updateOnScreen();
    //   expect($scope.customer).toEqual($scope.selectedCustomer);
    // });

    it('validate $scope.selectBuyer', function() {
      var customer = null;
      expect($scope.selectedCustomer).not.toEqual(customer);
      $scope.selectBuyer(customer);
      expect($scope.selectedCustomer).toEqual(customer);
    });

  });

  describe('LandBuyDetailListCtrl', function() {

    beforeEach(function() {
      LandBuyDetailListCtrl = $controller('LandBuyDetailListCtrl', {
        $scope: $scope,
        $$routeParams: $routeParams,
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
    })

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

});
