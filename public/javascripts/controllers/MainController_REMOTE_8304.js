angular.module('MainController', ['IndicoService']).controller('MainController', ['$scope', '$window', 'IndicoService', function($scope, $window, IndicoService) {

	var that = this;

	$window.fbAsyncInit = function() {
		FB.init({
		  appId      : '312149629136084',
		  status	 : true,
		  cookie	 : true,
		  xfbml      : true,
		  version    : 'v2.7'
		});

		FB.Event.subscribe('auth.authResponseChange', that.statusChange);
	};

	(function(d, s, id){
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;	
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	this.statusChange = function(res) {
		console.log("status changed")
		if(res.status === 'connected') {
			console.log("already logged in");
			$scope.$apply(function() {
				$scope.loggedIn = true;
			});
			that.getUser();
		}
	};

	this.loginFacebook = function() {
		console.log("logging in");
		FB.login(function(response) {
			if(response.status == 'connected') {
				that.loggedIn = true;
				that.getUser();
				console.log("log in successful");
			}
			else {
				console.log("log in failed");
			}
		}, {scope: 'public_profile,user_friends,user_about_me,user_birthday,user_education_history,user_events,user_hometown,user_likes,user_location,user_photos,user_posts,user_relationships,user_relationship_details,user_religion_politics,user_tagged_places,user_videos,user_website,user_work_history'});
	};

	// this.logoutFacebook = function(){
	// 	FB.logout(function(response){
	// 		that.loggedIn = false;
	// 		console.log("loggedout successful");
	// 	});
	// }

	this.getUser = function() {
		FB.api('/me', function(response) {
			$scope.$apply(function() {
				$scope.user.name = response.name;
				$scope.user.id = response.id;
			});
		});
	};

	this.getTags = function(text) {
		FB.api('/' + $scope.user.id + '/posts', function(response) {
			$scope.$apply(function() {
				$scope.tags = response;
			});
		});	
		/*
		IndicoService.getTags(text).then(function(res) {
			console.log(res);
		}, function(err) {
			console.log(err);
		});*/
	};

	this.getPopularity = function(){
		console.log($scope.user.id +'/albums');
		FB.api("/"+$scope.user.id +'/albums', {fields: 'id'}, function(response) {
			if (response && !response.error) {
		        console.log(response);
		    }
		    else{
		    	console.log(response.error);
		    }
		  
		});
	};

	$scope.loggedIn = false;
	$scope.user = {};
	$scope.tags = {};
}]);