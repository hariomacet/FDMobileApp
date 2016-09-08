/// <reference path="../views/app/feeds/questionModal.html" />
/// <reference path="../views/app/feeds/questionModal.html" />
angular.module('starter.controllers', [])

.controller('AuthCtrl', function ($scope, $ionicConfig) {

})

// APP
.controller('AppCtrl', function ($scope, $ionicConfig) {

})

//LOGIN
.controller('LoginCtrl', function ($scope, $state, $templateCache, $q, $rootScope, $firebaseArray, fireBaseData) {
    $scope.user = {};
    $rootScope.userIdPhone = {};

    $scope.doLogIn = function () {
        $scope.userdetails = $firebaseArray(fireBaseData.refRegisteration());
        $scope.userdetails.$loaded().then(function (userdetails) {
            var userlength = userdetails.length; // data is loaded here
            angular.forEach(userdetails, function (userdata) {
                angular.forEach(userdata, function (item) {
                    if (item.userEmailId == $scope.user.email) {
                        $rootScope.userIdPhone.userId = item.userId;
                        $rootScope.userIdPhone.PhoneNumber = item.userNumber;
                    }
                    else if (item.userNumber == $scope.user.phone) {
                        $rootScope.userIdPhone.userId = item.userId;
                        $rootScope.userIdPhone.PhoneNumber = item.userNumber;
                    }
                })
            })
        })
        $state.go('app.feeds-categories');
    };

    $scope.user = {};

    $scope.user.email = ""; //"XXXXX";
    $scope.user.pin = "";   //"12345"

    // We need this for the form validation
    $scope.selected_tab = "";

    $scope.$on('my-tabs-changed', function (event, data) {
        $scope.selected_tab = data.title;
    });

})

.controller('SignupCtrl', function ($scope, $state, $firebaseArray, fireBaseData) {
    $scope.user = {};

    $scope.user.email = "";
    var checkEmailId = false;
    var checkPhonenumber = false;
    var dateNow = new Date();

    $scope.doSignUp = function () {

        $scope.userdetails = $firebaseArray(fireBaseData.refRegisteration());
        //  var userlength = userdetails.__proto__.then.length;
        $scope.userdetails.$loaded().then(function (userdetails) {
            var userlength = userdetails.length; // data is loaded here
            angular.forEach(userdetails, function (userdata) {
                angular.forEach(userdata, function (value, key) {
                    if (key == 'userEmailId') {
                        checkEmailId = angular.equals($scope.user.email, value) ? true : false;
                    }
                    if (key == 'userNumber') {
                        checkPhonenumber = angular.equals($scope.user.phone, value) ? true : false;
                    }
                })
            })
            if (!checkEmailId && !checkPhonenumber) {
                $scope.saveuserdetails = userdetails.$add({
                    userName: $scope.user.name,
                    userId: "ust" + (++userdetails.length),
                    userNumber: $scope.user.phone,
                    userEmailId: $scope.user.email,
                    userPassword: $scope.user.password,
                    userIsAdmin: "0",
                    userIsActive: "1",
                    userCreateDate: dateNow.toDateString()
                }).then(function (ref) {
                    console.log(ref);
                }, function (error) {
                    console.log("Error:", error);
                });
                $state.go('app.feeds-categories');
            }
            else {
                $scope.userExists = "Already Exists!!";
                // return;
            }
        })

    };
    // var ref = new Firebase("https://ustdb.firebaseio.com/userRegistration");
    //$scope.userdetails.on("child_added", function (snapshot, prevChildKey) {
    //    console.log(snapshot.val());
    //}, function (errorObject) {
    //    console.log("The read failed: " + errorObject);
    //});




    //  $scope.posts = $firebase(custDetails.child('surveyDetails')).$asArray();




})


