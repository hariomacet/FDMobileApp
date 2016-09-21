/// <reference path="../views/app/feeds/questionModal.html" />
/// <reference path="../views/app/feeds/questionModal.html" />
angular.module('starter.controllers', [])

.controller('AuthCtrl', function ($scope, $ionicConfig) {

})

// APP
.controller('AppCtrl', function ($scope, $ionicConfig, $rootScope) {

    $scope.userName = $rootScope.userIdPhone.UserName;

    $scope.userIsAdmin = $rootScope.userIdPhone.userIsAdmin;
    // listen for the event in the relevant $scope
    //$scope.$on('userDetailsbroadcast', function (event, data) {
    //    $scope.userName = data// 'Data to send'
    //});
})

//LOGIN
.controller('LoginCtrl', function ($scope, $state, $templateCache, $q, $rootScope, $firebaseArray, fireBaseData) {
    $scope.user = {};
    $rootScope.userIdPhone = {};
    $scope.validUser = false;

    $scope.doLogIn = function () {
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
                        $rootScope.userIdPhone.userIsAdmin = userdata.userIsAdmin;

                        $rootScope.userIdPhone.PhoneNumber = userdata.userNumber;
                        $state.go('app.feeds-categories');
                        //$scope.$broadcast('userDetailsbroadcast', {
                        //    someProp: userdata.userName // send whatever you want
                        //});

                    } else {
                        $scope.emailcolor = "Red";
                        $scope.emailborder = "solid";
                    }
                }
                else if (userdata.userNumber == $scope.user.phone && userdata.pin == $scope.user.pin) {
                    $rootScope.userIdPhone.userId = userdata.userId;
                    $rootScope.userIdPhone.PhoneNumber = userdata.userNumber;
                    //$scope.validUser = true;
                    $state.go('app.feeds-categories');
                }
                else {
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
                    userId: $scope.user.userId,
                    userNumber: $scope.user.phone,
                    userEmailId: $scope.user.email,
                    userPassword: $scope.user.password,
                    userIsAdmin: "0",
                    userIsActive: "1",
                    userCreateDate: dateNow.toDateString(),
                    pin: $scope.user.pin
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

.controller('SurveyDetailsCtrl', function ($scope, $state, $firebaseArray, fireBaseData, $rootScope) {
    $scope.surveyInfo = {};
    $scope.surveyDetails = $firebaseArray(fireBaseData.refSurveyquestionaires());
    // $scope.surveyresult = $firebaseArray(fireBaseData.refSurveyresult());
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



    $scope.surveyKeySelected = '';
    $scope.submitSurvey = function (params) {




        $scope.surveyresult = $firebaseArray(fireBaseData.refSurveyresult());
        $scope.surveyresult.$loaded()
                  .then(function (surveyresult) {
                      $scope.surveyres = surveyresult.$add({
                          questionId: $scope.surveyKeySelected,
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
        )
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
                 // angular.forEach(categoryitem, function (categorylist) {
                 //  if (surveyitem.surveyActive == 1) {
                 // $scope.categoryTitle = categoryitem.title;
                 //$scope.category_sources = categoryitem[0];

                 if ($scope.categoryTitle != "survey") {
                     $scope.category_sources = categoryitem[0];

                 }
                 else {
                     $scope.category_sources = categoryitem;

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



    var categoryId = $stateParams.categoryId,
			sourceId = $stateParams.sourceId;
    $scope.sportsName = sourceId;

    $scope.categoryTitle = $stateParams.sourceId;


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
                   if (liveScore.$id.toUpperCase() == sourceId.toUpperCase()) {
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
});
