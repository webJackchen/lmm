'use strict';
/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:DefinedCategoryCtrl
 * @description
 * # SettingimageCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
.controller('DefinedCategoryCtrl', ["$scope", "$element", "$filter", "baseService", "$timeout","$http","lanhWindow","messengerService",
    function ($scope, $element, $filter, baseService, $timeout, $http, lanhWindow, messengerService) {
        this.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
        ];

        /*********以下代码可以通用*********/
        //$scope.$parent.model[$scope.$parent.currentId] 固定对象, 获取当前元素对象
        var _currentObj = angular.copy($scope.$parent.model[$scope.$parent.currentId]);
        for (var property in _currentObj) {
            $scope[property] = _currentObj[property];
        }

        var data = $scope.data = $.extend({
            data: [], /*数据*/
            definedCategory: [],
            target:"_self"
        }, $scope.data)


        /*添加栏目*/
        /*自定义菜单属性*/
        $scope.type = "0";/*后台添加一条数据*/
        $scope.category = {
            title:{text: ""},
            type: "",
            type1: "news",
            category: "",
            condition: "",/*筛选条件*/
            url: "",
            link: "",
            key: ""
        }
        $scope.addCategorys = function ($event) {
            $http.get("/views/settings/adddefinedcategory.tpl.html")
              .success(function (result) {
                  lanhWindow.create({
                      title: "自定义菜单",
                      template: result,
                      open: function () {
                          $scope.category = {
                              title: { text: "" },
                              type: "",
                              type1: "news",
                              category: "",
                              condition: "",/*筛选条件*/
                              url: "",
                              link: "",
                              key: parseInt(Math.random() * 100)
                          }
                          loadCategoryData($scope.category.type1);
                      }
                  }, $scope);
              });
        }

        /*获取栏目下的分类*/
        $scope.categorys = [];
        var loadCategoryData = function (type) {
            var categories = [];
            baseService.get('proxy', { catgeoryList: true, catgeoryType: type })
            .then(function (result) {
                if (result) {
                    var dataObj = JSON.parse(result.jsonText);
                    var categorys = dataObj.channel.item;
                    if (!angular.isArray(categorys)) {
                        categorys = [categorys];
                    }
                    $scope.categorys = categorys;
                    if ($scope.type === "0") {
                        $scope.contentList = angular.copy($scope.categorys);
                    } else {
                        $scope.category.category = $scope.categorys[0].link;
                        loadContentList();
                    }
                }
            });
        }

        /*获取分类下的数据*/
        $scope.contentList = [];
        var loadContentList = function () {
            var data = {
                contentType: $scope.category.type == "" ? $scope.category.type1 : $scope.category.type,
                category: $scope.category.category
            }
            baseService.get('proxy/itemlist', data)
            .then(function (result) {
                var dataObj = JSON.parse(result.jsonText);
                var contentList = dataObj.channel.item;
                if (!angular.isArray(contentList)) {
                    contentList = [contentList];
                }
                $scope.contentList = contentList;
            });

        }

        /*改变分类类型*/
        $scope.changeType = function () {
            loadCategoryData($scope.category.type == "" ? $scope.category.type1 : $scope.category.type);
        }

        /*改变分类*/
        $scope.changeCategory = function () {
            loadContentList();
        }

        /*改变数据类型*/
        $scope.changeData = function () {
            if ($scope.type === "0") {
                $scope.contentList = angular.copy($scope.categorys);
            } else {
                $scope.category.category = $scope.categorys[0].link;
                loadContentList();
            }
        }

        /*选择数据*/
        $scope.getHref = function (data, $event) {
            $($event.currentTarget).addClass("active").siblings().removeClass("active");
            $scope.category.link = data.link;
            $scope.category.url = "/web" + data.url;
        }

        /*关闭添加分类窗口*/
        $scope.addDefinedCategory = function ($event) {
            if ($scope.category.title.text === "" || $scope.category.url === "") {
                messengerService.info("标题和链接不能为空");
            } else {
                $scope.data.definedCategory.push($scope.category);
                $scope.data.data = $scope.data.definedCategory;
                $($event.currentTarget).parents(".lanh-modal").dialog("close");
            }
        }

        /*删除分类*/
        $scope.removeCategory = function (data) {
            var a = $.grep($scope.data.definedCategory, function (n) {
                return n.link != data.link
            });
            $scope.data.definedCategory = angular.copy(a);
            $scope.data.data = $scope.data.definedCategory;
        }


        var sortable = function () {
            $element.find(".sortable").sortable({
                axis: "y",
                cursor: "move",
                handle: "i",
                items: ">li",
                update: function (event, ui) {       //更新排序之后
                    var array = [];
                    $.each($element.find(".sortable li"), function (i, el) {
                        var keys = $(el).attr("data-key");
                        var item = "";
                        if (keys) {
                            item = $.grep($scope.data.definedCategory, function (n) { return n.key == keys })[0];
                            array.push(item);
                        }
                    });
                    $scope.data.definedCategory = array;
                    $scope.data.data = $scope.data.definedCategory;
                }
            });
        }
        sortable();

        $scope.btnOK = function () {
            console.log($scope.data)
            $scope.$parent.$broadcast("framework.setting." + $scope.$parent.currentId, { data: $scope.data, template: $scope.template, style: $scope.style });
            $element.parent().dialog("close");    //固定方法, 关闭弹窗.
        }
    }
]);