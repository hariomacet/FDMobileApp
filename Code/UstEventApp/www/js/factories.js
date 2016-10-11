angular.module('starter.factories', [])

.factory('FeedLoader', function ($resource) {
    return $resource('http://ajax.googleapis.com/ajax/services/feed/load', {}, {
        fetch: { method: 'JSONP', params: { v: '1.0', callback: 'JSON_CALLBACK' } }
    });
})


// Factory for node-pushserver (running locally in this case), if you are using other push notifications server you need to change this
.factory('NodePushServer', function ($http) {
    // Configure push notifications server address
    // 		- If you are running a local push notifications server you can test this by setting the local IP (on mac run: ipconfig getifaddr en1)
    var push_server_address = "http://192.168.1.102:8000";

    return {
        // Stores the device token in a db using node-pushserver
        // type:  Platform type (ios, android etc)
        storeDeviceToken: function (type, regId) {
            // Create a random userid to store with it
            var user = {
                user: 'user' + Math.floor((Math.random() * 10000000) + 1),
                type: type,
                token: regId
            };
            console.log("Post token for registered device with data " + JSON.stringify(user));

            $http.post(push_server_address + '/subscribe', JSON.stringify(user))
            .success(function (data, status) {
                console.log("Token stored, device is successfully subscribed to receive push notifications.");
            })
            .error(function (data, status) {
                console.log("Error storing device token." + data + " " + status);
            });
        },
        // CURRENTLY NOT USED!
        // Removes the device token from the db via node-pushserver API unsubscribe (running locally in this case).
        // If you registered the same device with different userids, *ALL* will be removed. (It's recommended to register each
        // time the app opens which this currently does. However in many cases you will always receive the same device token as
        // previously so multiple userids will be created with the same token unless you add code to check).
        removeDeviceToken: function (token) {
            var tkn = { "token": token };
            $http.post(push_server_address + '/unsubscribe', JSON.stringify(tkn))
            .success(function (data, status) {
                console.log("Token removed, device is successfully unsubscribed and will not receive push notifications.");
            })
            .error(function (data, status) {
                console.log("Error removing device token." + data + " " + status);
            });
        }
    };
})


.factory('AdMob', function ($window) {
    var admob = $window.AdMob;

    if (admob) {
        // Register AdMob events
        // new events, with variable to differentiate: adNetwork, adType, adEvent
        document.addEventListener('onAdFailLoad', function (data) {
            console.log('error: ' + data.error +
            ', reason: ' + data.reason +
            ', adNetwork:' + data.adNetwork +
            ', adType:' + data.adType +
            ', adEvent:' + data.adEvent); // adType: 'banner' or 'interstitial'
        });
        document.addEventListener('onAdLoaded', function (data) {
            console.log('onAdLoaded: ' + data);
        });
        document.addEventListener('onAdPresent', function (data) {
            console.log('onAdPresent: ' + data);
        });
        document.addEventListener('onAdLeaveApp', function (data) {
            console.log('onAdLeaveApp: ' + data);
        });
        document.addEventListener('onAdDismiss', function (data) {
            console.log('onAdDismiss: ' + data);
        });

        var defaultOptions = {
            // bannerId: admobid.banner,
            // interstitialId: admobid.interstitial,
            // adSize: 'SMART_BANNER',
            // width: integer, // valid when set adSize 'CUSTOM'
            // height: integer, // valid when set adSize 'CUSTOM'
            position: admob.AD_POSITION.BOTTOM_CENTER,
            // offsetTopBar: false, // avoid overlapped by status bar, for iOS7+
            bgColor: 'black', // color name, or '#RRGGBB'
            // x: integer,		// valid when set position to 0 / POS_XY
            // y: integer,		// valid when set position to 0 / POS_XY
            isTesting: true, // set to true, to receiving test ad for testing purpose
            // autoShow: true // auto show interstitial ad when loaded, set to false if prepare/show
        };
        var admobid = {};

        if (ionic.Platform.isAndroid()) {
            admobid = { // for Android
                banner: 'ca-app-pub-6869992474017983/9375997553',
                interstitial: 'ca-app-pub-6869992474017983/1657046752'
            };
        }

        if (ionic.Platform.isIOS()) {
            admobid = { // for iOS
                banner: 'ca-app-pub-6869992474017983/4806197152',
                interstitial: 'ca-app-pub-6869992474017983/7563979554'
            };
        }

        admob.setOptions(defaultOptions);

        // Prepare the ad before showing it
        // 		- (for example at the beginning of a game level)
        admob.prepareInterstitial({
            adId: admobid.interstitial,
            autoShow: false,
            success: function () {
                console.log('interstitial prepared');
            },
            error: function () {
                console.log('failed to prepare interstitial');
            }
        });
    }
    else {
        console.log("No AdMob?");
    }

    return {
        showBanner: function () {
            if (admob) {
                admob.createBanner({
                    adId: admobid.banner,
                    position: admob.AD_POSITION.BOTTOM_CENTER,
                    autoShow: true,
                    success: function () {
                        console.log('banner created');
                    },
                    error: function () {
                        console.log('failed to create banner');
                    }
                });
            }
        },
        showInterstitial: function () {
            if (admob) {
                // If you didn't prepare it before, you can show it like this
                // admob.prepareInterstitial({adId:admobid.interstitial, autoShow:autoshow});

                // If you did prepare it before, then show it like this
                // 		- (for example: check and show it at end of a game level)
                admob.showInterstitial();
            }
        },
        removeAds: function () {
            if (admob) {
                admob.removeBanner();
            }
        }
    };
})

