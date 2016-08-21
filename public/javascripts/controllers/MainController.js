
var globaltest=[];
google.load('visualization', '1', {packages:['corechart']});

google.setOnLoadCallback(function() {
  angular.bootstrap(document.body, ['6ixApp']);
});


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

					var options = {
						'title': 'Activities and Interests',
						legend: {position: 'none'},
						'width':500,
						'height':300,
						hAxis:  { textPosition: 'none' }
					};

					var data = new google.visualization.DataTable();
					data.addColumn('string', 'Activity');
					data.addColumn('number', 'Interest');

					for(var j=0; j<5; j++){
						var a = tags[j];
						data.addRow([Object.keys(a)[0], a[Object.keys(a)[0]]]);
					}								     

				    var chart = new google.visualization.BarChart(document.getElementById('InterestsChart'));

				     chart.draw(data,options);
				});
			}, function(err) {
				console.log(err);
			});
		});	

	};

	this.getPopularity = function(){

		function doasync (data1, fn){
			fn(data1);
		}

		console.log($scope.user.id +'/albums');
		FB.api("/"+$scope.user.id +'/albums', {fields: ['id', 'type'], limit: 500}, function(response) {
			if (response && !response.error) {
				var albumid;
		        console.log(response);
				for(var i=0; i<response.data.length; i++){
					if (response.data[i].type == "profile"){
						albumid = response.data[i].id;
						break;
					}
				}

				FB.api("/"+albumid+"/photos", {fields: ['id', 'created_time', 'source'], limit:5000}, function(response2){
					if(response2 && !response2.error){
						var profileinfo = response2.data;
						var profilearr=[];
						var datesCreated = [];
						var likes = [];

						for(var i=0; i<profileinfo.length; i++){

							datesCreated[i]=profileinfo[i].created_time;

							profilearr[datesCreated[i]]=profileinfo[i].id;

							doasync(i, function(key){
								FB.api("/"+profileinfo[key].id+"/likes", {limit:500}, function(response3){

									likes[key] = response3.data.length;


									var options = {
										'title': 'Popularity over time',
										legend: {position: 'none'},
										'width':500,
										'height':300,
										vAxis:  { textPosition: 'none' }
									};

									var data = new google.visualization.DataTable();
									data.addColumn('date', 'date');
      								data.addColumn('number', 'popularity');

									for(var j=0; j<profileinfo.length; j++){

										data.addRow([new Date(datesCreated[j]), likes[j]]);
									}								     

								    var chart = new google.visualization.LineChart(document.getElementById('chartdiv'));

								    chart.draw(data,options);
								    
								});
							});					

							// profilearr.datesCreated[i]=profileinfo[i].id;

							// console.log("all data: " + profilearr);
							
						}

							console.log("profilearr: ");
							console.log(profilearr);



						console.log(response2);
					}
					else{
						console.log(response2.error);
					}
				} );
		    }
		    else{
		    	console.log(response.error);
		    }
		  
		});
	};

	this.getInfo = function(){
		FB.api(
		    "/"+$scope.user.id,{fields: 'website'},
		    function (response) {
		      if (response && !response.error) {
		        console.log(response);
		      }
		      else{
		      	console.log(response.error);
		      }
		    }
		);
	}


	this.generate = function(){
		that.getTags();
		that.getPopularity();
		that.getInfo();
	}

	$scope.loggedIn = false;
	$scope.user = {};
	$scope.tags = [];
}]);