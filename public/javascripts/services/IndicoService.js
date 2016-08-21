angular.module('IndicoService', []).service('IndicoService', ['$http', function($http) {
	
	this.getTags = function(text) {
		return $http.post('/indico/tags', {text: text});
	};
}]);