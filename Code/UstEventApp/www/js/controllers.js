/// <reference path="../views/app/feeds/questionModal.html" />
/// <reference path="../views/app/feeds/questionModal.html" />
angular.module('starter.controllers', [])

.controller('AuthCtrl', function ($scope, $ionicConfig, $cordovaPush, $cordovaDialogs, $cordovaMedia, $cordovaToast, $ionicPlatform, $http) {


})

// APP
.controller('AppCtrl', function ($scope, $ionicConfig, $rootScope) {

    $scope.userName = $rootScope.userIdPhone.UserName;

    $scope.userIsAdmin = $rootScope.userIdPhone.userIsAdmin;
    $scope.userImage = $rootScope.userIdPhone.userImage;
    // listen for the event in the relevant $scope
    //$scope.$on('userDetailsbroadcast', function (event, data) {
    //    $scope.userName = data// 'Data to send'
    //});
})

//LOGIN
.controller('LoginCtrl', function ($scope, $state, $templateCache, $q, $rootScope, $firebaseArray, fireBaseData, $ionicLoading, ProgressBar) {
    $scope.user = {};
    $rootScope.userIdPhone = {};
    $scope.validUser = false;
    //$scope.show = function () {
    //    $ionicLoading.show({
    //        template: '<p>Please wait...</p><ion-spinner icon="ripple"></ion-spinner>'
    //    });
    //};

    //$scope.hide = function () {
    //    $ionicLoading.hide();
    //};
    $scope.doLogIn = function () {
        ProgressBar.show($ionicLoading);
        $scope.userdetails = $firebaseArray(fireBaseData.refRegisteration());
        $scope.userdetails.$loaded().then(function (userdetails) {
            var userlength = userdetails.length; // data is loaded here
            angular.forEach(userdetails, function (userdata) {
                //  angular.forEach(userdata, function (item) {
                if ($scope.user.email != '') {
                    if (userdata.userEmailId == $scope.user.email && userdata.userPassword == $scope.user.password) {

                        $scope.emailcolor = "Green";
                        $scope.validUser = true;
                        $rootScope.userIdPhone.userId = userdata.userId;
                        $rootScope.userIdPhone.UserName = userdata.userName;
                        $rootScope.userIdPhone.PhoneNumber = userdata.userNumber;
                        $rootScope.userIdPhone.userIsAdmin = userdata.userIsAdmin;
                        $rootScope.userIdPhone.userImage = userdata.userImage;
                        $rootScope.userIdPhone.userEmailId = userdata.userEmailId;
                        ProgressBar.hide();
                        $state.go('app.feeds-categories');
                        //$scope.$broadcast('userDetailsbroadcast', {
                        //    someProp: userdata.userName // send whatever you want
                        //});

                    } else {
                        ProgressBar.hide()
                        $scope.emailcolor = "Red";
                        $scope.emailborder = "solid";
                    }
                }
                else if (userdata.userNumber == $scope.user.phone && userdata.pin == $scope.user.pin) {
                    $rootScope.userIdPhone.userId = userdata.userId;
                    $rootScope.userIdPhone.UserName = userdata.userName;
                    $rootScope.userIdPhone.PhoneNumber = userdata.userNumber;
                    $rootScope.userIdPhone.userIsAdmin = userdata.userIsAdmin;
                    $rootScope.userIdPhone.userImage = userdata.userImage;
                    $rootScope.userIdPhone.userEmailId = userdata.userEmailId;
                    //$scope.validUser = true;
                    ProgressBar.hide();
                    $state.go('app.feeds-categories');
                }
                else {
                    ProgressBar.hide();
                    $scope.phonecolor = "Red";
                    $scope.phoneborder = "solid";
                }
                // })
            })
        })
        //if ($scope.validUser == true) {
        //    $state.go('app.feeds-categories');
        //}

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

.controller('SignupCtrl', function ($scope, $state, $firebaseArray, fireBaseData, $cordovaCamera, $rootScope, $cordovaFileTransfer, $ionicPopup, ProgressBar, $ionicLoading) {
    $scope.user = {};
    $scope.user.email = "";
    var checkEmailId = false;
    var checkPhonenumber = false;
    var dateNow = new Date();
    $scope.userImages = [];
    $scope.images = [];
    //
    $scope.doSignUp = function () {
        ProgressBar.show($ionicLoading);
        $scope.userdetails = $firebaseArray(fireBaseData.refRegisteration());
        $scope.userdetails.$loaded().then(function (userdetails) {
            var foundUserEmail = $scope.userdetails.filter(function (user) { return user.userEmailId.replace(/^\s+|\s+$/g, '') === $scope.user.email.replace(/^\s+|\s+$/g, '') });
            var foundUserPhone = $scope.userdetails.filter(function (user) { return user.userNumber == $scope.user.phone });
            if (foundUserEmail.length > 0 || foundUserPhone.length > 0) {
                $scope.user.UserExist = "Already Exists!!"
                ProgressBar.hide();
            } else {
                $scope.user.UserExist = null;
                $scope.saveuserdetails = userdetails.$add({
                    userName: $scope.user.name,
                    userId: $scope.user.userId,
                    userNumber: $scope.user.phone,
                    userEmailId: $scope.user.email,
                    userPassword: $scope.user.password,
                    userIsAdmin: "0",
                    userIsActive: "1",
                    userCreateDate: dateNow.toDateString(),
                    pin: $scope.user.pin,
                    userImage: $scope.userImages.length > 0 ? $scope.userImages[0] : ""
                }).then(function (ref) {
                    ProgressBar.hide();
                    console.log(ref);
                }, function (error) {
                    console.log("Error:", error);
                });
                $state.go('auth.login');
            }
        });

    };

    $scope.upload = function () {
        // Image picker will load images according to these settings
        $scope.images = [];
        $scope.userImages = [];

        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            targetWidth: 250,
            targetHeight: 250,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function (imageUri) {
            $scope.images.push(imageUri);
            encodeImageUri(imageUri, function (base64) {
                $scope.userImages.push(base64);
                //alert("data:image/jpeg;base64" + base64)
            });

        }, function (err) {
            // error
        });
    };
    var encodeImageUri = function (imageUri, callback) {
        var c = document.createElement('canvas');
        var ctx = c.getContext("2d");
        var img = new Image();
        img.onload = function () {
            c.width = this.width;
            c.height = this.height;
            ctx.drawImage(img, 0, 0);

            if (typeof callback === 'function') {
                var dataURL = c.toDataURL("image/jpeg");
                callback(dataURL.slice(22, dataURL.length));
            }
        };
        img.src = imageUri;
    }
})
    //Admin
.controller("MasterCtrl", function ($scope, $rootScope, $firebaseArray, fireBaseData) {
    $scope.feeds_categories = [];
    $scope.userIsAdmin = "";
    var adminType = $rootScope.userIdPhone.userIsAdmin;
    $scope.userIsAdmin = adminType;
    // $scope.feeds_categories = $firebaseArray(fireBaseData.refDashBoardDetails());

    //$http.get('feeds-categories.json').success(function (response) {
    //    $scope.feeds_categories = response;
    //});
})
.controller("ScheduleCtrl", function ($scope, $state, $firebaseArray, fireBaseData, $rootScope, $cordovaCalendar, $window) {
    $scope.TeamNames = [];
    $scope.SportsType = [];
    $scope.v = {};
    var isUpdate = false;
    $scope.TeamNames = $firebaseArray(fireBaseData.refTeamNames());
    $scope.SportsType = $firebaseArray(fireBaseData.refPlayerList());
    $scope.doSaveSchedule = function (v) {
        if (v.ScheduleDate == undefined) {
            $scope.Ratingcolor = "Red";
            $scope.Ratingborder = "solid";
            return;
        }
        $scope.MatchSchedules = $firebaseArray(fireBaseData.refMatchSchedule());
        $scope.MatchSchedules.$loaded()
                    .then(function (MatchSchedules) {
                        angular.forEach(MatchSchedules, function (shd, $index) {
                            if (shd.sportsId == v.selectedSportId) {
                                if ((shd.teamId1 == v.selectedTeamId && shd.teamId2 == v.selectedColor) || (shd.teamId2 == v.selectedTeamId && shd.teamId1 == v.selectedColor)) {
                                    var ref = new Firebase('https://ustdb.firebaseio.com/matchSchedule/' + $index);
                                    ref.update({
                                        "matchTiming": v.ScheduleDate.toLocaleString()//.toDateString()
                                    });
                                    isUpdate = true;
                                }
                            }
                        });
                        if (isUpdate == false) {
                            var schedulelength = MatchSchedules.length;
                            var foundTeam1 = $scope.TeamNames.filter(function (team) { return team.TeamColor === v.selectedTeamId });
                            var foundTeam2 = $scope.TeamNames.filter(function (team) { return team.TeamColor === v.selectedColor });
                            $scope.SportsType.$loaded()
                               .then(function (SportsType) {
                                   angular.forEach(SportsType, function (sport) {
                                       if (sport.id == v.selectedSportId) {
                                           var refAdd = new Firebase('https://ustdb.firebaseio.com/matchSchedule/' + schedulelength);
                                           refAdd.update({
                                               "isActive": 1,
                                               "matchTiming": v.ScheduleDate.toLocaleString(),//toDateString(),
                                               "sportsId": v.selectedSportId,
                                               "sportsName": sport.title,
                                               "teamId1": v.selectedTeamId,
                                               "teamId2": v.selectedColor,
                                               "teamName1": foundTeam1[0].TeamName,
                                               "teamName2": foundTeam2[0].TeamName,
                                               "winingTeam": 'Yet to start'
                                           });
                                           $scope.Ratingcolor = "";
                                           $scope.Ratingborder = "";
                                       }
                                   });
                               });
                        }
                    });

    };

})
.controller("SportsMasterCtrl", function ($scope, $state, $firebaseArray, fireBaseData, $rootScope) {
    $scope.TeamNames = [];
    $scope.userIsAdmin = "";
    $scope.v = {};
    $scope.TeamNames = $firebaseArray(fireBaseData.refTeamNames());
    $scope.MatchSchedules = $firebaseArray(fireBaseData.refMatchSchedule());
    //
    $scope.LiveScore = $firebaseArray(fireBaseData.refLiveScore());
    $scope.LiveScore.$loaded().then(function (LiveScore) {
        angular.forEach(LiveScore, function (score) {
            //if (score[0].team1.teamColor == x.selectedTeamId) {
            $scope._Score1 = score[0].team1.TotalRuns
            $scope._Overs1 = score[0].team1.currentOvers
            $scope._wickets1 = score[0].team1.lostWickets
            $scope._Score2 = score[0].team2.TotalRuns
            $scope._Overs2 = score[0].team2.currentOvers
            $scope._wickets2 = score[0].team2.lostWickets
            //}
        })
    });
    $scope.NewSchedules = [];
    $scope.changeSport = function (x) {
        $scope.NewSchedules = [];
        $scope.MatchSchedules.$loaded().then(function (MatchSchedules) {
            angular.forEach(MatchSchedules, function (schedule) {
                if (schedule.sportsId == x.selectedSportId && schedule.isActive == '0') {
                    $scope.NewSchedules.push(schedule)
                }
            })
        });
    };
    $scope.changeTeam1 = function (x) {
        $scope.NewSchedules = [];
        $scope.MatchSchedules.$loaded().then(function (MatchSchedules) {
            angular.forEach(MatchSchedules, function (schedule) {
                if (schedule.sportsId == x.selectedSportId && schedule.isActive == '0' && schedule.teamId1 == x.selectedTeamId && schedule.teamId2 == x.selectedColor) {
                    $scope.schDate = schedule.matchTiming;
                }
            })
        });
    };
    var adminType = $rootScope.userIdPhone.userIsAdmin;
    $scope.userIsAdmin = adminType;
    if (adminType == 1) {
        $scope.SportsCategorys = [];
        $scope.mstetitle = "Score Master";
        $scope.x = {};
        $scope.SportsCategorys = $firebaseArray(fireBaseData.refPlayerList());

    } else if (adminType == 2) {
        $scope.mstetitle = "Rating Master";
    }
    $scope.doSaveScore = function (x) {
        var foundTeam1 = $scope.TeamNames.filter(function (team) { return team.TeamColor === x.selectedTeamId });
        var refTeam1 = fireBaseData.refLiveScoreTeam1();
        refTeam1.update({
            "TotalRuns": x.Score1 == null ? 0 : x.Score1,
            "currentOvers": x.Overs1 == null ? 0 : x.Overs1,
            "lostWickets": x.wickets1 == null ? 0 : x.wickets1,
            "teamColor": x.selectedTeamId == null ? 0 : x.selectedTeamId,
            "teamName": foundTeam1[0].TeamName,
        });

        var foundTeam2 = $scope.TeamNames.filter(function (team) { return team.TeamColor === x.selectedColor });
        var refTeam2 = fireBaseData.refLiveScoreTeam2();
        refTeam2.update({
            "TotalRuns": x.Score2 == null ? 0 : x.Score2,
            "currentOvers": x.Overs2 == null ? 0 : x.Overs2,
            "lostWickets": x.wickets2 == null ? 0 : x.wickets2,
            "teamColor": x.selectedColor == null ? 0 : x.selectedColor,
            "teamName": foundTeam2[0].TeamName,
        });
    }
    $scope.doSaveRating = function (v) {
        if (v.Rating1 == undefined || v.Rating2 == undefined || v.Rating3 == undefined || v.Rating4 == undefined) {
            $scope.Ratingcolor = "Red";
            $scope.Ratingborder = "solid";
            return;
        }
        $scope.Ratingcolor = "";
        $scope.Ratingborder = "";
        $scope.TeamNames.$loaded()
                      .then(function (TeamNames) {
                          angular.forEach(TeamNames, function (team, $index) {
                              if (team.TeamId == 1) {
                                  var ref = new Firebase('https://ustdb.firebaseio.com/teamNames' + '/' + 0);
                                  ref.update({
                                      "Rating": v.Rating1 == null ? 0 : v.Rating1
                                  });
                              };
                              if (team.TeamId == 2) {
                                  var ref = new Firebase('https://ustdb.firebaseio.com/teamNames' + '/' + 1);
                                  ref.update({
                                      "Rating": v.Rating2 == null ? 0 : v.Rating2
                                  });
                              };
                              if (team.TeamId == 3) {
                                  var ref = new Firebase('https://ustdb.firebaseio.com/teamNames' + '/' + 2);
                                  ref.update({
                                      "Rating": v.Rating3 == null ? 0 : v.Rating3
                                  });
                              };
                              if (team.TeamId == 4) {
                                  var ref = new Firebase('https://ustdb.firebaseio.com/teamNames' + '/' + 3);
                                  ref.update({
                                      "Rating": v.Rating4 == null ? 0 : v.Rating4
                                  });
                              };
                              if (team.TeamId == 5) {
                                  var ref = new Firebase('https://ustdb.firebaseio.com/teamNames' + '/' + 4);
                                  ref.update({
                                      "Rating": v.Rating5 == null ? 0 : v.Rating5
                                  });
                              };
                          });
                      });
    };
})
// $window.alert(v.selectedSportId);
.controller("SportsLiveCtrl", function ($scope, $state, $firebaseArray, fireBaseData, $rootScope, $window, $filter) {
    $scope.MatchSchedules = $firebaseArray(fireBaseData.refMatchSchedule());
    $scope.SportsType = $firebaseArray(fireBaseData.refPlayerList());
    $scope.NewSchedules = [];
    $scope.v = {};
    $scope.SelectedSchedule = [];
    $scope.SelectedTeam = ""

    $scope.changedValue = function (v) {
        $scope.SelectedTeam = ""
        $scope.SelectedSchedule = [];
        $scope.NewSchedules = [];
        $scope.MatchSchedules.$loaded().then(function (MatchSchedules) {
            angular.forEach(MatchSchedules, function (schedule) {
                if (schedule.sportsId == v.selectedSportId && schedule.isActive == '1') {
                    $scope.NewSchedules.push(schedule)
                }
            })
        });
    }
    $scope.onLiveSelect = function (sche, v) {
        $scope.SelectedTeam = ""
        $scope.SelectedSchedule = [];
        $scope.SelectedSchedule.push({ "TeamColor1": sche.teamId1, "TeamColor2": sche.teamId2 });

    };
    $scope.MoveToLive = function (v) {
        if ($scope.SelectedSchedule.length == 0) {
            $scope.SelectedTeam = "1"
            return;
        }
        $scope.SelectedTeam = ""
        angular.forEach($scope.MatchSchedules, function (shd, $index) {
            if (shd.sportsId == v.selectedSportId) {
                if (shd.teamId1 == $scope.SelectedSchedule[0].TeamColor1 && shd.teamId2 == $scope.SelectedSchedule[0].TeamColor2) {
                    var ref = new Firebase('https://ustdb.firebaseio.com/matchSchedule/' + $index);
                    ref.update({
                        "isActive": '0'//.toDateString()
                    });
                }
            }
        });
        $scope.NewSchedules = [];
        $scope.MatchSchedules.$loaded().then(function (MatchSchedules) {
            angular.forEach(MatchSchedules, function (schedule) {
                if (schedule.sportsId == v.selectedSportId && schedule.isActive == '1') {
                    $scope.NewSchedules.push(schedule)
                }
            })
        });
        $scope.SelectedSchedule = [];
    };
})

.controller('SurveyMenuCtrl', function ($scope, $state, $firebaseArray, fireBaseData, $rootScope, $stateParams, ProgressBar, $ionicLoading, $interval) {
    $scope.SurveyTitle = $stateParams.sourceId;
    $scope.surveyFoods = [];
    ProgressBar.show($ionicLoading);
    $scope.s = {};
    $scope._surveyFoods = $firebaseArray(fireBaseData.refsurveyFood());
    $scope._surveyFoods.$loaded().then(function (_surveyFoods) {
        angular.forEach(_surveyFoods, function (food) {
            if (food.surveyActive == '1') {
                $scope.surveyFoods.push(food);
            }
        })
    });
    $scope.Surveyresults = $firebaseArray(fireBaseData.refSurveyresult());
    $scope.Surveyresults.$loaded().then(function (Surveyresults) {
        angular.forEach(Surveyresults, function (result) {
            if (result.userEmailId == $rootScope.userIdPhone.userEmailId) {
                $scope.s.choice = result.surveyId;
                $scope.isDisable = true;
                ProgressBar.hide();
            }
        });
    });
    $scope.onFoodSelect = function (s) {
        //alert(s.choice);
    };
    $scope.submitSurvey = function (s) {
        if (s.choice != undefined) {
            var referer = { 'surveyId': s.choice };
            $state.go('app.survey-details', referer);
        }
    };
    $interval(function () { ProgressBar.hide(); }, 5000, true);
})

.controller('SurveyDetailsCtrl', function ($scope, $state, $stateParams, $ionicModal, fireBaseData, $firebaseArray, $rootScope) {
    $scope.Questions = [];
    $scope.refSurveyDetails = $firebaseArray(fireBaseData.refSurveyDetails());
    $scope.refSurveyDetails.$loaded().then(function (refSurveyDetails) {
        angular.forEach(refSurveyDetails, function (srv) {
            if (srv.surveyId == $stateParams.surveyId) {
                angular.forEach(srv.questions, function (ques) {
                    if (ques.isActive == '1') {
                        $scope.Questions.push(ques);
                    }
                })
            }
        })
    });

    $scope.ratingArr = [{
        value: 1,
        icon: 'ion-ios-star-outline',
        question: 1
    }, {
        value: 2,
        icon: 'ion-ios-star-outline',
        question: 2
    }, {
        value: 3,
        icon: 'ion-ios-star-outline',
        question: 3
    }, {
        value: 4,
        icon: 'ion-ios-star-outline',
        question: 4
    }, {
        value: 5,
        icon: 'ion-ios-star-outline',
        question: 5
    }];
    $scope.setRating = function (question, val) {
        $scope.RatingSurvey = [];
        soSetRating(val);
        var obj = { 'questionid': question, 'ratingValue': val };
        $scope.RatingSurvey.push(obj);
    }
    var soSetRating = function (val) {
        var rtgs = $scope.ratingArr;
        for (var i = 0; i < rtgs.length; i++) {
            if (i < val) {
                rtgs[i].icon = 'ion-ios-star';
            } else {
                rtgs[i].icon = 'ion-ios-star-outline';
            }
        };
    };
    $scope.v = {};
    $scope.RatingSurvey = [];
    var checkEmailId = false;
    var checkPhoneNumber = false;
    var surveylength = 0;
    $scope.Surveyresults = $firebaseArray(fireBaseData.refSurveyresult());
    $scope.Surveyresults.$loaded().then(function (Surveyresults) {
        angular.forEach(Surveyresults, function (result) {
            checkEmailId = angular.equals(result.userEmailId, $rootScope.userIdPhone.userEmailId) ? true : false;
            checkPhoneNumber = angular.equals(result.phoneNumber, $rootScope.userIdPhone.PhoneNumber) ? true : false;
            if (checkEmailId || checkPhoneNumber) {
                if (result.surveyId == $stateParams.surveyId) {
                    soSetRating(result.rating);
                    $scope.v.choice = result.answerId;
                    $scope.isDisable = true;
                }
                surveylength = result.$id;
            }
        })
    })

    $scope.QuestionsId = [];
    $scope.onAnsSelect = function (id) {
        $scope.QuestionsId = [];
        $scope.QuestionsId.push(id);
    }
    $scope.ratingsCallback = function (rating) {
        alert('Selected rating is : ', rating);
    };
    //Save
    $scope.doSaveSurvey = function (v) {
        if ($scope.RatingSurvey.length > 0 && $scope.QuestionsId.length > 0) {
            if (!checkEmailId || !checkPhoneNumber) {
                surveylength = $scope.Surveyresults.length;
            }
            var refUpdate = new Firebase('"https://ustdb.firebaseio.com/surveyResults/' + surveylength);
            refUpdate.update({
                "surveyId": $stateParams.surveyId,
                "userEmailId": $rootScope.userIdPhone.userEmailId,
                "phoneNumber": $rootScope.userIdPhone.PhoneNumber,//toDateString(),
                "rating": $scope.RatingSurvey[0].ratingValue,
                "questionId": $scope.QuestionsId[0],
                "answerId": v.choice
            });
        }
    }

    //$scope._surveyFoods = $firebaseArray(fireBaseData.refsurveyFood());

    //$scope._surveyFoods.$loaded().then(function (_surveyFoods) {
    //    angular.forEach(_surveyFoods, function (food) {
    //        if (food.surveyActive == '1' && food.surveyId == $stateParams.surveyId) {
    //            $scope.surveyFoods.push(food);
    //        }
    //    })
    //});


    //$ionicModal.fromTemplateUrl('views/app/survey/surveyMenu.html', {
    //    scope: $scope,
    //    animation: 'slide-in-up'
    //}).then(function (modal) {
    //    vm.modal = modal;
    //    vm.modal.show();
    //});
    // var referer = { 'surveyType': $scope.SurveyTitle };
    //$state.go('app.surveyMenu', referer);

})    

.controller('ForgotPasswordCtrl', function ($scope, $state) {
    $scope.recoverPassword = function () {
        $state.go('app.feeds-categories');
    };

    $scope.user = {};
})


.controller('FeedCommentsCtrl', function ($state, $scope, $stateParams, $rootScope) {
    $scope.user = {};
    $state.go('app.enter-comments');
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
.controller('EventDetailsCtrl', function ($scope, $stateParams, $firebaseArray, fireBaseData) {
    $scope.EventDetails = [];
    $scope.eventName = $stateParams.sourceId;
    $scope.EventsDetails = $firebaseArray(fireBaseData.refEventsDetails());
    $scope.EventsDetails.$loaded().then(function (EventsDetails) {
        angular.forEach(EventsDetails, function (event) {
            if (event.eventId == $stateParams.categoryId) {
                $scope.EventDetails.push(event);
            }
        });
    });

})

//bring specific category providers
.controller('CategoryFeedsCtrl', function ($scope, $http, $stateParams, $firebaseArray, fireBaseData) {
    $scope.category_sources = [];
    $scope.categoryitems = [];
    $scope.special_sources = [];
    $scope.other_sources = [];
    $scope.categoryId = $stateParams.categoryId;

    $scope.categoryTitle = $stateParams.categoryId;


    $scope.categoryitem = $stateParams.categoryId == 'events2016' ? $firebaseArray(fireBaseData.refEventsList())
         : $stateParams.categoryId == 'sports' ? $firebaseArray(fireBaseData.refSportsList())
        : $stateParams.categoryId == 'event-updates' ? $firebaseArray(fireBaseData.eventNews())
        : $stateParams.categoryId == 'CSR' ? $firebaseArray(fireBaseData.refCsr())
        : $stateParams.categoryId == 'summary' ? $firebaseArray(fireBaseData.refsummary())
        : $stateParams.categoryId == 'survey' ? $firebaseArray(fireBaseData.refSurveyDashboard())
        : $stateParams.categoryId == 'vote' ? $firebaseArray(fireBaseData.refVoteDashBoard())
        : $firebaseArray(fireBaseData.refNowU());

    $scope.categoryitem.$loaded()
             .then(function (categoryitem) {
                 if ($scope.categoryTitle == "survey") {
                     $scope.category_sources = categoryitem;
                 }
                 else if ($scope.categoryTitle == "vote") {
                     $scope.category_sources = categoryitem;
                 }
                 else if ($scope.categoryTitle == "events2016") {
                     angular.forEach(categoryitem, function (sport) {
                         if (sport.type == 'sport' && sport.isActive == '1') {
                             $scope.category_sources.push(sport)
                         }
                         if (sport.type == 'special' && sport.isActive == '1') {
                             $scope.special_sources.push(sport)
                         }
                         if (sport.type == 'other' && sport.isActive == '1') {
                             $scope.other_sources.push(sport)
                         }
                     })
                 }
                 else {
                     $scope.category_sources = categoryitem[0];
                 }
                 //  }
                 //   })
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

.controller('FeedCommentsCtrl', function ($state, $scope, $stateParams, $rootScope) {
    $scope.user = {};
    $state.go('app.enter-comments');
})


//this method brings posts for a source provider
.controller('FeedEntriesCtrl', function ($scope, $stateParams, $http, FeedList, $q, $ionicLoading, BookMarkService, $firebaseArray, fireBaseData, $rootScope) {
    $scope.feed = [];
    $scope.userId = $rootScope.userIdPhone.userId;
    $scope.EventUserMap = $firebaseArray(fireBaseData.refEventUserMap());
    $scope.EventUserMap.$loaded()
          .then(function (itemValues) {


          })


    $scope.enableDisableAnchor = false;

    $scope.count = 0;



    $scope.galleryItem = {};
    $scope.championShipItems = {};

    var categoryId = $stateParams.categoryId,
        sourceTitle = $stateParams.sourceTitle,
			sourceId = $stateParams.sourceId;

    if (categoryId == "gallery") {
        var ref = new Firebase("https://ustdb.firebaseio.com/nowU/feed_source");
        ref.once("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var key = childSnapshot.key();
                if (sourceId == key) {
                    $scope.galleryItem = childSnapshot.val();
                }
            });
        });
    }
    if (categoryId == "summary") {
        var ref = new Firebase("https://ustdb.firebaseio.com/teamNames");
        ref.once("value", function (snapshot) {
            $scope.championShipItems = snapshot.val();
            console.log($scope.championShipItems);
        });
    }
    $scope.sportsName = $stateParams.sourceTitle;
    $scope.categoryTitle = sourceTitle;

    $scope.scorelikeCount1 = function (params1, params2) {
        var str = params1;
        $scope.count = params2;

        $scope.Items = {};
        $scope.eventName = {};
        $scope.userId = {};
        $scope.prevCountlikesTeam1 = {};

        var ref = new Firebase('https://ustdb.firebaseio.com/liveScore' + '/' + $scope.categoryTitle);
        // Retrieve new posts as they are added to our database
        ref.on("child_added", function (snapshot, prevChildKey) {
            var newPost = snapshot.val();
            prevCountlikesTeam1 = newPost.likesTeam1;
        });

        //$scope.EventUserMap = $firebaseArray(fireBaseData.refEventUserMap());

        var liveScoreItem = new Firebase('https://ustdb.firebaseio.com/liveScore' + '/' + $scope.categoryTitle + '/0');

        liveScoreItem.update({
            "likesTeam1": prevCountlikesTeam1 + 1
        });
        $scope.enableDisableAnchor = false;
    }

    $scope.scorelikeCount2 = function (params1, params2) {
        var str = params1;
        // var str = $scope.entry.eventId;
        $scope.count = params2;

        $scope.Items = {};
        $scope.eventName = {};
        $scope.userId = {};
        $scope.prevCountlikesTeam2 = {};

        var ref = new Firebase('https://ustdb.firebaseio.com/liveScore' + '/' + $scope.categoryTitle);
        // Retrieve new posts as they are added to our database
        ref.on("child_added", function (snapshot, prevChildKey) {
            var newPost = snapshot.val();
            prevCountlikesTeam2 = newPost.likesTeam2;
        });

        //$scope.EventUserMap = $firebaseArray(fireBaseData.refEventUserMap());

        var liveScoreItem = new Firebase('https://ustdb.firebaseio.com/liveScore' + '/' + $scope.categoryTitle + '/0');
        //var liveScoreItem = liveScorerf.child();
        liveScoreItem.update({
            "likesTeam2": prevCountlikesTeam2 + 1
        });
        $scope.enableDisableAnchor = false;
    }

    // $scope.entry.eventId = '';
    $scope.doRefresh = function () {

        $scope.feeds_MatchSchedule = $firebaseArray(fireBaseData.refMatchSchedule());
        $scope.feeds_LiveScore = $firebaseArray(fireBaseData.refLiveScore());

        $scope.feeds_LiveScore.$loaded()
           .then(function (result) {
               angular.forEach(result, function (liveScore) {
                   if (liveScore.$id.toUpperCase() == sourceTitle.toUpperCase()) {
                       $scope.liveScore = liveScore;
                       // $rootScope.eventId = $scope.entry.eventId;
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
.controller("VoteEntriesCtrl", function ($scope, $stateParams, $rootScope, $firebaseArray, fireBaseData, $ionicPopup) {
    $scope.Employees = $firebaseArray(fireBaseData.refEmpList());
    $scope.v = {};
    $scope.EmpVoteCounts = $firebaseArray(fireBaseData.refVoteCount());
    $scope.EmpVoteCounts.$loaded().then(function (EmpVoteCounts) {
        angular.forEach(EmpVoteCounts, function (emp) {
            if (emp.voterId == $rootScope.userIdPhone.userEmailId) {
                $scope.v.choice = emp.voteTo;
                $scope.isDisable = true;

            }
        });
    });


    $scope.doSaveVote = function (v) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Vote Confirmation',
            template: 'please confirm your selection(Ok for confirm)?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                $scope.isDisable = true;
                $scope.saveEmpVoteCounts = $scope.EmpVoteCounts.$add({
                    voterId: $rootScope.userIdPhone.userEmailId,
                    voteTo: v.choice
                }).then(function (ref) {
                    console.log(ref);
                }, function (error) {
                    console.log("Error:", error);
                });
                $scope.Employees.$loaded().then(function (Employees) {
                    angular.forEach(Employees, function (emp, value) {
                        if (emp.empId == v.choice) {
                            var ref = new Firebase('https://ustdb.firebaseio.com/employeeList/' + value);
                            ref.update({
                                "totalVote": emp.totalVote == undefined ? 1 : parseInt(emp.totalVote) + 1
                            });
                        };
                    });
                });
            }
        });
    }

})
.controller("VoteMastereCtrl", function ($scope, $stateParams, $rootScope, $firebaseArray, fireBaseData) {
    $scope.EmployeesData = [];
    $scope.Employees = $firebaseArray(fireBaseData.refEmpList());
    $scope.userdetails = $firebaseArray(fireBaseData.refRegisteration());
    $scope.userdetails.$loaded().then(function (userdetails) {
        var total = parseInt(userdetails.length)
        $scope.Employees.$loaded().then(function (Employees) {
            angular.forEach(Employees, function (emp) {
                var div = parseInt(emp.totalVote) * 100 / total

                var obj = { 'empColor': emp.empColor, 'empId': emp.empId, 'empName': emp.empName, 'totalVote': emp.totalVote, 'empPercent': div }
                $scope.EmployeesData.push(obj);
            });
        })
    });
})

//PLAYER LIST CONTROLLER
.controller('PlayerListCtrl', function ($scope, $stateParams, $http, $firebaseArray, fireBaseData, $q, $state) {
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

               if (playerlist[0].title == "Cricket") {
                   if (playerlist[0].teams[0][0].TeamName == "Red") {
                       $scope.playerlistitems = playerlist[0].teams[0][0].TeamList;
                   }

               }

           });


    $state.go('app.player-list');
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

.controller("ProfileSettingCtrl", function ($scope, $rootScope, $firebaseArray, fireBaseData, $cordovaCamera, $cordovaFileTransfer, $ionicLoading, ProgressBar, $interval) {
    $scope.images = [];    
    $scope.userdetails = $firebaseArray(fireBaseData.refRegisteration());
    $scope.userdetails.$loaded().then(function (userdetails) {
        angular.forEach(userdetails, function (value, key) {
            if (value.userEmailId == $rootScope.userIdPhone.userEmailId && value.userImage != undefined) {
                $scope.images.push("data:image/jpeg;base64" + value.userImage)
            }
        });
    });
    //Upload Image by Base64
    $scope.Uploadimages = [];

    $scope.ChangeImage = function () {
        // Image picker will load images according to these settings
        $scope.images = [];
        $scope.Uploadimages = [];
        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            targetWidth: 250,
            targetHeight: 250,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function (imageUri) {
            $scope.images.push(imageUri);
            encodeImageUri(imageUri, function (base64) {
                $scope.Uploadimages.push(base64);
                //alert("data:image/jpeg;base64" + base64)
            });

        }, function (err) {
            // error
        });
    };
    //Update Profile
    $scope.doUpdateProfile = function () {
        ProgressBar.show($ionicLoading);
        if ($scope.Uploadimages.length > 0) {
            $scope.userdetails.$loaded().then(function (userdetails) {
                angular.forEach(userdetails, function (value, key) {
                    if (value.userEmailId == $rootScope.userIdPhone.userEmailId) {
                        var refUpdate = new Firebase("https://ustdb.firebaseio.com/userRegistration/" + value.$id);
                        refUpdate.update({
                            "userImage": $scope.Uploadimages[0].toLocaleString()
                        });
                    }
                });
            });
            $scope.success == "1";
        }
        $interval(function () { ProgressBar.hide(); }, 8000, true);


    };
    var encodeImageUri = function (imageUri, callback) {
        var c = document.createElement('canvas');
        var ctx = c.getContext("2d");
        var img = new Image();
        img.onload = function () {
            c.width = this.width;
            c.height = this.height;
            ctx.drawImage(img, 0, 0);

            if (typeof callback === 'function') {
                var dataURL = c.toDataURL("image/jpeg");
                callback(dataURL.slice(22, dataURL.length));
            }
        };
        img.src = imageUri;
    }
});

