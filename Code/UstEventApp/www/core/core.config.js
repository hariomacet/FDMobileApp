 angular.module('starter.core', [])
        .run(appRun);

    function appRun($ionicPlatform, beacon) {

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
               

         


            window.errorHandler = function (error) {
                alert('an error occured'); 
            }


                       
        });
        
    }


