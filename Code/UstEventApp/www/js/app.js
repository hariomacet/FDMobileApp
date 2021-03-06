// Ionic Starter App

angular.module('underscore', [])
.factory('_', function () {
    return window._; // assumes underscore has already been loaded on the page
});

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', [
  'ionic',
  'angularMoment',
  'starter.controllers',
  'starter.directives',
  'starter.filters',
  'starter.services',
  'starter.beaconServices',
  'starter.factories',
  'starter.core',
  'starter.sessions',
  'starter.config',
  //'starter.views',
  'underscore',
  'ngMap',
  'ngResource',
  'ngCordova',
  'slugifier',
  'ionic.contrib.ui.tinderCards',
  'youtube-embed',
  'firebase',
  'timer',
])

.run(function ($ionicPlatform, $rootScope, $ionicConfig, $timeout) {

    $ionicPlatform.on("deviceready", function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
          if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
           

        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
       // cordova.plugins.backgroundMode.enable();
        
    });

    // This fixes transitions for transparent background views
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        if (toState.name.indexOf('auth.walkthrough') > -1) {
            // set transitions to android to avoid weird visual effect in the walkthrough transitions
            $timeout(function () {
                $ionicConfig.views.transition('android');
                $ionicConfig.views.swipeBackEnabled(false);
                console.log("setting transition to android and disabling swipe back");
            }, 0);
        }
    });
    $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
        if (toState.name.indexOf('app.feeds-categories') > -1) {
            // Restore platform default transition. We are just hardcoding android transitions to auth views.
            $ionicConfig.views.transition('platform');
            // If it's ios, then enable swipe back again
            if (ionic.Platform.isIOS()) {
                $ionicConfig.views.swipeBackEnabled(true);
            }
            console.log("enabling swipe back and restoring transition to platform default", $ionicConfig.views.transition());
        }
    });

    $ionicPlatform.on("resume", function () {
     
    });

})


.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $stateProvider

    //INTRO
    .state('auth', {
        url: "/auth",
        templateUrl: "views/auth/auth.html",
        abstract: true,
        controller: 'AuthCtrl'
    })

    .state('auth.walkthrough', {
        url: '/walkthrough',
        templateUrl: "views/auth/walkthrough.html"
    })

    .state('auth.login', {
        url: '/login',
        templateUrl: "views/auth/login.html",
        controller: 'LoginCtrl'
    })

    .state('auth.signup', {
        url: '/signup',
        templateUrl: "views/auth/signup.html",
        controller: 'SignupCtrl'
    })

    .state('auth.forgot-password', {
        url: "/forgot-password",
        templateUrl: "views/auth/forgot-password.html",
        controller: 'ForgotPasswordCtrl'
    })

    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "views/app/side-menu.html",
        controller: 'AppCtrl'
    })

    //MISCELLANEOUS
    //.state('app.miscellaneous', {
    //    url: "/miscellaneous",
    //    views: {
    //        'menuContent': {
    //            templateUrl: "views/app/miscellaneous/miscellaneous.html"
    //        }
    //    }
    //})
//Admin
    .state('app.admin', {
        url: "/master",
        views: {
            'menuContent': {
                templateUrl: "views/app/admin/master.html",
                controller: 'MasterCtrl'
            }
        }
    })
    .state('app.sports-master', {
        url: "/sports-master/:categoryId",
        views: {
            'menuContent': {
                templateUrl: "views/app/admin/sports-master.html",
                controller: 'SportsMasterCtrl'
            }
        }
    })
  .state('app.schedule-master', {
      url: "/schedule-master",
      views: {
          'menuContent': {
              templateUrl: "views/app/admin/schedule-Master.html",
              controller: 'ScheduleCtrl'
          }
      }
  })
 .state('app.live-master', {
     url: "/live-master",
     views: {
         'menuContent': {
             templateUrl: "views/app/admin/live-master.html",
             controller: 'SportsLiveCtrl'
         }
     }
 })
