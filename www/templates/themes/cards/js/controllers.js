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
appControllers.controller('cardCtrl', function ($ionicModal,$rootScope, $scope,$cordovaBarcodeScanner,$mdMedia,$mdDialog, $cordovaSocialSharing, $cordovaSms, $ionicPopup, $timeout, $state, $mdSidenav, $ionicHistory, svcard) {

    // This function is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.flag = false

    $scope.panel = false;
    $scope.toggle = function() {
      $scope.panel = !$scope.panel;
    };



  $ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };



$scope.card = {};

    $scope.initialForm = function () {
        $scope.flag = false
        svcard.load().then(function(data) {
            $scope.card = {
                id:data.id,
                name: data.get("name"),
                phone: data.get("phone"),
                business: data.get("business"),
                web: data.get("web"),
                description: data.get("description"),
                email: Parse.User.current().get("email"), 
                location: data.get("location"),
                job: data.get("job"),
                image: data.get("image")
            }; 
        });
        
        
    };// End initialForm.


$scope.uploadCardImage = function(idCard){
  navigator.camera.getPicture(function(imageURI){
     var uri;
    var parseFile = new Parse.File("mypic.jpg", {
        base64: imageURI
    });
    console.log(parseFile);
    parseFile.save().then(function() {
        
        uri = arguments[0]._url;
       $scope.card.image = arguments[0]._url;
       $scope.$apply();
        var query = new Parse.Query(Parse.Object.extend("Card"));
        query.equalTo("objectId",idCard );
        query.first({
            success: function(results) {
                results.set("image", uri);
                results.save();
                
            },
            error: function(error) {
                //alert("Ups!, ha ocurrido");
                console.log("Error: " + error.code + " " + error.message);
            }
        });
    }, function(error) {
       // alert(error);
    });

  },
        function(message) {
            //alert('get picture failed');
        }, {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
        }
    );
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

    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    $scope.qrcode = '<md-dialog>'+
      '<md-content>'+
    '<qrcode data="string"></qrcode>'+
  '</md-content>'+
'</md-dialog>';


      $scope.showAlert = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        // Modal dialogs should fully cover application
        // to prevent interaction outside of dialog
        $mdDialog.show({
              template: $scope.qrcode,
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:true
            })


      };





    $scope.showqr = function () {
      var data = JSON.parse(sessionStorage.getItem("card")).objectId;
      $scope.openModal();
    $("#modalito").html("");
    $("#modalito").qrcode({
        color: "#000",
        text: '' + data + '',
        render: 'canvas',
        minVersion: 1,
        maxVersion: 40,
        ecLevel: 'L',
        left: 0,
        top: 0,
        fill: '#000',
        background: '#FFF',
        radius: 0.5,
        quiet: 0,
        mode: 0,
        mSize: 0.1,
        mPosX: 0.5,
        mPosY: 0.5,
        label: 'DOCARDYUUd',
        fontname: 'sans',
        fontcolor: '#000',
        image: null
    });

    
    };

    $scope.scanqr = function () {
      
       $cordovaBarcodeScanner
      .scan()
      .then(function(barcodeData) {
        svcard.loadThisCard(barcodeData.text).then(function(data) {
            $scope.theircard = {
                name: data.get("name"),
                phone: data.get("phone"),
                business: data.get("business"),
                description: data.get("description"),
                email: Parse.User.current().get("email"), 
                location: data.get("location"),
                job: data.get("job"),
                image: data.get("image")
            };

             $scope.flag = true; 
        });


      }, function(error) {
        alert(error);
      });
    };

    $scope.save = function () {
        svcard.save($scope.card).then(function(data) { });
    };

    // sentSms is for send message by calling $cordovaSms
    // Parameter :  
    // phoneNumber = number of sending message
    $scope.sentSms = function () {
    
        $cordovaSocialSharing.shareViaWhatsApp("Hola, mi tarjeta de contacto es esta.", null, "www.docardy.com")
          .then(function(result) {
            // Success!
          }, function(err) {
            // An error occurred. Show a message to the user
          });
     /*   var options = {
            replaceLineBreaks: false, // true to replace \n by a new line, false by default.
            android: {
                intent: 'INTENT' 
            }
        };

        $cordovaSms.send(phoneNumber, " ", options);*/
    } // End sentSms.

    // sentEmail is for send email by calling $cordovaSocialSharing.
    // Parameter :  
    // email = email of receiver
    $scope.sentEmail = function (email) {
        $cordovaSocialSharing.shareViaEmail("Hola, mi tarjeta de contacto es esta: <br> www.docardy.com", "Hola, agregame a tu red de contactos", email, "", "", "");
        // format of sent email by using $cordovaSocialSharing is :
        //$cordovaSocialSharing.shareViaEmail(message, subject, toArr, ccArr, bccArr,file)
        // toArr, ccArr and bccArr must be an array, file can be either null, string or array.
    } // End sentEmail.

    // callTo is for using mobile calling.
    // Parameter :  
    // number = number that going to call.
    $scope.callTo = function (number) {
        window.open("tel:" + number);
    }// End callTo.

    $scope.initialForm();




    $scope.requestPhone = function() {
      $scope.data = {};
      // An elaborate, custom popup
      var popupPhone = $ionicPopup.show({
        template: '<input type="text" ng-model="data.phone">',
        title: 'Introduce su numero',
        subTitle: 'Estas apunto de enviar tu contacto por sms',
        scope: $scope,
        buttons: [
          { text: 'Cancelar' },
          {
            text: '<b>Enviar</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.phone) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.data.phone;
              }
            }
          }
        ]
      });
      popupPhone.then(function(res) {
        console.log('Tapped!', res);
        
      });

    };



$scope.requestEmail = function() {
       
 $scope.data = {};
  // An elaborate, custom popup
  var popupEmail = $ionicPopup.show({
    template: '<input type="email" ng-model="data.email">',
    title: 'Introduce su correo',
    subTitle: 'Enviar contacto por correo',
    scope: $scope,
    buttons: [
      { text: 'Cancelar' },
      {
        text: '<b>Enviar</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.email) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return $scope.data.email;
          }
        }
      }
    ]
  });

  popupEmail.then(function(res) {
    console.log('Tapped!', res);
    $scope.sentEmail(res);
  });
 };

});// End of contract us controller.
