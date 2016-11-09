angular.module('starter.filters', [])

.filter('rawHtml', function($sce){
  return function(val) {
    return $sce.trustAsHtml(val);
  };
})

.filter('parseDate', function() {
  return function(value) {
      return Date.parse(value);
  };
})

.filter('num', function () {
    return function (input) {
        return parseInt(input, 10);
    };
});

;
