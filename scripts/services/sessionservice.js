'use strict';

/**
 * @ngdoc service
 * @name lanhKdesignApp.SessionService
 * @description
 * # SessionService
 * Service in the lanhKdesignApp.
 */
angular.module('lanhKdesignApp')
  .service('SessionService', ["storage",
      function (stroage) {
          // AngularJS will instantiate a singleton by calling "new" on this function
          var session = {
              setInterval: function (interval) {
                  var now = new Date();
                  var expires = new Date(now.getTime() + interval * 60000);
                  stroage.local.set('INTERVAL', interval);
                  stroage.local.set('EXPIRES', expires.getTime());
              },
              sessionValid: function () {
                  var interval = parseInt(stroage.local.get('INTERVAL')) || 0;
                  var expires = new Date(parseInt(stroage.local.get('EXPIRES')));
                  var now = new Date();
                  var active = expires == null ? (new Date(now.getTime() + interval * 60000)) : expires;
                  //return false;
                  return active > now;
              },
              updateExpire: function () {
                  var interval = parseInt(stroage.local.get('INTERVAL')) || 0;
                  var now = new Date();
                  var expires = (new Date(now.getTime() + interval * 60000));
                  stroage.local.set('EXPIRES', expires.getTime());
              },
              checkLogin: function () {
                  if (!stroage.session.get('AuthorizationCode')) {
                      $rootScope.$broadcast('httpErrorRedirectLogon', { 'code': '-1' });
                      //$rootScope.$apply();
                  } else if (this.sessionValid() == false) {
                      $rootScope.$broadcast('httpErrorNeedLogon', { 'code': 900 });
                      //$rootScope.$apply();
                  }
              }
          };
          return session;
      }
  ]);
