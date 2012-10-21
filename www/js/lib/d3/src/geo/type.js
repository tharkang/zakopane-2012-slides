//Wrapped in an outer function to preserve global this
(function (root) { var amdExports; define([], function () { (function () {

function d3_geo_type(types, defaultValue) {
  return function(object) {
    return object && types.hasOwnProperty(object.type) ? types[object.type](object) : defaultValue;
  };
}



}.call(root));
    return amdExports;
}); }(this));
