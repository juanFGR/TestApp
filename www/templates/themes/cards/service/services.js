appServices.factory('svcard', function($q) {
	return {

    loadThisCard: function(idCard){
        var deferred = $q.defer();

            var cardquery = new Parse.Query(Parse.Object.extend("Card"));
            cardquery.include("owner");
            cardquery.include(["owner.profile"]);
              cardquery.equalTo("objectId", idCard);
                cardquery.first({
                  success: function(object) {
                      deferred.resolve(object);
                  },
                  error: function(error) {
                      alert("Error: " + error.code + " " + error.message);
                       deferred.reject(error);
                  }
              });

              return deferred.promise;

      },

	   	load: function(){
	   		var deferred = $q.defer();

            var cardquery = new Parse.Query(Parse.Object.extend("Card"));
            cardquery.include("owner");
            cardquery.include(["owner.profile"]);
              cardquery.equalTo("owner",Parse.User.current());
                cardquery.first({
                  success: function(object) {
                      deferred.resolve(object);
                  },
                  error: function(error) {
                      alert("Error: " + error.code + " " + error.message);
                       deferred.reject(error);
                  }
              });

              return deferred.promise;

	  	},

	  	save: function(card){
	   		var deferred = $q.defer();
            var cardquery = new Parse.Query(Parse.Object.extend("Card"));
            cardquery.include("owner");
            cardquery.include(["owner.profile"]);
           cardquery.equalTo("owner",Parse.User.current());
                cardquery.first({
                  success: function(object) {
                  	  object.set("name", card.name);
                      object.set("web", card.web);
                      object.set("phone", card.phone);
                      object.set("email", card.email);
                      object.set("description", card.description);
                      object.set("business", card.business);
                      object.set("job", card.job);
                      object.save();
                      deferred.resolve(object);
                  },
                  error: function(error) {
                      alert("Error: " + error.code + " " + error.message);
                       deferred.reject(error);
                  }
              });

              return deferred.promise;

	  	}

	}
});