.state('app.vote-master', {
    url: "/vote-master",
    views: {
        'menuContent': {
            templateUrl: "views/app/admin/vote-master.html",
            controller: 'VoteMastereCtrl'
        }
    }
})
.state('app.event-master', {
    url: "/event-master",
    views: {
        'menuContent': {
            templateUrl: "views/app/admin/event-master.html",
            controller: 'EventMastereCtrl'
        }
    }
})
.state('app.push-master', {
    url: "/push-master",
    views: {
        'menuContent': {
            templateUrl: "views/app/admin/push-master.html",
            controller: 'PushMasterCtrl'
        }
    }
})



    //LAYOUTS
    .state('app.layouts', {
        url: "/layouts",
        views: {
            'menuContent': {
                templateUrl: "views/app/layouts/layouts.html"
            }
        }
    })





    //FEEDS
    .state('app.feeds-categories', {
        url: "/feeds-categories",
        views: {
            'menuContent': {
                templateUrl: "views/app/feeds/feeds-categories.html",
                controller: 'FeedsCategoriesCtrl'
            }
        }
    })

    .state('app.category-feeds', {
        url: "/category-feeds/:categoryId",
        views: {
            'menuContent': {
                templateUrl: "views/app/feeds/category-feeds.html",
                controller: 'CategoryFeedsCtrl'
            }
        }
    })

    .state('app.vote-entries', {
        url: "/vote-entries/:categoryId",
        views: {
            'menuContent': {
                templateUrl: "views/app/feeds/vote-entries.html",
                controller: 'VoteEntriesCtrl'
            }
        }
    })

    .state('app.player-list', {
        url: "/player-list/:categoryId/:sourceId",
        views: {
            'menuContent': {
                templateUrl: "views/app/feeds/player-list.html",
                controller: "PlayerListCtrl"
            }
        }
    })

     .state('app.survey-details', {
         url: "/survey-details/:surveyId",
         views: {
             'menuContent': {
                 templateUrl: "views/app/survey/survey-details.html",
                 controller: 'SurveyDetailsCtrl'
             }
         }

     })
    .state('app.event-details', {
        url: "/event-details?categoryId&sourceId",
        views: {
            'menuContent': {
                templateUrl: "views/app/events/event-details.html",
                controller: 'EventDetailsCtrl'
            }
        }

    })
     .state('app.survey', {
         url: "/survey/:sourceId",
         views: {
             'menuContent': {
                 templateUrl: "views/app/survey/survey.html",
                 controller: 'SurveyCtrl'
             }
         }
     })

    .state('app.surveyMenu', {
        url: "/surveyMenu/::categoryId/:sourceId",
        views: {
            'menuContent': {
                templateUrl: "views/app/survey/surveyMenu.html",
                controller: 'SurveyMenuCtrl'
            }
        }
    })
 .state('app.kulim-attendance', {
     url: "/surveyMenu/::categoryId/:sourceId",
     views: {
         'menuContent': {
             templateUrl: "views/app/survey/kulim-attendance.html",
             controller: 'kulimCtrl'
         }
     }
 })
.state('app.ust-quiz', {
    url: "/surveyMenu/::categoryId/:sourceId",
    views: {
        'menuContent': {
            templateUrl: "views/app/survey/ust-quiz.html",
            controller: 'ustQuizCtrl'
        }
    }
})
    .state('app.feed-entries', {
        url: "/feed-entries/:categoryId/:sourceId/:sourceTitle",
        views: {
            'menuContent': {
                templateUrl: "views/app/feeds/feed-entries.html",
                controller: 'FeedEntriesCtrl'
            }
        }
    })







    //OTHERS
    .state('app.settings', {
        url: "/settings",
        views: {
            'menuContent': {
                templateUrl: "views/app/settings.html",
                controller: 'SettingsCtrl'
            }
        }
    })

     .state('app.profileSetting', {
         url: "/profileSetting",
         views: {
             'menuContent': {
                 templateUrl: "views/app/profileSetting.html",
                 controller: 'ProfileSettingCtrl'
             }
         }
     })


    .state('app.forms', {
        url: "/forms",
        views: {
            'menuContent': {
                templateUrl: "views/app/forms.html"
            }
        }
    })


    .state('app.profile', {
        url: "/profile",
        views: {
            'menuContent': {
                templateUrl: "views/app/profile.html"
            }
        }
    })

      .state('app.enter-comments', {
          url: "/enter-comments",
          views: {
              'mainContent': {
                  templateUrl: "views/app/enter-comments.html",
                  controller: 'FeedCommentsCtrl'
              }
          }
      })

    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/auth/walkthrough');
});
