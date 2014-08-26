angular.module('starter.services', [])

.factory('Drops', function($http, $q) {

    return {
        // get all drops
        all: function() {
            var deferred = $q.defer();

            $http.get('http://droplr.reinvanleirsberghe.com/api/v1/drop').success(function(data){
                deferred.resolve(data.drops);
            });

            return deferred.promise;
        },
        // get drop by id
        getById: function(dropId) {
            var deferred = $q.defer();

            $http.get('http://droplr.reinvanleirsberghe.com/api/v1/drop/' + dropId).success(function(data){
                deferred.resolve(data.drop);
            });

            return deferred.promise;
        }
    }
});
