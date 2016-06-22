// Controller of catalog Page.
appControllers.controller('loginCtrl', function ($scope, $rootScope, $mdToast, $mdDialog) {

 
     $rootScope.auth = {
        user:"",
        pass:"",
        email:"",
        image:""
    };


    $scope.initialForm = function () {
        if(localStorage.getItem("LocalData") == null){
            var data = [];
            data = JSON.stringify(data);
            localStorage.setItem("LocalData", data);
        }
        
        if(!(localStorage.getItem("user") === undefined) || !(localStorage.getItem("pass") === undefined)){
       
            $rootScope.auth.user = localStorage.getItem("user");
            $rootScope.auth.pass = localStorage.getItem("pass");

           
        }
        
        if((!($rootScope.auth.user === "") && !($rootScope.auth.pass === "")) && 
            (($rootScope.auth.user != null) && ($rootScope.auth.user != null))){
            $scope.signin();
        }
    }


    $scope.logout = function() {
        Parse.User.logOut();
        $scope.navigateTo('app.tryAppNoBackBtn');
    }



    $scope.signin = function() {

        Parse.User.logIn( $rootScope.auth.user,  $rootScope.auth.pass, {
            success: function(user) {
              
                localStorage.setItem("user", $rootScope.auth.user);
                localStorage.setItem("pass", $rootScope.auth.pass);

                var query = new Parse.Query("Profile");
                var profile = JSON.parse(JSON.stringify(Parse.User.current().get("profile")));
                query.equalTo("objectId", '' + profile['objectId'] + '');
                query.find({
                    success: function(results) {
                        var profile = JSON.parse(JSON.stringify(results));
                        //$("#userProfile_image").attr("src", results[0].get("image"));
                        $rootScope.auth.image = results[0].get("image");
                        sessionStorage.setItem('profile', JSON.stringify(profile));
                        console.log(JSON.stringify(results));
                    },
                    error: function() {
                        status = "No pictures exist for userId ";
                    }
                });


            var query = new Parse.Query(Parse.Object.extend("Card"));
            query.equalTo("owner",Parse.User.current());
            query.first({
                success: function(results) {
                    var cardsession = JSON.parse(JSON.stringify(results));
                       // $("#user_image").attr("src", results[0].get("image"));
                        sessionStorage.setItem('card', JSON.stringify(cardsession));
                },
                error: function(error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });

            $scope.navigateTo('app.card');

            },
            // If there is an error
            error: function(user, error) {
              //  window.location.href = "#!/index.html"
                alert("Ups! Usuario o contraseña son erróneas");
                console.log(error);
            }
        });
    };


    $scope.signup = function() {

        var profile = new Parse.Object("Profile");
        profile.save(null, {
            success: function(gameTurnAgain) {

                var user = new Parse.User();
                user.set("username", $rootScope.auth.user);
                user.set("password", $rootScope.auth.pass);
                user.set("email", $rootScope.auth.email);
                user.set("profile", gameTurnAgain);

                user.signUp(null, {
                    success: function(owner) {
                        localStorage.setItem("user", $rootScope.auth.user);
                        localStorage.setItem("pass", $rootScope.auth.pass);
                        var query = new Parse.Query("Profile");
                        query.equalTo("objectId", '' + gameTurnAgain.id + '');
                        query.find({
                            success: function(results) {

                                var card = new Parse.Object("Card");
                                card.save({
                                    name: user.get("username"),
                                    email: user.get("email"),
                                    description: "Este es el ejemplo de mi primera tarjeta con DOCARDY",
                                    owner: Parse.User.current()
                                        // image: results[0].get("image")
                                }, {
                                    success: function(gameTurnAgain) {
                                         $scope.navigateTo('app.card');
                                    },
                                    error: function(gameTurnAgain, error) {}
                                });


                            },
                            error: function() {

                                status = "No pictures exist for userId ";
                            }

                        });



                    },
                    error: function(owner, error) {
                        // Show the error message somewhere and let the user try again.
                        alert("Error: " + error.code + "\n\nwhat is the error \n\n " + error.message);
                    }
                });
            },
            error: function(gameTurnAgain, error) {}
        });
    }


$scope.initialForm();
});// End of catalog controller.