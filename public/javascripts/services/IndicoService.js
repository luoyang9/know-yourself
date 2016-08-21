angular.module('IndicoService', []).service('IndicoService', ['$http', function($http) {
	
	this.getTags = function(texts) {
		return $http.post('/indico/tags', {texts: texts});
	};
}]);