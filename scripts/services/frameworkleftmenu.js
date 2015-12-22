'use strict';

/**
 * @ngdoc service
 * @name lanhKdesignApp.FrameworkLeftMenu
 * @description
 * # FrameworkLeftMenu
 * Service in the lanhKdesignApp.
 */
angular.module('lanhKdesignApp')
  .service('FrameworkLeftMenuService', ["storage", function (storage) {
      // AngularJS will instantiate a singleton by calling "new" on this function
      var self = this;

      self.getLeftMenuJson = function () {
          var platform = "";
          switch (storage.session.get("platformType")) {
              case "mobile":
                  platform = "mobile";
                  break;
              default:
                  platform = "pc";
                  break;
          }
          return angular.copy(_menus[platform]);
      }

      var _attachMenu = null;
      var _searchMenuOption = function (key, _menus) {
          $.each(_menus, function (i, _menu) {
              if (_menu.key == key) {
                  _attachMenu = _menu;
              } else if (!!_menu.childs && _menu.childs.length > 0) {
                  _searchMenuOption(key, _menu.childs);
              }
          });
      }

      self.getMenuInfo = function (key) {
          _searchMenuOption(key, self.getLeftMenuJson());
          return _attachMenu;
      }

      /*
        key: 唯一标识,
        name: 菜单节点名称
        icon: 图标名称
        category: 类别. 目前仅有Web
        desc: 摘要
        type: 类型. setting | category
        childs: 当前节点的子级集合
        defaultTemplate: { html: "", css: "", js: "", previewImg:"" } 前三个属性设置默认显示的模块模板文件路径; 最后一个属性设置自定义样式的默认预览图路径;
        action: 设置打开方式(点击节点后) "default": 页面编辑区加载模板显示(默认) | "window": 加载控件到编辑区之后弹出设置窗口 | "setting": 直接弹出设置窗口(不加载控件到编辑区,用于系统设置等场景) | "select": 仅仅是辅助弹窗加载setting模板(对页面数据不造成任何影响)
        additional: 可选支持创建区域. header or footer or header|footer (不设置将自动禁用该功能)
        settingBaseStyle: 设置基础样式可设置的内容 backgroundColor | backgroundImage | backgroundRepeat | backgroundPosition | border | opacity (不设置将自动禁用该功能)
        settingTemplateUrl: 设置窗口对应的模板文件路径(不设置将自动禁用该功能)
        style: 可设置CSS的初始默认值。例如 style:{ "width": 200; "border-width": 5; }
        resizeHandles:  //n, e, s, w, ne, se, sw, nw,   左:w, 右:e, 上: n, 下:s
        dragCallback:   //拖动之后的回调事件。（Warning: 事件名称为全局名称，请尽量定义规范，避免冲突）
        resizeCallback:  //改变大小后的回调事件。（Warning: 事件名称为全局名称，请尽量定义规范，避免冲突）
        canDelete: //是否允许删除. true | false (default: true)
        canLock:   //是否允许锁定. true | false (default: true)
        visible:    //是否在左边菜单显示该节点 true | false (default: true)
        role:       //在固定模式下可见，多选已逗号隔开. web, component (default: web,component) 使用场景: 组件库需要隐藏部分选项.
        addTools: ["scale","stretch"] //数组格式，扩展的功能。 目前支持 1:1 = "scale" | "通栏 = "stretch"
      */
      var _menus = {
          pc: [{
              "key": "setting",
              "name": "设置",
              "icon": "icon-set-up-o",
              "category": "Web",
              "desc": "提供页面背景", //提供页面背景、网站SEO设置、域名绑定功能
              "type": "Setting",
              "role": "web",
              "childs": [
                  {
                      "key": "setting_global",
                      "name": "全局设置",
                      "type": "Setting",
                      "category": "Web",
                      "icon": "icon-pic-background",
                      "controlId": "pageBackground",
                      "additional": "header|footer",
                      "action": "setting",
                      "location": "page",
                      "settingTemplateUrl": "./../views/common/global.tpl.html"
                  },
                  {
                      "key": "setting_backgroud",
                      "name": "页面背景",
                      "type": "Setting",
                      "category": "Web",
                      "icon": "icon-pic-background",
                      "controlId": "pageBackground",
                      "additional": "header|footer",
                      "action": "setting",
                      "location": "page",
                      "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition"],
                      "settingTemplateUrl": "./../views/common/settingbasestyle.tpl.html"
                  },
                  {
                      "key": "setting_header",
                      "name": "头部设置",
                      "type": "Setting",
                      "category": "Web",
                      "icon": "icon-top-settings",
                      "controlId": "pageBackground",
                      "additional": "header|footer",
                      "action": "setting",
                      "location": "header",
                      "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition"],
                      "settingTemplateUrl": "./../views/common/settingbasestyle.tpl.html"
                  },
                  {
                      "key": "setting_body",
                      "name": "中部设置",
                      "type": "Setting",
                      "category": "Web",
                      "icon": "icon-pic-background",
                      "controlId": "pageBackground",
                      "additional": "header|footer",
                      "action": "setting",
                      "location": "body",
                      "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition"],
                      "settingTemplateUrl": "./../views/common/settingbasestyle.tpl.html"
                  },
                  {
                      "key": "setting_footer",
                      "name": "底部设置",
                      "type": "Setting",
                      "category": "Web",
                      "icon": "icon-down-settings",
                      "controlId": "pageBackground",
                      "additional": "header|footer",
                      "action": "setting",
                      "location": "footer",
                      "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition"],
                      "settingTemplateUrl": "./../views/common/settingbasestyle.tpl.html"
                  }
                  //{
                  //    "key": "setting_seo",
                  //    "name": "SEO设置",
                  //    "type": "Setting",
                  //    "category": "Web",
                  //    "action": "setting",
                  //    "icon": "icon-seo-settings",
                  //    "settingTemplateUrl": "./../views/settings/seo.tpl.html"
                  //}
              ]
          }, {
              "key": "controls",
              "name": "模块",
              "icon": "icon-modular",
              "desc": "选择你喜欢的模块组装你的网页",
              "type": "Controls",
              "category": "Web",
              "childs": [
                  {
                      "key": "controls_text",
                      "name": "文字",
                      "icon": "icon-edit-fonts",
                      "type": "Controls",
                      "additional": "header|footer",
                      "style": { width: 200, height: 100 },
                      "defaultTemplate": {
                          "html": "../../controls/text/text.tpl.html",
                          "css": "",
                          "js": "",
                          "previewImg": "../../controls/text/preview.jpg"
                      },
                      "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                      "settingTemplateUrl": "../../views/settings/text.tpl.html",
                      "data": { "settingContext": "双击此处添加文字" }
                  },
                  {
                      "key": "controls_image",
                      "name": "图片",
                      "icon": "icon-pic-background",
                      "type": "Controls",
                      "additional": "header|footer",
                      "defaultTemplate": {
                          "html": "../../controls/image/image.tpl.html",
                          "css": "../../controls/image/image.css",
                          "js": "../../controls/image/image.js",
                          "previewImg": "../../controls/image/preview.jpg"
                      },
                      "style": { width: 220, height: 220 },
                      "data": {
                          "src": "../../images/no_image_220x220.jpg"
                      },
                      "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                      "addTools": ["scale", "stretch", "createStyle"],
                      "settingTemplateUrl": "./../views/settings/image.tpl.html"
                  },
                  {
                      "key": "controls_gallery",
                      "name": "画廊",
                      "icon": "icon-draw",
                      "type": "Controls",
                      "childs": [
                          {
                              "key": "controls_gallery_grid",
                              "name": "网格",
                              "icon": "icon-grid",
                              "type": "Controls",
                              "additional": "header|footer",
                              "style": { width: 400, height: 300, background: "#eee" },
                              "defaultTemplate": {
                                  "html": "../../controls/gallery/grid/grid.tpl.html",
                                  "css": "../../controls/gallery/grid/grid.css",
                                  "js": "../../controls/gallery/grid/grid.js",
                                  "previewImg": "../../controls/gallery/grid/preview.jpg"
                              },
                              //"action": "window",
                              "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                              "settingTemplateUrl": "./../views/settings/grid.tpl.html",
                              "resizeCallback": 'control.grid.reload',
                              "data": {
                                  "attrs": { "col": 2, "row": 2 },
                                  "$item$": [{ "url": "javascript:void(0)", "image": { "url": "../../images/no_image_220x220.jpg" }, "allTitle": { "text": "Mock Data 1" } },
                                             { "url": "javascript:void(0)", "image": { "url": "../../images/no_image_220x220.jpg" }, "allTitle": { "text": "Mock Data 2" } },
                                             { "url": "javascript:void(0)", "image": { "url": "../../images/no_image_220x220.jpg" }, "allTitle": { "text": "Mock Data 3" } },
                                             { "url": "javascript:void(0)", "image": { "url": "../../images/no_image_220x220.jpg" }, "allTitle": { "text": "Mock Data 4" } }]
                              },
                              "addTools": ["createStyle"]
                          },
                          {
                              "key": "controls_gallery_slide",
                              "name": "幻灯片",
                              "icon": "icon-slides",
                              "type": "Controls",
                              "additional": "header|footer",
                              "style": { width: 700, height: 400, background: "#eee" },
                              "defaultTemplate": {
                                  "html": "../../controls/gallery/slide/slide.tpl.html",
                                  "css": "../../controls/gallery/slide/slide.css",
                                  "js": "../../controls/gallery/slide/slide.js",
                                  "previewImg": "../../controls/gallery/slide/preview.jpg"
                              },
                              //"action": "window",
                              "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                              "settingTemplateUrl": "./../views/settings/slide.tpl.html",
                              "resizeCallback": 'gallery.slide.reload',
                              "addTools": ["stretch", "createStyle"],
                              "data": {
                                  "$item$": [{ "url": "javascript:void(0)", "image": { "url": "../../images/no_image_220x220.jpg" }, "allTitle": { "text": "Mock Data 1" } },
                                             { "url": "javascript:void(0)", "image": { "url": "../../images/no_image_220x220.jpg" }, "allTitle": { "text": "Mock Data 2" } },
                                             { "url": "javascript:void(0)", "image": { "url": "../../images/no_image_220x220.jpg" }, "allTitle": { "text": "Mock Data 3" } },
                                             { "url": "javascript:void(0)", "image": { "url": "../../images/no_image_220x220.jpg" }, "allTitle": { "text": "Mock Data 4" } }]
                              }
                          },
                          {
                              "key": "controls_gallery_thumbnail",
                              "name": "缩略图",
                              "icon": "icon-thumbnail",
                              "type": "Controls",
                              "additional": "header|footer",
                              "style": { width: 800, height: 460, background: "#eee" },
                              "defaultTemplate": {
                                  "html": "../../controls/gallery/thumbnail/thumbnail.tpl.html",
                                  "css": "../../controls/gallery/thumbnail/thumbnail.css",
                                  "js": "../../controls/gallery/thumbnail/thumbnail.js",
                                  "previewImg": "../../controls/gallery/thumbnail/preview.jpg"
                              },
                              //"action": "window",
                              "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                              "settingTemplateUrl": "../../views/settings/thumbnail.tpl.html",
                              "resizeCallback": 'gallery.thumbnail.reload',
                              "addTools": ["stretch", "createStyle"],
                              "data": {
                                  "$item$": [{ "url": "javascript:void(0)", "image": { "url": "../../images/no_image_220x220.jpg" }, "allTitle": { "text": "Mock Data 1" } },
                                             { "url": "javascript:void(0)", "image": { "url": "../../images/no_image_220x220.jpg" }, "allTitle": { "text": "Mock Data 2" } },
                                             { "url": "javascript:void(0)", "image": { "url": "../../images/no_image_220x220.jpg" }, "allTitle": { "text": "Mock Data 3" } },
                                             { "url": "javascript:void(0)", "image": { "url": "../../images/no_image_220x220.jpg" }, "allTitle": { "text": "Mock Data 4" } }]
                              }
                          },
                          {
                              "key": "controls_gallery_fullSlide",
                              "name": "大幅幻灯片",
                              "icon": "icon-large-slides",
                              "type": "Controls",
                              "additional": "header|footer",
                              "style": { width: "auto", height: 300, background: "#eee" },
                              "defaultTemplate": {
                                  "html": "../../controls/gallery/fullslide/fullslide.tpl.html",
                                  "css": "../../controls/gallery/fullslide/fullslide.css",
                                  "js": "../../controls/gallery/fullslide/fullslide.js",
                                  "previewImg": "../../controls/gallery/fullslide/preview.jpg"
                              },
                              //"action": "window",
                              "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                              "settingTemplateUrl": "../../views/settings/fullslide.tpl.html",
                              'resizeHandles': 'n,s',
                              "resizeCallback": 'gallery.fullslide.reload',
                              "addTools": ["stretch", "createStyle"],
                              "data": {
                                  "$item$": [{ "url": "javascript:void(0)", "image": { "url": "../../images/no_image_220x220.jpg" }, "allTitle": { "text": "Mock Data 1" } },
                                             { "url": "javascript:void(0)", "image": { "url": "../../images/no_image_220x220.jpg" }, "allTitle": { "text": "Mock Data 2" } },
                                             { "url": "javascript:void(0)", "image": { "url": "../../images/no_image_220x220.jpg" }, "allTitle": { "text": "Mock Data 3" } },
                                             { "url": "javascript:void(0)", "image": { "url": "../../images/no_image_220x220.jpg" }, "allTitle": { "text": "Mock Data 4" } }]
                              }
                          }
                          //{
                          //    "key": "controls_gallery_stripwindow",
                          //    "name": "条形陈列窗",
                          //    "icon": "icon-bd-box",
                          //    "type": "Controls",
                          //    "additional": "header|footer"
                          //},
                          //{
                          //    "key": "controls_gallery_bigstripwindow",
                          //    "name": "大幅陈列窗",
                          //    "icon": "icon-sic--box",
                          //    "type": "Controls",
                          //    "additional": "header|footer"
                          //}
                      ]
                  },
                  {
                      "key": "controls_media",
                      "name": "媒体",
                      "icon": "icon-multimedia",
                      "type": "Controls",
                      "childs": [
                          {
                              "key": "controls_media_video",
                              "name": "视频",
                              "icon": "icon-video",
                              "type": "Controls",
                              "additional": "header|footer",
                              "style": { width: 200, height: 200 },
                              "defaultTemplate": {
                                  "html": "../../controls/media/video/video.tpl.html",
                                  "css": "",
                                  "js": "../../controls/media/video/video.js",
                                  "previewImg": "../../controls/media/video/preview.jpg"
                              },
                              "settingBaseStyle": ["opacity", "border"],
                              "addTools": ["createStyle"],
                              "settingTemplateUrl": "./../views/settings/video.tpl.html"
                          },
                          {
                              "key": "controls_media_audio",
                              "name": "音频",
                              "icon": "icon-music",
                              "type": "Controls",
                              "additional": "header|footer"
                          }
                      ]
                  },
                  {
                      "key": "controls_shapeandline",
                      "name": "形状和线条",
                      "icon": "icon-bar-display-box",
                      "type": "Controls",
                      "childs": [
                          {
                              "key": "controls_shapeandline_bar",
                              "name": "矩形",
                              "icon": "icon-bar-frame",
                              "type": "Controls",
                              "additional": "header|footer",
                              "style": { width: 200, height: 100 },
                              "defaultTemplate": {
                                  "html": "../../controls/shapeandline/barframe/barframe.tpl.html",
                                  "css": "",
                                  "js": "",
                                  "previewImg": "../../controls/shapeandline/barframe/preview.jpg"
                              },
                              "addTools": ["stretch", "createStyle"],
                              "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                          },
                          {
                              "key": "controls_shapeandline_hline",
                              "name": "横线",
                              "icon": "icon-line-horizontal",
                              "type": "Controls",
                              "additional": "header|footer",
                              "style": { width: 200, height: "auto" },
                              "resizeHandles": "e, w",
                              "defaultTemplate": {
                                  "html": "../../controls/shapeandline/linehorizontal/linehorizontal.tpl.html",
                                  "css": "",
                                  "js": "",
                                  "previewImg": "../../controls/shapeandline/linehorizontal/preview.jpg"
                              },
                              "addTools": ["stretch", "createStyle"],
                              //"settingBaseStyle": ["opacity", "border"],
                              "settingTemplateUrl": "./../views/settings/linehorizontal.tpl.html",
                              data: { opacity: 100 }
                          },
                          {
                              "key": "controls_shapeandline_vline",
                              "name": "竖线",
                              "icon": "icon-line-vertical",
                              "type": "Controls",
                              "additional": "header|footer",
                              "style": { "width": "auto", "height": 200 },
                              "resizeHandles": "n, s",
                              "defaultTemplate": {
                                  "html": "../../controls/shapeandline/linevertical/linevertical.tpl.html",
                                  "css": "",
                                  "js": "",
                                  "previewImg": "../../controls/shapeandline/linevertical/preview.jpg"
                              },
                              //"settingBaseStyle": ["opacity", "border"],
                              "settingTemplateUrl": "./../views/settings/linevertical.tpl.html",
                              "addTools": ["stretch", "createStyle"],
                              data: { opacity: 100 }
                          }
                      ]
                  },
                  {
                      "key": "controls_menu",
                      "name": "菜单",
                      "icon": "icon-uibutton",
                      "type": "Controls",
                      "childs": [
                          {
                              "key": "controls_base_hmenu",
                              "name": "横向菜单",
                              "icon": "icon-menu-transverse",
                              "type": "Controls",
                              "additional": "header|footer",
                              "style": { width: 400, height: 100, overflow: "visible" },
                              "addTools": ["createStyle"],
                              "defaultTemplate": {
                                  "html": "../../controls/menu/hmenu/hmenu.tpl.html",
                                  "css": "../../controls/menu/hmenu/hmenu.css",
                                  "js": "../../controls/menu/hmenu/hmenu.js",
                                  "previewImg": "../../controls/menu/hmenu/preview.jpg"
                              },
                              //"action": "window",
                              "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                              "settingTemplateUrl": "./../views/settings/hmenu.tpl.html",
                              "data": { "selectMenus": [{ "text": "首页", "href": "", key: "index", show: true }, { "text": "多屏商铺", "href": "", key: "shop", show: true }, { "text": "商铺管理", "href": "", key: "manage", show: true }] }
                          },
                          {
                              "key": "controls_base_vmenu",
                              "name": "竖向菜单",
                              "icon": "icon-menu-vertical",
                              "type": "Controls",
                              "additional": "header|footer",
                              "addTools": ["createStyle"],
                              "style": { width: 150, height: 400, overflow: "visible" },
                              "defaultTemplate": {
                                  "html": "../../controls/menu/vmenu/vmenu.tpl.html",
                                  "css": "../../controls/menu/vmenu/vmenu.css",
                                  "js": "../../controls/menu/vmenu/vmenu.js",
                                  "previewImg": "../../controls/menu/vmenu/preview.jpg"
                              },
                              //"action": "window",
                              "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                              "settingTemplateUrl": "./../views/settings/vmenu.tpl.html",
                              "data": { "selectMenus": [{ "text": "首页", "href": "", key: "index", show: true }, { "text": "多屏商铺", "href": "", key: "shop", show: true }, { "text": "商铺管理", "href": "", key: "manage", show: true }] }
                          }
                      ]
                  },
                  //{
                  //    "key": "controls_onlineshopping",
                  //    "name": "在线购物",
                  //    "icon": "icon-shopping",
                  //    "type": "Controls"
                  //},
                  /*{
                      "key": "controls_plugs",
                      "name": "基础插件",
                      "icon": "icon-basic-plug-in",
                      "type": "Controls",
                      "childs": [
                          {
                              "key": "controls_plugs_map",
                              "name": "地图",
                              "icon": "icon-map-navigation",
                              "type": "Controls",
                              "additional": "header|footer",
                              "style": { width: 200, height: 200 },
                              "defaultTemplate": {
                                  "html": "../../controls/plugs/map/map.tpl.html",
                                  "css": "",
                                  "js": "../../controls/plugs/map/js/map.js",
                                  "previewImg": "../../controls/plugs/map/preview.jpg"
                              },
                              "settingBaseStyle": ["opacity", "border"]
                          },
                          {
                              "key": "controls_plugs_tab",
                              "name": "选项卡",
                              "icon": "icon-options",
                              "type": "Controls",
                              "additional": "header|footer"
                          },
                          {
                              "key": "controls_plugs_flash",
                              "name": "Flash",
                              "icon": "icon-flash",
                              "type": "Controls",
                              "additional": "header|footer"
                          }
                      ]
                  },*/ {
                      "key": "controls_list",
                      "name": "列表",
                      "icon": "icon-list",
                      "type": "Controls",
                      "childs": [
                          {
                              "key": "controls_list_category",
                              "name": "文章分类",
                              "icon": "icon-article-categories",
                              "type": "Controls",
                              "additional": "header|footer",
                              "addTools": ["createStyle"],
                              "style": { width: 150, height: 200 },
                              "defaultTemplate": {
                                  "html": "../../controls/list/categoryList/categoryList.tpl.html",
                                  "css": "../../controls/list/categoryList/categoryList.css",
                                  "js": "../../controls/list/categoryList/categoryList.js",
                                  "previewImg": "../../controls/list/categoryList/preview.jpg"
                              },
                              "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                              "settingTemplateUrl": "./../views/settings/categoryList.tpl.html",
                              "data": {
                                  showType: true,
                                  category: "news",
                                  "data": [
                                      { "title": { "text": "国内新闻" }, "src": "", "target": "_self" },
                                      { "title": { "text": "国际新闻" }, "src": "", "target": "_self" }
                                  ]
                              }
                          }, {
                              "key": "controls_list_content",
                              "name": "文章列表",
                              "icon": "icon-article-list",
                              "type": "Controls",
                              "additional": "header|footer",
                              "addTools": ["createStyle"],
                              "style": { width: 400, height: 200 },
                              "defaultTemplate": {
                                  "html": "../../controls/list/contentlist/contentlist.tpl.html",
                                  "css": "../../controls/list/contentlist/contentlist.css",
                                  "js": "../../controls/list/contentlist/contentlist.js",
                                  "previewImg": "../../controls/list/contentlist/preview.jpg"
                              },
                              "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                              "settingTemplateUrl": "./../views/settings/contentlist.tpl.html",
                              resizeCallback: 'control.contentlist.reload',
                              "data": {
                                  showType: true,
                                  category: "news",
                                  $item$: [
                                      { "url": "", "title": { "text": "祝贺蓝海基业英雄会圆满落幕！" }, "pubDate": { "text": "2014-10-01" } },
                                      { "url": "", "title": { "text": "祝贺蓝海基业英雄会圆满落幕！" }, "pubDate": { "text": "2014-10-01" } }
                                  ]
                              }
                          }, {
                              "key": "controls_list_category",
                              "name": "产品分类",
                              "icon": "icon-product-categories",
                              "type": "Controls",
                              "additional": "header|footer",
                              "addTools": ["createStyle"],
                              "style": { width: 150, height: 200 },
                              "defaultTemplate": {
                                  "html": "../../controls/list/categoryList/categoryList.tpl.html",
                                  "css": "../../controls/list/categoryList/categoryList.css",
                                  "js": "../../controls/list/categoryList/categoryList.js",
                                  "previewImg": "../../controls/list/categoryList/preview.jpg"
                              },
                              "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                              "settingTemplateUrl": "./../views/settings/categoryList.tpl.html",
                              "data": {
                                  showType: false,
                                  category: "product",
                                  "data": [
                                      { "title": { "text": "生活用品" }, "src": "", "target": "_self" },
                                      { "title": { "text": "床上用品" }, "src": "", "target": "_self" }
                                  ]
                              }
                          }, {
                              "key": "controls_list_content",
                              "name": "产品列表",
                              "icon": "icon-product-list",
                              "type": "Controls",
                              "additional": "header|footer",
                              "addTools": ["createStyle"],
                              "style": { width: 280, height: 360 },
                              "defaultTemplate": {
                                  "html": "../../controls/list/contentlist/contentlist.tpl.html",
                                  "css": "../../controls/list/contentlist/contentlist.css",
                                  "js": "../../controls/list/contentlist/contentlist.js",
                                  "previewImg": "../../controls/list/contentlist/preview.jpg"
                              },
                              "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                              "settingTemplateUrl": "./../views/settings/contentlist.tpl.html",
                              "data": {
                                  showType: false,
                                  category: "product",
                                  row: "1",
                                  col: "1",
                                  $item$: [
                                      {
                                          "url": "",
                                          "title": { "text": "祝贺蓝海基业英雄会圆满落幕！" },
                                          "image": { "url": "../../images/no_image_220x220.jpg" },
                                          "moduleInfo": { "sale": { "text": "0.00" } },
                                          "visitCount": "0"
                                      }
                                  ]
                              },
                              resizeCallback: 'control.contentlist.reload',
                          }, {
                              "key": "controls_list_category",
                              "name": "招聘分类",
                              "icon": "icon-job-classification",
                              "type": "Controls",
                              "additional": "header|footer",
                              "addTools": ["createStyle"],
                              "style": { width: 150, height: 200 },
                              "defaultTemplate": {
                                  "html": "../../controls/list/categoryList/categoryList.tpl.html",
                                  "css": "../../controls/list/categoryList/categoryList.css",
                                  "js": "../../controls/list/categoryList/categoryList.js",
                                  "previewImg": "../../controls/list/categoryList/preview.jpg"
                              },
                              "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                              "settingTemplateUrl": "./../views/settings/categoryList.tpl.html",
                              "data": {
                                  showType: false,
                                  category: "job",
                                  "data": [
                                      { "title": { "text": "行政" }, "url": "", "target": "_self" },
                                      { "title": { "text": "财务" }, "url": "", "target": "_self" }
                                  ]
                              }
                          }, {
                              "key": "controls_list_content",
                              "name": "招聘列表",
                              "icon": "icon-job-list",
                              "type": "Controls",
                              "additional": "header|footer",
                              "addTools": ["createStyle"],
                              "style": { width: 400, height: 200 },
                              "defaultTemplate": {
                                  "html": "../../controls/list/contentlist/contentlist.tpl.html",
                                  "css": "../../controls/list/contentlist/contentlist.css",
                                  "js": "../../controls/list/contentlist/contentlist.js",
                                  "previewImg": "../../controls/list/contentlist/preview.jpg"
                              },
                              "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                              "settingTemplateUrl": "./../views/settings/contentlist.tpl.html",
                              resizeCallback: 'control.contentlist.reload',
                              "data": {
                                  showType: false,
                                  category: "job",
                                  $item$: [
                                      { "url": "", "title": { "text": "祝贺蓝海基业英雄会圆满落幕！" }, "pubDate": { "text": "2014-10-01" } },
                                      { "url": "", "title": { "text": "祝贺蓝海基业英雄会圆满落幕！" }, "pubDate": { "text": "2014-10-01" } }
                                  ]
                              }
                          },
                          {
                              "key": "controls_list_defined_category",
                              "name": "自定义分类",
                              "icon": "icon-custom-classification",
                              "type": "Controls",
                              "additional": "header|footer",
                              "addTools": ["createStyle"],
                              "style": { width: 150, height: 200 },
                              "defaultTemplate": {
                                  "html": "../../controls/list/definedcategory/categoryList.tpl.html",
                                  "css": "../../controls/list/definedcategory/categoryList.css",
                                  "js": "../../controls/list/definedcategory/categoryList.js",
                                  "previewImg": "../../controls/list/definedcategory/preview.jpg"
                              },
                              "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                              "settingTemplateUrl": "./../views/settings/definedcategorylist.tpl.html",
                              "data": {
                                  "data": [
                                      { "title": { "text": "行政" }, "url": "", "target": "_self", link: "1" },
                                      { "title": { "text": "财务" }, "url": "", "target": "_self", link: "2" }
                                  ]
                              }

                          }
                          , {
                              "key": "controls_details",
                              "name": "详情展示区",
                              "icon": "icon-list",
                              "type": "Controls",
                              "visible": false,
                              "childs": [{
                                  "key": "controls_download_detail",
                                  "name": "下载详情区",
                                  "icon": "icon-details",
                                  "type": "Controls",
                                  "location": "body",
                                  "resizeHandles": "w,e",
                                  "addTools": ["createStyle"],
                                  "style": { width: "auto", height: "auto" },
                                  "defaultTemplate": {
                                      "html": "../../controls/detail/download/download.tpl.html",
                                      "css": "../../controls/detail/detail.css",
                                      "js": "../../controls/detail/download/download.js",
                                      "previewImg": "../../controls/detail/download/download.jpg"
                                  },
                                  "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                                  "settingTemplateUrl": "../../views/settings/download.tpl.html",
                                  "canDelete": true,
                                  "data": {
                                      $title$: { text: "蓝海基业代理商加盟相关资料下载" },
                                      $pubDate$: { text: "2015-07-29" },
                                      $visitcount$: { text: 0 },
                                      $enclosure$: { text: "../../images/no_image_220x220.jpg" },
                                      $content$: {
                                          text: '<p><span>北京诚招电子商务平台网站代理商</span></p><p>' +
                                          '<span>蓝海基业</span><span>诚招北京地区业务代理商、北京战略合作伙伴！</span></p><p><span>代理商工作内容：</span></p>' +
                                          '<p><span>发展您所代理城市的广告业务及增值服务的收益，拉广告</span></p><br>'
                                      },
                                      file: 'true',
                                      count: 'true',
                                      $module: 'download',
                                      $dataconfig: '<model>download</model>'
                                  }
                              }, {
                                  "key": "controls_article_detail",
                                  "name": "简介详情区",
                                  "resizeHandles": "w,e",
                                  "icon": "icon-details",
                                  "type": "Controls",
                                  "location": "body",
                                  "style": { width: "auto", height: "auto" },
                                  "defaultTemplate": {
                                      "html": "../../controls/detail/introduce/introduce.tpl.html",
                                      "css": "../../controls/detail/detail.css",
                                      "js": "",
                                      "previewImg": "../../controls/detail/introduce/introduce.jpg"
                                  },
                                  "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                                  "settingTemplateUrl": "../../views/settings/introduce.tpl.html",
                                  "canDelete": true,
                                  "addTools": ["createStyle"],
                                  "data": {
                                      $title$: { text: "蓝海简介" },
                                      $pubdate$: { text: "2015-07-29" },
                                      $visitcount$: { text: 0 },
                                      $content$: {
                                          text: '<p><span>&nbsp;&nbsp; 蓝海基业信息技术有限公司，源于2004年，是一家专注于中国IT移动应用服务的高新科技企业，是中国领先的IT移动应用服务提供商。公司现拥有多家分公司，遍及华南、华中、华北、西南、西北等地，员工超过1000余人。</span></p><p><span>&nbsp;</span>' +
                                              '</p><p><span> &nbsp; &nbsp; 公司在2014年提供的产品服务主要分为三个方面：</span></p>' +
                                              '<p><span> &nbsp; &nbsp; 一、企业基础服务，提供：域名注册、商标注册、版权申请、知识产权服务等；</span></p><p><span>&nbsp;</span></p>' +
                                              '<p><span> &nbsp; &nbsp; 二、企业IT移动应用服务，推出了行业技术领先的K+平台，产品包括（一）K+多屏：K+企业网站、K+企业手机网站、K+企业手机客户端、K+企业微站;(二)K+商城：k+电脑商城、K+商城客户端、K+微商城、K+手机版商城；（三）K+微产品：K+智慧商家、K+微餐饮、K+微酒店、K+品牌二维码等；</span></p>' +
                                              '<p><span> &nbsp; &nbsp; 三、行业应用服务，推出了商云系统，包括行业网站、行业手机网站、行业客户端等。</span></p>' +
                                              '<p><span> &nbsp; &nbsp; 一直以来，公司投入巨资进行IT移动应用技术研发，拥有大批经验丰富的资深技术研发人才，公司研发中心研发的多屏技术、云技术、LSB、AR等技术成果，正在为广大客户提供强有力的技术和业务运营支持。截止2014年6月已经为上万家政府机构及企事业单位如中银汇丰、香港丹尼卡斯（DANYCASE）、万客来集团、中海天然气、北大荒米业集团、蜀安驾校、云南铜业、老拔云堂、滇虹药业、昆明市旅游局等提供服务并获良好口碑。</span></p>' +
                                              '<p><span> &nbsp;&nbsp; 公司秉承着“让客户生意更容易，让员工生活更美好”的企业使命，以“特别能战斗、特别能吃苦、特别有胸怀”的企业精神和 “认真、快、坚守承诺、绝不找借口”的工作作风，为客户提供“诚信、专业、高效、贴心”的顾问式服务，以公司领先的技术和优质的服务，帮助客户在经营中建立新的竞争优势！</span></p>'
                                      },
                                      $module: 'article',
                                      $dataconfig: '<model>article</model>'
                                  }
                              }, {
                                  "key": "controls_job_detail",
                                  "name": "招聘详情区",
                                  "resizeHandles": "w,e",
                                  "icon": "icon-details",
                                  "type": "Controls",
                                  "location": "body",
                                  "style": { width: "auto", height: "auto" },
                                  "defaultTemplate": {
                                      "html": "../../controls/detail/job/job.tpl.html",
                                      "css": "../../controls/detail/detail.css",
                                      "js": "../../controls/detail/detailJob.js",
                                      "previewImg": "../../controls/detail/job/job.jpg"
                                  },
                                  "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                                  "settingTemplateUrl": "../../views/settings/job.tpl.html",
                                  "canDelete": true,
                                  "addTools": ["createStyle"],
                                  "data": {
                                      $title$: { text: "高级产品经理（高级）" },
                                      $pubDate$: { text: "2015-07-29" },
                                      $visitcount$: { text: 0 },
                                      $price$: { text: "4K-7K" },
                                      $sex$: { text: "不限" },
                                      $hnumber$: { text: "2015-10-10" },
                                      $rank$: { text: "本科" },
                                      $configure$: { text: "2-3年" },
                                      $address$: { text: "成都市武侯区" },
                                      $person$: { text: "1-2" },
                                      $content$: {
                                          text: '<p><span>任职要求：</span></p>' +
                                          '<p><span >1.&nbsp; &nbsp;&nbsp; 互联网或移动互联网产品管理3年以上，主导过至少1个产品的整个生命周期管理</span></p>' +
                                          '<p><span>2.&nbsp; &nbsp;&nbsp; 深入理解企业应用市场；清晰的把握客户和用户的需求；</span></p>' +
                                          '<p><span >3.&nbsp; &nbsp;&nbsp; 熟悉企业互联网应用类产品的规划、策划、推广和数据分析；</span></p>'
                                      },
                                      $module: 'job',
                                      $dataconfig: '<model>job</model>'
                                  }
                              }, {
                                  "key": "controls_news_detail",
                                  "name": "新闻详情区",
                                  "resizeHandles": "w,e",
                                  "icon": "icon-details",
                                  "type": "Controls",
                                  "location": "body",
                                  "style": { width: "auto", height: "auto" },
                                  "defaultTemplate": {
                                      "html": "../../controls/detail/news/news.tpl.html",
                                      "css": "../../controls/detail/detail.css",
                                      "js": "../../controls/detail/detailNews.js",
                                      "previewImg": "../../controls/detail/news/news.jpg"
                                  },
                                  "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                                  "settingTemplateUrl": "../../views/settings/news.tpl.html",
                                  "canDelete": true,
                                  "addTools": ["createStyle"],
                                  "data": {
                                      $title$: { text: "K+产品受社会各界高度关注" },
                                      $pubdate$: { text: "2015-07-29" },
                                      $visitcount$: { text: 0 },
                                      common: 'false',
                                      $content$: {
                                          text: '<p><span>&nbsp; &nbsp;&nbsp; </span>' +
                                              '<span>2015年3月27日，重庆市渝中区刘副区长及经信委、科委一行领导莅临我公司参观考察，详细了解K+商城、K+多屏，为重庆市渝中区的传统企业信息化转型找到可行方法。</span>' +
                                              '</p><p><span>&nbsp; &nbsp;&nbsp; </span>' +
                                              '<span>蓝海基业自创始以来，一直致力于为中、小型企业提供信息化服务，得到了业界的一致好评和各级政府部门的认可。</span></p>'
                                      },
                                      $module: 'news',
                                      $dataconfig: '<model>news</model>'
                                  }
                              }, {
                                  "key": "controls_product_detail",
                                  "name": "产品详情区",
                                  "resizeHandles": "w,e",
                                  "icon": "icon-details",
                                  "type": "Controls",
                                  "location": "body",
                                  "style": { width: "auto", height: "auto" },
                                  "defaultTemplate": {
                                      "html": "../../controls/detail/product/product.tpl.html",
                                      "css": "../../controls/detail/product/product.css",
                                      "js": "../../controls/detail/product/product.js",
                                      "previewImg": "../../controls/detail/product/product.jpg"
                                  },
                                  "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                                  "settingTemplateUrl": "../../views/settings/product.tpl.html",
                                  "canDelete": false,
                                  "addTools": ["createStyle"],
                                  "data": {
                                      btntext: "立即订购",
                                      host: "",
                                      $title$: { text: "产品详情" },
                                      $image$: { text: "../../images/product.png" },
                                      $sale$: { text: "200.00" },
                                      $description$: { text: "取多屏后台数据" },
                                      $special$: { title: "某知名品牌" },
                                      $address$: { text: "成都市武侯区" },
                                      $rank$: { text: "U5615154154" },
                                      $stock$: { text: "HUHBJHUHUY" },
                                      $content$: {
                                          text: '<img src="../../images/product-detail.jpg" />'
                                      },
                                      $module: 'product',
                                      $dataconfig: '<model>product</model>'
                                  }
                              }, {
                                  "key": "controls_goods_detail",
                                  "name": "商铺详情区",
                                  "resizeHandles": "w,e",
                                  "icon": "icon-details",
                                  "type": "Controls",
                                  "location": "body",
                                  "style": { width: "auto", height: "auto" },
                                  "defaultTemplate": {
                                      "html": "../../controls/detail/goods/goods.tpl.html",
                                      "css": "../../controls/detail/goods/goods.css",
                                      "js": "../../controls/detail/goods/goods.js",
                                      "previewImg": "../../controls/detail/goods/product.jpg"
                                  },
                                  "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                                  "settingTemplateUrl": "../../views/settings/goods.tpl.html",
                                  "canDelete": false,
                                  "addTools": ["createStyle"],
                                  "data": {
                                      btntext: "立即购买",
                                      host: "",
                                      $title$: { text: "2015秋季新款磨砂牛皮铆钉舒适厚底内增高休闲鞋女鞋单鞋" },
                                      $image$: { text: "../../images/product.png" },
                                      $imglist$: { $image$: [{ url: "../../images/product.png" }] },
                                      $visitcount$: { text: "0" },
                                      $moduleInfo$: { $sale$: { text: "5000" }, $price$: { text: "500" }, $stock$: { text: "0" } },
                                      $isvip$: { text: "0" },
                                      $description$: { text: "磨砂牛皮铆钉舒适厚底内增高休闲鞋女鞋单鞋女FL2068" },
                                      $special$: { title: "某知名品牌" },
                                      $address$: { text: "成都市武侯区" },
                                      $rank$: { text: "U5615154154" },
                                      $stock$: { text: "HUHBJHUHUY" },
                                      $content$: {
                                          text: '<img src="../../images/product-detail.jpg" />'
                                      },
                                      $module: 'goods',
                                      $dataconfig: '<model>goods</model>'
                                  }
                              }]
                          },
                      ]
                  }, {
                      "key": "plugs",
                      "name": "商铺",
                      "icon": "icon-shops",
                      "type": "shops",
                      "childs": [{
                          "key": "shops_list_category",
                          "name": "商品分类",
                          "icon": "icon-commodity-classification",
                          "type": "shops",
                          "additional": "header|footer",
                          "addTools": ["createStyle"],
                          "style": { width: 150, height: 200 },
                          "defaultTemplate": {
                              "html": "../../controls/shops/categoryList/categoryList.tpl.html",
                              "css": "../../controls/shops/categoryList/categoryList.css",
                              "js": "../../controls/shops/categoryList/categoryList.js",
                              "previewImg": "../../controls/shops/contentlist/preview.jpg"
                          },
                          "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                          "settingTemplateUrl": "./../views/settings/goodscategorylist.tpl.html",
                          "data": {
                              category: "goods",
                              "data": [
                                  { "title": { "text": "国内新闻" }, "url": "", "target": "_self" },
                                  { "title": { "text": "国际新闻" }, "url": "", "target": "_self" }
                              ]
                          }
                      }, {
                          "key": "shops_list_content",
                          "name": "商品列表",
                          "icon": "icon-commodity-list",
                          "type": "shops",
                          "additional": "header|footer",
                          "addTools": ["createStyle"],
                          "style": { width: 280, height: 420 },
                          "defaultTemplate": {
                              "html": "../../controls/shops/contentlist/contentlist.tpl.html",
                              "css": "../../controls/shops/contentlist/contentlist.css",
                              "js": "../../controls/shops/contentlist/contentlist.js",
                              "previewImg": "../../controls/shops/contentlist/preview.jpg"
                          },
                          "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                          resizeCallback: 'control.contentlist.reload',
                          "settingTemplateUrl": "./../views/settings/goodscontentlist.tpl.html",
                          "data": {
                              category: "goods",
                              $item$: [
                                  {
                                      "url": "",
                                      "title": { "text": "祝贺蓝海基业英雄会圆满落幕！" },
                                      "pubDate": { "text": "2014-10-01" },
                                      "moduleInfo": { "sale": { "text": "0" }, "price": { "text": "0" } },
                                      "isvip": { text: "0" },
                                      "image": { "url": "../../images/no_image_220x220.jpg" },
                                      "visitCount": { "text": "0" }
                                  }
                              ]
                          }
                      }]
                  }
              ]
          }, {
              "key": "plugs",
              "name": "插件",
              "icon": "icon-plug-in-unit",
              "type": "Plug",
              "childs": [{
                  "key": "controls_plugs_map",
                  "name": "地图",
                  "icon": "icon-map-navigation",
                  "type": "Controls",
                  "additional": "header|footer",
                  "style": { width: 200, height: 200 },
                  "defaultTemplate": {
                      "html": "../../controls/plugs/map/map.tpl.html",
                      "css": "",
                      "js": "../../controls/plugs/map/map.js",
                      "previewImg": "../../controls/plugs/map/preview.jpg"
                  },
                  "settingTemplateUrl": "./../views/settings/map.tpl.html",
                  "addTools": ["createStyle"],
                  "settingBaseStyle": ["opacity", "border"]
              },
              {
                  "key": "plug_message_board",
                  "name": "留言板",
                  "icon": "icon-message-board",
                  "type": "Plug",
                  "additional": "header|footer",
                  "style": { width: 655, height: 450 },
                  "defaultTemplate": {
                      "html": "../../controls/plugs/messageboard/messageboard.tpl.html",
                      "css": "../../controls/plugs/messageboard/messageboard.css",
                      "js": "../../controls/plugs/messageboard/messageboard.js",
                      "previewImg": "../../controls/plugs/messageboard/preview.png"
                  },
                  "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                  "settingTemplateUrl": "./../views/settings/messageboard.tpl.html",
                  "addTools": ["createStyle"],
                  "data": {
                      "title": '留言板',
                      "titleTextAlign": 'left',
                      "welcomeTitle": '欢迎',
                      "submitText": '提交留言',
                      "hideTitle": false,
                      "hideWelcomeTitle": false
                  }
              },
              {
                  "key": "plug_customer_services",
                  "name": "在线客服",
                  "icon": "icon-qq",
                  "type": "Plug",
                  "additional": "header|footer",
                  "style": { width: 30, height: 150 },
                  "defaultTemplate": {
                      "html": "../../controls/plugs/customerservices/customerservices.tpl.html",
                      "css": "../../controls/plugs/customerservices/customerservices.css",
                      "js": "../../controls/plugs/customerservices/customerservices.js",
                      "previewImg": ""
                  },
                  //"settingBaseStyle": ["border", "opacity"],
                  "settingTemplateUrl": "./../views/settings/customerservices.tpl.html",
                  locked: true,
                  canLock: false
              },
              {
                  "key": "plug_bread_crumbs",
                  "name": "面包屑",
                  "icon": "icon-crumbs",
                  "type": "Plug",
                  "additional": "header|footer",
                  "style": { width: 600, height: 50 },
                  "defaultTemplate": {
                      "html": "../../controls/plugs/breadcrumbs/breadcrumbs.tpl.html",
                      "css": "../../controls/plugs/breadcrumbs/breadcrumbs.css",
                      "js": "../../controls/plugs/breadcrumbs/breadcrumbs.js",
                      "previewImg": "../../controls/plugs/breadcrumbs/preview.png"
                  },
                  "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                  "settingTemplateUrl": "./../views/settings/breadcrumbs.tpl.html",
                  "addTools": ["createStyle"],
                  "data": {
                      "source": [{
                          "key": 'default',
                          "text": '首页',
                          "href": '/web/default.html'
                      }],
                      "title": '当前位置',
                      "delimiter": '>>',
                      "fontName": '微软雅黑',
                      "fontSize": 12,
                      "fontBold": false,
                      "fontItalic": false,
                      "fontUnderline": false,
                      "fontColor": '#000'
                  }
              }, {
                  "key": "plug_links",
                  "name": "友情链接",
                  "icon": "icon-link",
                  "type": "Plug",
                  "additional": "header|footer",
                  "style": { width: 600, height: 50 },
                  "defaultTemplate": {
                      "html": "../../controls/plugs/links/links.tpl.html",
                      "css": "../../controls/plugs/links/links.css",
                      "js": "../../controls/plugs/links/links.js",
                      "previewImg": "../../controls/plugs/links/links.png"
                  },
                  "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                  "settingTemplateUrl": "./../views/settings/links.tpl.html",
                  "resizeCallback": 'control.links.reload',
                  "addTools": ["createStyle"],
                  data: {
                      links: [{
                          title: { text: "在线制作" },
                          link: "www.baidu.com"
                      }],
                      type: "text",
                      row: 1,
                      col: 3,
                      width: 30
                  }
              }, {
                  "key": "plug_contact",
                  "name": "联系我们",
                  "icon": "icon-list-con",
                  "type": "Plug",
                  "additional": "header|footer",
                  "style": { width: 600, height: 300 },
                  "defaultTemplate": {
                      "html": "../../controls/plugs/contact/contact.tpl.html",
                      "css": "../../controls/plugs/contact/contact.css",
                      "js": "../../controls/plugs/contact/contact.js",
                      "previewImg": "../../controls/plugs/contact/preview.png"
                  },
                  "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                  "settingTemplateUrl": "./../views/settings/contact.tpl.html",
                  resizeCallback: 'control.contact.reload',
                  "addTools": ["createStyle"],
                  "data": {
                      "hideTitle": false,
                      "areaCode": 'cd',
                      "title": "蓝海基业",
                      "fields": [{
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
                      }]
                  }
              }, {
                  "key": "plug_form",
                  "name": "万能表单",
                  "icon": "icon-universal-form",
                  "type": "Plug",
                  "additional": "header|footer",
                  "style": { width: 600, height: 300 },
                  "defaultTemplate": {
                      "html": "../../controls/plugs/form/form.tpl.html",
                      "css": "../../controls/plugs/form/form.css",
                      "js": "../../controls/plugs/form/form.js",
                      //"previewImg": "../../controls/plugs/form/preview.png"
                  },
                  "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                  "settingTemplateUrl": "./../views/settings/form.tpl.html",
                  "addTools": ["createStyle"],
                  "data": {
                      "skin": "",
                      "VerificationCode": "1"
                  }
              }, {
                  "key": "plug_login",
                  "name": "登录注册",
                  "icon": "icon-log-in-register",
                  "type": "Plug",
                  "additional": "header|footer",
                  "style": { width: "auto", height: 50 },
                  "defaultTemplate": {
                      "html": "../../controls/plugs/login/login.tpl.html",
                      "css": "../../controls/plugs/login/login.css",
                      "js": "../../controls/plugs/login/login.js",
                  },
                  "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
                  "settingTemplateUrl": "./../views/settings/login.tpl.html",
                  "addTools": ["createStyle"],
                  "data": {
                      "welcomeText": "您好，欢迎光临",
                      "verificationCode": "1",
                      "registerFields": [
                          { "key": "username", "title": "账号", "required": true, "type": "text", "default": true, "selected": true, "sort": 999, "display": true, "item": [] },
                          { "key": "password", "title": "密码", "required": true, "type": "password", "default": true, "selected": true, "sort": 998, "display": true, "item": [] },
                          { "key": "nickname", "title": "昵称", "required": true, "type": "text", "default": true, "selected": true, "sort": 997, "display": true, "item": [] },
                          { "key": "mobilephone", "title": "手机号", "required": false, "type": "text", "default": false, "selected": false, "sort": 996, "display": true, "item": [] },
                          { "key": "mail", "title": "邮箱", "required": false, "type": "text", "default": false, "selected": false, "sort": 995, "display": true, "item": [] },
                          { "key": "title", "title": "姓名", "required": false, "type": "text", "default": false, "selected": false, "sort": 994, "display": true, "item": [] },
                          { "key": "sex", "title": "性别", "required": false, "type": "radio", "default": false, "selected": false, "sort": 993, "display": true, "item": [{ "text": "男" }, { "text": "女" }] },
                          { "key": "cardid", "title": "身份证", "required": false, "type": "text", "default": false, "selected": false, "sort": 992, "display": true, "item": [] },
                          { "key": "contact_qq", "title": "QQ号", "required": false, "type": "text", "default": false, "selected": false, "sort": 990, "display": true, "item": [] },
                          { "key": "address", "title": "地址", "required": false, "type": "text", "default": false, "selected": false, "sort": 989, "display": true, "item": [] }
                      ],
                  }
              },
              {
                  "key": "plug_fulltext",
                  "name": "全站搜索",
                  "icon": "icon-total-station",
                  "type": "Plug",
                  "additional": "header|footer",
                  "style": { width: 500, height: 80 },
                  "defaultTemplate": {
                      "html": "../../controls/plugs/fulltext/fulltext.tpl.html",
                      "css": "../../controls/plugs/fulltext/fulltext.css",
                      "js": "../../controls/plugs/fulltext/fulltext.js",
                      //"previewImg": "../../controls/plugs/form/preview.png"
                  },
                  "settingBaseStyle": ["border", "opacity"],
                  "settingTemplateUrl": "./../views/settings/fulltext.tpl.html",
                  "addTools": ["createStyle"],
                  "data": {
                      "emptyText": "请输入文章或产品名称"
                  }
              },
              {
                  "key": "plug_html",
                  "name": "html",
                  "icon": "icon-universal-form",
                  "type": "Plug",
                  "additional": "header|footer",
                  "style": { width: 600, height: 300 },
                  "defaultTemplate": {
                      "html": "../../controls/plugs/html/html.tpl.html",
                      "css": "../../controls/plugs/html/html.css",
                      "js": "../../controls/plugs/html/html.js",
                      //"previewImg": "../../controls/plugs/form/preview.png"
                  },
                  "settingBaseStyle": ["border", "opacity"],
                  "settingTemplateUrl": "./../views/settings/htmls.tpl.html",
                  "addTools": ["createStyle"],
                  "data": {
                      "code": "html控件",
                      "sure": "false"
                  }
              }]
          },
          {
              "key": "components",
              "name": "组件库",
              "icon": "icon-module-settings",
              "action": 'select',
              "settingTemplateUrl": "./../views/settings/components.tpl.html"
          },
          {
              "key": "controls_fulltextresult",
              "name": "搜索结果页",
              "visible": false,
              "icon": "icon-details",
              "type": "Controls",
              "location": "body",
              "resizeHandles": "w,e",
              "style": { width: "auto", height: "auto" },
              "defaultTemplate": {
                  "html": "../../controls/plugs/fulltext/fulltextresult.tpl.html",
                  "css": "../../controls/plugs/fulltext/fulltextresult.css",
                  "js": "../../controls/plugs/fulltext/fulltextresult.js"
              },
              "settingBaseStyle": ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "opacity", "border"],
              "canDelete": true,
              "settingTemplateUrl": "./../views/settings/fulltextresult.tpl.html",
              "addTools": ["createStyle"]
          }/*{
              "key": "sysmanage",
              "name": "后台管理",
              "icon": "icon-backstage-management"
          }*/],
          mobile: [
              //todo: wait...
          ]
      }
  }]);