.factory('iAd', function ($window) {
    var iAd = $window.iAd;

    // preppare and load ad resource in background, e.g. at begining of game level
    if (iAd) {
        iAd.prepareInterstitial({ autoShow: false });
    }
    else {
        console.log("No iAd?");
    }

    return {
        showBanner: function () {
            if (iAd) {
                // show a default banner at bottom
                iAd.createBanner({
                    position: iAd.AD_POSITION.BOTTOM_CENTER,
                    autoShow: true
                });
            }
        },
        showInterstitial: function () {
            // ** Notice: iAd interstitial Ad only supports iPad.
            if (iAd) {
                // If you did prepare it before, then show it like this
                // 		- (for example: check and show it at end of a game level)
                iAd.showInterstitial();
            }
        },
        removeAds: function () {
            if (iAd) {
                iAd.removeBanner();
            }
        }
    };
})

.factory('ProgressBar', ['$ionicLoading', function ($ionicLoading) {
    return {
        show: function () {
            $ionicLoading.show({
                template: '<p>Please wait...</p><ion-spinner icon="ripple"></ion-spinner>'
            });
        },
        hide: function () {
            $ionicLoading.hide();
        }
    }
}])


.factory('fireBaseData', function ($FirebaseObject) {
    var refRegisteration = new Firebase("https://ustdb.firebaseio.com/userRegistration");
    var refSurveyresult = new Firebase("https://ustdb.firebaseio.com/surveyResults");
    var refSurveyDetails = new Firebase("https://ustdb.firebaseio.com/surveyDetails");
    var refsurveyFood = new Firebase("https://ustdb.firebaseio.com/surveyFood");
    var refDashBoardDetails = new Firebase("https://ustdb.firebaseio.com/dashBoard");
    var refSportsList = new Firebase("https://ustdb.firebaseio.com/sportsList");
    var refNowU = new Firebase("https://ustdb.firebaseio.com/nowU");
    var refEventsList = new Firebase("https://ustdb.firebaseio.com/eventsList");
    var reftechnology = new Firebase("https://ustdb.firebaseio.com/technology");
    var refCsr = new Firebase("https://ustdb.firebaseio.com/csrList");
    var eventNews = new Firebase("https://ustdb.firebaseio.com/eventsNews");
    var refsummary = new Firebase("https://ustdb.firebaseio.com/summary");
    var refSportsTeamMembers = new Firebase("https://ustdb.firebaseio.com/sportsTeamMembers");
    var refTeamNames = new Firebase("https://ustdb.firebaseio.com/teamNames");
    var refSurveyDashboard = new Firebase("https://ustdb.firebaseio.com/surveyDashBoard");
    var refMatchSchedule = new Firebase("https://ustdb.firebaseio.com/matchSchedule");
    var refPlayerList = new Firebase("https://ustdb.firebaseio.com/sportsList/feed_source/");
    var refLiveScore = new Firebase("https://ustdb.firebaseio.com/liveScore");
    var refLiveScoreTeam1 = new Firebase("https://ustdb.firebaseio.com/liveScore/cricket/0/team1");
    var refLiveScoreTeam2 = new Firebase("https://ustdb.firebaseio.com/liveScore/cricket/0/team2");
    var refEventUserMap = new Firebase("https://ustdb.firebaseio.com/eventUserMapping");
    var refVoteDashBoard = new Firebase("https://ustdb.firebaseio.com/voteDashBoard");
    var refEmpList = new Firebase("https://ustdb.firebaseio.com/employeeList");
    var refVoteCount = new Firebase("https://ustdb.firebaseio.com/empVoteCount");
    var refEventsDetails = new Firebase("https://ustdb.firebaseio.com/eventDetails");
    var refSecurityQuestion = new Firebase("https://ustdb.firebaseio.com/securityQuestion");
    var refScoreCard = new Firebase("https://ustdb.firebaseio.com/scoreCard");

    return {
        refRegisteration: function () {
            return refRegisteration;
            // return Math.max.apply(Math, refRegisteration.map(function (item) { return item.id; }));

        },
        //return {
        //    all: function() {
        //        return refRegisteration
        //    },
        refSurveyresult: function () {
            return refSurveyresult;
        },
        refSurveyDetails: function () {
            // return refSurveyquestionaires
            return refSurveyDetails;
        },
        refsurveyFood: function () {
            return refsurveyFood;
        },
        refDashBoardDetails: function () {
            return refDashBoardDetails;
        },
        refSportsList: function () {
            return refSportsList;
        }
        ,
        refsportsTeamMembers: function () {
            return refsportsTeamMembers;
        },
        refTeamNames: function () {
            return refTeamNames;
        },
        refTeamMembers: function () {
            return refTeamMembers;
        }
        ,
        refNowU: function () {
            return refNowU;
        },
        refEventsList: function () {
            return refEventsList;
        },
        reftechnology: function () {
            return reftechnology;
        },
        refCsr: function () {
            return refCsr;
        },
        eventNews: function () {
            return eventNews;
        },
        refSurveyDashboard: function () {
            return refSurveyDashboard;
        },
        refMatchSchedule: function () {
            return refMatchSchedule;
        },
        refPlayerList: function () {
            return refPlayerList;
        },
        refLiveScore: function () {
            return refLiveScore;
        },
        refLiveScoreTeam1: function () {
            return refLiveScoreTeam1;
        },
        refLiveScoreTeam2: function () {
            return refLiveScoreTeam2;
        },
        refEventUserMap: function () {
            return refEventUserMap;
        },
        refsummary: function () {
            return refsummary;
        },
        refVoteDashBoard: function () {
            return refVoteDashBoard;
        },
        refEmpList: function () {
            return refEmpList;
        },
        refVoteCount: function () {
            return refVoteCount;
        },
        refEventsDetails: function () {
            return refEventsDetails;
        },
        refSecurityQuestion: function () {
            return refSecurityQuestion;
        },
        refScoreCard: function () {
            return refScoreCard;
        }
    };
})
.filter('currentdate', ['$filter', function ($filter) {
    return function () {
        return $filter('date')(new Date(), 'yyyy-MM-dd');
    };
}])
.filter('orderByDesc', function () {
    return function (items, field, reverse) {
        // Build array
        var filtered = [];
        for (var key in items) {
            if (field === 'key')
                filtered.push(key);
            else
                filtered.push(items[key]);
        }
        // Sort array
        filtered.sort(function (a, b) {
            if (field === 'key')
                return (a > b ? 1 : -1);
            else
                return (a[field] > b[field] ? 1 : -1);
        });
        // Reverse array
        if (reverse)
            filtered.reverse();
        return filtered;
    };
})
;
