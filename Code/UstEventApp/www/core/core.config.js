 angular.module('starter.core', [])
        .run(appRun);

    function appRun($ionicPlatform, beacon, RequestsService) {
        var pushNotification;
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                /* globals cordova */
                beacon.initialise();
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
               // cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                /* globals StatusBar */
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }

            pushNotification = window.plugins.pushNotification;

            window.onNotification = function (e) {

                console.log('notification received');

                switch (e.event) {
                    case 'registered':
                        if (e.regid.length > 0) {

                            var device_token = e.regid;
                            RequestsService.register(device_token).then(function (response) {
                                console.log('device registered');
                            });
                        }
                        break;

                    case 'message':
                        console.log('msg received');
                        //alert(JSON.stringify(e));
                        break;

                    case 'error':
                        alert('error occured');
                        break;

                }
            };


            window.errorHandler = function (error) {
                //alert('an error occured'); //commented by praveen
            }


            pushNotification.register(
              onNotification,
              errorHandler,
              {
                  'badge': 'true',
                  'sound': 'true',
                  'alert': 'true',
                  'senderID': '617296814346',
                  'ecb': 'onNotification'
              }
            );            
        });
        
    }


