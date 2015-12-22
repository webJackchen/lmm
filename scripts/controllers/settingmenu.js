'use strict';
/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:SettingMenuCtrl
 * @description
 * # SettingimageCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
.controller('SettingMenuCtrl', ["$scope", "$element", "$filter", "baseService", "$timeout","$http","lanhWindow","messengerService",
    function ($scope, $element, $filter, baseService, $timeout, $http, lanhWindow, messengerService) {
        this.awesomeThings = [
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

        var data = $scope.data = $.extend({
            selectMenus:[],
            menus: [],
            definedMenu:[]
        }, $scope.data);

        var getLinkListData = function (menu) {
            var list = [{ key: 'default', text: '首页', selected: true, href: "/web/default.html",show:true }];
            if (!angular.isArray(menu)) {
                menu = [menu];
            }
            for (var i = 0; i < menu.length; i++) {
                var menuIte = menu[i],
                    parentItem = {
                        text: menuIte.title.text,
                        key: menuIte.link,
                        href: "/web" + menuIte.url,
                        selected: false,
                        show: true
                    }, childList = [];

                if (menuIte.item) {
                    if (!angular.isArray(menuIte.item)) {
                        menuIte.item = [menuIte.item];
                    }
                    var menuItem = menuIte.item;
                    for (var j = 0; j < menuItem.length; j++) {
                        var childItem = menuItem[j];
                        menuItem[j].selected = false;
                        childList.push({
                            text: childItem.title.text,
                            key: childItem.link,
                            href: "/web" + childItem.url,
                            selected: false,
                            show: true
                        });
                    }
                }
                parentItem.childs = childList;
                list.push(parentItem);
            }
            return list;
        }

        
        /*重新加载数据*/
        var reloadCheckedData = function (menus) {
            if ($scope.data.selectMenus && $scope.data.selectMenus.length) {
                for (var i = 0; i < $scope.data.selectMenus.length; i++) {
                    var menuItem = $scope.data.selectMenus[i];
                    var firstQuery = $filter('filter')(menus, function (sourceItem) {
                        if (sourceItem.key === menuItem.key) {
                            sourceItem.selected = true;
                            return sourceItem.key === menuItem.key;
                        }
                    });
                    if (firstQuery && firstQuery.length) {
                        firstQuery[0].selected = true;
                    }
                    if (menuItem.childs && menuItem.childs.length) {
                        for (var m = 0, n = menuItem.childs.length; m < n; m++) {
                            var secondQuery = $filter('filter')(firstQuery[0].childs, function (childItem) {
                                if (childItem.key === menuItem.childs[m].key) {
                                    childItem.selected = true;
                                }
                            });
                        }
                    }
                }
            } else {
                $($element).find('.checkbox').attr({ checked: false });
            }
        }


        /*获取菜单*/
        var loadMenus = function () {
            baseService.get('proxy', { isSection: true }).then(function (result) {
                var kplusObj = result.jsonText && JSON.parse(result.jsonText) || {},
                dataList = kplusObj.channel.item;
                $scope.data.menus = getLinkListData(dataList);
                reloadCheckedData($scope.data.menus);
            });
        }

        /*添加菜单*/
        $scope.addMenus = function ($event) {
            $http.get("/views/settings/addmenus.tpl.html")
              .success(function (result) {
                  lanhWindow.create({
                      title: "选择栏目",
                      template: result,
                      open: function () {
                          loadMenus();
                      }
                  }, $scope);
              });
        }

        /*自定义菜单数据集*/
        console.log($scope.data.definedMenu)
        $scope.definedMenus = $.extend([],$scope.data.definedMenu) ;

        /*自定义菜单属性*/
        //$scope.type = "1";/*后台添加一条数据*/
        $scope.menu = {
            dataForm:"1",
            text: "",
            type: "",
            type1: "news",
            category: "",
            condition: "",/*筛选条件*/
            href: "",
            link:"",
            show: true,
            key: "",
            isEdit:false
        }
        /*自定义菜单*/
        $scope.definedMenu = function () {
            $http.get("/views/settings/definedmenus.tpl.html")
              .success(function (result) {
                  lanhWindow.create({
                      title: "自定义菜单",
                      template: result,
                      open: function () {
                          $scope.menu = {
                              dataForm: "1",
                              text: "",
                              type: "",
                              type1: "news",
                              category: "",
                              condition: "",/*筛选条件*/
                              href: "",
                              link: "",
                              show: true,
                              key: parseInt(Math.random() * 100),
                              isEdit: false
                          }
                         
                          loadCategoryData($scope.menu.type1);
                          $scope.isEdit = false;
                      }
                  }, $scope);
              });
        }

        /*编辑自定义菜单*/
        $scope.editData = {};
        $scope.isEdit = false;
        $scope.editMenu = function (data) {
            $http.get("/views/settings/definedmenus.tpl.html")
              .success(function (result) {
                  lanhWindow.create({
                      title: "自定义菜单",
                      template: result,
                      open: function () {
                          $scope.menu = data;
                          $scope.editData = $scope.menu;
                          $scope.isEdit = true;
                          loadCategoryData($scope.menu.type == "" ? $scope.menu.type1 : $scope.menu.type);
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
                    if (!$scope.menu.isEdit) {
                        $scope.menu.category = $scope.categorys[0].link;
                    }
                    loadContentList();
                }
            });
        }

        /*获取分类下的数据*/
        $scope.contentList = [];
        var loadContentList = function () {
            var data = {
                contentType: $scope.menu.type == "" ? $scope.menu.type1 : $scope.menu.type,
                category: $scope.menu.category
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
            $scope.isChange = false;
            loadCategoryData($scope.menu.type == "" ? $scope.menu.type1 : $scope.menu.type);
        }
        
        /*改变分类*/
        $scope.changeCategory = function () {
            loadContentList();
        }

        /*选择数据*/
        $scope.getHref = function (data) {
            $scope.menu.link = data.link;
            $scope.menu.href = "/web" + data.url;
        }

        /*菜单显示隐藏*/
        $scope.toggle = function (data) {
            data.show = !data.show;
            $scope.data.definedMenu = angular.copy($scope.definedMenus);
        }

        /*删除菜单*/
        $scope.removeMenu = function (data) {
            var a = $.grep($scope.definedMenus, function (n) {
                return n.link != data.link
            });
            $scope.definedMenus = angular.copy(a);
            $scope.data.definedMenu = angular.copy($scope.definedMenus);
        }

        /*关闭自定义菜单框*/
        $scope.addDefinedMenu = function ($event) {
            if ($scope.menu.text === "" || $scope.menu.href === "") {
                messengerService.info("标题和链接不能为空");
            } else {
                if ($scope.isEdit) {/*编辑*/
                    for (var i = 0; i < $scope.definedMenus.length; i++) {
                        if ($scope.definedMenus[i].key === $scope.editData.key) {
                            $scope.definedMenus[i] = $scope.editData;
                        }
                    }
                } else {
                    $scope.menu.isEdit = true;
                    $scope.definedMenus.push($scope.menu);
                }
                $scope.data.definedMenu = angular.copy($scope.definedMenus);
                $($event.currentTarget).parents(".lanh-modal").dialog("close");
            }
        }


        /*选择菜单*/
        var setSelectedMenu = function (callback) {
            var selectedItem = [];
            for (var i = 0, j = $scope.data.menus.length; i < j; i++) {
                var oldItem = $scope.data.menus[i],
                firstItem = angular.extend(angular.copy(oldItem), {
                    childs: []
                });
                if (oldItem.selected) {
                    if (oldItem.childs && oldItem.childs.length) {
                        for (var m = 0, n = oldItem.childs.length; m < n; m++) {
                            var childItem = oldItem.childs[m];
                            if (childItem.selected) {
                                firstItem.childs.push(angular.copy(childItem));
                            }
                        }
                    }
                    selectedItem.push(firstItem);
                }
            }
            $scope.data.selectMenus = angular.copy(selectedItem);
            console.log($scope.definedMenus)
            if ($scope.definedMenus && $scope.definedMenus.length) {/*添加自定义菜单*/
                for (var i = 0; i < $scope.definedMenus.length; i++) {
                    $scope.data.selectMenus.push($scope.definedMenus[i]);
                }
            }
            $timeout(function () {
                callback();
            });
        }

        /*一级菜单选择*/
        $scope.selectedMenu = function (event, menu) {
            menu.selected = !menu.selected;
            if (!menu.selected) {
                if (menu.childs && menu.childs.length) {
                    for (var i = 0, j = menu.childs.length; i < j; i++) {
                        menu.childs[i].selected = false;
                    }
                }
            }
        }

        /*二级菜单*/
        $scope.selectedChildMenu = function (event, menu, parentMenu) {
            menu.selected = !menu.selected;
            if (menu.selected) {
                parentMenu.selected = true;
            } 
        }
        
        /*关闭选择菜单框*/
        $scope.getSelectedMenu = function ($event) {
            setSelectedMenu(function () {
                $($event.currentTarget).parents(".lanh-modal").dialog("close");
            });
        }
       
        var sortable = function () {
            $element.find(".sortable").sortable({
                axis:"y",
                cursor: "move",
                handle:"i",
                items :">li",
                update : function(event, ui){       //更新排序之后
                    var array = [];
                    $.each($element.find(".sortable li"), function (i, el) {
                        var keys = $(el).attr("data-key");
                        var item = "";
                        if (keys) {
                            item = $.grep($scope.data.selectMenus, function (n) { return n.key == keys })[0];
                            array.push(item);
                        }
                    });
                    $scope.data.selectMenus = array;
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