.controller('SurveyDetailsCtrl', function ($scope, $state, $firebaseArray, fireBaseData) {
    $scope.surveyInfo = {};
    $scope.surveyDetails = $firebaseArray(fireBaseData.refSurveyquestionaires());
    $scope.surveyresult = $firebaseArray(fireBaseData.refSurveyresult());
    $scope.userFetchDetails = $firebaseArray(fireBaseData.refRegisteration());
    $scope.surveyQ = $firebaseArray(fireBaseData.refSurveyquestions());

    var phoneNumber = "";
    $scope.surveyDetails.$loaded()
                         .then(function (surveyDetails) {
                             angular.forEach(surveyDetails, function (surveyitem) {
                                 if (surveyitem.surveyActive == 1) {
                                     $scope.surveyInfo = {
                                         surveyid: surveyitem.surveyId
                                         //userid: surveyitem.userId
                                     }

                                     //$scope.userFetchDetails.$loaded().then(function (userFetchDetails) {
                                     //    angular.forEach(userFetchDetails, function (userdata) {
                                     //        angular.forEach(userdata, function (item) {
                                     //            if (item.userId == $scope.surveyInfo.userid) {
                                     //                phoneNumber = item.userNumber;
                                     //            }
                                     //        })
                                     //    })
                                     //})
                                     $scope.suveryQues = surveyitem.questionnaires[0];

                                 }
                             })
                         });


    var arraySurveyQuestions = [];
    var item;
    // $scope.surveyItemValues = {};
    $scope.surveyQ.$loaded()
                   .then(function (surveyQ) {
                       angular.forEach(surveyQ, function (surveyitems) {
                           if (surveyitems.surveyActive == 1) {
                               //for (i in surveyitems)
                               //{
                               //    item = surveyitems[i];
                               //}
                               //$scope.surveyItemValues = surveyitems;
                               arraySurveyQuestions.push(surveyitems);

                               console.log(surveyitems);
                           }
                       })
                       $scope.Surveylist = arraySurveyQuestions;
                   });



    $scope.surveyKey = {};
    $scope.submitSurvey = function () {
        $scope.surveyresult = surveyresult.$add({
            questionId: $scope.surveyKey.select,
            mobileNo: $rootScope.userIdPhone.PhoneNumber,  //GET VALUES ON LOGIN 
            surveyId: $scope.surveyInfo.surveyid,
            userId: $rootScope.userIdPhone.userId    //GET VALUES ON LOGIN 

        }).then(function (ref) {
            console.log(ref);
        }, function (error) {
            console.log("Error:", error);
        });
        $state.go('app.feeds-categories');
    }
    //else {
    //                $scope.userExists = "Already Exists!!";
    //    // return;
    //}



})


    .controller('SurveyCtrl', function ($scope, $state, $stateParams, $ionicModal) {
        $scope.SurveyTitle = $stateParams.sourceId;
        $ionicModal.fromTemplateUrl('views/app/feeds/survey-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(
               function (modal) {
                   vm.modal = modal;
                   vm.modal.show();
               }
               )
    })



           // $state.go('app.feeds-categories');





    //    function closeQuestionEditor() {
    //    vm.modal.hide();
    //    vm.modal.remove();

    //    $ionicListDelegate.closeOptionButtons();
    //}

.controller('ForgotPasswordCtrl', function ($scope, $state) {
    $scope.recoverPassword = function () {
        $state.go('app.feeds-categories');
    };

    $scope.user = {};
})

.controller('RateApp', function ($scope) {
    $scope.rateApp = function () {
        if (ionic.Platform.isIOS()) {
                AppRate.promptForRating(true);
        } else if (ionic.Platform.isAndroid()) {
            //you need to set your own android app id
            AppRate.preferences.storeAppURL.android = 'market://details?id=ionFB';
            AppRate.promptForRating(true);
        }
    };
})

.controller('SendMailCtrl', function ($scope) {
    $scope.sendMail = function () {
        cordova.plugins.email.addAlias('gmail', 'com.google.android.gm');
        cordova.plugins.email.isAvailable(
			function (isAvailable) {
			    alert('Service is not available');
			    cordova.plugins.email.open({
			        app: 'gmail',
			        to: 'praveen.dexter@gmail.com',
			        cc: 'praveen.dexter@gmail.com',
			        // bcc:     ['XXXX', 'XXXX'],
			        subject: 'Greetings',
			        body: 'How are you? Nice greetings from Ionic'
			    });
			}
		);
    };
})


// FEED
//brings all feed categories
.controller('FeedsCategoriesCtrl', function ($scope, $http, $firebaseArray, fireBaseData) {
    $scope.feeds_categories = [];
    $scope.feeds_categories = $firebaseArray(fireBaseData.refDashBoardDetails());

    //$http.get('feeds-categories.json').success(function (response) {
    //    $scope.feeds_categories = response;
    //});
})

//bring specific category providers
.controller('CategoryFeedsCtrl', function ($scope, $http, $stateParams, $firebaseArray, fireBaseData) {
    $scope.category_sources = [];
    $scope.categoryitems = [];
    $scope.categoryId = $stateParams.categoryId;

    $scope.categoryTitle = $stateParams.categoryId;


    $scope.categoryitem = $stateParams.categoryId == 'events2016' ? $firebaseArray(fireBaseData.refEventsList())
         : $stateParams.categoryId == 'sports' ? $firebaseArray(fireBaseData.refSportsList())
        : $stateParams.categoryId == 'events-news' ? $firebaseArray(fireBaseData.eventNews())
        : $stateParams.categoryId == 'CSR' ? $firebaseArray(fireBaseData.refCsr())
        : $stateParams.categoryId == 'technology' ? $firebaseArray(fireBaseData.reftechnology())
        : $stateParams.categoryId == 'survey' ? $firebaseArray(fireBaseData.refSurveyDashboard()) : $firebaseArray(fireBaseData.refNowU());

    $scope.categoryitem.$loaded()
             .then(function (categoryitem) {
              
                 if ($scope.categoryTitle != "survey") {
                     $scope.category_sources = categoryitem[0];

                 }
                 else {
                     $scope.category_sources = categoryitem;

                 }






             });


    if ($stateParams.categoryId == 'db002') {
        $scope.category_sources = $firebaseArray(fireBaseData.refSportsList());
    }


    //$http.get('feeds-categories.json').success(function (response) {
    //    var category = _.find(response, { id: $scope.categoryId });
    //    $scope.categoryTitle = category.title;
    //    $scope.category_sources = category.feed_sources;
    //});
})

