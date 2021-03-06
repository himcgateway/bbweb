// Jasmine test suite
//
define(['angular', 'angularMocks', 'biobankApp'], function(angular, mocks) {
  'use strict';

  describe('Service: authorizationService', function() {

    var $rootScope, $q, biobankApi, authorization, usersService, resolved;
    //var fakeToken = 'fake-token';
    var user = {
      id:           'dummy-id',
      version:      1,
      timeAdded:    '2014-10-20T09:58:43-0600',
      name:         'testuser',
      email:        'testuser@test.com',
      avatarUrl:    'http://www.avatarsdb.com/avatars/duck_walking.gif',
      status:       'Active'
    };

    var failTest = function(error) {
      console.log('test fails', error);
      expect(error).toBeUndefined();
    };

    beforeEach(mocks.module('biobankApp'));

    beforeEach(inject(function (_$rootScope_,
                                _$q_,
                                _biobankApi_,
                                _usersService_,
                                _authorization_) {
      $rootScope    = _$rootScope_;
      $q            = _$q_;
      biobankApi    = _biobankApi_;
      usersService  = _usersService_;
      authorization = _authorization_;
      resolved      = false;
    }));

    describe('requireAuthenticatedUser', function () {

      it('requests the user from the server', function (done) {
        spyOn(biobankApi, 'get').and.callFake(function () {
          return $q.when(user);
        });

        expect(usersService.isAuthenticated()).toBe(false);
        authorization.requireAuthenticatedUser()
          .then(function () {
            resolved = true;
            expect(usersService.isAuthenticated()).toBe(true);
            expect(usersService.getCurrentUser()).toBe(user);
          })
          .catch(failTest)
            .finally(done);

        $rootScope.$digest();
        expect(resolved).toBe(true);
      });

      it('user is not authorized', function (done) {
        spyOn(biobankApi, 'get').and.callFake(function () {
          var deferred = $q.defer();
          deferred.reject();
          return deferred.promise;
        });

        expect(usersService.isAuthenticated()).toBe(false);
        authorization.requireAuthenticatedUser()
          .then(failTest)
          .catch(function () {
            resolved = true;
            expect(usersService.isAuthenticated()).toBe(false);
            expect(usersService.getCurrentUser()).toBe(null);
          })
            .finally(done);

        $rootScope.$digest();
        expect(resolved).toBe(true);
      });

      it('user fails authentication', function (done) {
        spyOn(biobankApi, 'get').and.callFake(function () {
          return $q.when(user);
        });

        spyOn(usersService, 'isAuthenticated').and.callFake(function () {
          return false;
        });

        authorization.requireAuthenticatedUser()
          .then(failTest)
          .catch(function () {
            resolved = true;
            expect(usersService.isAuthenticated()).toBe(false);
          })
            .finally(done);

        $rootScope.$digest();
        expect(resolved).toBe(true);
      });

    });

    describe('requireAdminUser', function () {

      it('requests the user from the server', function (done) {
        spyOn(biobankApi, 'get').and.callFake(function () {
          return $q.when(user);
        });

        expect(usersService.isAuthenticated()).toBe(false);
        authorization.requireAdminUser()
          .then(function () {
            resolved = true;
            expect(usersService.isAdmin()).toBe(true);
            expect(usersService.getCurrentUser()).toBe(user);
          })
          .catch(failTest)
            .finally(done);

        $rootScope.$digest();
        expect(resolved).toBe(true);
      });

      it('user is not authorized', function (done) {
        spyOn(biobankApi, 'get').and.callFake(function () {
          var deferred = $q.defer();
          deferred.reject();
          return deferred.promise;
        });

        expect(usersService.isAuthenticated()).toBe(false);
        authorization.requireAdminUser()
          .then(failTest)
          .catch(function () {
            resolved = true;
            expect(usersService.isAuthenticated()).toBe(false);
            expect(usersService.getCurrentUser()).toBe(null);
          })
            .finally(done);

        $rootScope.$digest();
        expect(resolved).toBe(true);
      });

      it('user fails authentication', function (done) {
        spyOn(biobankApi, 'get').and.callFake(function () {
          return $q.when(user);
        });

        spyOn(usersService, 'isAdmin').and.callFake(function () {
          return false;
        });

        authorization.requireAdminUser()
          .then(failTest)
          .catch(function () {
            resolved = true;
            expect(usersService.isAdmin()).toBe(false);
          })
            .finally(done);

        $rootScope.$digest();
        expect(resolved).toBe(true);
      });

    });

  });

});
