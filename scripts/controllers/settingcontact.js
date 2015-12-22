'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:SettingcontactCtrl
 * @description
 * # SettingcontactCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('SettingcontactCtrl', ['$scope', '$element', '$http', '$filter',
      function ($scope, $element, $http, $filter) {
          $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          //*********以下代码可以通用*********
          //$scope.$parent.model[$scope.$parent.currentId] 固定对象, 获取当前元素对象
          var _currentObj = angular.copy($scope.$parent.model[$scope.$parent.currentId]);
          for (var property in _currentObj) {
              $scope[property] = _currentObj[property];
          }

          var kplusFieldMapping = [{
              key: 'person',
              name: '联系人',
          }, {
              key: 'address',
              name: '地址',
          }, {
              key: 'telephone',
              name: '电话',
          }, {
              key: 'rank',
              name: '传真',
          }, {
              key: 'mail',
              name: '邮箱',
          }, {
              key: 'zipcode',
              name: '邮编',
          }],
          getKplusAreaFields = function (contactItem, kplusObj) {
              var kplusCustomFields = kplusObj.channel.attributeTitle && kplusObj.channel.attributeTitle.item || [],
                  newFields = [],
                  moduleInfo = contactItem.moduleInfo || {},
                  fieldKeys = Object.keys(moduleInfo);

              for (var i = 0, j = fieldKeys.length; i < j; i++) {
                  var field = fieldKeys[i],
                      queryItems = $filter('filter')(kplusFieldMapping, function (item) { return item.key === field; });
                  if (queryItems && queryItems.length) {
                      newFields.push({
                          index: kplusFieldMapping.indexOf(queryItems[0]),
                          key: field,
                          field: field,
                          name: queryItems[0].name,
                          text: moduleInfo[field].text
                      });
                  }
              }

              if (!!kplusCustomFields) {
                  if (!angular.isArray(kplusCustomFields)) kplusCustomFields = [kplusCustomFields];
              }
              for (var i = 0, j = kplusCustomFields.length; i < j; i++) {
                  var fieldKey = kplusCustomFields[i].key,
                      field = kplusCustomFields[i].alias;
                  if (contactItem[fieldKey] || contactItem[field]) {
                      newFields.push({
                          index: newFields.length + 1,
                          key: fieldKey,
                          field: field,
                          name: kplusCustomFields[i].title,
                          text: contactItem[fieldKey].text || contactItem[field].text,
                          isCustom: true
                      });
                  }
              }
              return newFields;
          }, setAreas = function (kplusObj) {
              var kplusList = kplusObj.channel.item !== '0' ? kplusObj.channel.item : [],
                  areas = [];
              if (!angular.isArray(kplusList)) kplusList = [kplusList];

              for (var i = 0, j = kplusList.length; i < j; i++) {
                  areas.push({
                      key: kplusList[i].link.text,
                      text: kplusList[i].title.text,
                      fields: getKplusAreaFields(kplusList[i], kplusObj)
                  });
              }
              $scope.data.fields = areas;
              $scope.data.areaInfo = areas[0];
          },
          getDispalyFields = function () {
              var fields = $scope.data.areaInfo.fields,
                  displayFields = [],
                  selectedFieldsObject = $scope.data.selectedField;
              if (!$scope.data.selectedField || !Object.keys(selectedFieldsObject).length)
                  return [];
              for (var i = 0, j = fields.length; i < j; i++) {
                  var fieldName = fields[i].field;
                  if (!!$scope.data.selectedField[fieldName]) {
                      displayFields.push(angular.copy(fields[i]))
                  }
              }
              return $filter('orderBy')(displayFields, 'index');
          };

          $http.get(lanh.apiPath + "proxy?isContact=true")
              .success(function (result) {
                  var kplusObj = result.jsonText && JSON.parse(result.jsonText) || {};
                  setAreas(kplusObj)
              });

          $scope.applySetting = function () {
              $scope.data.areaKey = $scope.data.areaInfo.key;
              $scope.data.displayFields = getDispalyFields();
              $scope.$parent.$broadcast("framework.setting." + $scope.controlId, {
                  data: $scope.data,
                  template: $scope.template,
                  style: $scope.style
              });
              $element.parent().dialog("close");
          }
      }]);