//this method brings posts for a source provider
.controller('FeedEntriesCtrl', function ($scope, $stateParams, $http, FeedList, $q, $ionicLoading, BookMarkService, $firebaseArray, fireBaseData) {
    $scope.feed = [];

    $scope.count = 0;
    $scope.likeCount = function () {
        $scope.count = $scope.count + 1;
    }

    
    var categoryId = $stateParams.categoryId,
			sourceId = $stateParams.sourceId;
    $scope.sportsName = sourceId;

    $scope.categoryTitle = $stateParams.sourceId;

    $scope.doRefresh = function () {

        $scope.feeds_MatchSchedule = $firebaseArray(fireBaseData.refMatchSchedule());
        $scope.feeds_LiveScore = $firebaseArray(fireBaseData.refLiveScore());

        $scope.feeds_LiveScore.$loaded()
           .then(function (result) {
               angular.forEach(result, function (liveScore) {
                   if (liveScore.$id.toUpperCase() == sourceId.toUpperCase()) {
                       $scope.liveScore = liveScore;
                   }
               })
           })


        //  $scope.feed_MatchDetails = JSON.stringify($scope.feeds_MatchSchedule);

        if ($scope.feeds_MatchSchedule == null) {
            $http.get('feeds-categories.json').success(function (response) {

                $ionicLoading.show({
                    template: 'Loading entries...'
                });

                var category = _.find(response, { id: categoryId }),
                        source = _.find(category.feed_sources, { id: sourceId });

                $scope.sourceTitle = source.title;

                FeedList.get(source.url)
                .then(function (result) {
                    $scope.feed = result.feed;
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                }, function (reason) {
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                });
            });
        }
    };

    $scope.doRefresh();

    $scope.bookmarkPost = function (post) {
        $ionicLoading.show({ template: 'Post Saved!', noBackdrop: true, duration: 1000 });
        BookMarkService.bookmarkFeedPost(post);
    };
})

//PLAYER LIST CONTROLLER
.controller('PlayerListCtrl', function ($scope, $stateParams, $http, $firebaseArray, fireBaseData, $q) {
    $scope.feeds_PlayerList = $firebaseArray(fireBaseData.refPlayerList());





    $scope.teamName = $stateParams.categoryId;
    $scope.SportsName = $stateParams.sourceId;


    $scope.feeds_PlayerList.$loaded()
           .then(function (playerlist) {
               //    var playerlist = JSON.stringify(arrplayerlist);
               angular.forEach(playerlist, function (sportlist) {
                   if (sportlist.title.toUpperCase() == $scope.SportsName.toUpperCase()) {
                       angular.forEach(sportlist.teams, function (teamlistNames) {
                           angular.forEach(teamlistNames, function (teamlist) {
                               if (teamlist.TeamName.toUpperCase() == $scope.teamName.toUpperCase()) {
                                   $scope.playerlistitems = teamlist.TeamList;
                               }
                           })
                       })
                       //$scope.categoryTitle = categoryitem.title;
                       //$scope.category_sources = categoryitem[0];
                   }
               })

               //if(playerlist[0].title=="Cricket")
               //{
               //    if (playerlist[0].teams[0][0].TeamName == "Red") {
               //        $scope.playerlistitems =playerlist[0].teams[0][0].TeamList;
               //    }

               //}

           });


    //$state.go('app.player-list');
})


// SETTINGS
.controller('SettingsCtrl', function ($scope, $ionicActionSheet, $state) {
    $scope.airplaneMode = true;
    $scope.wifi = false;
    $scope.bluetooth = true;
    $scope.personalHotspot = true;

    $scope.checkOpt1 = true;
    $scope.checkOpt2 = true;
    $scope.checkOpt3 = false;

    $scope.radioChoice = 'B';

    // Triggered on a the logOut button click
    $scope.showLogOutMenu = function () {

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            //Here you can add some more buttons
            // buttons: [
            // { text: '<b>Share</b> This' },
            // { text: 'Move' }
            // ],
            destructiveText: 'Logout',
            titleText: 'Are you sure you want to logout? This app is awsome so I recommend you to stay.',
            cancelText: 'Cancel',
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index) {
                //Called when one of the non-destructive buttons is clicked,
                //with the index of the button that was clicked and the button object.
                //Return true to close the action sheet, or false to keep it opened.
                return true;
            },
            destructiveButtonClicked: function () {
                //Called when the destructive button is clicked.
                //Return true to close the action sheet, or false to keep it opened.
                $state.go('auth.walkthrough');
            }
        });

    };
})


;
