angular.module('starter.NotificationService', [])
    .service('RequestsService', ['$http', '$q', RequestsService]);
    function RequestsService($http, $q) {
        var base_url = 'http://a1dc8db8.ngrok.io';
        function register(device_token) {
            var deferred = $q.defer();
            //$ionicLoading.show();
            $http.post(base_url + '/register', { 'device_token': device_token })
                .success(function (response) {
                    //$ionicLoading.hide();
                    deferred.resolve(response);
                })
                .error(function (data) {
                    deferred.reject();
                });
            return deferred.promise;
        };

        return {
            register: register
        };
    }
