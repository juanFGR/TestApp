appServices.factory('svmenu', function($q) {
	return {
	   	load: function(){
        var deferred = $q.defer();

         var query = new Parse.Query("Profile");
                var profile = JSON.parse(JSON.stringify(Parse.User.current().get("profile")));
                query.equalTo("objectId", '' + profile['objectId'] + '');
                query.first({
                    success: function(results) {
                      console.log(JSON.stringify(results));
                        deferred.resolve(results);
                        
                    },
                    error: function() {
                        status = "No pictures exist for userId ";
                    }
                });



                   return deferred.promise;
	  	}
	}
});