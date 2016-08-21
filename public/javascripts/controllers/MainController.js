angular.module('MainController', ['IndicoService']).controller('MainController', ['$scope', '$timeout', '$window', 'IndicoService', function($scope, $timeout, $window, IndicoService) {

	var that = this;

	$window.fbAsyncInit = function() {
		FB.init({
		  appId      : '312149629136084',
		  status	 : true,
		  cookie	 : true,
		  xfbml      : true,
		  version    : 'v2.7'
		});

		FB.Event.subscribe('auth.authResponseChange', that.loginChange);
	};

	(function(d, s, id){
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;	
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	this.loginChange = function(res) {
		console.log("login: ", res);
		if(res.status === 'connected') {
			console.log("already logged in");
			$timeout(function(){
				$scope.loggedIn = true;
			});
			that.getUser();
		}
	};

	this.loginFacebook = function() {
		console.log("logging in");
		FB.login(function(response) {
			if(response.status == 'connected') {
				$timeout(function(){
					$scope.loggedIn = true;
				});
				that.getUser();
				console.log("log in successful");
			}
			else {
				console.log("log in failed");
			}
		}, {scope: 'public_profile,user_friends,user_about_me,user_birthday,user_education_history,user_events,user_hometown,user_likes,user_location,user_photos,user_posts,user_relationships,user_relationship_details,user_religion_politics,user_tagged_places,user_videos,user_website,user_work_history'});
	};

	this.logoutFacebook = function(){
 		var cookies = document.cookie.split(";");
	    for (var i = 0; i < cookies.length; i++) {
	    	var cookie = cookies[i];
	    	var eqPos = cookie.indexOf("=");
	    	var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
	    	document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
	    }

		FB.logout(function(response){
			console.log(response);

			$timeout(function(){
				$scope.loggedIn = false;
			});
		});
	}

	this.getUser = function() {
		FB.api('/me', function(response) {
			$timeout(function(){
				$scope.user.name = response.name;
				$scope.user.id = response.id;
			});
		});
	};

	this.getTags = function() {
		FB.api('/' + $scope.user.id + '/posts', function(response) {
			var posts = response.data.filter(function(post) {
				if(post.message) return true;
				return false;
			}).map(function(post) {
				return post.message;
			});

			IndicoService.getTags(posts).then(function(res) {
				$timeout(function(){
					var tags = [];

					res.data.forEach(function(obj) {
						for(var category in obj) {
							var tag = {};
							tag[category] = obj[category];
							
							var exists = false;
							tags.forEach(function(tag) {
								if(tag.hasOwnProperty(category)) {
									exists = true;
								}
							});

							if(!exists) {
								tags.push(tag);
							}
							else {
								tags[category] += obj[category];
							}
						}
					});
					tags.sort(function(a, b) {
						return b[Object.keys(b)[0]] - a[Object.keys(a)[0]]; 
					});
					tags = tags.slice(0, 5);
					console.log(tags);
					$scope.tags = tags;
				});
			}, function(err) {
				console.log(err);
			});
		});	

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
	$scope.tags = [];
}]);