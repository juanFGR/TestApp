appServices.factory('feed', function() {
	return {
	   	loadEvent: function(){
	  	  var _event = Parse.Object.extend("Event");
		  var query = new Parse.Query(_event);
		  return query;
	  	}
	}
});