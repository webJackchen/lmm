'use strict';

/**
 * @ngdoc service
 * @name lanhKdesignApp.utilsService
 * @description
 * # utilsService
 * Service in the lanhKdesignApp.
 */
angular.module('lanhKdesignApp')
  .service('utilsService', function () {
      var self = this;

      var _uuid = {
          newuuid: function () {
              var s = [];
              var hexDigits = "0123456789abcdef";
              for (var i = 0; i < 36; i++) {
                  s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
              }
              s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
              s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
              s[8] = s[13] = s[18] = s[23] = "-";
              return s.join("");
          },
          newguid: function () {
              return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                  s4() + '-' + s4() + s4() + s4();
          }
      }

      function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
      }

      var _compensate = function (val, number, sign) {
          var reLength = val.toString().length;
          if (!number || reLength > number) return val;
          var prexStr = sign + '';
          for (var i = 1, j = number - reLength; i < j; i++) {
              prexStr += sign
          }
          return prexStr + val;
      }

      var _uniqueId = function (type) {
          if (type === 'uuid') return _uuid.newuuid();
          if (type == 'guid') return _uuid.newguid();
          var dateObj = new Date();
          return (dateObj.getFullYear() - 2000).toString()
              + _compensate((dateObj.getMonth() + 1), 2, '0')
              + _compensate(dateObj.getDate(), 2, '0')
              + _compensate(dateObj.getHours(), 2, '0')
              + _compensate(dateObj.getMinutes(), 2, '0') +
              _compensate(dateObj.getSeconds(), 2, '0');
      }
      self.uniqueId = _uniqueId;

      self.loop = function loop(obj, childName, callback) {
          if (!angular.isObject(obj)) return;

          var childData = obj[childName];
          if (angular.isArray(childData) && childData.length) {
              for (var i = 0, ii = childData.length; i < ii; i++) {
                  if (callback) callback(obj, childData[i], this);
                  loop(childData[i], childName, callback);
              }
          }
      };

  });
