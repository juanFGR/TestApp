appServices.factory('svprofile', function($q) {
	return {
	   	load: function(){
            var profile = Parse.User.current().get("profile");
                	sessionStorage.setItem('profile', JSON.stringify(profile));
                	console.log(JSON.stringify(profile));
                    return profile;
              
	  	},

	  	save: function(data){
	   		var deferred = $q.defer();
          var profile = new Parse.Object("Profile");
          profile.id = data.id;
	        profile.save({
            name:data.name,
            surname:data.surname,
            email:data.email,
            phone:data.phone,
            gender:data.gender
          }, {
	            success: function(object) {
                      deferred.resolve(object);
                  },
                  error: function(error) {
                       deferred.reject(error);
                  }
              });

              return deferred.promise;

	  	}

	}
});




