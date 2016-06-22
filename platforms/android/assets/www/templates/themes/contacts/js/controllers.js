// For sent email you have to install $cordovaSocialSharing by running the following
// command in your cmd.exe for windows or terminal for mac:
// $ cd your_project_path
// $ ionic plugin remove nl.x-services.plugins.socialsharing
// $ ionic plugin add https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git
// 
// Learn more about $cordovaSocialSharing :
// http://ngcordova.com/docs/plugins/socialSharing/
// 
// For sent message you have to install $cordovaSMS by running the following
// command in your cmd.exe for windows or terminal for mac:
// $ cd your_project_path
// $ ionic plugin remove com.cordova.plugins.sms
// $ ionic plugin add https://github.com/cordova-sms/cordova-sms-plugin.git
// 
// Learn more about $cordovaSMS :
// http://ngcordova.com/docs/plugins/sms/
// 
//
// For using mobile calling you must go to yourProjectPath/config.xml 
// and put this following code in the access area.
// <access origin="tel:*" launch-external="yes"/>
// 
// Controller of contract us page.
appControllers.controller('contactCtrl', function ($scope, $cordovaBarcodeScanner, $cordovaSocialSharing, $cordovaSms, svcontact) {

    // This function is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        svcontact.load().then(function(data) {

            $scope.contacts = data;
           // console.log(JSON.stringify($scope.contacts));
          //  console.log(JSON.stringify($scope.contacts[0].get("card").get("name")));
        });
        
        
    };// End initialForm.

    $scope.delete = function (id) {
        svcontact.delete(id).then(function(contactDeleted) {
             svcontact.load().then(function(data) {
                $scope.contacts = data;
            });
        });
    };

    $scope.showqr = function () {
       aler("qr");
    };

    $scope.scanqr = function () {
       $cordovaBarcodeScanner
      .scan()
      .then(function(barcodeData) {
        alert(JSON.stringify(barcodeData));
      }, function(error) {
        // An error occurred
      });
    };
    $scope.save = function () {
        svcard.save($scope.card).then(function(data) { });
    };

    // sentSms is for send message by calling $cordovaSms
    // Parameter :  
    // phoneNumber = number of sending message
    $scope.sentSms = function (index) {
        //config options to sent message
        var options = {
            replaceLineBreaks: false, // true to replace \n by a new line, false by default.
            android: {
                intent: 'INTENT' // send SMS with the native android SMS messaging.
                //intent: '' // send SMS without open any other app.
            }
        };
        // calling $cordovaSms to sent message
        $cordovaSms.send($scope.contacts[index].get("card").get("owner").get("profile").get("phone"), " ", options);
    } // End sentSms.

    // sentEmail is for send email by calling $cordovaSocialSharing.
    // Parameter :  
    // email = email of receiver
    $scope.sentEmail = function (index) {
        
        $cordovaSocialSharing.shareViaEmail("", "",$scope.contacts[index].get("card").get("owner").get("email"), "", "", "");
        // format of sent email by using $cordovaSocialSharing is :
        //$cordovaSocialSharing.shareViaEmail(message, subject, toArr, ccArr, bccArr,file)
        // toArr, ccArr and bccArr must be an array, file can be either null, string or array.
    } // End sentEmail.

    // callTo is for using mobile calling.
    // Parameter :  
    // number = number that going to call.
    $scope.callTo = function (index) {
        window.open("tel:" + $scope.contacts[index].get("card").get("owner").get("profile").get("phone"));
    }// End callTo.

    $scope.initialForm();

});// End of contract us controller.
