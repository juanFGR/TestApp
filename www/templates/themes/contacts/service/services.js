appServices.factory('svcontact', function($q) {
	return {
	   	load: function(){

        var deferred = $q.defer();

        var _user = Parse.Object.extend("User");
        var thisUser = new _user();
        thisUser.id = Parse.User.current().id;

        var _card = Parse.Object.extend("CardFollower");
        var query = new Parse.Query(_card);

        query.equalTo("follower", thisUser);
        query.include("card");
        query.include(["card.owner"]);
        query.include(["card.owner.profile"]);
        query.find().then(function(result){
         deferred.resolve(result);
        });
       

        return deferred.promise;

	  	},
        delete: function(contact){
            var deferred = $q.defer();
            var invFriend = Parse.Object.extend("CardFollower");
            var query = new Parse.Query(invFriend);
            query.get( contact , {
              success: function(myObj) {
                // The object was retrieved successfully.
                myObj.destroy({});
                deferred.resolve(contact);
              },
              error: function(object, error) {
                // The object was not retrieved successfully.
                // error is a Parse.Error with an error code and description.
              }
            });

            return deferred.promise;
        }
	}
});