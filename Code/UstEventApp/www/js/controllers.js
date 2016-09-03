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

    $scope.user.email = ""; //"john@doe.com";
    $scope.user.pin = "";  //"12345"

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
                           if(surveyitems.surveyActive==1)
                           {
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

.controller('ForgotPasswordCtrl', function ($scope, $state) {
    $scope.recoverPassword = function () {
        $state.go('app.feeds-categories');
    };

    $scope.user = {};
})

.controller('RateApp', function ($scope) {
    $scope.rateApp = function () {
        if (ionic.Platform.isIOS()) {
            //you need to set your own ios app id
            AppRate.preferences.storeAppURL.ios = '1234555553>';
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
		       alert('Service is not available') ;
               cordova.plugins.email.open({
                    app: 'gmail',
			        to: 'praveen.dexter@gmail.com',
			        cc: 'praveenx.nelge@intel.com',
			        // bcc:     ['john@doe.com', 'jane@doe.com'],
			        subject: 'Greetings',
			        body: 'How are you? Nice greetings from Ionic'
			    });
			}
		);
    };
})

.controller('MapsCtrl', function ($scope, $ionicLoading) {

    $scope.info_position = {
        lat: 43.07493,
        lng: -89.381388
    };

    $scope.center_position = {
        lat: 43.07493,
        lng: -89.381388
    };

    $scope.my_location = "";

    $scope.$on('mapInitialized', function (event, map) {
        $scope.map = map;
    });

    $scope.centerOnMe = function () {

        $scope.positions = [];

        $ionicLoading.show({
            template: 'Loading...'
        });

        // with this function you can get the user’s current position
        // we use this plugin: https://github.com/apache/cordova-plugin-geolocation/
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            $scope.current_position = { lat: pos.G, lng: pos.K };
            $scope.my_location = pos.G + ", " + pos.K;
            $scope.map.setCenter(pos);
            $ionicLoading.hide();
        });
    };
})

.controller('AdsCtrl', function ($scope, $ionicActionSheet, AdMob, iAd) {

    $scope.manageAdMob = function () {

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            //Here you can add some more buttons
            buttons: [
				{ text: 'Show Banner' },
				{ text: 'Show Interstitial' }
            ],
            destructiveText: 'Remove Ads',
            titleText: 'Choose the ad to show',
            cancelText: 'Cancel',
            cancel: function () {
                // add cancel code..
            },
            destructiveButtonClicked: function () {
                console.log("removing ads");
                AdMob.removeAds();
                return true;
            },
            buttonClicked: function (index, button) {
                if (button.text == 'Show Banner') {
                    console.log("show banner");
                    AdMob.showBanner();
                }

                if (button.text == 'Show Interstitial') {
                    console.log("show interstitial");
                    AdMob.showInterstitial();
                }

                return true;
            }
        });
    };

    $scope.manageiAd = function () {

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            //Here you can add some more buttons
            buttons: [
			{ text: 'Show iAd Banner' },
			{ text: 'Show iAd Interstitial' }
            ],
            destructiveText: 'Remove Ads',
            titleText: 'Choose the ad to show - Interstitial only works in iPad',
            cancelText: 'Cancel',
            cancel: function () {
                // add cancel code..
            },
            destructiveButtonClicked: function () {
                console.log("removing ads");
                iAd.removeAds();
                return true;
            },
            buttonClicked: function (index, button) {
                if (button.text == 'Show iAd Banner') {
                    console.log("show iAd banner");
                    iAd.showBanner();
                }
                if (button.text == 'Show iAd Interstitial') {
                    console.log("show iAd interstitial");
                    iAd.showInterstitial();
                }
                return true;
            }
        });
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
.controller('CategoryFeedsCtrl', function ($scope, $http, $stateParams,$firebaseArray, fireBaseData) {
    $scope.category_sources = [];
    $scope.categoryitems = [];
    $scope.categoryId = $stateParams.categoryId;


    $scope.categoryitem = $stateParams.categoryId == 'events2016' ? $firebaseArray(fireBaseData.refEventsList())
         : $stateParams.categoryId == 'sports' ? $firebaseArray(fireBaseData.refSportsList())
        : $stateParams.categoryId == 'events-news' ? $firebaseArray(fireBaseData.eventNews())
        : $stateParams.categoryId == 'CSR' ? $firebaseArray(fireBaseData.refCsr())
        : $stateParams.categoryId == 'technology' ? $firebaseArray(fireBaseData.reftechnology()) : $firebaseArray(fireBaseData.refNowU());

    $scope.categoryitem.$loaded()
             .then(function (categoryitem) {
                // angular.forEach(categoryitem, function (categorylist) {
               //  if (surveyitem.surveyActive == 1) {
                // $scope.categoryTitle = categoryitem.title;
                 $scope.category_sources = categoryitem[0];
                  

               //  }
          //   })
         });


    if ($stateParams.categoryId =='db002')
    {
        $scope.category_sources = $firebaseArray(fireBaseData.refSportsList());
    }

  
    //$http.get('feeds-categories.json').success(function (response) {
    //    var category = _.find(response, { id: $scope.categoryId });
    //    $scope.categoryTitle = category.title;
    //    $scope.category_sources = category.feed_sources;
    //});
})

