// Controller of catalog Page.
appControllers.controller('feedCtrl', function ($scope,$timeout,$mdSidenav,$ionicHistory,$state, $mdToast, $mdDialog, feed, $location) {

    $scope.eventList = [];

$scope.init = function(){
        feed.loadEvent().find({
        success: function(results) {
        
          $scope.eventList = results;
        },
        error: function(error) {

        }
      });
}


$scope.detailed=function(id){


      feed.loadEvent().find({
        success: function(results) {
          for (var i = 0; i < $scope.eventList.length; i++) {
            if($scope.eventList[i].id == id){
                $scope.event = $scope.eventList[i];
            }
          }
        },
        error: function(error) {

        }
      });
  $scope.go('app.eventdetail');
}

 

  $scope.go = function (stateName) {
        $timeout(function () {
            $mdSidenav('left').close();
            if ($ionicHistory.currentStateName() != stateName) {
                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: false
                });
                $state.go(stateName);
            }
        }, ($scope.isAndroid == false ? 300 : 0));
    };// End navigateTo.


});// End of catalog controller.