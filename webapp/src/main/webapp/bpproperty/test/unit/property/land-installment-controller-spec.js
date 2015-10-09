describe('land-installment', function() {

  beforeEach(module('land-installment'));

  beforeEach(inject(function($injector, _$controller_) {
    $location = $injector.get('$location');
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $controller = _$controller_;
    $q = $injector.get('$q');
    NotificationService = $injector.get('NotificationService');
    InstallmenService = $injector.get('InstallmentService');
  }));

  describe('InstallmentListCtrl', function() {

    it('init', function() {
      expect(null).toBeNull();
    });

  });

});
