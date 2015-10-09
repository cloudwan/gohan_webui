(function() {
window["JST"] = window["JST"] || {};

window["JST"]["app.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="header-panel shadow-z-2 navbar navbar-default navbar-material-blue-600" id="header">\n</div>\n\n<div class="container-fluid main" id="main_containter">\n  <div class="row">\n    <nav class="col-xs-2 menu" id="sidebar">\n    </nav>\n    <div class="pages col-xs-10">\n      <div class="col-xs-12">\n        <div class="well page" id="main">\n          <div id="alerts"></div>\n          <div class="page_header">\n            <div id="back_button"></div>\n            <h1 id="page_title"></h1>\n          </div>\n          <div id="main_body">\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n';

}
return __p
}})();
(function() {
window["JST"] = window["JST"] || {};

window["JST"]["breadcrumb.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<ul class="bread_crumb">\n';
 _.each(parents, function(parent){;
__p += '\n   <li>\n       <a href="#' +
((__t = ( parent.schema_fragment )) == null ? '' : __t) +
'">' +
__e( parent.schema_title ) +
'</a>\n   </li>\n   <li>\n       <a href="#' +
__e( parent.fragment ) +
'">' +
__e( parent.title ) +
'</a>\n   </li>\n';
 }); ;
__p += '\n</ul>\n';

}
return __p
}})();
(function() {
window["JST"] = window["JST"] || {};

window["JST"]["data_popup.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<button type=\'button\' class=\'btn btn-default btn-sm\'\n        data-placement=\'auto\'\n        data-trigger=\'click\'\n        data-toggle=\'hover\' data-html=\'true\'\n        data-content=\'' +
((__t = ( content )) == null ? '' : __t) +
'\'>view</button>\n';

}
return __p
}})();
(function() {
window["JST"] = window["JST"] || {};

window["JST"]["detail.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h1 class="header" id="bread_crumb">\n</h1>\n\n<div class="detail_info_container container-fluid">\n  ';
 _.each(schema.schema.propertiesOrder, function(key){
   var property = schema.schema.properties[key];
   var view = property['view'];
   if(view){
     if(view.indexOf("detail") < 0){
       return
     }
   }
  ;
__p += '\n  <div class="row">\n    <div class="property_title col-md-2">' +
__e( property.title ) +
'</div>\n    <div class="property_detail col-md-8">' +
((__t = ( data[key] )) == null ? '' : __t) +
'</div>\n  </div>\n  ';
 }); ;
__p += '\n</div>\n\n\n';
 if ( children.length > 0 ) { ;
__p += '\n<div class="container-fluid">\n  <div class="row">\n    <div class="well page active">\n      ';
 _.each(children, function(child){  ;
__p += '\n      <div class="child_resource">\n        <div id="' +
__e( child.id ) +
'_table"></div>\n      </div>\n      ';
 }); ;
__p += '\n    </div>\n  </div>\n</div>\n';
 } ;
__p += '\n\n<div id="ex_container"></div>\n';

}
return __p
}})();
(function() {
window["JST"] = window["JST"] || {};

window["JST"]["error.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="alert alert-danger" role="alert">\n<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>\n<strong>Error:</strong>' +
__e( message ) +
'\n</div>\n';

}
return __p
}})();
(function() {
window["JST"] = window["JST"] || {};

window["JST"]["header.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="navbar-header">\n  <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">\n    <span class="sr-only">Toggle navigation</span>\n    <span class="icon-bar"></span>\n    <span class="icon-bar"></span>\n    <span class="icon-bar"></span>\n  </button>\n  <a class="navbar-brand" href="#">Gohan WebUI</a>\n</div>\n<div class="navbar-collapse collapse navbar-responsive-collapse">\n  <ul class="nav navbar-nav navbar-right">\n    ';
 if (auth_token) { ;
__p += '\n      <li><a href="#" class="noa">' +
((__t = ( username )) == null ? '' : __t) +
'</a></li>\n      <li><a href="#" id="logout">Logout</a></li>\n    ';
 } ;
__p += '\n  </ul>\n</div>\n';

}
return __p
}})();
(function() {
window["JST"] = window["JST"] || {};

window["JST"]["login.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="container login-panel " id="main">\n    <div class="col-md-4 col-md-offset-4">\n      <div class="panel panel-default center-block">\n        <div class="panel-heading">\n          <h3 class="panel-title h3-material-blue-200">Please sign in</h3>\n        </div>\n        <div class="panel-body">\n          <div id="alerts"></div>\n          <form accept-charset="UTF-8" method="" action="" role="form" id="login">\n            <fieldset>\n              <div class="form-group">\n                <input class="form-control" placeholder="ID" name="id" type="text" id="id"></div>\n              <div class="form-group">\n                <input class="form-control" placeholder="Password" name="password" id="password" type="password" value=""></div>\n              <div class="form-group">\n                <input class="form-control" placeholder="Tenant" id="tenant" name="tenant" type="text" value="' +
((__t = ( tenant_name )) == null ? '' : __t) +
'"></div>\n              <input class="btn btn-lg btn-primary btn-raised btn-material-blue-600 btn-block" type="button" value="Login"></fieldset>\n          </form>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n';

}
return __p
}})();
(function() {
window["JST"] = window["JST"] || {};

window["JST"]["property_form.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<tr>\n<td class="handle">\n    <span class="glyphicon glyphicon-list" aria-hidden="true"></span>\n</td>\n<td>\n    <input id="id" value="' +
__e( property["id"] ) +
'" class="form-control id_form"/>\n</td>\n';
 _.each(propertyColumns, function(column){
    var id = column.id; ;
__p += '\n    <td>\n    ';
 if (column.enum){ ;
__p += '\n        <select class="form-control" id="\'' +
__e( id ) +
'">\n        ';
 _.each(column.enum, function(key){ ;
__p += '\n           <option value="' +
__e( key ) +
'"\n               ';
 if(key == property[column.id] ){ ;
__p += ' selected ';
 } ;
__p += '> ' +
__e( key ) +
'\n           </option>\n        ';
 }); ;
__p += '\n        </select>\n    ';
 } else if (column.type == "string"){ ;
__p += '\n        <input id="' +
__e( id ) +
'" value="' +
__e( property[column.id] ) +
'" class="form-control"/>\n    ';
 }else if(column.type == "checkbox") { ;
__p += '\n        <input type="checkbox" class="form-control" id="' +
__e( id ) +
'"\n            ';
 if(property[column.id]){;;
__p += ' checked  ';
 } ;
__p += ' />\n    ';
 } ;
__p += '\n    </td>\n';
 }); ;
__p += '\n<td>\n    <button type="button" class="btn btn-default" aria-label="Detail" id="detail" > Detail </button>\n    <button type="button" class="btn btn-default btn-xs" aria-label="Delete" onclick="$(this).parent().parent().remove()">\n    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>\n</td>\n</tr>\n';

}
return __p
}})();
(function() {
window["JST"] = window["JST"] || {};

window["JST"]["row.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\n';
 _.each(data, function(d){ ;
__p += '\n<tr>\n\n</tr>\n';
 }); ;
__p += '\n\n\n';

}
return __p
}})();
(function() {
window["JST"] = window["JST"] || {};

window["JST"]["schema_form.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<table class="table table-striped" id="properties_table">\n<thead>\n<tr><th></th><th>ID</th>';

_.each(propertyColumns, function(column){;
__p += '\n    <th>' +
((__t = ( column.id )) == null ? '' : __t) +
'</th>\n';

 });
;
__p += '\n<th></th></tr></thead>\n<tbody></tbody></table>\n\n';

}
return __p
}})();
(function() {
window["JST"] = window["JST"] || {};

window["JST"]["sideview_item.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<a href="' +
((__t = ( source.path )) == null ? '' : __t) +
'">\n  ' +
((__t = ( source.title )) == null ? '' : __t) +
'\n</a>\n';

}
return __p
}})();
(function() {
window["JST"] = window["JST"] || {};

window["JST"]["table.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h1 class="header" id="bread_crumb">\n  <ul class="bread_crumb"><li>' +
__e( schema.title ) +
'</li></ul>\n</h1>\n<a class="btn btn-primary gohan_create btn-raised btn-material-blue-600"><strong>+</strong> New</a>\n\n<div class="table-responsive">\n  <table class="table table-striped gohan-table">\n    <thead>\n      <tr>\n       ';
 _.each(schema.schema.propertiesOrder, function(key){
           var property = schema.schema.properties[key];
           var view = property['view']
           if(view){
             if(view.indexOf("list") < 0){
               return
             }
           }
           if(key === parent_property){
             return
           }
        ;
__p += '\n        <th>' +
((__t = ( property.title )) == null ? '' : __t) +
'</th>\n       ';
 }); ;
__p += '\n       <th></th>\n      </tr>\n    </thead>\n    <tbody>\n      ';
 _.each(data, function(d){ ;
__p += '\n      <tr>\n       ';
 _.each(schema.schema.propertiesOrder, function(key){
           var property = schema.schema.properties[key];
           var view = property['view']
           if(view){
             if(view.indexOf("list") < 0){
               return
             }
           }
           if(key === parent_property){
             return
           }
           ;
__p += '\n        <td>' +
((__t = ( d[key] )) == null ? '' : __t) +
'</td>\n       ';
 }); ;
__p += '\n       <td class="action_column">\n         <div class="btn-group ">\n          <a class="btn btn-default btn-sm gohan_update btn-raised btn-material-blue-600" data-id="' +
__e( d['id']) +
'">Edit</a>\n             <button type="button" class="btn btn-default btn-sm dropdown-toggle"\n               data-toggle="dropdown" aria-expanded="true" data-container="body">\n             <span class="caret"></span>\n             <span class="sr-only">Toggle Dropdown</span>\n           </button>\n           <ul class="dropdown-menu pull-right" role="menu" >\n             <li><a class="gohan_delete btn-danger" data-id="' +
__e( d['id']) +
'" >Delete</a></li>\n           </ul>\n         </div>\n       </td>\n      </tr>\n      ';
 }); ;
__p += '\n   </tbody>\n  </table>\n</div>\n\n\n';

}
return __p
}})();