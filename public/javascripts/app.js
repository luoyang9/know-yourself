var app = angular.module('6ixApp', ['MainController', 'IndicoService']);
		
app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});