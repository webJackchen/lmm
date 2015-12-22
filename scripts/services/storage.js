'use strict';

/**
 * @ngdoc service
 * @name lanhKdesignApp.storage
 * @description
 * # storage
 * Service in the lanhKdesignApp.
 */
angular.module('lanhKdesignApp')
  .service('storage', ["$window",
      function ($window) {
          var create, storageFactory;
          storageFactory = {
              local: function () {
                  return $window.localStorage;
              },
              session: function () {
                  return $window.sessionStorage;
              }
          };
          create = function (storageName) {
              var del, get, set, storage;
              storage = (storageFactory[storageName] && storageFactory[storageName]()) || $.cookie;
              set = function (key, val, extend) {
                  if (storage.setItem) {
                      return storage.setItem(key, val);
                  }
                  extend || (extend = {
                      path: '/'
                  });
                  return storage(key, val, extend);
              };
              get = function (key, val, extend) {
                  if (storage.getItem) {
                      return storage.getItem(key, val);
                  }
                  extend || (extend = {
                      path: '/'
                  });
                  return storage(key, extend);
              };
              del = function (key) {
                  if (storage.removeItem) {
                      return storage.removeItem(key);
                  }
                  return $.removeCookie(key);
              };
              return {
                  set: set,
                  get: get,
                  del: del
              };
          };
          return {
              local: create('local'),
              session: create('session'),
              cookie: create('cookie')
          };
      }
  ]);
