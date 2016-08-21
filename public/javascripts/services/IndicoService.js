angular.module('IndicoService', []).service('IndicoService', ['$http', function($http) {
	
	this.getTags = function(texts) {
		return $http.post('/indico/tags', {texts: texts});
	};

	this.getPhotos = function(photos) {
		return $http.post('/indico/facial', {photos: photos});
	};

	this.getPositivity = function(posts) {
		return $http.post('/indico/positivity', {posts: posts});
	};

	this.getEmotions = function(posts) {
		return $http.post('/indico/emotion', {posts: posts});
	};

	this.getPhotoTags = function(photos) {
		return $http.post('/clarifai/imageTags', {photos: photos});
	};

	this.getPeople = function(posts){
		return $http.post('/indico/people', {posts: posts});
	};
}]);