describe('AuthenticationService', function() {

  beforeEach(module('authentication-service'));

  describe('Authentication', function() {

    var $httpBackend, Authentication;

    beforeEach(inject(function(_$httpBackend_, _Authentication_) {
      $httpBackend = _$httpBackend_;
      Authentication = _Authentication_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should send auth header', function() {

      var username = 'username',
        password = 'passwd';
      var callback = function(data) {
        expect(data.success).toBeTruthy();
      }

      $httpBackend.expect('GET', 'postlogin', undefined, function(headers) {
        return headers['authorization'] === "Basic " + btoa(username + ":" + password);
      }).respond(201, '');

      Authentication.authenticate(username, password, callback);
      $httpBackend.flush();
    });

    it('should authenticate successfully', function() {

      $httpBackend.when('GET', 'postlogin').respond(200, '');

      var callback = function(data) {
        expect(data.success).toBeTruthy();
        expect(data.message).toBeUndefined();
      }
      Authentication.authenticate('username', 'password', callback);

      $httpBackend.flush();
    });

    it('should fail to authenticate', function() {

      $httpBackend.when('GET', 'postlogin').respond(400, '');

      var callback = function(data) {
        expect(data.success).toBeUndefined();
        expect(data.message).toEqual('Username or password is incorrect');
      }
      Authentication.authenticate('username', 'password', callback);

      $httpBackend.flush();
    });
  });

  describe('AuthenticationService', function() {

    var AuthenticationService, $rootScope, $cookies;

    beforeEach(inject(function($injector) {

      $rootScope = $injector.get('$rootScope');
      $cookies = $injector.get('$cookies');
      var $http = $injector.get('$http');
      AuthenticationService = $injector.get('AuthenticationService');

      $rootScope.$digest();

    }));

    it('should authenticate user', inject(function(Authentication) {
      var username = 'username', password = 'passwd';
      spyOn(Authentication, 'authenticate');
      var callback = function(data) {
      }
      AuthenticationService.login(username, password, callback);
      expect(Authentication.authenticate).toHaveBeenCalledWith(username, password, callback);
    }));

    it('should logout', inject(function(_$httpBackend_) {
      var $httpBackend = _$httpBackend_;
      $httpBackend.when('POST', 'logout').respond(200, '');

      var callbackSpy = jasmine.createSpy('callback');
      AuthenticationService.logout(callbackSpy);
      $httpBackend.flush();

      expect(callbackSpy).toHaveBeenCalled();
    }));

    it('should set credentials and cookies', function() {
      var username = 'username', password = 'passwd';
      var authdata = btoa(username + ':' + password);
      AuthenticationService.setCredentials(username, password);

      expect($rootScope.globals.currentUser.username).toEqual(username);
      expect($rootScope.globals.currentUser.authdata).toEqual(authdata);

      expect($rootScope.globals).toEqual($cookies.getObject('globals'));

      // clean up
      $rootScope.globals = {};
      $cookies.remove('globals');
    });

    it('should clear credentials and cookies', function() {
      var username = 'username', password = 'passwd';
      var authdata = btoa(username + ':' + password);
      AuthenticationService.setCredentials(username, password);

      AuthenticationService.clearCredentials();

      expect($rootScope.globals).toEqual({});
      expect($cookies.getObject('globals')).toBeUndefined();
    });

  });

});