//this method brings posts for a source provider
.controller('FeedEntriesCtrl', function ($scope, $stateParams, $http, FeedList, $q, $ionicLoading, BookMarkService) {
    $scope.feed = [];

    var categoryId = $stateParams.categoryId,
			sourceId = $stateParams.sourceId;

    $scope.doRefresh = function () {

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
    };

    $scope.doRefresh();

    $scope.bookmarkPost = function (post) {
        $ionicLoading.show({ template: 'Post Saved!', noBackdrop: true, duration: 1000 });
        BookMarkService.bookmarkFeedPost(post);
    };
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

// TINDER CARDS
.controller('TinderCardsCtrl', function ($scope, $http) {

    $scope.cards = [];


    $scope.addCard = function (img, name) {
        var newCard = { image: img, name: name };
        newCard.id = Math.random();
        $scope.cards.unshift(angular.extend({}, newCard));
    };

    $scope.addCards = function (count) {
        $http.get('http://api.randomuser.me/?results=' + count).then(function (value) {
            angular.forEach(value.data.results, function (v) {
                $scope.addCard(v.user.picture.large, v.user.name.first + " " + v.user.name.last);
            });
        });
    };

    $scope.addFirstCards = function () {
        $scope.addCard("https://dl.dropboxusercontent.com/u/30675090/envato/tinder-cards/left.png", "Nope");
        $scope.addCard("https://dl.dropboxusercontent.com/u/30675090/envato/tinder-cards/right.png", "Yes");
    };

    $scope.addFirstCards();
    $scope.addCards(5);

    $scope.cardDestroyed = function (index) {
        $scope.cards.splice(index, 1);
        $scope.addCards(1);
    };

    $scope.transitionOut = function (card) {
        console.log('card transition out');
    };

    $scope.transitionRight = function (card) {
        console.log('card removed to the right');
        console.log(card);
    };

    $scope.transitionLeft = function (card) {
        console.log('card removed to the left');
        console.log(card);
    };
})


// BOOKMARKS
.controller('BookMarksCtrl', function ($scope, $rootScope, BookMarkService, $state) {

    $scope.bookmarks = BookMarkService.getBookmarks();

    // When a new post is bookmarked, we should update bookmarks list
    $rootScope.$on("new-bookmark", function (event) {
        $scope.bookmarks = BookMarkService.getBookmarks();
    });

    $scope.goToFeedPost = function (link) {
        window.open(link, '_blank', 'location=yes');
    };
    $scope.goToWordpressPost = function (postId) {
        $state.go('app.post', { postId: postId });
    };
})

// WORDPRESS
.controller('WordpressCtrl', function ($scope, $http, $ionicLoading, PostService, BookMarkService) {
    $scope.posts = [];
    $scope.page = 1;
    $scope.totalPages = 1;

    $scope.doRefresh = function () {
        $ionicLoading.show({
            template: 'Loading posts...'
        });

        //Always bring me the latest posts => page=1
        PostService.getRecentPosts(1)
		.then(function (data) {
		    $scope.totalPages = data.pages;
		    $scope.posts = PostService.shortenPosts(data.posts);

		    $ionicLoading.hide();
		    $scope.$broadcast('scroll.refreshComplete');
		});
    };

    $scope.loadMoreData = function () {
        $scope.page += 1;

        PostService.getRecentPosts($scope.page)
		.then(function (data) {
		    //We will update this value in every request because new posts can be created
		    $scope.totalPages = data.pages;
		    var new_posts = PostService.shortenPosts(data.posts);
		    $scope.posts = $scope.posts.concat(new_posts);

		    $scope.$broadcast('scroll.infiniteScrollComplete');
		});
    };

    $scope.moreDataCanBeLoaded = function () {
        return $scope.totalPages > $scope.page;
    };

    $scope.bookmarkPost = function (post) {
        $ionicLoading.show({ template: 'Post Saved!', noBackdrop: true, duration: 1000 });
        BookMarkService.bookmarkWordpressPost(post);
    };

    $scope.doRefresh();
})

// WORDPRESS POST
.controller('WordpressPostCtrl', function ($scope, post_data, $ionicLoading) {

    $scope.post = post_data.post;
    $ionicLoading.hide();

    $scope.sharePost = function (link) {
        window.plugins.socialsharing.share('Check this post here: ', null, null, link);
    };
})


.controller('ImagePickerCtrl', function ($scope, $rootScope, $cordovaCamera) {

    $scope.images = [];

    $scope.selImages = function () {

        window.imagePicker.getPictures(
			function (results) {
			    for (var i = 0; i < results.length; i++) {
			        console.log('Image URI: ' + results[i]);
			        $scope.images.push(results[i]);
			    }
			    if (!$scope.$$phase) {
			        $scope.$apply();
			    }
			}, function (error) {
			    console.log('Error: ' + error);
			}
		);
    };

    $scope.removeImage = function (image) {
        $scope.images = _.without($scope.images, image);
    };

    $scope.shareImage = function (image) {
        window.plugins.socialsharing.share(null, null, image);
    };

    $scope.shareAll = function () {
        window.plugins.socialsharing.share(null, null, $scope.images);
    };
})

;
