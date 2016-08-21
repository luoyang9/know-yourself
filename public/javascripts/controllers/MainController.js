angular.module('MainController', []).controller('MainController', ['$scope', '$window', function($scope, $window) {

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
		});
	};

	this.getUser = function() {
		FB.api('/me', function(response) {
			$scope.$apply(function() {
				$scope.user.name = response.name;
				$scope.user.id = response.id;
			});
		});
	};

	$scope.loggedIn = false;
	$scope.user = {};
}]);